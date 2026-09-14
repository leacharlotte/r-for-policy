const WEBR_URL = 'https://webr.r-wasm.org/v0.6.0/webr.mjs';
let engine;
let starting;
const loadedPackages = new Set();
const loadedFiles = new Set();
let generation = 0;
let busy = false;
let cancelCurrent;
let status = { state: 'idle', text: '' };
const listeners = new Set();

function announce(state, text) {
  status = { state, text };
  listeners.forEach(fn => fn(status));
}
export function observeRuntime(fn) { listeners.add(fn); fn(status); return () => listeners.delete(fn); }
export function isBusy() { return busy; }

async function start(lesson) {
  const requestGeneration = generation;
  const stillCurrent = () => { if(requestGeneration !== generation)throw new Error('R was stopped. Your code is still in the editor.'); };
  if (!starting) {
    const version = generation;
    starting = (async () => {
      announce('loading', 'Loading R — first start may take a moment');
      const { WebR, ChannelType } = await import(/* @vite-ignore */ WEBR_URL);
      if (version !== generation) throw new Error('R was restarted. Run your code again.');
      const instance = new WebR({ channelType: ChannelType.PostMessage, interactive: false });
      engine = instance;
      await instance.init();
      if (version !== generation) throw new Error('R was restarted. Run your code again.');
      await instance.evalRVoid('options(width = 76, digits = 7)');
      stillCurrent();
      announce('ready', 'R is ready');
    })().catch(error => {
      if (version === generation) { starting = undefined; announce('error', 'R could not load. Check your connection and try again.'); }
      throw error;
    });
  }
  await starting;
  stillCurrent();
  const instance = engine;
  const packages = [...new Set([...(lesson.data ? ['dplyr'] : []), ...(lesson.packages || [])])];
  const missingPackages = packages.filter(name => !loadedPackages.has(name));
  if (missingPackages.length) {
    announce('loading', `Preparing ${missingPackages.join(', ')}`);
    await instance.installPackages(missingPackages, { quiet: true });
    stillCurrent();
    for (const name of missingPackages) {
      await instance.evalRVoid(`suppressPackageStartupMessages(library(${name}))`);
      stillCurrent();
      loadedPackages.add(name);
    }
  }
  const files = lesson.files || (lesson.data ? ['data_incomes.csv'] : []);
  const missingFiles = files.filter(name => !loadedFiles.has(name));
  if (missingFiles.length) {
    announce('loading', 'Preparing the practice data');
    await instance.evalRVoid('setwd("/home/web_user"); dir.create("data", showWarnings = FALSE)');
    for (const name of missingFiles) {
      const response = await fetch(new URL(`${import.meta.env.BASE_URL}data/${name}`, document.baseURI).href);
      if (!response.ok) throw new Error(`The course data file ${name} could not load.`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      stillCurrent();
      await instance.FS.writeFile(`/home/web_user/data/${name}`, bytes);
      stillCurrent();
      loadedFiles.add(name);
    }
  }
  stillCurrent();
  announce('ready', 'R is ready');
  return instance;
}

export function restartR() {
  generation++;
  cancelCurrent?.(new Error('R was stopped. Your code is still in the editor.'));
  cancelCurrent = undefined;
  engine?.close();
  engine = undefined;
  starting = undefined;
  loadedPackages.clear();
  loadedFiles.clear();
  busy = false;
  announce('idle', 'R stopped. Run code to start a fresh session.');
}

export async function execute(code, lesson, check = false) {
  if (busy) throw new Error('Another calculation is running. Wait for it to finish or select Stop R.');
  if (!code.trim()) return { output: '', error: 'Write your R code in the editor first. You can open a hint if you need help getting started.' };
  if (/_{6,}/.test(code)) return { output: '', error: 'Replace each ______ with your R code, then try again.' };
  busy = true;
  const version = generation;
  const cancelled = new Promise((_, reject) => { cancelCurrent = reject; });
  let shelter;
  let deadline;
  let runtime;
  let outputDirectory;
  let previousDirectory;
  try {
    // Startup and package downloads get more time than a learner calculation.
    const r = await Promise.race([
      start(lesson),
      cancelled,
      new Promise((_, reject) => { deadline = setTimeout(() => { if(version === generation)restartR(); reject(new Error('R took too long to load. Check your connection and run the code again.')); }, 120000); }),
    ]);
    clearTimeout(deadline);
    if (version !== generation) throw new Error('R was stopped. Your code is still in the editor.');
    runtime = r;
    announce('running', 'Running your code');
    shelter = await new r.Shelter();
    const env = await shelter.evalR('new.env(parent = globalenv())');
    if (lesson.setup) await shelter.evalR(lesson.setup, { env });
    if (lesson.downloadFiles?.length) {
      // Fresh files per run prevent earlier exports from satisfying a new answer.
      previousDirectory = await r.evalRString('getwd()');
      outputDirectory = await r.evalRString('local({ folder <- tempfile("course-export-"); dir.create(folder); folder })');
      await r.evalRVoid('setwd(.folder)', { env: { '.folder': outputDirectory } });
    }
    const result = await Promise.race([
      shelter.captureR(code, { env, captureGraphics: true, withAutoprint: true }),
      cancelled,
      new Promise((_, reject) => { deadline = setTimeout(() => { if(version === generation)restartR(); reject(new Error('This calculation exceeded 20 seconds. Check for an endless loop and try again.')); }, 20000); }),
    ]);
    clearTimeout(deadline);
    const lines = [];
    let error = '';
    for (const item of result.output) {
      if (item.type === 'stdout' || item.type === 'stderr') lines.push(item.data);
      else if (item.type === 'error' || item.type === 'warning' || item.type === 'message') {
        const message = await r.evalRString('conditionMessage(.condition)', { env: { '.condition': item.data } });
        lines.push(`${item.type === 'error' ? 'Error' : item.type === 'warning' ? 'Warning' : 'Message'}: ${message}`);
        if (item.type === 'error') error = message;
      }
    }
    const response = { output: lines.join('\n').slice(0, 16000), error, images: result.images };
    if (outputDirectory) {
      await r.evalRVoid('setwd(.folder)', { env: { '.folder': outputDirectory } });
      const filenames = (await r.evalRString('paste(list.files()[!dir.exists(list.files())], collapse = "\\n")')).split('\n').filter(Boolean);
      response.files = [];
      for (const name of filenames) {
        const extension = name.split('.').pop().toLowerCase();
        if (!lesson.downloadFiles.includes(extension)) continue;
        const bytes = await r.FS.readFile(`${outputDirectory}/${name}`);
        // R can open an empty default graphics file while switching devices.
        if (!bytes.length) continue;
        const type = {png:'image/png',csv:'text/csv;charset=utf-8',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',pdf:'application/pdf'}[extension] || 'application/octet-stream';
        response.files.push({ name, bytes, type });
      }
    }
    if (check && !error) {
      await env.bind('.answer', result.result);
      if (lesson.checkGraphics) await env.bind('.plot_count', result.images?.length || 0);
      if (lesson.checkPrintedOutput) {
        await env.bind('.printed_output', result.output.filter(item => item.type === 'stdout').map(item => item.data).join('\n'));
      }
      response.correct = await r.evalRBoolean(`isTRUE(tryCatch({ ${lesson.check} }, error = function(e) FALSE))`, { env });
      response.feedback = response.correct ? lesson.success : 'Not quite yet. Check the task, the units and your final result. You can reveal a hint below.';
      if (!response.correct) {
        for (const mistake of lesson.mistakes || []) {
          if (await r.evalRBoolean(`isTRUE(tryCatch({ ${mistake.when} }, error = function(e) FALSE))`, { env })) {
            response.feedback = mistake.message;
            break;
          }
        }
      }
    }
    return response;
  } catch (error) {
    return { output: '', error: error.message || String(error) };
  } finally {
    clearTimeout(deadline);
    if (version === generation) {
      if (outputDirectory) {
        await runtime.evalRVoid('setwd(.previous); unlink(.folder, recursive = TRUE)', { env: { '.previous': previousDirectory, '.folder': outputDirectory } }).catch(() => {});
      }
      if (shelter) await shelter.purge().catch(() => {});
      busy = false;
      cancelCurrent = undefined;
      if (status.state !== 'error') announce(starting ? 'ready' : 'idle', starting ? 'R is ready' : 'Run code to start R');
    }
  }
}

export function explainError(message) {
  if (/object .* not found/i.test(message)) return 'Check spelling and capitalisation. Each editor starts fresh: define the object in this editor before using it.';
  if (/non-numeric argument/i.test(message)) return 'One of your inputs is text instead of a number. Look for quotation marks around numbers.';
  if (/unexpected end|unexpected INCOMPLETE|unexpected symbol|unexpected token/i.test(message)) return 'Look for an unclosed parenthesis or quotation mark, or a missing comma. R needs complete syntax before it can run.';
  if (/could not find function/i.test(message)) return 'Check the function name. Data lessons load dplyr for you; other packages need to be available in this browser session.';
  return '';
}

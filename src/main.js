import './style.css';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, drawSelection } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { StreamLanguage, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { r } from '@codemirror/legacy-modes/mode/r';
import { modules } from './course.js';
import { execute, observeRuntime, explainError, restartR, isBusy } from './runtime.js';

const icons = {
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>',
  play:'<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="m6 4 10 6-10 6z"/></svg>',
  reset:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7a6 6 0 1 1 0 6M3 3v5h5"/></svg>',
  check:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>',
  download:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M10 2v10m-4-4 4 4 4-4M3 12v5h14v-5"/></svg>',
};
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const allLessons = modules.flatMap(module => module.lessons.map(lesson => ({ module, lesson })));
const exerciseCount = allLessons.filter(({lesson}) => !lesson.guide).length;
const drafts = new Map();
const solved = new Set();
let editors = [];
let active;
let currentState;
let runtimeStatus;
const base = import.meta.env.BASE_URL;

function stateFor(lesson) {
  if (!drafts.has(lesson.id)) drafts.set(lesson.id, { example: lesson.example, exercise: lesson.starter, followup: lesson.followUp?.example, hints:0, results:{}, quizSelected:null, quizChecked:false });
  return drafts.get(lesson.id);
}
function route(module, lesson) { return `#${module.id}/${lesson.id}`; }

document.querySelector('#app').innerHTML = `
<aside class="sidebar">
  <a class="brand" href="#home" aria-label="R for Policy, start page"><span class="brand-mark">R<span>↗</span></span><span>R for Policy<small>THE MVPF TOOLKIT</small></span></a>
  <div class="sidebar-label">YOUR LEARNING PATH</div>
  <nav id="course-nav" aria-label="Course modules"></nav>
  <div class="course-progress"><div><span>Exercises solved</span><span id="progress-count">0 / ${exerciseCount}</span></div><progress id="progress" value="0" max="${exerciseCount}" aria-label="Exercises solved"></progress><small>Progress stays in this tab.</small></div>
  <div class="sidebar-bottom">
    <details class="reference"><summary>R quick reference</summary><dl><dt><code>x &lt;- 100</code></dt><dd>Save a value</dd><dt><code>c(1, 2, 3)</code></dt><dd>Combine values</dd><dt><code>sum(x)</code> · <code>mean(x)</code></dt><dd>Add or average</dd><dt><code>x[x &gt; 0]</code></dt><dd>Select positive values</dd><dt><code>filter()</code> · <code>select()</code></dt><dd>Keep rows or columns</dd><dt><code>mutate()</code></dt><dd>Calculate columns</dd><dt><code>group_by()</code> · <code>summarise()</code></dt><dd>Aggregate within groups</dd></dl></details>
    <details class="reference"><summary>Practice data</summary><p>Synthetic income profiles for practice. Generated for learning; no real observations.</p><a href="${base}data/data_incomes.csv" download>Modules 3–6 · Income by age and gender</a></details>
    <span class="small-rule"></span><p>Public Policy Evaluation</p>
  </div>
</aside>
<div class="workspace">
  <header class="topbar"><span>THE R FOUNDATIONS</span><div class="runtime-controls"><span id="runtime-status" role="status"></span><button id="stop-r" class="stop-button" hidden>Stop R</button></div></header>
  <main id="lesson" class="lesson" tabindex="-1"></main>
</div>`;

function renderNav() {
  document.querySelector('.brand').toggleAttribute('aria-current', !active);
  if(!active)document.querySelector('.brand').setAttribute('aria-current','page');
  document.querySelector('#course-nav').innerHTML = modules.map(module => `
    <a class="module-link ${active?.module.id === module.id ? 'active' : ''}" href="${route(module,module.lessons[0])}" ${active?.module.id === module.id ? 'aria-current="true"' : ''}>
      <span class="module-no">${module.number}</span><span>${module.title}<small>${module.lessons.length} lessons</small></span>
      ${module.lessons.some(lesson=>!lesson.guide) && module.lessons.filter(lesson=>!lesson.guide).every(lesson=>solved.has(lesson.id)) ? `<span class="module-complete" aria-label="All exercises solved">${icons.check}</span>` : ''}
    </a>
    ${active?.module.id === module.id ? `<div class="lesson-links">${module.lessons.map(lesson=>`<a class="${active.lesson.id===lesson.id?'current':''}" href="${route(module,lesson)}" ${active.lesson.id===lesson.id?'aria-current="page"':''}>${lesson.title}${solved.has(lesson.id)?'<span class="solved-mark" aria-label="Exercise solved">✓</span>':''}</a>`).join('')}</div>`:''}
  `).join('');
  document.querySelector('#progress-count').textContent = `${solved.size} / ${exerciseCount}`;
  document.querySelector('#progress').value = solved.size;
  document.querySelector('#progress').max = exerciseCount;
}

function renderHome() {
  active = null;
  currentState = null;
  const desktopModule = modules.find(module=>module.lessons.every(lesson=>lesson.guide));
  document.title = 'R for Policy — Start here';
  renderNav();
  document.querySelector('#lesson').innerHTML = `
    <section class="home-intro" aria-labelledby="home-title">
      <span class="eyebrow">PUBLIC POLICY EVALUATION</span>
      <h1 id="home-title">R for Policy</h1>
      <p class="lede">Learn to turn economic questions into calculations, work with data and interpret your results. This website prepares you for the quantitative part of the Public Policy Evaluation course.</p>
      <p class="home-welcome">No previous coding experience is needed. You can run R directly on this website and learn at your own pace.</p>
      <a class="button-primary home-start" href="${route(modules[0],modules[0].lessons[0])}">Start Module 1 ${icons.arrow}</a>
      <p class="home-summary">${modules.length} modules <span aria-hidden="true">·</span> ${exerciseCount} interactive exercises <span aria-hidden="true">·</span> No installation needed to start</p>
    </section>
    <section class="home-modules" aria-labelledby="modules-heading">
      <h2 id="modules-heading">Your learning path</h2>
      <p>Start with Module 1 if you are new to R, or choose a module to refresh a particular skill.</p>
      <ol class="module-overview">${modules.map(module=>`
        <li><a class="module-overview-link" href="${route(module,module.lessons[0])}" aria-labelledby="overview-title-${module.number}" aria-describedby="overview-description-${module.number}">
          <span class="overview-number" aria-hidden="true">${module.number}</span>
          <div class="overview-content"><h3 id="overview-title-${module.number}"><span class="overview-prefix">Module ${module.number}: </span>${module.title}</h3><p id="overview-description-${module.number}">${module.description}</p><span class="overview-lessons">${module.lessons.length} ${module.lessons.every(lesson=>lesson.guide)?'guides':'lessons'}</span></div>
          ${icons.arrow}
        </a></li>`).join('')}
      </ol>
    </section>
    <section class="home-how" aria-labelledby="how-heading">
      <h2 id="how-heading">How to use this course</h2>
      <p>In the interactive lessons, run the worked example, change a few values and try the exercise yourself. Use <strong>Check answer</strong> for feedback, then explore the hints or compare your code with the solution.</p>
      <p><strong>Download code</strong> in each module gives you all its examples and solutions.${desktopModule ? ` Module ${Number(desktopModule.number)} shows you how to install R and RStudio and run these scripts on your own computer.` : ''}</p>
      <p class="home-session">Your edits and progress stay in this tab as you move between the start page and lessons. Reloading or closing the tab resets them.</p>
    </section>`;
  updateRuntime(runtimeStatus);
}

function guideMarkup(lesson) {
  return `<section class="code-card" aria-label="Code to run in RStudio">
    <div class="code-top"><span><b class="r-chip">R</b> RUN IN RSTUDIO</span><span>${active.module.number}_${lesson.id}.R</span></div>
    <pre class="guide-code"><code>${escape(lesson.example)}</code></pre>
    <div class="code-actions"><button id="copy-guide-code" class="button-outline">Copy code</button><span id="copy-status" role="status"></span></div>
  </section>
  <div class="note"><span class="note-symbol" aria-hidden="true">↳</span><div><strong>${lesson.noteTitle}</strong><p>${lesson.note}</p></div></div>
  <section class="prose">${lesson.guideAfter}</section>
  <p class="session-note">Follow these steps in RStudio on your computer. Download code includes all examples in this module.</p>
  <div class="guide-sources"><span>Official guides</span>${lesson.sources.map(source=>`<a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label} ↗</a>`).join('')}</div>`;
}

function card(kind) {
  const label = kind === 'exercise' ? 'Your exercise' : kind === 'followup' ? 'Follow-up example' : 'Worked example';
  return `<section class="code-card" aria-label="${label}" id="${kind}-card">
    <div class="code-top"><span><b class="r-chip">R</b> ${kind === 'exercise' ? 'YOUR CODE' : kind === 'followup' ? 'FOLLOW-UP EXAMPLE' : 'WORKED EXAMPLE'}</span><span>${active.module.number}_${active.lesson.id}.R</span></div>
    <div class="editor" id="${kind}-editor"></div>
    <div class="code-actions"><button class="button-primary r-action" id="run-${kind}">${icons.play} Run code</button>${kind === 'exercise' ? `<button class="button-check r-action" id="check-answer">${icons.check} Check answer</button>`:''}<button class="button-reset" id="reset-${kind}" aria-label="Reset ${kind === 'example'?'example':kind==='followup'?'follow-up':'exercise'} code" title="Reset to the original code">${icons.reset}<span>Reset</span></button><span class="keyboard-note">⌘ / Ctrl + Enter</span></div>
    <div class="output" id="${kind}-output" aria-live="polite"><span class="output-label">OUTPUT</span><pre class="empty-output">Run the code to see the result.</pre></div>
    <div class="feedback" id="${kind}-feedback" role="status" hidden></div>
  </section>`;
}

function followUpMarkup(lesson) {
  const section = lesson.followUp;
  if (!section) return '';
  return `<section class="prose"><h2>${section.title}</h2>${section.body}</section>${card('followup')}${section.note ? `<div class="prose"><p>${escape(section.note)}</p></div>` : ''}`;
}

function dictionary() {
  return `<details class="data-dictionary"><summary>What is in the income dataset? <span>4 columns · 92 rows</span></summary><div class="table-scroll"><table><caption>Column guide for data_incomes.csv · synthetic data</caption><thead><tr><th>Column</th><th>Meaning</th></tr></thead><tbody><tr><td><code>age</code></td><td>Age in years, from 20 to 65 inclusive</td></tr><tr><td><code>gender</code></td><td>Female or Male</td></tr><tr><td><code>annual_income</code></td><td>Mean annual income per person in this group, in $</td></tr><tr><td><code>n_people</code></td><td>Number of people in the age–gender group</td></tr></tbody></table></div></details>`;
}

function quizMarkup(quiz) {
  if (!quiz) return '';
  return `<section class="quiz"><span class="eyebrow">CHECK YOUR UNDERSTANDING</span><fieldset><legend>${quiz.question}</legend>${quiz.options.map((option,i)=>`<label><input type="radio" name="understanding" value="${i}" ${currentState.quizSelected === i ? 'checked':''}><span>${option}</span></label>`).join('')}</fieldset><button id="check-reasoning" class="button-outline">Check reasoning</button><p class="quiz-feedback" id="quiz-feedback" role="status"></p></section>`;
}

function renderLesson() {
  editors.forEach(editor=>editor.destroy());
  editors = [];
  let [moduleId, lessonId] = location.hash.slice(1).split('/');
  if (moduleId === 'module-8' && !modules.some(module=>module.id===moduleId)) {
    const desktopModule = modules.find(module=>module.lessons.some(lesson=>lesson.guide && lesson.id===lessonId));
    if (desktopModule) {
      moduleId = desktopModule.id;
      window.history.replaceState(null, '', `#${moduleId}/${lessonId}`);
    }
  }
  if (moduleId === 'module-7' && lessonId === 'weighted-averages') {
    moduleId = 'module-5';
    window.history.replaceState(null, '', '#module-5/weighted-averages');
  }
  const module = modules.find(item=>item.id===moduleId);
  if(!module){renderHome();return;}
  const lesson = module.lessons.find(item=>item.id===lessonId) || module.lessons[0];
  active = {module,lesson};
  currentState = stateFor(lesson);
  const index = module.lessons.indexOf(lesson);
  const globalIndex = allLessons.findIndex(item=>item.lesson.id===lesson.id);
  const previous = allLessons[globalIndex - 1];
  const next = allLessons[globalIndex + 1];
  const downloadDescription = `Download code: all Module ${module.number} examples${module.lessons.some(item=>!item.guide)?' and solutions':''}`;
  const titleMarker = lesson.titleMarker ? `<span class="lesson-marker${lesson.titleMarkerPosition === 'before' ? ' lesson-marker-before' : ''}">${escape(lesson.titleMarker)}</span>` : '';
  document.title = `${lesson.title} — R for Policy`;
  renderNav();
  document.querySelector('#lesson').innerHTML = `
    <div class="breadcrumb"><span>Module ${module.number}</span><span>/</span><span>${module.title}</span><a id="download-code" class="download-button" href="${base}downloads/module-${module.number}-solutions.R" download="module-${module.number}-solutions.R" aria-label="${downloadDescription}" title="${downloadDescription}">${icons.download}<span>Download code</span></a></div>
    <div class="mobile-lesson-menu"><label for="lesson-select">Lesson<select id="lesson-select">${module.lessons.map((item,i)=>`<option value="${route(module,item)}" ${item.id===lesson.id?'selected':''}>${i+1}. ${item.title}</option>`).join('')}</select></label></div>
    <div class="lesson-heading">${lesson.titleMarkerPosition === 'before' ? `${titleMarker} ` : ''}<span class="eyebrow">LESSON ${index + 1} OF ${module.lessons.length}</span>${lesson.titleMarkerPosition !== 'before' && titleMarker ? ` ${titleMarker}` : ''}<h1>${lesson.heading}</h1><p class="lede">${lesson.intro}</p>${lesson.introNote ? `<p class="lesson-intro-note">${lesson.introNote}</p>` : ''}</div>
    <div class="lesson-facts"><span>${lesson.guide ? 'On your computer' : module.number === '01' ? 'Beginner friendly' : 'Build on what you know'}</span><span>${lesson.guide ? 'RStudio Desktop' : 'No installation needed'}</span></div>
    <section class="prose"><h2>${lesson.section}</h2>${lesson.body}</section>
    ${lesson.guide ? guideMarkup(lesson) : `
    ${lesson.table?dictionary():''}
    ${lesson.exampleSetupNote ? `<div class="setup-note">${lesson.exampleSetupNote}</div>` : ''}
    ${card('example')}
    ${lesson.quiz?.position === 'after-example' ? quizMarkup(lesson.quiz) : ''}
    ${lesson.note ? `<div class="note"><span class="note-symbol" aria-hidden="true">↳</span><div><strong>${lesson.noteTitle}</strong><p>${lesson.note}</p></div></div>` : ''}
    ${lesson.followUp?.position === 'before-exercise' ? followUpMarkup(lesson) : ''}
    ${lesson.exerciseIntro ? `<section class="prose"><h2>${lesson.exerciseIntro.title}</h2>${lesson.exerciseIntro.body}</section>` : ''}
    <section class="prose exercise-prompt"><span class="eyebrow">YOUR TURN</span><h2>${lesson.taskTitle}</h2>${lesson.task}</section>
    ${lesson.setupNote?`<div class="setup-note">${lesson.setupNote}</div>`:lesson.setup?'<div class="setup-note">Ready to use: <code>df</code> contains the synthetic income data. <code>dplyr</code> is loaded for you.</div>':lesson.data?'<div class="setup-note">The practice file and <code>dplyr</code> are prepared when you run code.</div>':''}
    ${card('exercise')}
    <div class="exercise-help"><button id="show-hint" class="hint-button">Need a hint? <span id="hint-count"></span></button><details id="solution"><summary>View solution</summary><div class="solution-body"><p>Compare the steps with your attempt, then try the exercise again on your own.</p><pre><code>${escape(lesson.solution)}</code></pre><button id="use-solution" class="button-outline">Load solution into editor</button></div></details></div>
    <div id="hints" class="hints" aria-live="polite"></div>
    ${lesson.followUp?.position !== 'before-exercise' ? followUpMarkup(lesson) : ''}
    ${lesson.quiz?.position !== 'after-example' ? quizMarkup(lesson.quiz) : ''}
    ${lesson.closingContent ? `<div class="prose lesson-closing">${lesson.closingContent}</div>` : ''}
    <p class="session-note">Each editor starts fresh when you run it. Your edits stay as you move between lessons and reset when you reload or close this tab. Download code contains all examples and solutions for this module.</p>`}
    <nav class="lesson-footer" aria-label="Lesson navigation"><div>${previous?`<a class="previous-lesson" href="${route(previous.module,previous.lesson)}">← Previous lesson</a>`:'<span>First steps in R</span>'}</div>${next?`<a class="next-lesson" href="${route(next.module,next.lesson)}"><span><small>${next.module.id !== module.id?'NEXT MODULE':'NEXT LESSON'}</small>${next.lesson.title}</span>${icons.arrow}</a>`:'<span class="course-end">Ready for the tutorials <span>Keep your code for the tutorials.</span></span>'}</nav>`;

  document.querySelector('#lesson-select').addEventListener('change',event=>{location.hash=event.target.value;});
  if (lesson.guide) {
    document.querySelector('#copy-guide-code').addEventListener('click',async()=>{
      const status = document.querySelector('#copy-status');
      try {
        await navigator.clipboard.writeText(lesson.example);
        status.textContent = 'Copied. Paste into RStudio.';
      } catch {
        status.textContent = 'Select and copy the code above, or use Download code.';
      }
    });
    updateRuntime(runtimeStatus);
    return;
  }
  for (const kind of ['example','exercise',...(lesson.followUp ? ['followup'] : [])]) {
    const editor = new EditorView({
      state: EditorState.create({doc:currentState[kind],extensions:[
        lineNumbers(), highlightActiveLineGutter(), history(), drawSelection(), bracketMatching(),
        StreamLanguage.define(r), syntaxHighlighting(defaultHighlightStyle),
        keymap.of([{key:'Mod-Enter',run:()=>{run(kind,false);return true;}},...defaultKeymap,...historyKeymap]),
        EditorView.lineWrapping, EditorState.tabSize.of(2),
        EditorView.contentAttributes.of({'aria-label':kind==='example'?'Worked example R code':kind==='followup'?'Follow-up example R code':'Exercise R code','spellcheck':'false'}),
        EditorView.updateListener.of(update=>{
          if (update.docChanged) {
            currentState[kind] = update.state.doc.toString();
            delete currentState.results[kind];
            const feedback = document.querySelector(`#${kind}-feedback`);
            if (feedback) feedback.hidden = true;
            const output = document.querySelector(`#${kind}-output .output-label`);
            if (output) output.textContent = 'OUTPUT · CODE EDITED — RUN AGAIN';
          }
        }),
      ]}),parent:document.querySelector(`#${kind}-editor`),
    });
    editors.push(editor);
    document.querySelector(`#run-${kind}`).addEventListener('click',()=>run(kind,false));
    document.querySelector(`#reset-${kind}`).addEventListener('click',()=>{
      editor.dispatch({changes:{from:0,to:editor.state.doc.length,insert:kind==='example'?lesson.example:kind==='followup'?lesson.followUp.example:lesson.starter}});
      delete currentState.results[kind];
      showResult(kind,null);
    });
    if (currentState.results[kind]) showResult(kind,currentState.results[kind]);
  }
  document.querySelector('#check-answer').addEventListener('click',()=>run('exercise',true));
  document.querySelector('#show-hint').addEventListener('click',()=>{currentState.hints=Math.min(currentState.hints+1,lesson.hints.length);renderHints();});
  document.querySelector('#use-solution').addEventListener('click',()=>{
    editors[1].dispatch({changes:{from:0,to:editors[1].state.doc.length,insert:lesson.solution}});
    editors[1].focus();
    document.querySelector('#exercise-card').scrollIntoView({behavior:'smooth',block:'center'});
  });
  if (lesson.quiz) {
    document.querySelectorAll('input[name="understanding"]').forEach(input=>input.addEventListener('change',()=>{currentState.quizSelected=Number(input.value);currentState.quizChecked=false;document.querySelector('#quiz-feedback').textContent='';}));
    document.querySelector('#check-reasoning').addEventListener('click',()=>{currentState.quizChecked=true;showQuiz();});
    if(currentState.quizChecked)showQuiz();
  }
  renderHints();
  updateRuntime(runtimeStatus);
}

function renderHints() {
  document.querySelector('#hints').innerHTML = active.lesson.hints.slice(0,currentState.hints).map((hint,i)=>`<div class="hint"><strong>Hint ${i+1}</strong><p>${escape(hint)}</p></div>`).join('');
  document.querySelector('#hint-count').textContent = currentState.hints ? `${currentState.hints} / ${active.lesson.hints.length}` : '';
  document.querySelector('#show-hint').disabled = currentState.hints===active.lesson.hints.length;
}

function showQuiz() {
  const el = document.querySelector('#quiz-feedback');
  if(currentState.quizSelected===null){el.textContent='Choose an answer first.';el.className='quiz-feedback';return;}
  const correct=currentState.quizSelected===active.lesson.quiz.correct;
  el.textContent=`${correct?'Correct.':'Think it through once more.'} ${active.lesson.quiz.explanation}`;
  el.className=`quiz-feedback ${correct?'correct':'incorrect'}`;
}

function showResult(kind,result) {
  const output=document.querySelector(`#${kind}-output`);
  const feedback=document.querySelector(`#${kind}-feedback`);
  if(!output)return;
  output.innerHTML='<span class="output-label">OUTPUT</span>';
  const pre=document.createElement('pre');
  pre.textContent=result ? (result.output || (result.plotUrls?.length ? '' : result.error ? result.error : 'Code ran successfully. Print an object by writing its name on a new line to see its value.')) : 'Run the code to see the result.';
  if(!result)pre.className='empty-output';
  if(result?.error)pre.className='error-output';
  output.append(pre);
  for(const source of result?.plotUrls||[]){const img=document.createElement('img');img.src=source;img.alt='Plot generated by your R code';img.className='r-plot';output.append(img);}
  feedback.hidden=true;
  if(result?.error){const explanation=explainError(result.error);if(explanation){feedback.textContent=explanation;feedback.className='feedback incorrect';feedback.hidden=false;}}
  else if(typeof result?.correct==='boolean'){feedback.innerHTML=`<span aria-hidden="true">${result.correct?'✓':'↳'}</span><span>${escape(result.feedback)}</span>`;feedback.className=`feedback ${result.correct?'correct':'incorrect'}`;feedback.hidden=false;}
}

async function run(kind,check=false) {
  if(isBusy())return {error:'Another calculation is running.'};
  const lesson=active.lesson;
  const draft=currentState;
  const code=draft[kind];
  const el=document.querySelector(`#${kind}-feedback`);
  el.hidden=false;el.className='feedback running';el.textContent='Preparing your calculation…';
  document.querySelectorAll('.r-action').forEach(button=>button.disabled=true);
  const result=await execute(code,lesson,check);
  result.plotUrls=[];
  for(const image of result.images||[]){const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;canvas.getContext('2d').drawImage(image,0,0);result.plotUrls.push(canvas.toDataURL());image.close?.();}
  delete result.images;
  if(check&&result.correct)solved.add(lesson.id);
  if(draft[kind]===code)draft.results[kind]=result;
  if(active?.lesson.id===lesson.id && draft[kind]===code)showResult(kind,result);
  renderNav();updateRuntime(runtimeStatus);
  return {output:result.output,error:result.error||null,correct:result.correct??null,feedback:result.feedback||null};
}

function updateRuntime(status) {
  if(!status)return;
  runtimeStatus=status;
  document.querySelector('.runtime-controls').hidden=(!active || active.lesson.guide) && !isBusy();
  const target=document.querySelector('#runtime-status');
  target.hidden=!status.text;
  target.textContent=status.text;target.className=`runtime-status ${status.state}`;
  document.querySelector('#stop-r').hidden=!isBusy();
  document.querySelectorAll('.r-action').forEach(button=>button.disabled=isBusy());
}
document.querySelector('#stop-r').addEventListener('click',()=>{
  restartR();
  for(const kind of ['example','exercise','followup']){
    const feedback=document.querySelector(`#${kind}-feedback`);
    if(feedback?.classList.contains('running')){feedback.textContent='R stopped. Your code is still here. Run it again when you are ready.';feedback.className='feedback';}
  }
});
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();document.querySelector('#lesson').focus();});
document.querySelector('.brand').addEventListener('click',()=>{
  if(location.hash==='#home'){
    window.scrollTo({top:0,behavior:'instant'});
    document.querySelector('#lesson').focus({preventScroll:true});
  }
});
observeRuntime(updateRuntime);

renderLesson();
addEventListener('hashchange',()=>{renderLesson();window.scrollTo({top:0,behavior:'instant'});document.querySelector('#lesson').focus({preventScroll:true});});

// Optional browser-native agent interface; shares the visible navigation and editors.
if(document.modelContext?.registerTool){
  const lifecycle=new AbortController();
  const register=tool=>{try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
  register({name:'read_current_lesson',title:'Read the current R lesson',description:'Read the visible lesson, editable code and latest results, or the module overview on the start page. Does not expose unrevealed solutions.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>active?({module:active.module.title,lesson:active.lesson.title,lessonId:active.lesson.id,exampleCode:currentState.example,exerciseCode:currentState.exercise,followUpCode:currentState.followup??null,followUpResult:currentState.results.followup?{output:currentState.results.followup.output,error:currentState.results.followup.error}:null,exerciseResult:currentState.results.exercise?{output:currentState.results.exercise.output,correct:currentState.results.exercise.correct,error:currentState.results.exercise.error}:null,solvedExercises:solved.size}):({page:'home',title:'R for Policy',modules:modules.map(module=>({title:module.title,description:module.description,url:route(module,module.lessons[0])})),solvedExercises:solved.size})});
  register({name:'navigate_lesson',title:'Open an R lesson',description:'Navigate to an R course lesson or the desktop setup guide.',inputSchema:{type:'object',properties:{lessonId:{type:'string',enum:allLessons.map(item=>item.lesson.id)}},required:['lessonId'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{const entry=allLessons.find(item=>item.lesson.id===input?.lessonId);if(!entry)throw new Error('Unknown lesson.');window.history.replaceState(null,'',route(entry.module,entry.lesson));renderLesson();window.scrollTo({top:0});return {lessonId:active.lesson.id,title:active.lesson.title};}});
  addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}

import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { modules } from '../src/course.js';

const publicDir = new URL('../public/', import.meta.url);
await mkdir(new URL('data/', publicDir), { recursive: true });
await mkdir(new URL('downloads/', publicDir), { recursive: true });

// Keep generated downloads in sync when a module is temporarily hidden or removed.
const activeDownloads = new Set(modules.map(module => `module-${module.number}-solutions.R`));
for (const file of await readdir(new URL('downloads/', publicDir))) {
  if (/^module-\d{2}-solutions\.R$/.test(file) && !activeDownloads.has(file)) {
    await unlink(new URL(`downloads/${file}`, publicDir));
  }
}

// Entirely fictional profiles, deterministic so browser and downloads agree.
// Smooth hump-shaped incomes and unequal population sizes exercise data skills.
const rows = ['age,gender,annual_income,n_people'];
for (let age = 20; age <= 65; age++) {
  const t = age - 20;
  for (const gender of ['Female', 'Male']) {
    const female = gender === 'Female';
    const income = female
      ? 22000 + 1950 * t - 37 * t ** 2 + 1000 * Math.sin(t / 5)
      : 21000 + 2200 * t - 39 * t ** 2 + 800 * Math.sin(t / 6);
    const people = female
      ? 900 + 260 * Math.cos((age - 36) / 13) + 60 * Math.sin(age / 3)
      : 850 + 300 * Math.cos((age - 40) / 14) + 70 * Math.sin(age / 4);
    rows.push([age, gender, Math.round(income / 100) * 100, Math.round(people / 10) * 10].join(','));
  }
}
const csv = rows.join('\n') + '\n';
await writeFile(new URL('data/data_incomes.csv', publicDir), csv);

// A small practice CPI series, with 2020 as its index reference year.
const cpiCsv = 'year,CPI\n2020,100\n2021,105\n2022,110\n2023,120\n2024,125\n';
await writeFile(new URL('data/data_cpi.csv', publicDir), cpiCsv);

// Keep the real WID data pinned: builds use the checked-in snapshot, never a live API.
const inequalityCsv = await readFile(new URL('data/data_inequality.csv', publicDir), 'utf8');
const widMetadata = JSON.parse(await readFile(new URL('data/wid-inequality-metadata.json', publicDir), 'utf8'));
if (createHash('sha256').update(inequalityCsv).digest('hex') !== widMetadata.teaching_csv_sha256) {
  throw new Error('WID data and provenance disagree. Refresh them together with scripts/update-wid-data.py.');
}

const datasets = {
  'data_incomes.csv': {variable:'income_profile_csv', csv},
  'data_cpi.csv': {variable:'cpi_csv', csv:cpiCsv},
  'data_inequality.csv': {variable:'inequality_csv', csv:inequalityCsv, sourceNotes:[
    '# Source: World Inequality Database (WID.world), https://wid.world/data/',
    `# Snapshot downloaded ${widMetadata.retrieved_at_utc.slice(0,10)}; original bulk series ${widMetadata.variable.join(', ')}.`,
    '# France, Germany, Switzerland, United States; 1980-2024; top 10% and bottom 50%.',
    '# Share of pretax national income, equal-split adults aged 20 and older; fractions of 1.',
    '# top10 rows: share of total income received by the top 10% of adults.',
    '# bottom50 rows: share of total income received by the bottom 50% of adults.',
    '# group identifies the share; income_share stores its value as a fraction of 1.',
    '# Country/group labels simplified; WID values unchanged. Estimates may include interpolation or extrapolation.',
    '# Definitions and methodology: https://wid.world/codes-dictionary/ and https://wid.world/methodology/',
  ]},
};
const portableCode = code => Object.entries(datasets).reduce((text, [file, data]) =>
  text.replaceAll(`read.csv("data/${file}")`, `read.csv(text = ${data.variable})`), code)
  .replaceAll('read_excel("data/data_incomes.xlsx"', 'read_excel(income_excel_file');
const rString = text => JSON.stringify(text);
for (const module of modules) {
  const parts = [
    `# R for Policy — Module ${module.number}: ${module.title}`,
    `# Complete module: ${module.lessons.length} lessons, ${module.lessons.some(lesson=>lesson.example !== undefined) ? 'all worked examples' + (module.lessons.some(lesson=>!lesson.guide) ? ' and exercise solutions' : '') : 'all exercise solutions'}.`,
    '# These are the reference solutions; they do not include your browser edits.',
    '# Run sections in order, or source this entire file in R.',
    '',
  ];
  const files = [...new Set(module.lessons.flatMap(lesson => lesson.files || (lesson.data ? ['data_incomes.csv'] : [])))];
  const needsIncomeExcel = files.includes('data_incomes.xlsx');
  const csvFiles = [...new Set(files.map(file => file === 'data_incomes.xlsx' ? 'data_incomes.csv' : file))];
  const packages = [...new Set([...module.lessons.flatMap(lesson => [...(lesson.data ? ['dplyr'] : []), ...(lesson.packages || [])]), ...(needsIncomeExcel ? ['writexl'] : [])])];
  if (packages.length) {
    parts.push(
      '# SETUP',
      `# Install once, if needed: install.packages(c(${packages.map(rString).join(', ')}))`,
      ...packages.map(name => `library(${name})`),
      '',
    );
  }
  if (files.length) {
    parts.push(
      ...csvFiles.flatMap(file => datasets[file].sourceNotes || ['# Synthetic practice data: no real observations or empirical estimates.']),
      '# The same CSV data used on the website are embedded below.',
      '# read.csv(text = ...) reads this embedded CSV instead of a separate file.',
      '# No additional data downloads or working-directory changes are required.',
      ...csvFiles.map(file => `${datasets[file].variable} <- ${rString(datasets[file].csv)}`),
      '',
    );
  }
  if (needsIncomeExcel) {
    parts.push(
      '# Prepare an Excel copy of the same practice data for the import example.',
      'income_excel_file <- tempfile(fileext = ".xlsx")',
      'writexl::write_xlsx(list(Incomes = read.csv(text = income_profile_csv)), income_excel_file)',
      '',
    );
  }
  module.lessons.forEach((lesson, index) => {
    parts.push('# ' + '='.repeat(70), `# LESSON ${index + 1}: ${lesson.title}`, '# ' + '='.repeat(70), '');
    if (lesson.downloadNotes) parts.push(...lesson.downloadNotes.map(note=>`# ${note}`), '');
    if (lesson.setup) parts.push('# Prepare the data for this lesson', portableCode(lesson.setup), '');
    if (lesson.example !== undefined) {
      parts.push('# WORKED EXAMPLE');
      if (lesson.exampleError) {
        parts.push('# This lesson deliberately demonstrates an error.', '# try() displays it and allows the rest of the module to run.', 'try({', ...lesson.example.split('\n').map(line => `  ${line}`), '}, silent = FALSE)');
      } else {
        parts.push(portableCode(lesson.example));
      }
    }
    const followUpParts = lesson.followUp ? [`# ${(lesson.followUp.exampleLabel || 'Follow-up example').toUpperCase()}: ${lesson.followUp.title}`, portableCode(lesson.followUp.example), ''] : [];
    if (lesson.followUp?.position === 'before-exercise') parts.push('', ...followUpParts);
    if (!lesson.guide) parts.push('', `# EXERCISE SOLUTION: ${lesson.taskTitle}`, portableCode(lesson.solution), '');
    else parts.push('');
    if (lesson.followUp?.position !== 'before-exercise') parts.push(...followUpParts);
  });
  await writeFile(new URL(`downloads/module-${module.number}-solutions.R`, publicDir), parts.join('\n'));
}
console.log(`Generated income/CPI practice data and ${modules.length} complete module scripts, using the saved WID snapshot.`);

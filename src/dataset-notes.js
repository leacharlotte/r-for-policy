// Shared wording keeps dataset reminders consistent across lessons and editors.
const datasetNote = (name, description) => `<strong>What is in ${name}?</strong> ${description}`;

const incomeDescription = 'Each of the 92 rows represents women or men at one age from 20 to 65. The columns are <code>age</code>, <code>gender</code>, <code>annual_income</code> (mean annual income per person, in $) and <code>n_people</code> (number of people).';
const cpiDescription = 'The five rows cover 2020–2024. <code>year</code> gives the calendar year and <code>CPI</code> its annual consumer price index, with 2020 = 100.';

export const incomeDataNote = datasetNote('df', incomeDescription);
export const incomeFileNote = datasetNote('data_incomes.csv', incomeDescription);
export const cpiFileNote = datasetNote('data_cpi.csv', cpiDescription);
export const practiceDataNote = datasetNote('practice', 'Each of the four rows represents women at one age: 25, 35, 45 or 55. The columns are <code>age</code> and <code>annual_income</code> (mean annual income in $). The income at age 35 is missing (<code>NA</code>).');
export const incomeAndCpiDataNote = datasetNote('df and cpi', `<code>df</code>: ${incomeDescription} Here, all incomes are in 2024 prices. <code>cpi</code>: ${cpiDescription}`);

export const inequalityGroupsDescription = '<code>top10</code> rows report the share of total income received by the <strong>top 10%</strong> of adults by income; <code>bottom50</code> rows report the share of total income received by the <strong>bottom 50%</strong> of adults by income.';
// Repeat only the essentials above editors; the full codebook appears in the inspection lesson.
const inequalityReminder = 'WID income shares for France, Germany, Switzerland and the United States. Each row is a country, year and income group. <code>group</code> identifies the share received by the <strong>top 10%</strong> (<code>top10</code>) or <strong>bottom 50%</strong> (<code>bottom50</code>) of adults by income. <code>income_share</code> stores the share as a fraction of 1.';
export const inequalityDataNote = datasetNote('df', `${inequalityReminder} Period: 1980–2024.`);
export const inequalityAnalysisNote = datasetNote('df', `${inequalityReminder} Period: 2000–2024. <code>share_pct</code> contains the same share in percent.`);
export const inequalityComparisonNote = datasetNote('comparison', 'WID data for the four countries, 2000–2024. Each row is one country and year. <code>top10</code> and <code>bottom50</code> contain the shares of total income received by the <strong>top 10%</strong> and <strong>bottom 50%</strong> of adults by income, respectively, in percent.');

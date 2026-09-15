import { inequalityDataNote, inequalityGroupsDescription, inequalityAnalysisNote, inequalityComparisonNote } from './dataset-notes.js';
import { linePlotCheck } from './plot-checks.js';

const source = '.wid_source <- read.csv("data/data_inequality.csv")';
const analysisData = `local({ data <- .wid_source[.wid_source$year >= 2000, ]; data$share_pct <- data$income_share * 100; data })`;
const comparisonData = `local({
  data <- ${analysisData}
  top <- data[data$group == "top10", c("country", "year", "share_pct")]
  bottom <- data[data$group == "bottom50", c("country", "year", "share_pct")]
  result <- merge(top, bottom, by = c("country", "year"))
  names(result)[3:4] <- c("top10", "bottom50")
  result
})`;
const topData = `local({ data <- ${analysisData}; data[data$group == "top10", ] })`;
const rawSetup = `${source}\ndf <- .wid_source`;
const analysisSetup = `${source}\ndf <- ${analysisData}`;
const comparisonSetup = `${source}\ncomparison <- ${comparisonData}`;
const plotCode = `p <- df %>%
  filter(group == "top10") %>%
  ggplot(aes(x = year, y = share_pct, colour = country)) +
  geom_line() +
  labs(x = "Year", y = "Top 10% income share (%)", colour = "Country", caption = "Source: WID.world") +
  theme_minimal()
p`;

// Compare the data, accepting equivalent R methods and column/row ordering.
const sameRows = (actual, expected, keys = ['country', 'year', 'group']) => `local({
  actual <- ${actual}; expected <- ${expected}
  keys <- c(${keys.map(key=>`"${key}"`).join(', ')})
  if (!is.data.frame(actual) || !setequal(names(actual), names(expected))) FALSE else {
    actual <- as.data.frame(actual); expected <- as.data.frame(expected)
    actual <- actual[do.call(order, actual[keys]), names(expected), drop = FALSE]
    expected <- expected[do.call(order, expected[keys]), , drop = FALSE]
    rownames(actual) <- NULL; rownames(expected) <- NULL
    isTRUE(all.equal(actual, expected, check.attributes = FALSE, tolerance = 1e-7))
  }
})`;
const plotCheck = linePlotCheck({
  data:topData, x:'year', y:'share_pct', colour:'country',
  labels:{x:'Year', y:'Top 10% income share (%)', caption:'Source: WID.world'},
});
const taskDefaults = {data:true, files:['data_inequality.csv'], starter:''};

export const module8 = {
  id:'module-8', number:'08', title:'Practice project',
  description:'Use World Inequality Database data to compare income inequality across countries and over time. Write your own code in short steps.',
  lessons:[
    {
      ...taskDefaults, id:'inequality-import', title:'Read the WID data', heading:'How does income inequality differ across countries?',
      intro:'Investigate how income is distributed in France, Germany, Switzerland and the United States.',
      section:'Your practice project',
      body:`<p>You will use data from the <a href="https://wid.world/data/" target="_blank" rel="noopener noreferrer">World Inequality Database (WID)</a> for 1980–2024. Compare the share of total income received by the <strong>top 10%</strong> and the <strong>bottom 50%</strong> of adults by income, then explore how the top 10% share has changed over time.</p>
        <p>These are published estimates based on sources such as tax records, surveys and national accounts. We selected a small extract and simplified the labels; the income-share values are unchanged.</p>
        <p>Write a few lines in each empty editor. Use the hints when needed. Each later task starts with the prepared results of the previous steps, so you only need to write the new code.</p>
        <p><a href="data/data_inequality.csv" download>Download the WID extract</a></p>
        <details class="data-dictionary"><summary>About these income estimates</summary><p>We use WID’s <strong>pretax national income</strong> measure for adults aged 20 and older. It includes labour and capital income and social-insurance benefits, before personal income taxes and other redistribution. WID uses an equal-split convention for income within couples or households.</p></details>`,
      setup:source,
      taskTitle:'Import the CSV',
      task:'<p>Read <code>data/data_inequality.csv</code> into a data frame called <code>df</code>. Display its first six rows.</p>',
      solution:'df <- read.csv("data/data_inequality.csv")\nhead(df)',
      hints:['Use read.csv() to read the file and <- to save it as df.', 'Put "data/data_inequality.csv" in quotation marks. Then write head(df) to display the first six rows.'],
      check:`exists("df", inherits = FALSE) && ${sameRows('df', '.wid_source')} && ${sameRows('.answer', '.wid_source[1:6, ]')}`,
      success:'Correct: df contains the WID extract. Each displayed row describes an income group in one country and one year.',
      mistakes:[{when:'!exists("df", inherits = FALSE)',message:'Save the imported data in an object called df.'},{when:'exists("df", inherits = FALSE) && is.data.frame(df) && nrow(df) == nrow(.wid_source)',message:'The data are loaded. Display the first six rows with head(df) as your last line.'}],
    },
    {
      ...taskDefaults, id:'inequality-inspect', title:'Inspect the dataset', heading:'Understand what each row represents.',
      intro:'Check the size and structure of the data before starting your comparison.',
      section:'What is in df?',
      body:`<p>Each row reports an income share for one country and year. The following table shows the <strong>codebook</strong>: it lists each variable’s name and describes what it contains.</p>
        <div class="data-dictionary"><div class="table-scroll"><table>
          <caption>Codebook for df</caption>
          <thead><tr><th scope="col">Variable name</th><th scope="col">Description</th></tr></thead>
          <tbody>
            <tr><td><code>country</code></td><td>The country: France, Germany, Switzerland or the United States.</td></tr>
            <tr><td><code>year</code></td><td>The year the income share refers to, from 1980 to 2024.</td></tr>
            <tr><td><code>group</code></td><td>Identifies which income share is reported. ${inequalityGroupsDescription}</td></tr>
            <tr><td><code>income_share</code></td><td>The share of total income received by the group, stored as a fraction of 1.</td></tr>
          </tbody>
        </table></div></div>`,
      noteTitle:'Definition: Top income share',
      note:'For example, if a <code>top10</code> row has <code>income_share = 0.30</code>, the <strong>10% of adults with the highest incomes</strong> together receive <strong>30% of total income</strong> in that country and year.',
      setup:rawSetup,
      taskTitle:'Count observations and list variables',
      task:'<p>Save the number of rows in <code>df</code> as <code>n_observations</code>, and its column names as <code>column_names</code>. Display both objects.</p>',
      solution:'n_observations <- nrow(df)\ncolumn_names <- names(df)\nn_observations\ncolumn_names',
      hints:['Use nrow() to count rows and names() to list the columns.', 'Save each result with <-. Write each object’s name on a separate line to display it.'],
      checkPrintedOutput:true,
      check:'exists("n_observations", inherits = FALSE) && isTRUE(all.equal(n_observations, nrow(.wid_source))) && exists("column_names", inherits = FALSE) && identical(column_names, names(.wid_source)) && grepl(as.character(n_observations), .printed_output, fixed = TRUE) && all(vapply(column_names, function(name) grepl(name, .printed_output, fixed = TRUE), logical(1)))',
      success:'Correct: 360 observations and four columns. The rows cover four countries, 45 years and two income groups.',
      mistakes:[{when:'exists("n_observations", inherits = FALSE) && isTRUE(all.equal(n_observations, 4L))',message:'That is the number of columns. Use nrow(df) to count observations.'}],
    },
    {
      ...taskDefaults, id:'inequality-prepare', title:'Prepare the data', heading:'Choose the period and calculate percentages.',
      intro:'Focus on the years since 2000 and express the income shares as percentages.',
      section:'Prepare df for the analysis',
      body:'<p>The source file covers 1980–2024. We will analyse 2000–2024.</p><p><code>income_share</code> stores the share as a fraction of 1, where 1 represents all of a country’s income. For example, <code>0.30</code> means that the group receives 30% of total income. To express the share as a percentage, multiply it by 100: <code>0.30 * 100</code> gives <code>30</code>.</p>',
      setup:rawSetup, setupNote:inequalityDataNote,
      taskTitle:'Filter and add share_pct',
      task:'<p>Filter the data frame so that you keep only rows with <code>year</code> greater than or equal to 2000. Use a pipe (<code>%&gt;%</code>) to pass the filtered data to <code>mutate()</code>. Add a new column called <code>share_pct</code> that contains <code>income_share</code> expressed as a percentage. Keep all existing columns, save the result as <code>df</code>, and display its first six rows.</p>',
      solution:'df <- df %>%\n  filter(year >= 2000) %>%\n  mutate(share_pct = income_share * 100)\nhead(df)',
      hints:['Use filter(year >= 2000) to choose the period. Then pass the result into mutate().', 'A fraction becomes a percentage when you multiply by 100: share_pct = income_share * 100. Assign the result back to df.'],
      check:`exists("df", inherits = FALSE) && ${sameRows('df', analysisData)}`,
      success:'Correct: df contains 200 observations for 2000–2024, with income shares expressed as percentages in share_pct.',
      mistakes:[{when:'exists("df", inherits = FALSE) && "share_pct" %in% names(df) && isTRUE(all.equal(df$share_pct, df$income_share))',message:'The new column still contains fractions. Multiply income_share by 100.'},{when:'exists("df", inherits = FALSE) && is.data.frame(df) && any(df$year < 2000)',message:'Some earlier years remain. Keep only observations from 2000 onward, including 2000.'}],
    },
    {
      ...taskDefaults, id:'inequality-countries', title:'Compare the countries', heading:'Where does the top 10% receive the largest share?',
      intro:'Compare all four countries in the same year: 2024.',
      section:'Make a table for one year and one group',
      body:'<p>To compare countries, use the same income definition, income group and year. Here we compare the percentage of pretax national income received by each country’s top 10%.</p>',
      setup:analysisSetup, setupNote:inequalityAnalysisNote,
      taskTitle:'Create country_comparison',
      task:'<p>Create <code>country_comparison</code> using only the <code>top10</code> rows for 2024, which report the share of total income received by the <strong>top 10%</strong> of adults by income. Keep the columns <code>country</code> and <code>share_pct</code>. Sort from the largest share to the smallest, then display the table.</p>',
      solution:'country_comparison <- df %>%\n  filter(year == 2024, group == "top10") %>%\n  select(country, share_pct) %>%\n  arrange(desc(share_pct))\ncountry_comparison',
      hints:['Use filter() with two conditions: year == 2024 and group == "top10". Then use select() for the two requested columns.', 'Use arrange(desc(share_pct)) for the largest value first. Save the result as country_comparison and display it.'],
      check:`exists("country_comparison", inherits = FALSE) && ${sameRows('country_comparison', `local({ data <- ${analysisData}; data[data$year == 2024 & data$group == "top10", c("country", "share_pct")] })`, ['country'])} && all(diff(country_comparison$share_pct) <= 0)`,
      success:'Correct: the table compares the top 10% income share in 2024, from largest to smallest.',
      mistakes:[{when:'exists("country_comparison", inherits = FALSE) && nrow(country_comparison) != 4L',message:'There should be one row for each of the four countries. Select one year and one income group.'},{when:'exists("country_comparison", inherits = FALSE) && "share_pct" %in% names(country_comparison) && any(diff(country_comparison$share_pct) > 0)',message:'Put the largest share first by using desc() inside arrange().'}],
    },
    {
      ...taskDefaults, id:'inequality-reshape', title:'Reshape the data', heading:'Put the two income groups side by side.',
      intro:'Create separate columns for the top 10% and bottom 50% income shares.',
      section:'One row per country and year',
      body:'<p>In <code>df</code>, the two income shares occupy separate rows. A wide table will put them in separate columns: <code>top10</code> contains the share of total income received by the <strong>top 10%</strong> of adults by income; <code>bottom50</code> contains the share of total income received by the <strong>bottom 50%</strong> of adults by income. Keep <code>country</code> and <code>year</code> to identify each row.</p>',
      packages:['tidyr'], setup:analysisSetup, setupNote:inequalityAnalysisNote,
      taskTitle:'Create comparison',
      task:'<p>First select <code>country</code>, <code>year</code>, <code>group</code> and <code>share_pct</code> from <code>df</code>. Reshape them from long to wide format: use <code>group</code> for the new column names and <code>share_pct</code> for their values. Save the result as <code>comparison</code> and display its first six rows.</p>',
      solution:'comparison <- df %>%\n  select(country, year, group, share_pct) %>%\n  pivot_wider(names_from = group, values_from = share_pct)\nhead(comparison)',
      hints:['Use select() to keep the four requested columns. The original income_share column is not needed in the wide table.', 'Use pivot_wider(names_from = group, values_from = share_pct). The group labels become the column names.'],
      check:`exists("comparison", inherits = FALSE) && ${sameRows('comparison', comparisonData, ['country','year'])}`,
      success:'Correct: comparison has 100 rows, one per country and year, with both income-group shares in percent.',
      mistakes:[{when:'exists("comparison", inherits = FALSE) && "income_share" %in% names(comparison)',message:'Select only country, year, group and share_pct before reshaping. Otherwise the original fractions can split a country-year into separate rows.'}],
      quiz:{question:'What does one row of comparison describe?',options:['One person and their annual income','One country in one year, with a column for each income group’s share','One income group averaged across all four countries'],correct:1,explanation:'country and year identify a row. top10 contains the share of total income received by the top 10% of adults by income; bottom50 contains the share received by the bottom 50% of adults by income. Both are in percent. They do not add to 100% because the income share of the middle 40% is not included.'},
    },
    {
      ...taskDefaults, id:'inequality-change', title:'Measure change over time', heading:'How much has the top 10% share changed?',
      intro:'Calculate the change between 2000 and 2024 separately for each country.',
      section:'Compare the beginning and end of the period',
      body:'<p>The <code>top10</code> column in <code>comparison</code> contains the share of total income received by the <strong>top 10%</strong> of adults by income, in percent. Subtract its value in 2000 from its value in 2024 to obtain a change in <strong>percentage points</strong>. A positive result means the top 10% received a larger share in 2024.</p>',
      noteTitle:'Percentage points and percent',
      note:'When you subtract two percentages, the result is in <strong>percentage points</strong>, not percent. For example, an increase from 20% to 25% is <strong>5 percentage points</strong>. Relative to the starting value of 20%, this is a 25% increase.',
      setup:comparisonSetup, setupNote:inequalityComparisonNote,
      taskTitle:'Create changes',
      task:'<p>Create a summary table called <code>changes</code> with one row per <code>country</code>. Add <code>change_pp</code>: the top 10% share in 2024 minus the top 10% share in 2000. Display the table.</p>',
      solution:'changes <- comparison %>%\n  group_by(country) %>%\n  summarise(change_pp = top10[year == 2024] - top10[year == 2000])\nchanges',
      hints:['Use group_by(country) before summarise(). Within each country, select the relevant value using a condition in square brackets.', 'top10[year == 2024] selects the share of total income received by the top 10% in 2024. Subtract top10[year == 2000] and name the result change_pp.'],
      check:`exists("changes", inherits = FALSE) && ${sameRows('changes', `local({ data <- ${comparisonData}; first <- data[data$year == 2000, c("country","top10")]; last <- data[data$year == 2024, c("country","top10")]; joined <- merge(first, last, by = "country"); data.frame(country = joined$country, change_pp = joined$top10.y - joined$top10.x) })`, ['country'])}`,
      success:'Correct: change_pp measures the change in percentage points for each country. Compare the values to see where the top 10% share increased most over this period.',
      mistakes:[{when:'exists("changes", inherits = FALSE) && is.data.frame(changes) && nrow(changes) != 4L',message:'Calculate one change per country. Group by country before summarising.'}],
    },
    {
      ...taskDefaults, id:'inequality-plot', title:'Plot the trends', heading:'Compare changes over time.',
      intro:'Use a line graph to see how each country’s top 10% income share developed between 2000 and 2024.',
      section:'One line per country',
      body:'<p>Illustrate how the share of total income received by the top 10% changes over time using a line graph, with one line for each country.</p>',
      packages:['ggplot2'], setup:analysisSetup, setupNote:inequalityAnalysisNote,
      taskTitle:'Create and display p',
      task:'<p>Create a line graph called <code>p</code> using the <code>top10</code> rows from <code>df</code>. Put <code>year</code> on the x-axis, <code>share_pct</code> on the y-axis, and map colour to <code>country</code>. Label the axes <strong>Year</strong> and <strong>Top 10% income share (%)</strong>. Add the caption <strong>Source: WID.world</strong>, use <code>theme_minimal()</code> and display the graph.</p>',
      solution:plotCode,
      hints:['Start with p <- df %>% filter(group == "top10") %>% ggplot(aes(...)). This passes the selected rows to ggplot() and leaves df unchanged. Map year, share_pct and colour = country, then add geom_line() with +.', 'Use labs(x = "Year", y = "Top 10% income share (%)", caption = "Source: WID.world") for the labels and source. Add theme_minimal(), save as p and write p on a new line.'],
      checkGraphics:true, check:plotCheck,
      success:'Correct: each line shows the top 10% income share in one country over time. A higher line means a larger share of that country’s total income goes to the top 10%.',
      mistakes:[{when:'exists("p", inherits = FALSE) && inherits(p, "ggplot") && is.data.frame(p$data) && "group" %in% names(p$data) && any(p$data$group != "top10")',message:'The graph includes the bottom50 rows. Filter for group == "top10" before passing the data to ggplot().'}, {when:'exists("p", inherits = FALSE) && inherits(p, "ggplot") && .plot_count == 0',message:'Your plot object exists. Write p on a new line to display it.'},{when:'exists("p", inherits = FALSE) && inherits(p, "ggplot") && !identical(p$labels$caption, "Source: WID.world")',message:'Add the data source with labs(caption = "Source: WID.world").'}],
      quiz:{question:'What does an increase in a country’s line mean?',options:['The top 10% receive a larger share of that country’s total pretax income','More than 10% of adults now belong to the top 10%','Average income necessarily increased for everyone in that country'],correct:0,explanation:'The y-axis measures the share of income received by the top 10%. It does not show the level of average income. The top group remains 10% of adults, although its members can change over time.'},
    },

  ],
};

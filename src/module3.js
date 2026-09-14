import { incomeDataNote, incomeFileNote, practiceDataNote } from './dataset-notes.js';

const profileSetup = 'df <- read.csv("data/data_incomes.csv")';
export const module3 = {
  id:'module-3',number:'03',title:'Working with data',titleMarker:'Intermediate',
  description:'Import income data, select rows, calculate columns, handle missing values, summarise groups, reshape tables and save your datasets.',
  lessons:[
    {
      id:'import',title:'Read and inspect a dataset',heading:'Meet your first dataset',data:true,
      packages:['readxl'],files:['data_incomes.csv','data_incomes.xlsx'],
      setupNote:incomeFileNote,
      intro:'How does income vary with age? Explore a dataset of incomes for women and men at different ages.',
      section:'Rows are observations; columns are variables',
      body:'<p><code>read.csv()</code> reads a comma-separated file into a <strong>data frame</strong>. A data frame stores data in rows and columns: each row describes an observation, and each column contains a variable. The filename is text, so it belongs in quotes. The practice file is already available in the <code>data/</code> folder.</p><p><code>head(df)</code> shows the first six rows. <code>names(df)</code> lists columns, <code>str(df)</code> shows their types, and <code>nrow(df)</code> counts observations. Use <code>df$annual_income</code> to extract one column as a vector.</p>',
      example:'df <- read.csv("data/data_incomes.csv")\n\n# inspect data\nhead(df)\nnames(df)\nstr(df)\nnrow(df)',table:true,
      taskTitle:'Load, count and select',task:'<p>Read <code>data/data_incomes.csv</code> into an object named <code>df</code>. Save the number of observations as <code>n_groups</code>, and display it.</p><p>Select the <code>annual_income</code> variable from <code>df</code> and store it in a new vector named <code>incomes</code>. Display this vector.</p>',
      starter:'df <- read.csv("______")\nn_groups <- ______\nn_groups\n\n# Select annual_income and store it as a vector\nincomes <- ______\nincomes',solution:'df <- read.csv("data/data_incomes.csv")\nn_groups <- nrow(df)\nn_groups\n\n# Select annual_income and store it as a vector\nincomes <- df$annual_income\nincomes',
      hints:['The filename is data/data_incomes.csv. Keep it inside quotation marks.', 'Use nrow(df) to count rows, rather than length(df), which counts columns.', 'Use $ to extract a column as a vector: incomes <- df$annual_income.'],
      check:'exists("df", inherits=FALSE) && is.data.frame(df) && exists("n_groups", inherits=FALSE) && isTRUE(all.equal(n_groups, 92L)) && isTRUE(all.equal(df, read.csv("data/data_incomes.csv"))) && exists("incomes", inherits=FALSE) && is.numeric(incomes) && isTRUE(all.equal(incomes, df$annual_income))',success:'Correct: 46 ages × 2 gender categories gives 92 rows. Your incomes vector contains the annual_income value from each row.',
      followUp:{
        title:'Read Excel files',exampleLabel:'Worked example',
        body:`<p>Data also come in Excel files, with names ending in <code>.xlsx</code> or <code>.xls</code>. To read them into R, use <code>read_excel()</code> from the <code>readxl</code> package.</p>
          <p>The practice file <code>data_incomes.xlsx</code> contains the same income data in a worksheet named <code>Incomes</code>. It is available in the <code>data/</code> folder.</p>
          <p>The first argument gives the file path. <code>sheet = "Incomes"</code> selects the worksheet to read. If you leave out <code>sheet</code>, <code>read_excel()</code> reads the first worksheet. You can then inspect <code>df</code> with the same commands as before.</p>`,
        example:`# Load the package
library(readxl)

# Read the Incomes worksheet and save it as df
df <- read_excel("data/data_incomes.xlsx", sheet = "Incomes")

# Inspect the first six rows
head(df)`,
      },
      quiz:{
        question:'What does <code>sheet = "Incomes"</code> select in the example above?',
        options:['Only the column named Incomes','The worksheet named Incomes','All worksheets in the Excel file'],
        correct:1,
        explanation:'sheet selects a worksheet inside the Excel file. The example reads the worksheet named Incomes and stores its data in df. It does not select a single column or combine all worksheets.',
      },
      downloadNotes:[
        'The Excel worked example reads the Incomes worksheet with read_excel().',
        'sheet selects a worksheet; leaving it out reads the first worksheet.',
        'Reference: https://readxl.tidyverse.org/reference/read_excel.html',
      ],
    },
    {
      id:'filter',title:'Select and sort data',heading:'Find the observations you need.',data:true,setup:profileSetup,setupNote:incomeDataNote,
      intro:'Focus on the observations and columns you need, then put the rows in a useful order.',
      section:'Read a pipe as “and then”',
      body:'<p>The <code>dplyr</code> package provides readable data commands. A package is a collection of functions; <code>library(dplyr)</code> makes them available. It is loaded for you in these data lessons.</p><p><code>filter()</code> keeps rows that meet a condition; <code>select()</code> keeps columns.</p><p>The symbol <code>%&gt;%</code> is called a <strong>pipe</strong>. It passes the result on its left into the function on its right. Read <code>df %&gt;% filter(...)</code> as “take df, and then filter it”.</p>',
      example:'df %>%\n  filter(gender == "Male") %>%\n  select(age, annual_income) %>%\n  head()',
      noteTitle:'Use == to compare.',note:'gender == "Male" asks a question about each row. Quotation marks are needed for the category value; column names such as gender are written without them. These two categories are a simplification in this practice dataset.',
      taskTitle:'Select the female income profile',task:'<p>Create <code>female_profile</code> by keeping rows where <code>gender</code> equals <code>"Female"</code>. Keep only <code>age</code> and <code>annual_income</code>, in that order.</p>',
      starter:'female_profile <- df %>%\n  filter(______) %>%\n  select(______)\n\nhead(female_profile)',
      solution:'female_profile <- df %>%\n  filter(gender == "Female") %>%\n  select(age, annual_income)\nhead(female_profile)',
      hints:['Compare gender with "Female" using ==.', 'select(age, annual_income) keeps just the two requested columns.'],
      check:'exists("female_profile", inherits=FALSE) && isTRUE(all.equal(as.data.frame(female_profile), as.data.frame(df %>% filter(gender == "Female") %>% select(age, annual_income))))',success:'Correct: you kept all 46 ages for the female profile and the two requested columns.',
      followUp:{
        title:'Sort rows with arrange()',
        body:'<p><code>arrange()</code> puts rows in order. Use <code>arrange(annual_income)</code> to sort incomes from lowest to highest. Use <code>arrange(desc(annual_income))</code> to reverse the order, from highest to lowest.</p><p>Sorting changes the order of the rows; the values in each row stay the same.</p>',
        example:'# Show the lowest incomes first\ndf %>%\n  select(age, gender, annual_income) %>%\n  arrange(annual_income) %>%\n  head()\n\n# Show the highest incomes first\ndf %>%\n  select(age, gender, annual_income) %>%\n  arrange(desc(annual_income)) %>%\n  head()',
      },
      quiz:{question:'Which code sorts the rows from highest to lowest annual income?',options:['<code>df %&gt;% arrange(annual_income)</code>','<code>df %&gt;% arrange(desc(annual_income))</code>','<code>df %&gt;% select(annual_income)</code>'],correct:1,explanation:'arrange(desc(annual_income)) puts the highest incomes first. arrange(annual_income) sorts from lowest to highest. select(annual_income) keeps a column; it does not sort the rows.'},
    },
    {
      id:'mutate',title:'Calculate new columns',heading:'Turn raw columns into useful quantities.',data:true,setup:profileSetup,setupNote:incomeDataNote,
      intro:'Convert annual incomes into monthly amounts, then calculate the total income represented by each row.',
      section:'mutate() adds a calculation to every row',
      body:'<p><code>annual_income</code> is a group mean. Dividing it by 12 gives mean monthly income. Multiplying it by <code>n_people</code> gives the group’s total annual income.</p><p><code>mutate()</code> creates or changes columns. Save its result to keep the new columns: <code>df_new &lt;- df %&gt;% mutate(...)</code>.</p><p>You can also update the existing data frame by saving the result under the same name: <code>df &lt;- df %&gt;% mutate(monthly_income = annual_income / 12)</code>. The <code>df</code> object then contains the updated data frame.</p>',
      example:'df_new <- df %>%\n  mutate(monthly_income = annual_income / 12)\n\ndf_new %>%\n  select(age, gender, monthly_income) %>%\n  head()',
      noteTitle:'Keep track of the unit of each column.',note:'annual_income is annual currency units per person. total_income is annual currency units for the whole age–gender group. Multiplying by the number of people changes what the quantity describes.',
      followUp:{
        position:'before-exercise',
        title:'Use functions inside mutate()',
        body:'<p>You can use functions inside <code>mutate()</code> when calculating a column. For example, <code>round(annual_income / 12, digits = 2)</code> first calculates monthly income, then rounds each value to two decimal places. <code>mutate()</code> stores these results in the <code>monthly_income</code> column.</p>',
        example:'df_rounded <- df %>%\n  mutate(monthly_income = round(annual_income / 12, digits = 2))\n\ndf_rounded %>%\n  select(age, gender, annual_income, monthly_income) %>%\n  head()',
      },
      taskTitle:'Add monthly and total income',task:'<p>Create <code>df_new</code> with two additional columns: <code>monthly_income</code>, the annual mean divided by 12, and <code>total_income</code>, the annual mean multiplied by the number of people.</p>',
      starter:'df_new <- df %>%\n  mutate(\n    monthly_income = ______,\n    total_income = ______\n  )\n\nhead(df_new)',
      solution:'df_new <- df %>%\n  mutate(\n    monthly_income = annual_income / 12,\n    total_income = annual_income * n_people\n  )\nhead(df_new)',
      hints:['Use annual_income / 12 for the monthly mean.', 'Multiply annual_income by n_people to get total_income.'],
      check:'exists("df_new", inherits=FALSE) && is.data.frame(df_new) && local({ expected <- read.csv("data/data_incomes.csv"); expected$monthly_income <- expected$annual_income / 12; expected$total_income <- expected$annual_income * expected$n_people; if (!all(names(expected) %in% names(df_new))) FALSE else { actual <- as.data.frame(df_new)[names(expected)]; actual <- actual[order(actual$age, actual$gender), ]; expected <- expected[order(expected$age, expected$gender), ]; rownames(actual) <- NULL; rownames(expected) <- NULL; isTRUE(all.equal(actual, expected, check.attributes=FALSE)) } })',success:'Correct: you calculated a monthly mean and a total annual income for each age–gender group.',
      mistakes:[{when:'exists("df_new", inherits=FALSE) && is.data.frame(df_new) && !all(c("age","gender","annual_income","n_people") %in% names(df_new))',message:'Keep the original columns and add the two new ones with mutate().'}, {when:'exists("df_new", inherits=FALSE) && isTRUE(all.equal(df_new$monthly_income, df$annual_income*12))',message:'To convert an annual amount into a monthly amount, divide by 12 rather than multiply.'}],
    },
    {
      id:'missing',title:'Handle missing values',heading:'Calculate a mean with missing data.',data:true,
      setup:'practice <- data.frame(\n  age = c(25, 35, 45, 55),\n  annual_income = c(31700, NA, 46700, 45600)\n)',
      setupNote:practiceDataNote,
      intro:'An unreported income is not a zero. R makes that distinction explicit with NA.',
      section:'Recognise missing incomes',
      body:`<p>The small dataset <code>practice</code> is prepared for you. It contains annual incomes for women at four ages. The income at age 35 was not reported, so its value is <code>NA</code>.</p>
        <div class="data-dictionary"><div class="table-scroll"><table><caption>practice · annual income in $</caption><thead><tr><th>age</th><th>annual_income</th></tr></thead><tbody><tr><td>25</td><td>31,700</td></tr><tr><td>35</td><td><code>NA</code></td></tr><tr><td>45</td><td>46,700</td></tr><tr><td>55</td><td>45,600</td></tr></tbody></table></div></div>
        <p><code>is.na(practice$annual_income)</code> checks each income: <code>TRUE</code> means it is missing, and <code>FALSE</code> means it is available.</p>
        <p><code>mean()</code> returns <code>NA</code> when an input is missing. Add <code>na.rm = TRUE</code> to calculate the mean using only the available values.</p>`,
      example:'# Identify missing incomes: TRUE means missing, FALSE means observed\nis.na(practice$annual_income)\n\n# By default, the missing value makes the mean NA\nmean(practice$annual_income)\n\n# Calculate the mean using only the observed incomes\nmean(practice$annual_income, na.rm = TRUE)',
      noteTitle:'The missing income stays missing.',note:'na.rm = TRUE excludes the missing value from this calculation. It does not replace it with zero or change the practice dataset. The result is the mean of the three reported income values.',
      taskTitle:'Calculate the mean of the observed incomes',task:'<p>Using <code>practice</code>, calculate the mean of the available <code>annual_income</code> values. Save the result as <code>mean_observed</code> and display it.</p>',
      starter:'mean_observed <- ______\nmean_observed',
      solution:'mean_observed <- mean(practice$annual_income, na.rm = TRUE)\nmean_observed',
      hints:['Use practice$annual_income to select the income column.', 'Add na.rm = TRUE inside mean() to leave out the missing value.'],
      check:'exists("mean_observed", inherits=FALSE) && isTRUE(all.equal(mean_observed, (31700 + 46700 + 45600) / 3))',success:'Correct: the mean of the observed incomes is $41,333.33. The missing value is excluded from this calculation.',
      quiz:{question:'What does na.rm = TRUE do in mean()?',options:['Leaves missing values out of this mean calculation','Replaces missing values with zero','Deletes rows with missing values from the original dataset'],correct:0,explanation:'The mean uses only the observed values. The original dataset stays unchanged.'},
    },
    {
      id:'aggregate',title:'Aggregation',heading:'Compare incomes across groups.',data:true,setup:profileSetup,setupNote:incomeDataNote,
      intro:'Create a summary table with aggregate statistics for women and men. For each group, calculate the number of people, their total income and the mean of the income values across ages.',
      section:'Group first, then summarise',
      body:'<p><code>group_by(gender)</code> tells subsequent commands to work separately for each gender. <code>summarise()</code> collapses each group into one row of results.</p><p>Reuse the functions from Module 2: add people with <code>sum(n_people)</code>, calculate total income with <code>sum(annual_income * n_people)</code> and average the age-group incomes with <code>mean(annual_income)</code>. Use <code>.groups = "drop"</code> to return an ordinary, ungrouped summary.</p>',
      example:'df %>%\n  group_by(gender) %>%\n  summarise(\n    total_people = sum(n_people),\n    .groups = "drop"\n  )',
      noteTitle:'Read the mean in the units of your rows.',note:'Each row represents one age group. mean(annual_income) gives every age group an equal contribution, regardless of its population size. The Tools module explains how to account for different group sizes when calculating a mean across people.',
      taskTitle:'Compare the two profiles',task:'<p>Create <code>summary_by_gender</code>, with one row per <code>gender</code> and columns <code>total_people</code>, <code>total_income</code>, and <code>mean_income</code>. Use <code>mean(annual_income)</code> for the simple average across the 46 age groups in each profile.</p>',
      starter:'summary_by_gender <- df %>%\n  group_by(gender) %>%\n  summarise(\n    total_people = ______,\n    total_income = ______,\n    mean_income = ______,\n    .groups = "drop"\n  )\n\nsummary_by_gender',
      solution:'summary_by_gender <- df %>%\n  group_by(gender) %>%\n  summarise(\n    total_people = sum(n_people),\n    total_income = sum(annual_income * n_people),\n    mean_income = mean(annual_income),\n    .groups = "drop"\n  )\nsummary_by_gender',
      hints:['Use sum(n_people) and sum(annual_income * n_people) for the two totals inside summarise().', 'Add mean_income = mean(annual_income) inside the same summarise() call.'],
      check:'exists("summary_by_gender", inherits=FALSE) && isTRUE(all.equal(as.data.frame(summary_by_gender %>% arrange(gender)), as.data.frame(df %>% group_by(gender) %>% summarise(total_people=sum(n_people), total_income=sum(annual_income*n_people), mean_income=mean(annual_income), .groups="drop") %>% arrange(gender)), check.attributes=FALSE))',success:'Correct: you have summarised both profiles. mean_income is the simple average across the 46 age-group incomes for each gender.',
      followUp:{
        title:'Use mutate() within groups',
        body:`<p>You can group calculations directly inside <code>mutate()</code> using <code>.by = gender</code>. Here, <code>mean(annual_income)</code> is calculated separately for women and men. Each row receives the mean of the income values in its own gender group.</p>
          <div class="data-dictionary"><div class="table-scroll"><table><caption>Two ways to calculate a mean by gender</caption><thead><tr><th>Function</th><th>Result</th></tr></thead><tbody><tr><td><code>summarise(..., .by = gender)</code></td><td>2 rows: one mean per gender</td></tr><tr><td><code>mutate(..., .by = gender)</code></td><td>All 92 rows stay, with the group mean added as a new column</td></tr></tbody></table></div></div>
          <p><code>.by</code> groups the data for this calculation only. The resulting data frame is ungrouped, so a separate <code>ungroup()</code> step is not needed.</p>`,
        example:'# Calculate the mean separately for women and men\n# .by groups the data only for this calculation\ndf_with_mean <- df %>%\n  mutate(\n    group_mean = mean(annual_income),\n    .by = gender\n  )\n\n# Inspect the original incomes and the new group mean\ndf_with_mean %>%\n  select(age, gender, annual_income, group_mean) %>%\n  head()',
      },
    },
    {
      id:'reshape',title:'Reshape data',heading:'From long to wide format',data:true,packages:['tidyr'],setup:profileSetup,
      setupNote:incomeDataNote,
      intro:'The same data can be stored in different shapes. Reshape a table from long format to wide format.',
      section:'Wide and long describe how a table is organised',
      body:`<p>The income data are currently in <strong>long format</strong>: each age has a row for women and a row for men. The <code>gender</code> column identifies the group, and <code>annual_income</code> contains its income. In <strong>wide format</strong>, each age has one row, with separate <code>Female</code> and <code>Male</code> columns containing the incomes.</p>
        <div class="reshape-comparison">
          <div class="data-dictionary"><div class="table-scroll"><table><caption>Before · long</caption><thead><tr><th>age</th><th>gender</th><th>annual_income</th></tr></thead><tbody><tr><td>25</td><td>Female</td><td>31,700</td></tr><tr><td>25</td><td>Male</td><td>31,600</td></tr><tr><td>35</td><td>Female</td><td>43,100</td></tr><tr><td>35</td><td>Male</td><td>45,700</td></tr></tbody></table></div></div>
          <div class="data-dictionary"><div class="table-scroll"><table><caption>After · wide</caption><thead><tr><th>age</th><th>Female</th><th>Male</th></tr></thead><tbody><tr><td>25</td><td>31,700</td><td>31,600</td></tr><tr><td>35</td><td>43,100</td><td>45,700</td></tr></tbody></table></div></div>
        </div>
        <p><code>pivot_wider()</code> comes from the package <code>tidyr</code> and can be used to transform a dataset from long to wide format. Use <code>names_from = gender</code> to turn the values Female and Male into column names. Use <code>values_from = annual_income</code> to fill those columns with the income values.</p>
        <p>First keep only <code>age</code>, <code>gender</code> and <code>annual_income</code> with <code>select()</code>. This leaves <code>age</code> as the identifier for each output row.</p>`,
      example:'library(tidyr)\n\n# Inspect two ages in long format\nexample_long <- df %>%\n  filter(age %in% c(25, 35)) %>%\n  select(age, gender, annual_income)\nexample_long\n\n# Create one income column for women and one for men\nexample_wide <- example_long %>%\n  pivot_wider(\n    names_from = gender,\n    values_from = annual_income\n  )\nexample_wide',
      noteTitle:'Change the shape, keep the values.',
      note:'The full dataset has 92 age–gender rows. In wide format, it has 46 rows, one per age, with incomes in separate Female and Male columns. All income values are preserved. We leave out n_people because this example reshapes only the income values.',
      taskTitle:'Reshape the complete income profiles',
      task:'<p>Reshape the full <code>df</code> dataset from long to wide format and save it as <code>df_wide</code>. Start by keeping <code>age</code>, <code>gender</code> and <code>annual_income</code>. Create separate <code>Female</code> and <code>Male</code> columns containing the income values. The result should have <strong>46 rows and three columns</strong>: <code>age</code>, <code>Female</code> and <code>Male</code>.</p>',
      starter:'df_wide <- df %>%\n  select(age, gender, annual_income) %>%\n  pivot_wider(\n    names_from = ______,\n    values_from = ______\n  )\n\nhead(df_wide)\nnrow(df_wide)',
      solution:'df_wide <- df %>%\n  select(age, gender, annual_income) %>%\n  pivot_wider(\n    names_from = gender,\n    values_from = annual_income\n  )\nhead(df_wide)\nnrow(df_wide)',
      hints:['Use names_from = gender so Female and Male become the new column names.', 'Use values_from = annual_income to fill the new columns with income values.'],
      check:'exists("df_wide", inherits=FALSE) && is.data.frame(df_wide) && setequal(names(df_wide), c("age","Female","Male")) && isTRUE(all.equal(as.data.frame(df_wide %>% select(age,Female,Male) %>% arrange(age)), as.data.frame(read.csv("data/data_incomes.csv") %>% select(age,gender,annual_income) %>% pivot_wider(names_from=gender, values_from=annual_income) %>% select(age,Female,Male) %>% arrange(age)), check.attributes=FALSE))',
      success:'Correct: the 92 long rows became 46 wide rows, one per age, with separate Female and Male income columns. Every income value is preserved.',
      mistakes:[
        {when:'exists("df_wide", inherits=FALSE) && "n_people" %in% names(df_wide)',message:'Keep only age, gender and annual_income before pivot_wider(). Otherwise n_people also identifies rows, so you do not get one row per age.'},
        {when:'exists("df_wide", inherits=FALSE) && !all(c("Female","Male") %in% names(df_wide))',message:'Use names_from = gender so Female and Male become column names, and values_from = annual_income to fill them.'},
      ],
      followUp:{
        title:'From wide to long format',
        body:`<p><code>pivot_longer()</code> also comes from the package <code>tidyr</code> and transforms a dataset from wide to long format. Here, we move the incomes from the <code>Female</code> and <code>Male</code> columns into a single income column.</p>
          <ul><li><code>cols = c(Female, Male)</code> selects the columns to reshape.</li><li><code>names_to = "gender"</code> stores their column names, Female and Male, in a new <code>gender</code> column.</li><li><code>values_to = "annual_income"</code> stores their income values in a new <code>annual_income</code> column.</li></ul>
          <p><code>age</code> stays as an identifier. Each age now has two rows, one for women and one for men. The code first recreates the wide table from your exercise, then converts it back to long format.</p>`,
        example:'# Recreate the wide table from the exercise\ndf_wide <- df %>%\n  select(age, gender, annual_income) %>%\n  pivot_wider(\n    names_from = gender,\n    values_from = annual_income\n  )\nhead(df_wide)\n\n# Move Female and Male into a gender column and collect their incomes\ndf_long <- df_wide %>%\n  pivot_longer(\n    cols = c(Female, Male),\n    names_to = "gender",\n    values_to = "annual_income"\n  )\n\nhead(df_long)\nnrow(df_long)',
      },
      quiz:{question:'What happens to the column names Female and Male when you use pivot_longer() in this example?',options:['They remain as two separate column names','They become values in the gender column','They become values in the annual_income column'],correct:1,explanation:'names_to = "gender" puts Female and Male into the gender column. Their income values go into annual_income. The result has 92 rows, one per age–gender group.'},
    },
    {
      id:'save-data',title:'Save a dataset',heading:'Save your data for later.',
      data:true,packages:['writexl','readxl'],setup:profileSetup,downloadFiles:['csv','xlsx'],
      intro:'Save a data frame as a CSV or Excel file so you can open it again or share it.',
      section:'Save a CSV with write.csv()',
      body:'<p><code>write.csv()</code> writes a data frame to a CSV file. Give it the data frame first, then the filename in quotes. Use <code>row.names = FALSE</code> to leave out R’s row names, which are often just row numbers. Your column names are still included.</p>',
      exampleSetupNote:incomeDataNote,
      example:'# Save df as a CSV file, without an extra column of row names\nwrite.csv(df, file = "incomes_saved.csv", row.names = FALSE)\n\n# Show the folder where R saved the file\ngetwd()',
      noteTitle:'Where are the files saved?',
      note:'On this website, the files are created in your browser session. Use the download links below the output to save them to your computer. In RStudio, these filenames save to the current working directory: getwd() shows that folder. Using an existing filename replaces that file.',
      followUp:{
        position:'before-exercise',exampleLabel:'Worked example',
        title:'Save an Excel file with write_xlsx()',
        body:'<p>Use <code>write_xlsx()</code> from the <code>writexl</code> package to create an Excel file ending in <code>.xlsx</code>. It saves the data frame in a worksheet, including its column names.</p>',
        example:'# Load the package\nlibrary(writexl)\n\n# Save df as an Excel file\nwrite_xlsx(df, path = "incomes_saved.xlsx")',
      },
      taskTitle:'Save the data in both formats',
      task:'<p>Save <code>df</code> as <code>my_incomes.csv</code> and <code>my_incomes.xlsx</code>. Include all rows and columns, and leave out R’s row names in the CSV file. Download the files using the links below your output.</p>',
      setupNote:incomeDataNote,
      starter:'# Save df as a CSV file\nwrite.csv(df, file = "______", row.names = ______)\n\n# Save df as an Excel file\nlibrary(writexl)\nwrite_xlsx(df, path = "______")',
      solution:'# Save df as a CSV file\nwrite.csv(df, file = "my_incomes.csv", row.names = FALSE)\n\n# Save df as an Excel file\nlibrary(writexl)\nwrite_xlsx(df, path = "my_incomes.xlsx")',
      hints:['Use "my_incomes.csv" as the CSV filename and row.names = FALSE to leave out R’s row names.', 'Use write_xlsx(df, path = "my_incomes.xlsx") to save the Excel file.'],
      check:'file.exists("my_incomes.csv") && file.exists("my_incomes.xlsx") && isTRUE(all.equal(read.csv("my_incomes.csv"), df)) && isTRUE(all.equal(as.data.frame(readxl::read_excel("my_incomes.xlsx")), df))',
      success:'Correct: both files contain all 92 rows and the four columns of df. The CSV has no extra column of row names. Use the download links to open the files on your computer.',
      mistakes:[{when:'!file.exists("my_incomes.csv") || !file.exists("my_incomes.xlsx")',message:'Save both files with the requested names: my_incomes.csv and my_incomes.xlsx.'},{when:'file.exists("my_incomes.csv") && ncol(read.csv("my_incomes.csv")) > ncol(df)',message:'The CSV contains an extra column. Use row.names = FALSE in write.csv().'}],
      downloadNotes:[
        'The worked examples write incomes_saved.csv and incomes_saved.xlsx. The exercise saves my_incomes.csv and my_incomes.xlsx.',
        'On the website, download links appear below the output. In RStudio, files are saved in the current working directory.',
        'getwd() shows the output folder. An existing file with the same name is replaced.',
      ],
      sources:[
        {label:'write.csv()',url:'https://stat.ethz.ch/R-manual/R-devel/library/utils/html/write.table.html'},
        {label:'write_xlsx()',url:'https://docs.ropensci.org/writexl/reference/write_xlsx.html'},
      ],
    },
  ],
};

import { incomeDataNote } from './dataset-notes.js';

const taxFunction = `tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}`;
const ready = {data:true, setup:'df <- read.csv("data/data_incomes.csv")',
  setupNote:incomeDataNote};
export const module6 = {
  id:'module-6',number:'06',title:'Loops',titleMarker:'Advanced',
  description:'Repeat calculations with for, save the results and compare tax payments under different assumptions.',
  lessons:[
    {
      id:'loops-first',title:'Repeat a calculation with a loop',heading:'Repeat a calculation with a loop.',
      intro:'A loop repeats a block of code. Use the tax function to calculate a payment for each income.',
      section:'Read for as “for each value”',
      body:'<p><code>for (y in incomes) { ... }</code> means: repeat the code inside <code>{ }</code> once for each income stored in the vector <code>incomes</code>. In the example below, R first uses <code>y = 20000</code>, then <code>y = 40000</code>, and finally <code>y = 60000</code>. Each time, it runs the same code inside <code>{ }</code> with the new income. After all three incomes, R moves on to the code below the loop.</p><p>Inside the loop, use <code>print(payment)</code> to display each payment. Typing <code>payment</code> on its own inside the loop will not display it.</p>',
      example:`${taxFunction}\n\nincomes <- c(20000, 40000, 60000)\n\nfor (y in incomes) {\n  payment <- tax_payment(y)\n  print(payment)\n}`,
      quiz:{
        position:'after-example',
        question:'What does print(payment) display when the loop above runs?',
        options:[
          'Only the tax payment for the last income, 60,000.',
          'Three tax payments: one for 20,000, one for 40,000 and one for 60,000.',
          'The sum of the three tax payments.',
        ],
        correct:1,
        explanation:'The loop calculates and prints one payment for each income. Because print(payment) is inside the braces, it runs three times.',
      },
      exerciseIntro:{
        title:'Change a parameter in the loop',
        body:'<p>A loop can also repeat a calculation for different parameter values. This time, keep income fixed at <strong>40,000</strong> and try three values of <code>rho</code>.</p><p><code>for (rho in rho_values)</code> uses each value stored in <code>rho_values</code> in turn. In <code>tax_payment(income, tau = -1, rho = rho)</code>, the first <code>rho</code> names the function argument; the second supplies the current value from the loop. Use <code>print(payment)</code> inside the braces to display each result.</p>',
      },
      taskTitle:'Calculate payments for three values of rho',task:'<p>For an annual income of <strong>40,000</strong>, calculate the tax payment using <strong>rho = 0.08, 0.12 and 0.16</strong>. Keep <code>tau = -1</code>. Complete the loop to calculate <code>payment</code> using the current value of <code>rho</code>, then print it.</p><p>Your output should show three payments, in the same order as the values in <code>rho_values</code>.</p>',
      starter:`${taxFunction}\n\nincome <- 40000\nrho_values <- c(0.08, 0.12, 0.16)\n\nfor (rho in rho_values) {\n  # Calculate the payment for this income and the current rho\n  payment <- ______\n  # Display the payment\n  ______\n}`,
      solution:`${taxFunction}\nincome <- 40000\nrho_values <- c(0.08, 0.12, 0.16)\nfor (rho in rho_values) {\n  payment <- tax_payment(income, tau = -1, rho = rho)\n  print(payment)\n}`,
      hints:['Use tax_payment(income, tau = -1, rho = rho). Income stays at 40,000 while rho changes.', 'Put print(payment) inside the loop so that all three payments are displayed.'],
      checkPrintedOutput:true,
      check:String.raw`exists("income", inherits=FALSE) && isTRUE(all.equal(income, 40000)) && exists("rho_values", inherits=FALSE) && isTRUE(all.equal(rho_values, c(0.08,0.12,0.16))) && isTRUE(all.equal(scan(text=gsub("\\[[0-9]+\\]", "", .printed_output), quiet=TRUE), 40000 - 2/(1-c(0.08,0.12,0.16))*40000^(1-c(0.08,0.12,0.16)), tolerance=1e-6))`,
      success:'Correct: the output shows three tax payments for the same income of 40,000, using rho = 0.08, 0.12 and 0.16 in that order.',
      mistakes:[
        {when:'!nzchar(trimws(.printed_output))',message:'No payments were displayed. Put print(payment) inside the loop.'},
        {when:String.raw`length(scan(text=gsub("\\[[0-9]+\\]", "", .printed_output), quiet=TRUE)) != 3`,message:'Display one payment for each of the three rho values. Keep print(payment) inside the loop so it runs each time.'},
        {when:String.raw`isTRUE(all.equal(scan(text=gsub("\\[[0-9]+\\]", "", .printed_output), quiet=TRUE), rep(40000-2/0.88*40000^0.88, 3), tolerance=1e-6))`,message:'All three payments use rho = 0.12. Pass rho = rho to use the current parameter value from the loop.'},
      ],
    },
    {
      id:'loops-store',title:'Save the results of a loop',heading:'Keep the payments you calculate.',
      intro:'Save each calculated tax payment so you can use all the results afterward.',
      section:'Keep each payment as it is calculated',
      body:`<p>Instead of printing the calculated tax payment for each income, we now want to save <strong>every calculated tax payment</strong> in a vector called <code>payments</code>.</p>
        <p>Start with <code>payments &lt;- numeric(0)</code>. This creates an empty numeric vector with no entries.</p>
        <p>You already know <code>c()</code> combines values into a vector. Here, <code>payments &lt;- c(payments, payment)</code> keeps the payments saved so far and adds the new <code>payment</code> at the end.</p>
        <p>First, try this without a loop: calculate a payment for 20,000, save it, then add the payment for 40,000.</p>`,
      example:`${taxFunction}\n\n# Set up a vector for storing results\npayments <- numeric(0)\n\n# Calculate and save the first payment\npayment <- tax_payment(20000)\npayments <- c(payments, payment)\npayments\n\n# Add the second payment to the saved results\npayment <- tax_payment(40000)\npayments <- c(payments, payment)\npayments`,
      quiz:{
        position:'after-example',
        question:'What does payments <- c(payments, payment) do?',
        options:[
          'Adds all the payments together to produce one total.',
          'Keeps the saved payments and adds the new payment at the end of the vector.',
          'Replaces the saved payments with only the new payment.',
        ],
        correct:1,
        explanation:'c() combines the saved values with the new payment. The vector grows by one entry, and all earlier payments stay in it.',
      },
      followUp:{
        position:'before-exercise',
        title:'Let the loop collect the payments',
        body:`<p>Now let the loop repeat those steps. The vector <code>incomes</code> below contains three incomes: 20,000, 40,000 and 60,000.</p>
          <ol>
            <li><p><strong>Start with an empty result vector.</strong> Create <code>payments &lt;- numeric(0)</code> before the loop.</p></li>
            <li><p><strong>Calculate and save each payment.</strong> Inside the loop, add <code>payments &lt;- c(payments, payment)</code> to save each new result. You can still use <code>print(payment)</code> to display it.</p></li>
            <li><p><strong>Display the saved results together.</strong> After the loop, <code>data.frame(income = incomes, tax = payments)</code> creates a data frame. Its <code>income</code> column contains the incomes; its <code>tax</code> column contains the saved payments. The first income and first payment form the first row, and so on.</p></li>
          </ol>`,
        example:`${taxFunction}\n\nincomes <- c(20000, 40000, 60000)\n\n# 1. Start with an empty vector\npayments <- numeric(0)\n\n# 2. Use the loop from Lesson 1 and save each payment\nfor (y in incomes) {\n  payment <- tax_payment(y)\n  print(payment)\n  payments <- c(payments, payment)\n}\n\n# 3. Display all saved payments beside their incomes\ndata.frame(income = incomes, tax = payments)`,
      },
      taskTitle:'Save payments for three values of rho',
      task:'<p>For an annual income of <strong>40,000</strong>, calculate and save the tax payment using <strong>rho = 0.08, 0.12 and 0.16</strong>. Keep <code>tau = -1</code>. Complete the three blanks:</p><ol><li>Create an empty numeric vector called <code>payments</code> before the loop.</li><li>Calculate <code>payment</code> for the fixed income and the current value of <code>rho</code>.</li><li>Add this payment to the saved results using <code>c()</code>.</li></ol><p>The final <code>data.frame()</code> line is provided. It shows each value of <code>rho</code> beside its tax payment.</p>',
      starter:`${taxFunction}\n\nincome <- 40000\nrho_values <- c(0.08, 0.12, 0.16)\n\n# Start with an empty vector\npayments <- ______\n\nfor (rho in rho_values) {\n  # Calculate the payment for the fixed income and current rho\n  payment <- ______\n  # Keep the saved payments and add the new one\n  payments <- ______\n}\n\ndata.frame(rho = rho_values, tax_payment = payments)`,
      solution:`${taxFunction}\nincome <- 40000\nrho_values <- c(0.08, 0.12, 0.16)\npayments <- numeric(0)\nfor (rho in rho_values) {\n  payment <- tax_payment(income, tau = -1, rho = rho)\n  payments <- c(payments, payment)\n}\ndata.frame(rho = rho_values, tax_payment = payments)`,
      hints:['Use numeric(0) to create an empty numeric vector.', 'Use tax_payment(income, tau = -1, rho = rho). Income stays at 40,000 while rho changes.', 'Use c(payments, payment) to combine the saved payments with the new one.'],
      check:'exists("income", inherits=FALSE) && isTRUE(all.equal(income, 40000)) && exists("rho_values", inherits=FALSE) && isTRUE(all.equal(rho_values, c(0.08,0.12,0.16))) && exists("payments", inherits=FALSE) && isTRUE(all.equal(payments, 40000 - 2/(1-c(0.08,0.12,0.16))*40000^(1-c(0.08,0.12,0.16))))',
      success:'Correct: payments contains the three tax payments for an income of 40,000. The data frame pairs each rho value with its payment.',
      mistakes:[
        {when:'exists("payments", inherits=FALSE) && length(payments) == 1',message:'Only one result was saved. Create payments before the loop and use c(payments, payment) inside it to keep all three payments.'},
        {when:'exists("payments", inherits=FALSE) && isTRUE(all.equal(payments, rep(40000-2/0.88*40000^0.88, 3)))',message:'All three payments use rho = 0.12. Pass rho = rho to use the current parameter value from the loop.'},
      ],
    },
    {
      id:'loops-scenarios',title:'Apply a function to a dataset',heading:'One dataset. Several tax schedules.',...ready,packages:['tidyr','ggplot2'],
      exampleSetupNote:ready.setupNote,
      intro:'Use a loop to add a new column of tax payments to the data frame for each value of rho.',
      section:'Create a tax column for each value of rho',
      body:`<p>We want to compare tax payments under different values of <code>rho</code>. A loop lets us repeat the same calculation for each value of <code>rho</code>. We use the same incomes each time and keep <code>tau = -1</code>.</p>
        <p><code>for (rho in rho_values)</code> uses each value in <code>rho_values</code> in turn. In the example below, R first uses <code>rho = 0.1</code>, then <code>rho = 0.15</code>. Each time, we create one new column of tax payments.</p>
        <ol>
          <li><p><strong>Prepare the data frame.</strong> Use <code>df_tax &lt;- df</code> to copy the income data. We will add new columns to <code>df_tax</code> with the tax payments under different values of <code>rho</code>.</p></li>
          <li><p><strong>Name the new column.</strong> Inside the loop, <code>paste0("tax_rho_", rho)</code> joins the text with the current value of <code>rho</code>, without spaces. For <code>rho = 0.1</code>, it creates <code>"tax_rho_0.1"</code>. Save this name in <code>column_name</code>.</p></li>
          <li><p><strong>Calculate and save the payments.</strong> <code>tax_payment(df$annual_income, tau = -1, rho = rho)</code> calculates one payment for every income using the current value of <code>rho</code>.</p>
            <p>Assign the result to <code>df_tax[[column_name]]</code>. The double brackets use the name stored in <code>column_name</code> to add the new column. All 92 payments are saved at once: the first payment goes into the first income’s row, the second into the second income’s row, and so on.</p></li>
        </ol>
        <p>The result, <code>df_tax</code>, contains all the original columns plus <code>tax_rho_0.1</code> and <code>tax_rho_0.15</code>. Use <code>head(df_tax)</code> to see the first six rows and compare the payments side by side.</p>`,
      example:`${taxFunction}\n\n# 1. Copy the income data and choose the values of rho\ndf_tax <- df\nrho_values <- c(0.1, 0.15)\n\nfor (rho in rho_values) {\n  # 2. Create a column name for the current rho\n  column_name <- paste0("tax_rho_", rho)\n\n  # 3. Calculate the payments and save them in the new column\n  df_tax[[column_name]] <- tax_payment(\n    df$annual_income,\n    tau = -1,\n    rho = rho\n  )\n}\n\n# Display the original data and the new tax columns\nhead(df_tax)`,
      noteTitle:'Describe what the comparison holds fixed.',note:'Only rho changes here: tau, income units and the synthetic income distribution stay fixed. Each new column contains tax calculated at the mean income of each age–gender group. With this nonlinear formula, that is not the same as the average tax paid by individuals in the group.',
      taskTitle:'Add tax columns for three values of rho',task:'<p>Use a <code>for</code> loop to calculate tax payments for <strong>rho = 0.08, 0.12 and 0.16</strong>, keeping <code>tau = -1</code>. Add the results as three new columns in <code>df_tax</code>. Complete the three blanks:</p><ol><li>Create <code>column_name</code> by combining <code>"tax_rho_"</code> with the current value of <code>rho</code>.</li><li>Supply the income column <code>df$annual_income</code> to the tax function.</li><li>Use the current value of <code>rho</code> in the tax function.</li></ol><p>The assignment to <code>df_tax[[column_name]]</code> saves the payments in the new column. Keep all 92 rows and the original columns. Your new columns should be called <code>tax_rho_0.08</code>, <code>tax_rho_0.12</code> and <code>tax_rho_0.16</code>.</p>',
      starter:`${taxFunction}\n\ndf_tax <- df\nrho_values <- c(0.08, 0.12, 0.16)\n\nfor (rho in rho_values) {\n  # Create a column name for the current rho\n  column_name <- ______\n\n  # Calculate and save the payments for all incomes\n  df_tax[[column_name]] <- tax_payment(\n    ______,\n    tau = -1,\n    rho = ______\n  )\n}\n\nhead(df_tax)`,
      solution:`${taxFunction}\ndf_tax <- df\nrho_values <- c(0.08, 0.12, 0.16)\nfor (rho in rho_values) {\n  column_name <- paste0("tax_rho_", rho)\n  df_tax[[column_name]] <- tax_payment(\n    df$annual_income,\n    tau = -1,\n    rho = rho\n  )\n}\nhead(df_tax)`,
      hints:['Use paste0("tax_rho_", rho) to create a different name for each column.', 'Use df$annual_income to calculate a payment for every income in the data frame.', 'Pass rho = rho so the function uses the current value from the loop.'],
      check:'exists("rho_values", inherits=FALSE) && isTRUE(all.equal(rho_values, c(0.08,0.12,0.16))) && exists("df_tax", inherits=FALSE) && is.data.frame(df_tax) && nrow(df_tax) == nrow(df) && ncol(df_tax) == ncol(df) + 3 && all(names(df) %in% names(df_tax)) && isTRUE(all.equal(as.data.frame(df_tax[names(df)]), as.data.frame(df), check.attributes=FALSE)) && all(vapply(c(0.08,0.12,0.16), function(p) { column <- paste0("tax_rho_", p); column %in% names(df_tax) && isTRUE(all.equal(df_tax[[column]], df$annual_income - 2/(1-p)*df$annual_income^(1-p))) }, logical(1)))',success:'Correct: df_tax keeps all 92 rows and the original columns, and adds three tax columns. Each new column contains the payments calculated with its own value of rho.',
      mistakes:[
        {when:'exists("df_tax", inherits=FALSE) && "column_name" %in% names(df_tax)',message:'Using $column_name creates a column literally called column_name. Use df_tax[[column_name]] so R uses the name stored in that object.'},
        {when:'exists("df_tax", inherits=FALSE) && !all(paste0("tax_rho_", c(0.08,0.12,0.16)) %in% names(df_tax))',message:'Some tax columns are missing. Copy df before the loop, then use paste0("tax_rho_", rho) inside it to create a different column name for each rho.'},
        {when:'exists("df_tax", inherits=FALSE) && all(vapply(c(0.08,0.12,0.16), function(p) { column <- paste0("tax_rho_", p); column %in% names(df_tax) && isTRUE(all.equal(df_tax[[column]], df$annual_income-2/0.88*df$annual_income^0.88)) }, logical(1)))',message:'All three columns use rho = 0.12. Pass rho = rho so the function uses the current value from the loop.'},
      ],
      followUp:{
        title:'Compare the tax payments in a graph',
        body:'<p>Finally, plot the two tax columns from the worked example, using <code>rho = 0.1</code> and <code>rho = 0.15</code>. Put <strong>annual income on the x-axis</strong> and <strong>tax payment on the y-axis</strong> to compare the payments at the same income.</p><p><code>pivot_longer()</code> combines the two tax columns into one column called <code>tax_payment</code>. The new <code>rho</code> column records which parameter value each payment belongs to. In <code>aes()</code>, <code>colour = rho</code> gives each value its own line and adds a legend. Run the code below to display the graph.</p>',
        example:`${taxFunction}\n\n# Recreate the two tax columns with a for loop\ndf_tax <- df\nrho_values <- c(0.1, 0.15)\nfor (rho in rho_values) {\n  column_name <- paste0("tax_rho_", rho)\n  df_tax[[column_name]] <- tax_payment(\n    df$annual_income,\n    tau = -1,\n    rho = rho\n  )\n}\n\n# Move the two tax columns into long format\n# names_prefix removes "tax_rho_" from the labels in the rho column\nplot_data <- df_tax %>%\n  pivot_longer(\n    cols = c(tax_rho_0.1, tax_rho_0.15),\n    names_to = "rho",\n    names_prefix = "tax_rho_",\n    values_to = "tax_payment"\n  )\n\n# Draw one line for each value of rho\np <- ggplot(plot_data, aes(\n  x = annual_income, y = tax_payment, colour = rho\n)) +\n  geom_line(linewidth = 1) +\n  labs(\n    title = "Tax payments for different values of rho",\n    x = "Annual income (in $)",\n    y = "Tax payment (in $)",\n    colour = "rho"\n  ) +\n  theme_minimal()\np`,
      },
      quiz:{
        question:'How do pivot_longer() and colour = rho work together in this example?',
        options:[
          'The two tax columns are added together, so the graph shows the total tax payment.',
          'The tax payments go into one column, and rho identifies which of the two lines each payment belongs to.',
          'The two tax columns stay separate, and geom_line() automatically draws one line for each column.',
        ],
        correct:1,
        explanation:'pivot_longer() puts the values from tax_rho_0.1 and tax_rho_0.15 into tax_payment. The rho column records whether each payment belongs to rho = 0.1 or rho = 0.15. Using colour = rho inside aes() draws a separate line for each value and adds a legend.',
      },
    },
  ],
};

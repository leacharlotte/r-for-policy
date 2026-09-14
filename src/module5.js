import { incomeDataNote } from './dataset-notes.js';

const fixedFunction = `tax_payment <- function(y) {
  tau <- -1
  rho <- 0.12
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}`;
const flexibleFunction = `tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}`;
const fixedCheck = 'exists("tax_payment", inherits=FALSE) && is.function(tax_payment) && "y" %in% names(formals(tax_payment)) && isTRUE(all.equal(tax_payment(c(0, 17500, 42000)), c(0, 17500, 42000) - 2/0.88 * c(0, 17500, 42000)^0.88))';
const ready = {data:true, setup:'df <- read.csv("data/data_incomes.csv")',
  setupNote:incomeDataNote};
export const module5 = {
  id:'module-5',number:'05',title:'Functions',titleMarker:'Advanced',
  description:'Write a tax function, apply it to income data and make its parameters adjustable.',
  lessons:[
    {
      id:'functions-first',title:'Write a function',heading:'Write the formula once. Use it many times.',
      intro:'A function gives a calculation a name and stores it so that it can be used several times. For example, we can set up a function to compute the tax payment for a given income value. Supply an income as its input, and it returns the corresponding tax payment.',
      section:'Input, calculation, output',
      body:`<p>An illustrative tax formula is:</p>
        <div class="display-equation">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="T of y equals y minus the fraction one minus tau over one minus rho, times y raised to the power one minus rho">
            <mrow>
              <mi>T</mi><mo stretchy="false">(</mo><mi>y</mi><mo stretchy="false">)</mo><mo>=</mo><mi>y</mi><mo>−</mo>
              <mfrac><mrow><mn>1</mn><mo>−</mo><mi>τ</mi></mrow><mrow><mn>1</mn><mo>−</mo><mi>ρ</mi></mrow></mfrac>
              <mo>·</mo><msup><mi>y</mi><mrow><mn>1</mn><mo>−</mo><mi>ρ</mi></mrow></msup>
            </mrow>
          </math>
        </div>
        <p>Here <strong>y is annual income</strong>, and τ and ρ are parameters that determine the tax payment for a given income. The output is an annual tax payment. In R, we write τ as <code>tau</code> and ρ as <code>rho</code>. For now, fix <code>tau = -1</code> and <code>rho = 0.12</code>.</p>
        <p><code>tax_payment &lt;- function(y) { ... }</code> saves a function named tax_payment. The argument <code>y</code> is a placeholder for the income supplied in a call such as <code>tax_payment(40000)</code>. R then runs the code between the braces <code>{ }</code> with y equal to 40,000.</p>
        <p>A function returns its last evaluated expression. Here that is the tax formula; you can also write <code>return(...)</code> explicitly. Defining the function stores the calculation. Calling it produces a payment.</p>`,
      example:`${fixedFunction}\n\n# Call the function with income y = 40000\ntax_payment(40000)\n\n# Check: calculate the same payment directly\n40000 - ((1 - (-1)) / (1 - 0.12)) * 40000^(1 - 0.12)`,
      noteTitle:'The input name belongs to the function.',note:'You do not need to create an object called y before calling tax_payment(40000). R supplies y inside the function for that call. The tau and rho assignments inside the function are local too. These parameters describe an illustrative schedule, not a real tax system.',
      taskTitle:'Define the function and calculate a payment',task:'<p>Complete <code>tax_payment</code> using the formula above. Keep tau and rho fixed as given. Call the function for an income of <strong>30,000</strong>, save its output as <code>payment_30000</code>, and display it.</p>',
      starter:'tax_payment <- function(y) {\n  tau <- -1\n  rho <- 0.12\n  ______\n}\n\npayment_30000 <- ______\npayment_30000',
      solution:`${fixedFunction}\npayment_30000 <- tax_payment(30000)\npayment_30000`,
      hints:['Put y - ((1 - tau) / (1 - rho)) * y^(1 - rho) on the last line inside the braces.', 'Call tax_payment(30000). The function takes the income inside parentheses and returns the tax payment.'],
      check:fixedCheck+' && exists("payment_30000", inherits=FALSE) && isTRUE(all.equal(payment_30000, 30000 - 2/0.88 * 30000^0.88))',success:'Correct: you defined a reusable function and called it for an income of 30,000. The output is a payment amount, not a tax rate.',
      followUp:{
        title:'Use values defined outside a function',
        body:'<p>A function can also use objects defined outside its braces. In the example below, we define <code>tau</code> and <code>rho</code> alongside the function. We remove their assignments from inside the function, so R looks up their values in the environment where the function was created.</p><p>Here, <code>y</code> is still the only <strong>argument</strong>. <code>tau</code> and <code>rho</code> are external objects that the calculation uses.</p>',
        example:'# Define the parameters outside the function\ntau <- -1\nrho <- 0.12\n\ntax_payment <- function(y) {\n  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)\n}\n\n# Use the values of tau and rho defined above\ntax_payment(40000)\n\n# Change tau outside the function, then call it again\ntau <- -0.8\ntax_payment(40000)',
        note:'The second call uses the updated value of tau; rho stays at 0.12. The function looks up these external values when it runs. If you kept the assignments inside the function instead, it would use those local values.',
      },
      quiz:{
        question:'In the example above, we change tau to −0.8 outside the function. What happens when we call tax_payment(40000) again?',
        options:[
          'It still uses <code>tau = -1</code>, the value from when the function was defined.',
          'It uses the new value <code>tau = -0.8</code>, without redefining the function.',
          'It returns an error because <code>tau</code> is not a function argument.',
        ],
        correct:1,
        explanation:'The function looks up tau outside its braces when it runs, so the next call uses −0.8. rho remains 0.12. External values are not frozen when the function is defined, and they do not have to be listed as arguments.',
      },
    },
    {
      id:'functions-incomes',title:'Apply a function to a vector',heading:'One function. Several tax payments.',
      intro:'Change the income passed to your function, or supply a vector to calculate several payments in one call.',
      section:'The input can be a number or a vector',
      body:'<p><code>tax_payment(20000)</code> and <code>tax_payment(60000)</code> run the same formula with different inputs. You can save their results just like any other value in R.</p><p>You can give this function several incomes at once. For example, <code>tax_payment(c(20000, 40000, 60000))</code> calculates a separate tax payment for each of the three incomes. The first result is the payment for 20,000, the second for 40,000 and the third for 60,000. This is called <strong>vectorisation</strong>: the same formula is applied to each value in the vector.</p><p>Vectorisation also works in ordinary calculations in R. If <code>a</code> and <code>b</code> are numeric vectors of the same length, <code>a - b</code> subtracts values in matching positions: the first result is <code>a[1] - b[1]</code>, the second is <code>a[2] - b[2]</code>, and so on. Addition, multiplication and division also work this way.</p><p>A small <code>data.frame()</code> makes the input and output easy to compare. The example below also shows subtraction with two simple vectors.</p>',
      example:`${fixedFunction}\n\nincomes <- c(20000, 40000, 60000)\npayments <- tax_payment(incomes)\ndata.frame(income = incomes, tax = payments)\n\n# Vectorisation also works with ordinary subtraction\na <- c(10, 20, 30)\nb <- c(1, 2, 3)\n\n# Subtract matching values: 10 - 1, 20 - 2, 30 - 3\na - b`,
      noteTitle:'Pass the object containing the values.',note:'If your vector is named incomes, call tax_payment(incomes). Its name does not need to match the function’s argument y. Do not put incomes in quotation marks: that would pass text rather than the income values.',
      taskTitle:'Calculate payments and after-tax income',task:'<p>For incomes of <strong>15,000, 30,000, 45,000 and 60,000</strong>, calculate <code>payments</code> with one function call. Calculate <code>net_income</code> by subtracting payments from incomes, then display the supplied table.</p>',
      starter:`${fixedFunction}\n\nincomes <- c(15000, 30000, 45000, 60000)\npayments <- ______\nnet_income <- ______\ndata.frame(income = incomes, tax = payments, net_income = net_income)`,
      solution:`${fixedFunction}\nincomes <- c(15000, 30000, 45000, 60000)\npayments <- tax_payment(incomes)\nnet_income <- incomes - payments\ndata.frame(income = incomes, tax = payments, net_income = net_income)`,
      hints:['Call tax_payment(incomes) to pass all four values at once.', 'Use net_income <- incomes - payments. Both vectors contain four values in the same order.'],
      check:fixedCheck+' && exists("payments", inherits=FALSE) && exists("net_income", inherits=FALSE) && isTRUE(all.equal(payments, c(15000,30000,45000,60000) - 2/0.88*c(15000,30000,45000,60000)^0.88)) && isTRUE(all.equal(net_income, 2/0.88*c(15000,30000,45000,60000)^0.88))',success:'Correct: one call returned four payments, and you subtracted each payment from its matching income. The same idea works with a column in a dataset.',
      quiz:{
        question:'If <code>a &lt;- c(10, 20, 30)</code> and <code>b &lt;- c(1, 4, 2)</code>, what does <code>a - b</code> return?',
        options:['<code>53</code>','<code>c(9, 16, 28)</code>','<code>c(9, 19, 29)</code>'],
        correct:1,
        explanation:'R subtracts values in matching positions: 10 − 1 = 9, 20 − 4 = 16 and 30 − 2 = 28. The result is a vector with three values.',
      },
    },
    {
      id:'functions-data',title:'Apply a function to a dataset',heading:'A column of incomes. A column of payments.',...ready,
      intro:'Apply the tax function to the income data and add the tax payments as a new column.',
      section:'Call your function inside mutate()',
      body:'<p>In the <code>df</code> data frame, <code>annual_income</code> contains one income value per row. We can use <code>tax_payment()</code> to calculate the tax payment for each of these values.</p><p>Inside <code>mutate()</code>, write <code>tax_at_mean = tax_payment(annual_income)</code>. This uses the incomes in <code>annual_income</code> and adds the results as a new column called <code>tax_at_mean</code>. Each row keeps its original data and gets its corresponding tax payment.</p><p>You can also calculate the payments directly with <code>tax_payment(df$annual_income)</code>. This returns a vector of payments; it does not add a column to the data frame.</p>',
      example:`${fixedFunction}\n\ndf_tax <- df %>%\n  mutate(tax_at_mean = tax_payment(annual_income))\n\ndf_tax %>%\n  select(age, gender, annual_income, tax_at_mean) %>%\n  head()`,
      noteTitle:'Tax at mean income is not necessarily mean tax.',note:'Each row contains a group’s mean income. Applying a nonlinear formula to that mean gives the tax payment at the mean income. It does not recover average tax payments within the group without information about individual incomes.',
      taskTitle:'Add tax and after-tax income to every row',task:'<p>Create <code>df_tax</code> by adding two columns to <code>df</code>: <code>tax_at_mean</code> from your function, and <code>net_at_mean</code>, defined as annual_income minus tax_at_mean. Keep all existing rows and columns.</p>',
      starter:`${fixedFunction}\n\ndf_tax <- df %>%\n  mutate(\n    tax_at_mean = ______,\n    net_at_mean = ______\n  )\nhead(df_tax)`,
      solution:`${fixedFunction}\ndf_tax <- df %>%\n  mutate(\n    tax_at_mean = tax_payment(annual_income),\n    net_at_mean = annual_income - tax_at_mean\n  )\nhead(df_tax)`,
      hints:['Use tax_payment(annual_income) inside mutate(). It calculates one payment per row.', 'Use annual_income - tax_at_mean for net_at_mean. You can use a column created earlier in the same mutate() call.'],
      check:fixedCheck+' && exists("df_tax", inherits=FALSE) && isTRUE(all.equal(as.data.frame(df_tax), as.data.frame(df %>% mutate(tax_at_mean=annual_income-2/0.88*annual_income^0.88, net_at_mean=annual_income-tax_at_mean)), check.attributes=FALSE))',success:'Correct: all 92 age–gender rows now have a tax amount and after-tax income calculated at the group mean. Your function is reusable inside a data workflow.',
    },
    {
      id:'functions-arguments',title:'Add arguments to a function',heading:'Keep the formula. Change the tax schedule.',...ready,
      intro:'Add tau and rho as inputs to your function. You can then choose their values to calculate tax payments under different tax schedules.',
      section:'Arguments make assumptions explicit',
      body:'<p>In the previous exercises, the parameters tau and rho were fixed inside the function. With <code>function(y, tau, rho)</code>, you need to provide values for all three inputs: income, tau and rho. Remove the fixed assignments inside the braces; otherwise they would overwrite the supplied values.</p><p>You can provide defaults: <code>function(y, tau = -1, rho = 0.12)</code>. Then <code>tax_payment(40000)</code> uses the default schedule, while <code>tax_payment(40000, tau = -0.8, rho = 0.15)</code> uses different parameters.</p><p><strong>Useful to know:</strong> Here tau shifts the tax level and rho controls progressivity. We use non-negative incomes and <code>0 &lt;= rho &lt; 1</code> in these exercises.</p>',
      example:`${flexibleFunction}\n\n# Default schedule\ntax_payment(40000)\n\n# Override both parameters\ntax_payment(40000, tau = -0.8, rho = 0.15)\n\n# Override only tau; rho keeps its default\ntax_payment(40000, tau = -0.8)`,
      noteTitle:'Changing arguments does not change the function.',note:'Each call uses the values supplied for that call. Calling tax_payment(40000, tau = -0.8) does not replace the default tau for future calls. Reuse the same income units across schedules, since this nonlinear formula’s calibration depends on the units.',
      taskTitle:'Compare tax payments before and after a change',
      task:`<p>Use the same incomes to compare tax payments under different values of <code>tau</code> and <code>rho</code>. Complete the code below in four steps:</p>
        <ol>
          <li><strong>Set up the function.</strong> Set its default values to <code>tau = -1</code> and <code>rho = 0.12</code>.</li>
          <li><strong>Calculate the original tax payments.</strong> Use <code>tax_payment()</code> with the incomes in <code>annual_income</code> and the default parameter values. Store the results in a new column called <code>tax_base</code>.</li>
          <li><strong>Calculate the new tax payments.</strong> Use the same incomes, but set <code>tau = -0.8</code> and <code>rho = 0.15</code>. Store these results in <code>tax_reform</code>.</li>
          <li><strong>Find the change in tax payments.</strong> Subtract <code>tax_base</code> from <code>tax_reform</code> and store the difference in <code>tax_change</code>.</li>
        </ol>
        <p>Use <code>mutate()</code> to add these three columns to <code>df</code> and save the resulting data frame as <code>comparison</code>. The last line of the code displays its first six rows.</p>`,
      starter:'tax_payment <- function(y, tau = ______, rho = ______) {\n  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)\n}\n\ncomparison <- df %>%\n  mutate(\n    tax_base = ______,\n    tax_reform = ______,\n    tax_change = ______\n  )\nhead(comparison)',
      solution:`${flexibleFunction}\ncomparison <- df %>%\n  mutate(\n    tax_base = tax_payment(annual_income),\n    tax_reform = tax_payment(annual_income, tau = -0.8, rho = 0.15),\n    tax_change = tax_reform - tax_base\n  )\nhead(comparison)`,
      hints:['Put tau = -1 and rho = 0.12 in the argument list. Keep the formula inside the braces, without fixed tau or rho assignments.', 'Use tax_payment(annual_income) for the baseline and tax_payment(annual_income, tau = -0.8, rho = 0.15) for the reform. Subtract the baseline from the reform.'],
      check:fixedCheck+' && all(c("tau","rho") %in% names(formals(tax_payment))) && isTRUE(all.equal(tax_payment(c(18000,51000), tau=-0.6, rho=0.2), c(18000,51000)-1.6/0.8*c(18000,51000)^0.8)) && isTRUE(all.equal(tax_payment(37000, tau=-0.8), 37000-1.8/0.88*37000^0.88)) && isTRUE(all.equal(tax_payment(37000, rho=0.15), 37000-2/0.85*37000^0.85)) && exists("comparison", inherits=FALSE) && isTRUE(all.equal(as.data.frame(comparison), as.data.frame(df %>% mutate(tax_base=annual_income-2/0.88*annual_income^0.88, tax_reform=annual_income-1.8/0.85*annual_income^0.85, tax_change=tax_reform-tax_base)), check.attributes=FALSE))',success:'Correct: your function accepts income and adjustable tax parameters, supports defaults and compares both schedules on the same 92 observations.',
      mistakes:[{when:'exists("tax_payment", inherits=FALSE) && is.function(tax_payment) && all(c("tau","rho") %in% names(formals(tax_payment))) && isTRUE(all.equal(tax_payment(40000, tau=-0.8, rho=0.15), tax_payment(40000)))',message:'Both schedules returned the same payment. Check whether fixed tau or rho assignments inside the function are overwriting your arguments.'}],
    },
  ],
};

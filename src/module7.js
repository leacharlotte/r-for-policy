import { incomeDataNote, cpiFileNote, incomeAndCpiDataNote } from './dataset-notes.js';

export const module7 = {
  id:'module-7',number:'07',title:'Tools',
  description:'Calculate weighted means, express amounts in common prices and discount individual payments or payment streams.',
  lessons:[
    {
      id:'weighted-averages',title:'Calculate a weighted mean',heading:'Calculate an average with weights.',
      titleMarker:'Tools',
      data:true,setup:'df <- read.csv("data/data_incomes.csv")',
      setupNote:incomeDataNote,
      intro:'A weighted mean is an average calculated by multiplying each value by its weight, adding these products and dividing by the sum of the weights.',
      section:'How to calculate a weighted mean',
      body:`<p><code>mean(income)</code> gives each group one equal contribution. If the groups differ in size, the mean across people requires a <strong>weighted average</strong>: multiply each group’s mean income by its number of people, add these totals, then divide by the total number of people.</p>
        <p>The weighted mean is:</p>
        <div class="display-equation">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="The weighted mean x bar subscript w equals the sum from i equals one to n of w i times x i, divided by the sum from i equals one to n of w i">
            <mrow>
              <msub><mi mathvariant="italic">x&#x0304;</mi><mi>w</mi></msub><mo>=</mo>
              <mfrac>
                <mstyle displaystyle="true"><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msub><mi>w</mi><mi>i</mi></msub><mo>·</mo><msub><mi>x</mi><mi>i</mi></msub></mrow></mstyle>
                <mstyle displaystyle="true"><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msub><mi>w</mi><mi>i</mi></msub></mrow></mstyle>
              </mfrac>
            </mrow>
          </math>
        </div>
        <p>In this income example, <var>x<sub>i</sub></var> is group <var>i</var>’s mean income, <var>w<sub>i</sub></var> is the number of people in that group, and <var>n</var> is the number of groups. The symbol <strong>∑</strong> means to add across all groups.</p>
        <p>In R, the same formula is <code>sum(income * people) / sum(people)</code>. Keep the income and population vectors in matching order. R also provides the built-in function <code>weighted.mean(income, w = people)</code> for the same calculation.</p>
        <p>In this example, two groups have mean annual incomes of <strong>20,000 and 50,000</strong> and contain <strong>100 and 20 people</strong>.</p>`,
      downloadNotes:[
        'Weighted mean: x_bar_w = sum(w_i * x_i) / sum(w_i), summing over groups i = 1, ..., n.',
        'Here x_i is group i\'s mean income, w_i is its number of people, and n is the number of groups.',
      ],
      example:'income <- c(20000, 50000)\npeople <- c(100, 20)\n\n# Give each group an equal contribution\nmean(income)\n\n# Give each person an equal contribution\ntotal_income <- sum(income * people)\ntotal_people <- sum(people)\naverage_income <- total_income / total_people\naverage_income\n\n# The built-in function gives the same result\nweighted.mean(income, w = people)',
      noteTitle:'The denominator defines the population.',note:'The simple mean across the two groups is 35,000. The mean across all 120 people is 25,000. More people belong to the lower-income group, so it contributes more to the weighted mean.',
      taskTitle:'Calculate average income from the data frame',task:'<p>Use <code>weighted.mean()</code> to calculate mean annual income across all people represented in <code>df</code>. Use the <code>annual_income</code> column for incomes and the <code>n_people</code> column as weights. Access these columns directly with <code>df$</code>. Save the result as <code>average_income</code> and display it.</p>',
      closingContent:`<p>Alternatively, use the built-in function <code>weighted.mean()</code> inside <code>summarise()</code>:</p>
        <pre class="task-code"><code>df %&gt;%
  summarise(
    average_income = weighted.mean(annual_income, w = n_people)
  )</code></pre>
        <p>This calculates the same weighted mean and returns it in a data frame with one row and a column named <code>average_income</code>. Inside <code>summarise()</code>, you can use the column names directly. Both approaches are accepted.</p>`,
      starter:'average_income <- weighted.mean(\n  ______,\n  w = ______\n)\naverage_income',
      solution:'average_income <- weighted.mean(\n  df$annual_income,\n  w = df$n_people\n)\naverage_income\n\n# Alternative: calculate the same mean inside summarise()\ndf %>%\n  summarise(average_income = weighted.mean(annual_income, w = n_people))',
      hints:['The first argument contains the incomes: df$annual_income. Inside summarise(), use annual_income directly.', 'Use w = df$n_people, or w = n_people inside summarise(), so that each group’s income is weighted by its number of people.'],
      check:'if (exists(".answer", inherits=FALSE) && is.data.frame(.answer)) { nrow(.answer) == 1L && ncol(.answer) == 1L && isTRUE(all.equal(.answer[[1]], sum(df$annual_income * df$n_people) / sum(df$n_people))) } else { exists("average_income", inherits=FALSE) && isTRUE(all.equal(average_income, sum(df$annual_income * df$n_people) / sum(df$n_people))) }',success:'Correct: weighted.mean() uses the number of people in each group to calculate mean annual income across all people represented in df.',
      mistakes:[{when:'(exists("average_income", inherits=FALSE) && isTRUE(all.equal(average_income, mean(df$annual_income)))) || (exists(".answer", inherits=FALSE) && is.data.frame(.answer) && nrow(.answer) == 1L && ncol(.answer) == 1L && isTRUE(all.equal(.answer[[1]], mean(df$annual_income))))',message:'This gives each age–gender group an equal contribution. Use w = df$n_people, or w = n_people inside summarise(), to calculate the mean across people.'}],
    },
    {
      id:'cpi-prices',title:'Deflate an amount with CPI',heading:'Different price years. The same purchasing power.',
      titleMarker:'Tools',
      intro:'Before comparing monetary amounts from different years, we need to express them in a common price year. The consumer price index (CPI) provides the conversion factor.',
      section:'From nominal to real amounts',
      body:`<p>A <strong>nominal amount</strong> is an amount of money expressed in the prices of the year it refers to. A <strong>real amount</strong> expresses that amount in the prices of a chosen <strong>base year</strong>. This lets us compare amounts from different years after accounting for changes in prices.</p>
        <p>The <strong>consumer price index (CPI)</strong> measures how consumer prices change over time. To convert a nominal amount into base-year prices, multiply it by the CPI in the base year divided by the CPI in its original year:</p>
        <div class="display-equation">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="Real amount equals nominal amount times CPI in the base year divided by CPI in the original year">
            <mrow>
              <mtext>Real amount</mtext><mo>=</mo><mtext>Nominal amount</mtext><mo>×</mo>
              <mfrac><msub><mi mathvariant="normal">CPI</mi><mtext>base</mtext></msub><msub><mi mathvariant="normal">CPI</mi><mtext>year</mtext></msub></mfrac>
            </mrow>
          </math>
        </div>
        <p><code>CPI_base</code> is the CPI for the year whose prices we want to use. For example, to express an amount in 2020 dollars, use the CPI for 2020.</p>
        <p><code>CPI_year</code> is the CPI for the original year of the nominal amount. For an amount received in 2024, use the CPI for 2024.</p>
        <p>In R, write <code>real_amount &lt;- nominal_amount * CPI_base / CPI_year</code>.</p>
        <p>Suppose the CPI is <strong>100 in 2020</strong> and <strong>125 in 2024</strong>. Prices are 25% higher in 2024. To express <strong>$1,000 from 2024 in 2020 dollars</strong>, calculate <code>1000 * 100 / 125</code>. The result is <strong>$800 in 2020 prices</strong>: the amount that would buy the same basket of goods and services at those earlier prices.</p>
        <aside class="note" aria-label="Hint"><span class="note-symbol" aria-hidden="true">↳</span><div><strong>Hint</strong><p>For U.S. dollar amounts, you can also use the <a href="https://www.bls.gov/data/inflation_calculator.htm" target="_blank" rel="noopener noreferrer">BLS CPI Inflation Calculator</a> linked in the course slides. It converts amounts between dates using U.S. CPI data.</p></div></aside>`,
      downloadNotes:[
        'Convert nominal amounts into base-year prices: real_amount <- nominal_amount * CPI_base / CPI_year.',
        'CPI_base is the CPI for the year whose prices you want to use; CPI_year is the CPI for the original year of the nominal amount.',
        'BLS CPI Inflation Calculator (linked in the course slides): https://www.bls.gov/data/inflation_calculator.htm',
      ],
      example:'CPI_base <- 100\nCPI_year <- 125\nnominal_amount <- 1000\n\nreal_amount <- nominal_amount * CPI_base / CPI_year\nreal_amount',
      noteTitle:'A smaller number can represent the same purchasing power.',note:'The result does not mean money was lost. You changed the units in which the amount is expressed.',
      taskTitle:'Express a UBI payment in base-year prices',task:'<p>Suppose a universal basic income (UBI) payment is <strong>$1,500 per month in 2024</strong>. Using the CPI values below, express this monthly payment in <strong>2020 prices</strong>. Save the result as <code>real_amount</code> and display it.</p>',
      starter:'nominal_amount <- 1500\nCPI_base <- 100\nCPI_year <- 125\n\nreal_amount <- ______\nreal_amount',
      solution:'nominal_amount <- 1500\nCPI_base <- 100\nCPI_year <- 125\nreal_amount <- nominal_amount * CPI_base / CPI_year\nreal_amount',
      hints:['Use CPI_base / CPI_year to convert into base-year prices.', 'Multiply 1500 by 100 / 125. The result should be smaller than the nominal amount.'],
      check:'exists("real_amount", inherits=FALSE) && isTRUE(all.equal(real_amount, 1200))',success:'Correct: the monthly UBI payment of $1,500 in 2024 is equivalent to $1,200 per month in 2020 prices under these CPI values.',
      mistakes:[{when:'exists("real_amount", inherits=FALSE) && isTRUE(all.equal(real_amount, 1875))',message:'The CPI ratio is reversed. Multiply by the target price year’s CPI divided by the original price year’s CPI.'}],
    },
    {
      id:'cpi-table',title:'Use CPI data',heading:'Use CPI data to adjust incomes.',
      titleMarker:'Tools',
      data:true,files:['data_cpi.csv','data_incomes.csv'],
      setup:'cpi <- read.csv("data/data_cpi.csv")\ndf <- read.csv("data/data_incomes.csv")',
      intro:'Use CPI data from statistical offices or central banks to express incomes in a common price year.',
      section:'1. Read a CPI table',
      body:`<p>Statistical offices publish CPI data that you can download and import into R. For example, the <a href="https://www.bls.gov/cpi/data.htm" target="_blank" rel="noopener noreferrer">BLS CPI databases</a> provide U.S. price indices.</p>
        <p>CPI data contain a time period and its price index. Some tables show monthly values. For this example, we use annual averages, with <strong>one row per year</strong>. Our small practice file has two columns: <code>year</code> and <code>CPI</code>.</p>
        <div class="data-dictionary"><div class="table-scroll"><table><caption>data_cpi.csv · practice values · 2020 = 100</caption><thead><tr><th scope="col">year</th><th scope="col">CPI</th></tr></thead><tbody><tr><td>2020</td><td>100</td></tr><tr><td>2021</td><td>105</td></tr><tr><td>2022</td><td>110</td></tr><tr><td>2023</td><td>120</td></tr><tr><td>2024</td><td>125</td></tr></tbody></table></div></div>
        <p><strong>2020 = 100</strong> means that 2020 is the index’s reference year. The value 125 in 2024 means that prices are 25% higher than in 2020.</p>`,
      exampleSetupNote:cpiFileNote,
      example:`# Read the annual CPI data
cpi <- read.csv("data/data_cpi.csv")

# Display the CPI table
cpi`,
      followUp:{
        position:'before-exercise',title:'2. Deflate the incomes in a data frame',
        body:`<p>We now want to express the annual incomes in <code>df</code> in <strong>2022 prices</strong>. For this example, assume that all values in <code>annual_income</code> are in <strong>2024 prices</strong>. Every row therefore uses the CPI for 2024, regardless of the person’s age or gender.</p>
          <p>Use the CPI for the <strong>target year, 2022</strong>, divided by the CPI for the <strong>income’s original year, 2024</strong>: <code>110 / 125</code>. With <code>mutate()</code>, apply this ratio to every income and store the result in a new column called <code>real_income</code>. For example, an income of $22,000 becomes <code>22000 * 110 / 125 = 19360</code>, or $19,360 in 2022 prices.</p>
          <p>In the code below, <code>filter(year == 2022)</code> selects the row for 2022. Then <code>base_row$CPI</code> takes its CPI value, which we store as <code>CPI_base</code>. We do the same for 2024 to obtain <code>CPI_year</code>.</p>`,
        setupNote:incomeAndCpiDataNote,
        example:`# The target price year is 2022
base_row <- cpi %>% filter(year == 2022)
CPI_base <- base_row$CPI

# All incomes in this example are in 2024 prices
income_year_row <- cpi %>% filter(year == 2024)
CPI_year <- income_year_row$CPI

# Keep the original columns and add income in 2022 prices
df_real <- df %>%
  mutate(real_income = annual_income * CPI_base / CPI_year)

# Show the first six rows
head(df_real)`,
      },
      taskTitle:'Express the incomes in 2021 prices',
      task:'<p>Now use <strong>2021 as the target price year</strong>. The incomes in <code>df</code> are still in <strong>2024 prices</strong>.</p><ol><li>Select the CPI for 2021 and save it as <code>CPI_base</code>.</li><li>Create <code>df_real</code> by adding a new <code>real_income</code> column with each income expressed in 2021 prices. Keep all original rows and columns.</li><li>Display the first six rows with <code>head(df_real)</code>.</li></ol>',
      setupNote:incomeAndCpiDataNote,
      starter:`# Select the target price year
base_row <- cpi %>% filter(year == ______)
CPI_base <- base_row$CPI

# The original price year of the incomes stays the same
income_year_row <- cpi %>% filter(year == 2024)
CPI_year <- income_year_row$CPI

# Add income in 2021 prices
df_real <- df %>%
  mutate(real_income = ______)

head(df_real)`,
      solution:`# Select the target price year: 2021
base_row <- cpi %>% filter(year == 2021)
CPI_base <- base_row$CPI

# Select the original price year: 2024
income_year_row <- cpi %>% filter(year == 2024)
CPI_year <- income_year_row$CPI

# Add income in 2021 prices, keeping all original data
df_real <- df %>%
  mutate(real_income = annual_income * CPI_base / CPI_year)

head(df_real)`,
      hints:['Use filter(year == 2021). Its CPI is 105; the CPI for the original year, 2024, is 125.', 'Inside mutate(), calculate annual_income * CPI_base / CPI_year. For the first income, this gives 22000 * 105 / 125 = 18480.'],
      check:'exists("CPI_base", inherits=FALSE) && isTRUE(all.equal(CPI_base, 105)) && exists("df_real", inherits=FALSE) && local({ expected <- read.csv("data/data_incomes.csv"); expected$real_income <- expected$annual_income * 105 / 125; isTRUE(all.equal(as.data.frame(df_real), expected, check.attributes=FALSE)) })',
      success:'Correct: all 92 rows are kept, and real_income contains each income multiplied by 105 / 125. The first income of $22,000 in 2024 prices is $18,480 in 2021 prices.',
      mistakes:[{when:'exists("df_real", inherits=FALSE) && "real_income" %in% names(df_real) && isTRUE(all.equal(df_real$real_income, read.csv("data/data_incomes.csv")$annual_income * 125 / 105))',message:'The CPI ratio is reversed. Multiply by the CPI for the target year (2021), divided by the CPI for the original year (2024).'}],
      downloadNotes:[
        'Practice CPI data: annual averages, indexed to 2020 = 100.',
        'For this lesson only, assume every annual_income value in df is expressed in 2024 prices.',
        'The worked example converts incomes to 2022 prices; the exercise uses 2021 prices.',
        'Deflate directly with annual_income * CPI_base / CPI_year, using CPI values from the same index series and reference.',
        'Official CPI data: https://www.bls.gov/cpi/data.htm',
      ],
    },
    {
      id:'npv-payment',title:'Discount a future payment',heading:'One future payment. Its value today.',
      titleMarker:'Tools',
      intro:'Discounting expresses how much a future payment is worth today.',
      section:'Why do we discount future payments?',
      body:`<p>Money received today can be used immediately or invested to earn a return. If we receive the same amount later, we miss that opportunity in the meantime. <strong>Discounting</strong> lets us compare payments that arrive at different times by expressing their value today.</p>
        <p>For example, at an annual return of <strong>5%</strong>, <strong>$100 today</strong> grows to <strong>$105 in one year</strong>. Reading this backward, a payment of $105 in one year has a value of $100 today when we use a 5% discount rate. This value today is called the <strong>present value (PV)</strong>.</p>
        <h2>Count the years until the payment</h2>
        <p>To find the present value, calculate:</p>
        <div class="display-equation">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="Present value equals payment divided by one plus r raised to the power t">
            <mrow>
              <mi mathvariant="normal">PV</mi><mo>=</mo>
              <mfrac>
                <mtext>payment</mtext>
                <msup><mrow><mo>(</mo><mn>1</mn><mo>+</mo><mi>r</mi><mo>)</mo></mrow><mi>t</mi></msup>
              </mfrac>
            </mrow>
          </math>
        </div>
        <p>The <strong>discount rate</strong>, <code>r</code>, is the annual rate used to convert a future payment into its present value. In our example, it represents the return we could earn by investing the money today. Enter it as a decimal: a 5% annual discount rate means <code>r = 0.05</code>.</p>
        <p><code>t</code> is the number of years from today until the payment arrives.</p>
        <p>When <code>t = 0</code>, the payment occurs today and is not discounted. If it is received three years from now, use <code>t = 3</code>.</p>`,
      example:'payment <- 1000\nr <- 0.03\nt <- 2\n\npv <- payment / (1 + r)^t\npv',
      noteTitle:'Read the calculation backward.',note:'The example gives a present value of about $942.60. An amount of that size today, earning 3% per year, would grow to $1,000 after two years.',
      taskTitle:'Value a payment three years from now',task:'<p>A payment of <strong>$1,200</strong> arrives three years from today. Calculate <code>pv</code> using a <strong>4% annual discount rate</strong>.</p>',
      starter:'payment <- 1200\nr <- ______\nt <- ______\n\npv <- ______\npv',
      solution:'payment <- 1200\nr <- 0.04\nt <- 3\npv <- payment / (1 + r)^t\npv',
      hints:['Store 4% as 0.04. Three years after today means t = 3.', 'Divide by (1 + r)^t. Multiplying by this factor would compound the amount forward instead.'],
      check:'exists("pv", inherits=FALSE) && isTRUE(all.equal(pv, 1200/1.04^3))',success:'Correct: $1,200 received in three years has a present value of about $1,066.80 at a 4% annual discount rate.',
      mistakes:[{when:'exists("pv", inherits=FALSE) && isTRUE(all.equal(pv, 1200*1.04^3))',message:'You compounded forward. To calculate present value, divide the future payment by (1 + r)^t.'}],
    },
    {
      id:'npv-stream',title:'Discount a stream of payments',heading:'Calculate the present value of several payments.',
      titleMarker:'Tools',
      intro:'Discount each payment to today and add the results to find the present value of the whole payment stream.',
      section:'Discount first, then sum',
      body:`<p>Suppose you receive a payment today and further payments over the next three years. To find their combined value today, first calculate the <strong>present value of each payment</strong>. Then add these values to obtain the <strong>present value of the payment stream</strong>:</p>
        <div class="display-equation">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="Present value equals the sum from t equals zero to T of the payment in year t divided by one plus r raised to the power t">
            <mrow>
              <mi mathvariant="normal">PV</mi><mo>=</mo>
              <munderover><mo class="sum-operator">∑</mo><mrow><mi>t</mi><mo>=</mo><mn>0</mn></mrow><mi>T</mi></munderover>
              <mfrac>
                <msub><mtext>payment</mtext><mi>t</mi></msub>
                <msup><mrow><mo>(</mo><mn>1</mn><mo>+</mo><mi>r</mi><mo>)</mo></mrow><mi>t</mi></msup>
              </mfrac>
            </mrow>
          </math>
        </div>
        <p>The sum runs from today (<code>t = 0</code>) to the last payment year (<code>T</code>). The annual discount rate is <code>r</code>.</p>
        <p>Store the payments in a vector called <code>payments</code> and their times in a vector called <code>t</code>. The two vectors must have the same length and matching order: the first time belongs to the first payment, the second time to the second payment, and so on.</p>
        <p>In R, <code>payments / (1 + r)^t</code> calculates all present values at once. Save them as <code>present_values</code>, then use <code>sum(present_values)</code> to add them. A payment at <code>t = 0</code> stays unchanged because its exponent is zero.</p>`,
      example:`# Payments received today and in each of the next three years
payments <- c(900, 1000, 1100, 1200)
t <- 0:3
r <- 0.03

# Calculate the present value of each payment
present_values <- payments / (1 + r)^t
present_values

# Add the present values of all four payments
total_pv <- sum(present_values)
total_pv`,
      noteTitle:'Each payment has its own timing.',note:'The first entry in present_values belongs to the first payment, and so on. The $900 received today stays unchanged; the later payments are discounted before they are added.',
      taskTitle:'Find the present value of four payments',
      task:'<p>You receive <strong>$1,000 today</strong>, followed by <strong>$1,200 in one year</strong>, <strong>$1,400 in two years</strong> and <strong>$1,600 in three years</strong>. Use a <strong>5% annual discount rate</strong>.</p><ol><li>Calculate the present value of each payment and store the results in <code>present_values</code>.</li><li>Add these values and save the total as <code>total_pv</code>.</li><li>Display both results.</li></ol>',
      starter:`payments <- c(1000, 1200, 1400, 1600)
t <- 0:3
r <- 0.05

# Discount each payment, then add the results
present_values <- ______
total_pv <- ______

present_values
total_pv`,
      solution:`payments <- c(1000, 1200, 1400, 1600)
t <- 0:3
r <- 0.05

# Discount each payment at its own time
present_values <- payments / (1 + r)^t

# Add the present values
total_pv <- sum(present_values)

present_values
total_pv`,
      hints:['Use payments / (1 + r)^t. The times 0, 1, 2 and 3 match the four payments in order.', 'Use sum(present_values) for total_pv. The first present value should still be 1000 because that payment arrives today.'],
      check:'exists("present_values", inherits=FALSE) && exists("total_pv", inherits=FALSE) && isTRUE(all.equal(present_values, c(1000,1200,1400,1600)/1.05^(0:3))) && isTRUE(all.equal(total_pv, sum(c(1000,1200,1400,1600)/1.05^(0:3))))',
      success:'Correct: you discounted each payment at its own time and added the four present values. The payment received today remains $1,000.',
      mistakes:[
        {when:'exists("total_pv", inherits=FALSE) && isTRUE(all.equal(total_pv, sum(c(1000,1200,1400,1600)/1.05^(1:4))))',message:'The first payment arrives today. Use t = 0:3, so it is not discounted.'},
        {when:'exists("total_pv", inherits=FALSE) && isTRUE(all.equal(total_pv, 5200))',message:'You added the payments without discounting them. Calculate each present value first, then add those values.'},
      ],
      closingContent:'<h2>Net present value</h2><p>If the payment stream contains <strong>net cash flows</strong> — money received minus money paid out — its discounted sum is called the <strong>net present value (NPV)</strong>. Record money received as positive and money paid out as negative. The calculation uses the same steps: discount each entry, then add the results.</p>',
      downloadNotes:[
        'The present value of a payment stream is the sum of its discounted payments.',
        'Each payment must be paired with its time. t = 0 means the payment arrives today.',
        'If the entries are net cash flows (money received minus money paid out), their discounted sum is the net present value (NPV).',
      ],
    },
  ],
};

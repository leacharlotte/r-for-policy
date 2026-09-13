const tableLesson = {data:true, files:[],
  setupNote:'<code>dplyr</code> is loaded. All CPI indices and monetary amounts below are fictional and are created directly in your code.'};
const incomeTable = `income <- data.frame(
  year = 2020:2023,
  nominal_income = c(30000, 31500, 34100, 36000),
  CPI = c(100, 105, 110, 120)
)`;
const cashTable = `cash_flows <- data.frame(
  year = 2020:2023,
  nominal_flow = c(-2500, 1050, 1102.5, 1157.625),
  CPI = c(100, 105, 110.25, 115.7625)
)`;
const npvFunction = `npv <- function(cash_flow, t, r) {
  sum(cash_flow / (1 + r)^t)
}`;
export const module7 = {
  id:'module-7',number:'07',title:'NPV & CPI',
  description:'Express amounts in common prices, discount future payments and calculate net present value.',
  lessons:[
    {
      id:'cpi-prices',title:'Deflate an amount with CPI',heading:'Different price years. The same purchasing power.',
      intro:'Before comparing monetary amounts, express them in a common price year. The consumer price index (CPI) provides the conversion factor.',
      section:'Multiply by the ratio of price levels',
      body:'<p>A nominal amount is measured in the prices of the year it refers to. A real amount expresses its purchasing power in a chosen base year. Convert with <code>real_amount = nominal_amount * CPI_base / CPI_year</code>.</p><p>Suppose a fictional CPI is <strong>100 in 2020</strong> and <strong>125 in 2024</strong>. Prices are 25% higher in the later year. Dividing a 2024 amount by 1.25 expresses it in 2020-price units. The CPI is an index level, not an inflation rate.</p><p>Both CPI observations must come from the same index series and use the same index reference. The chosen price year need not have a CPI of 100: only the ratio matters.</p>',
      example:'CPI_base <- 100\nCPI_year <- 125\nnominal_amount <- 1000\n\nreal_amount <- nominal_amount * CPI_base / CPI_year\nreal_amount',
      noteTitle:'A smaller number can represent the same purchasing power.',note:'The result does not mean money was lost. You changed the units in which the amount is expressed. CPI adjustment does not move a payment to an earlier date; discounting will do that in a later lesson.',
      taskTitle:'Express a subsidy in base-year prices',task:'<p>A subsidy is <strong>1,500 in 2024-price units</strong>. With the fictional CPI values below, calculate <code>real_amount</code> in 2020-price units.</p>',
      starter:'nominal_amount <- 1500\nCPI_base <- 100\nCPI_year <- 125\n\nreal_amount <- ______\nreal_amount',
      solution:'nominal_amount <- 1500\nCPI_base <- 100\nCPI_year <- 125\nreal_amount <- nominal_amount * CPI_base / CPI_year\nreal_amount',
      hints:['Use CPI_base / CPI_year to convert into base-year prices.', 'Multiply 1500 by 100 / 125. The result should be smaller than the nominal amount.'],
      check:'exists("real_amount", inherits=FALSE) && isTRUE(all.equal(real_amount, 1200))',success:'Correct: 1,500 in 2024-price units is equivalent to 1,200 in 2020-price units under these fictional indices.',
      mistakes:[{when:'exists("real_amount", inherits=FALSE) && isTRUE(all.equal(real_amount, 1875))',message:'The CPI ratio is reversed. Multiply by the target price year’s CPI divided by the original price year’s CPI.'}],
    },
    {
      id:'cpi-table',title:'Deflate a table of incomes',heading:'Compare incomes in constant prices.',...tableLesson,
      intro:'A rise in nominal income can reflect higher prices, higher purchasing power, or both. Deflate each observation before comparing years.',
      section:'Use the CPI from the matching year',
      body:'<p>This practice table has one row per calendar year, with nominal income and the CPI for that same year. Extract the 2020 index with <code>(income %&gt;% filter(year == 2020))$CPI</code>, then apply the ratio to every row in <code>mutate()</code>.</p><p>We can reuse the function skills from Module 5: <code>deflate(amount, cpi_year, cpi_base)</code> accepts either one observation or equally sized vectors. Each amount must be paired with the CPI for its year. This is a calendar-year table; age alone would not tell you which CPI to use.</p>',
      example:`deflate <- function(amount, cpi_year, cpi_base) {\n  amount * cpi_base / cpi_year\n}\n\n# Two nominal amounts with the same purchasing power\ndeflate(c(1000, 1250), cpi_year = c(100, 125), cpi_base = 100)`,
      noteTitle:'Check real income, not just nominal growth.',note:'In the table below, nominal income rises from 30,000 to 36,000 while the CPI rises from 100 to 120. Their proportional increases are equal, so purchasing power is unchanged between the first and last year.',
      taskTitle:'Put every income in 2020 prices',task:'<p>Extract <code>CPI_base</code> for 2020. Create <code>income_real</code> by adding <code>real_income</code> to the supplied table, using the function <code>deflate()</code>.</p>',
      starter:`${incomeTable}\n\ndeflate <- function(amount, cpi_year, cpi_base) {\n  amount * cpi_base / cpi_year\n}\nCPI_base <- ______\nincome_real <- income %>%\n  mutate(real_income = ______)\nincome_real`,
      solution:`${incomeTable}\ndeflate <- function(amount, cpi_year, cpi_base) {\n  amount * cpi_base / cpi_year\n}\nCPI_base <- (income %>% filter(year == 2020))$CPI\nincome_real <- income %>%\n  mutate(real_income = deflate(nominal_income, CPI, CPI_base))\nincome_real`,
      hints:['Use (income %>% filter(year == 2020))$CPI to select the base-year index.', 'Inside mutate(), call deflate(nominal_income, CPI, CPI_base). Each row uses its own CPI but the same base-year index.'],
      check:'exists("CPI_base", inherits=FALSE) && isTRUE(all.equal(CPI_base, 100)) && exists("income_real", inherits=FALSE) && isTRUE(all.equal(as.data.frame(income_real), data.frame(year=2020:2023, nominal_income=c(30000,31500,34100,36000), CPI=c(100,105,110,120), real_income=c(30000,30000,31000,30000)), check.attributes=FALSE))',success:'Correct: the real incomes are 30,000, 30,000, 31,000 and 30,000 in 2020-price units. Nominal growth did not translate into the same pattern of real growth.',
    },
    {
      id:'npv-payment',title:'Discount a future payment',heading:'One future payment. Its value today.',
      intro:'After choosing a price basis, choose a valuation date. Discounting expresses the value of a later payment at that date.',
      section:'Count the years until the payment',
      body:'<p>A payment at time t has present value <code>PV = payment / (1 + r)^t</code>. Here <code>r</code> is an annual discount rate as a decimal, and <code>t</code> is the number of years after the valuation date.</p><p>When t is zero, the payment occurs today and is not discounted. If it is received three years from now, use <code>t = 3</code>. Our payments in this lesson are already in constant base-year prices, so we use a <strong>real discount rate</strong>.</p><p>A higher positive discount rate gives a smaller present value for a fixed positive future payment. It does not change the payment itself.</p>',
      example:'payment <- 1000\nr <- 0.03\nt <- 2\n\npv <- payment / (1 + r)^t\npv',
      noteTitle:'Price year and valuation date answer different questions.',note:'The price year defines purchasing-power units. The valuation date defines when you value the payment. A future amount can already be in today’s price units and still need discounting because it arrives later.',
      taskTitle:'Value a payment three years from now',task:'<p>A payment of <strong>1,200 in constant-price units</strong> arrives three years from today. Calculate <code>pv</code> using a <strong>4% annual real discount rate</strong>.</p>',
      starter:'payment <- 1200\nr <- ______\nt <- ______\n\npv <- ______\npv',
      solution:'payment <- 1200\nr <- 0.04\nt <- 3\npv <- payment / (1 + r)^t\npv',
      hints:['Store 4% as 0.04. Three years after today means t = 3.', 'Divide by (1 + r)^t. Multiplying by this factor would compound the amount forward instead.'],
      check:'exists("pv", inherits=FALSE) && isTRUE(all.equal(pv, 1200/1.04^3))',success:'Correct: the present value is about 1,066.80 in the chosen constant-price units. The three-year delay makes it smaller than 1,200.',
      mistakes:[{when:'exists("pv", inherits=FALSE) && isTRUE(all.equal(pv, 1200*1.04^3))',message:'You compounded forward. To calculate present value, divide the future payment by (1 + r)^t.'}],
    },
    {
      id:'npv-stream',title:'Calculate the NPV of a cash-flow stream',heading:'Several dates. One net present value.',
      intro:'Represent costs and benefits as a signed vector, discount each entry at its own date, and add the results.',
      section:'Discount first, then sum',
      body:'<p>A net cash flow is benefits received minus costs paid. Store inflows as positive numbers and outflows as negative numbers, keeping the same perspective throughout. The <strong>net present value (NPV)</strong> is <code>sum(cash_flow / (1 + r)^t)</code>.</p><p>Our example has a cost at t = 0 and benefits at t = 1, 2 and 3. The vectors cash_flow and t must have the same length and matching order. The initial cost stays unchanged because its exponent is zero.</p><p>If you add discounted payments without subtracting costs, the result is the present value of that payment stream. Calling it a net benefit requires including the relevant costs too.</p>',
      example:`${npvFunction}\n\n# Constant-price net cash flows, from one consistent perspective\ncash_flow <- c(-2000, 900, 900, 900)\nt <- 0:3\nr <- 0.03\n\npresent_values <- cash_flow / (1 + r)^t\npresent_values\nnpv(cash_flow, t, r)`,
      noteTitle:'Interpret the units and signs.',note:'A positive NPV means discounted benefits exceed the costs included in this stream. NPV has monetary units. For an MVPF calculation, discount WTP and government-cost streams separately before forming their ratio.',
      taskTitle:'Include the cost paid today',task:'<p>A programme costs <strong>2,500 today</strong> and yields benefits of <strong>1,000</strong> at each of t = 1, 2 and 3. All amounts are in constant prices. Calculate the vector <code>present_values</code> and total <code>net_present_value</code> at a <strong>5% real discount rate</strong>. Use the supplied npv() function.</p>',
      starter:`${npvFunction}\n\ncash_flow <- c(______)\nt <- 0:3\nr <- 0.05\n\npresent_values <- ______\nnet_present_value <- ______\nnet_present_value`,
      solution:`${npvFunction}\ncash_flow <- c(-2500, 1000, 1000, 1000)\nt <- 0:3\nr <- 0.05\npresent_values <- cash_flow / (1 + r)^t\nnet_present_value <- npv(cash_flow, t, r)\nnet_present_value`,
      hints:['Use cash_flow <- c(-2500, 1000, 1000, 1000). The negative cost matches t = 0.', 'Compute cash_flow / (1 + r)^t for each present value, then call npv(cash_flow, t, r) for the total.'],
      check:'exists("present_values", inherits=FALSE) && exists("net_present_value", inherits=FALSE) && isTRUE(all.equal(present_values, c(-2500,1000,1000,1000)/1.05^(0:3))) && isTRUE(all.equal(net_present_value, sum(c(-2500,1000,1000,1000)/1.05^(0:3))))',success:'Correct: the NPV is about 223.25. The initial cost remains −2,500; the three future benefits are discounted before they are added.',
      mistakes:[{when:'exists("net_present_value", inherits=FALSE) && isTRUE(all.equal(net_present_value, sum(c(-2500,1000,1000,1000)/1.05^(1:4))))',message:'The first cash flow happens today. Use t = 0:3, so the initial cost is not discounted.'}],
    },
    {
      id:'npv-cpi-combined',title:'Combine CPI adjustment and NPV',heading:'Common prices. A common valuation date.',...tableLesson,
      intro:'Put both steps together: deflate each nominal cash flow, then discount the real cash flows to the starting date.',
      section:'Match the cash-flow basis to the discount rate',
      body:'<p>This separate practice dataset has a cost in 2020 and nominal benefits in 2021–2023. Its fictional CPI rises by 5% each year. Choose 2020 both as the price base and as the valuation date.</p><p>First calculate <code>real_flow = nominal_flow * CPI_base / CPI</code>. Next calculate <code>t = year - 2020</code> and <code>pv = real_flow / (1 + r_real)^t</code>. Finally, add the pv column.</p><p><strong>Real cash flows need a real discount rate.</strong> If you instead work with nominal flows, use corresponding nominal discount rates. Do not deflate cash flows that are already in constant prices. Under consistent price and discount-rate assumptions, the two approaches agree.</p>',
      example:`${cashTable}\n\nCPI_base <- (cash_flows %>% filter(year == 2020))$CPI\nr_real <- 0.03\n\nvalued <- cash_flows %>%\n  mutate(\n    real_flow = nominal_flow * CPI_base / CPI,\n    t = year - 2020,\n    pv = real_flow / (1 + r_real)^t\n  )\nvalued\nsum(valued$pv)`,
      noteTitle:'Rising nominal benefits need not imply rising real benefits.',note:'The three nominal benefits increase with the CPI, so each equals 1,000 in 2020-price units. They still have different present values because they arrive at different dates. The initial cost is negative and occurs at t = 0.',
      taskTitle:'Complete the workflow at a 4% real rate',task:'<p>Use the table below to create <code>valued</code> with columns <code>real_flow</code>, <code>t</code> and <code>pv</code>. Set the annual real discount rate to <strong>4%</strong>, value all flows at the 2020 starting date, and save their total as <code>net_present_value</code>.</p>',
      starter:`${cashTable}\n\nCPI_base <- (cash_flows %>% filter(year == 2020))$CPI\nr_real <- ______\n\nvalued <- cash_flows %>%\n  mutate(\n    real_flow = ______,\n    t = ______,\n    pv = ______\n  )\nnet_present_value <- ______\nnet_present_value`,
      solution:`${cashTable}\nCPI_base <- (cash_flows %>% filter(year == 2020))$CPI\nr_real <- 0.04\nvalued <- cash_flows %>%\n  mutate(\n    real_flow = nominal_flow * CPI_base / CPI,\n    t = year - 2020,\n    pv = real_flow / (1 + r_real)^t\n  )\nnet_present_value <- sum(valued$pv)\nnet_present_value`,
      hints:['The CPI conversion is nominal_flow * CPI_base / CPI. Use year - 2020 to start the timeline at zero.', 'Set r_real <- 0.04. Discount the real_flow column, then use sum(valued$pv).'],
      check:'exists("valued", inherits=FALSE) && exists("net_present_value", inherits=FALSE) && isTRUE(all.equal(as.data.frame(valued), data.frame(year=2020:2023, nominal_flow=c(-2500,1050,1102.5,1157.625), CPI=c(100,105,110.25,115.7625), real_flow=c(-2500,1000,1000,1000), t=0:3, pv=c(-2500,1000,1000,1000)/1.04^(0:3)), check.attributes=FALSE)) && isTRUE(all.equal(net_present_value, sum(c(-2500,1000,1000,1000)/1.04^(0:3))))',success:'Correct: you first expressed all flows in 2020 prices, then valued them at the 2020 starting date. The NPV is about 275.09. Next, set up R and RStudio to use these skills on your own computer.',
      mistakes:[{when:'exists("valued", inherits=FALSE) && isTRUE(all.equal(valued$pv, c(-2500,1050,1102.5,1157.625)/1.04^(0:3)))',message:'You discounted nominal flows with the real rate. Deflate each flow first, then discount the real_flow column.'}],
      quiz:{question:'Why can a future payment already expressed in 2020 prices still need discounting to 2020?',options:['The price base and the date when the payment arrives are different concepts','Deflation always removes too little inflation','CPI adjustment and discounting are the same calculation'],correct:0,explanation:'CPI adjustment changes purchasing-power units. Discounting accounts for when the payment arrives relative to the valuation date. Use real rates for flows expressed in constant prices.'},
    },
  ],
};

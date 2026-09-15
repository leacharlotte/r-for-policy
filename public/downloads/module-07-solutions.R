# R for Policy — Module 07: Tools
# Complete module: 5 lessons, all worked examples and exercise solutions.
# These are the reference solutions; they do not include your browser edits.
# Run sections in order, or source this entire file in R.

# SETUP
# Install once, if needed: install.packages(c("dplyr"))
library(dplyr)

# Synthetic practice data: no real observations or empirical estimates.
# Synthetic practice data: no real observations or empirical estimates.
# The same CSV data used on the website are embedded below.
# read.csv(text = ...) reads this embedded CSV instead of a separate file.
# No additional data downloads or working-directory changes are required.
income_profile_csv <- "age,gender,annual_income,n_people\n20,Female,22000,1010\n20,Male,21000,830\n21,Female,24100,1040\n21,Male,23300,850\n22,Female,26100,1080\n22,Male,25500,880\n23,Female,28100,1100\n23,Male,27600,920\n24,Female,29900,1120\n24,Male,29700,950\n25,Female,31700,1130\n25,Male,31600,990\n26,Female,33300,1130\n26,Male,33500,1030\n27,Female,34800,1120\n27,Male,35200,1060\n28,Female,36200,1120\n28,Male,36900,1090\n29,Female,37500,1110\n29,Male,38400,1120\n30,Female,38700,1100\n30,Male,39900,1140\n31,Female,39800,1090\n31,Male,41300,1160\n32,Female,40700,1090\n32,Male,42500,1170\n33,Female,41600,1090\n33,Male,43700,1180\n34,Female,42400,1100\n34,Male,44700,1180\n35,Female,43100,1110\n35,Male,45700,1170\n36,Female,43700,1130\n36,Male,46600,1170\n37,Female,44200,1150\n37,Male,47400,1160\n38,Female,44700,1160\n38,Male,48100,1140\n39,Female,45100,1180\n39,Male,48700,1130\n40,Female,45400,1190\n40,Male,49200,1110\n41,Female,45800,1190\n41,Male,49700,1100\n42,Female,46000,1190\n42,Male,50100,1090\n43,Female,46300,1180\n43,Male,50500,1080\n44,Female,46500,1160\n44,Male,50700,1070\n45,Female,46700,1140\n45,Male,50900,1060\n46,Female,46800,1110\n46,Male,51100,1060\n47,Female,46900,1070\n47,Male,51200,1060\n48,Female,47000,1040\n48,Male,51200,1060\n49,Female,47000,1010\n49,Male,51200,1070\n50,Female,46900,970\n50,Male,51100,1070\n51,Female,46800,950\n51,Male,51000,1070\n52,Female,46600,930\n52,Male,50800,1080\n53,Female,46400,910\n53,Male,50600,1070\n54,Female,46000,900\n54,Male,50300,1070\n55,Female,45600,900\n55,Male,49900,1060\n56,Female,45000,900\n56,Male,49400,1040\n57,Female,44400,900\n57,Male,48900,1020\n58,Female,43600,900\n58,Male,48300,1000\n59,Female,42800,890\n59,Male,47700,970\n60,Female,41800,880\n60,Male,46900,940\n61,Female,40700,870\n61,Male,46100,900\n62,Female,39500,850\n62,Male,45100,860\n63,Female,38200,820\n63,Male,44100,830\n64,Female,36800,790\n64,Male,43000,790\n65,Female,35200,760\n65,Male,41800,750\n"
cpi_csv <- "year,CPI\n2020,100\n2021,105\n2022,110\n2023,120\n2024,125\n"

# ======================================================================
# LESSON 1: Calculate a weighted mean
# ======================================================================

# Weighted mean: x_bar_w = sum(w_i * x_i) / sum(w_i), summing over groups i = 1, ..., n.
# Here x_i is group i's mean income, w_i is its number of people, and n is the number of groups.

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
income <- c(20000, 50000)
people <- c(100, 20)

# Give each group an equal contribution
mean(income)

# Give each person an equal contribution
total_income <- sum(income * people)
total_people <- sum(people)
average_weighted_income <- total_income / total_people
average_weighted_income

# The built-in function gives the same result
weighted.mean(income, w = people)

# EXERCISE SOLUTION: Calculate average income from the data frame
average_income <- weighted.mean(
  df$annual_income,
  w = df$n_people
)
average_income

# Alternative: calculate the same mean inside summarise()
df %>%
  summarise(average_income = weighted.mean(annual_income, w = n_people))

# WORKED EXAMPLE: Calculate the same mean with summarise()
df %>%
  summarise(
    average_income = weighted.mean(annual_income, w = n_people)
  )

# ======================================================================
# LESSON 2: Deflate an amount with CPI
# ======================================================================

# Convert nominal amounts into base-year prices: real_amount <- nominal_amount * CPI_base / CPI_year.
# CPI_base is the CPI for the year whose prices you want to use; CPI_year is the CPI for the original year of the nominal amount.
# BLS CPI Inflation Calculator (linked in the course slides): https://www.bls.gov/data/inflation_calculator.htm

# WORKED EXAMPLE
CPI_base <- 100
CPI_year <- 125
nominal_amount <- 1000

real_amount <- nominal_amount * CPI_base / CPI_year
real_amount

# EXERCISE SOLUTION: Express a UBI payment in base-year prices
nominal_amount <- 1500
CPI_base <- 100
CPI_year <- 125
real_amount <- nominal_amount * CPI_base / CPI_year
real_amount

# ======================================================================
# LESSON 3: Use CPI data
# ======================================================================

# Practice CPI data: annual averages, indexed to 2020 = 100.
# For this lesson only, assume every annual_income value in df is expressed in 2024 prices.
# The worked example converts incomes to 2022 prices; the exercise uses 2021 prices.
# Deflate directly with annual_income * CPI_base / CPI_year, using CPI values from the same index series and reference.
# Official CPI data: https://www.bls.gov/cpi/data.htm

# Prepare the data for this lesson
cpi <- read.csv(text = cpi_csv)
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
# Read the annual CPI data
cpi <- read.csv(text = cpi_csv)

# Display the CPI table
cpi

# FOLLOW-UP EXAMPLE: 2. Deflate the incomes in a data frame
# The target price year is 2022
base_row <- cpi %>% filter(year == 2022)
CPI_base <- base_row$CPI

# All incomes in this example are in 2024 prices
income_year_row <- cpi %>% filter(year == 2024)
CPI_year <- income_year_row$CPI

# Keep the original columns and add income in 2022 prices
df_real <- df %>%
  mutate(real_income = annual_income * CPI_base / CPI_year)

# Show the first six rows
head(df_real)


# EXERCISE SOLUTION: Express the incomes in 2021 prices
# Select the target price year: 2021
base_row <- cpi %>% filter(year == 2021)
CPI_base <- base_row$CPI

# Select the original price year: 2024
income_year_row <- cpi %>% filter(year == 2024)
CPI_year <- income_year_row$CPI

# Add income in 2021 prices, keeping all original data
df_real <- df %>%
  mutate(real_income = annual_income * CPI_base / CPI_year)

head(df_real)

# ======================================================================
# LESSON 4: Discount a future payment
# ======================================================================

# WORKED EXAMPLE
payment <- 1000
r <- 0.03
t <- 2

pv <- payment / (1 + r)^t
pv

# EXERCISE SOLUTION: Value a payment three years from now
payment <- 1200
r <- 0.04
t <- 3
pv <- payment / (1 + r)^t
pv

# ======================================================================
# LESSON 5: Discount a stream of payments
# ======================================================================

# The present value of a payment stream is the sum of its discounted payments.
# Each payment must be paired with its time. t = 0 means the payment arrives today.
# If the entries are net cash flows (money received minus money paid out), their discounted sum is the net present value (NPV).

# WORKED EXAMPLE
# Payments received today and in each of the next three years
payments <- c(900, 1000, 1100, 1200)
t <- 0:3
r <- 0.03

# Calculate the present value of each payment
present_values <- payments / (1 + r)^t
present_values

# Add the present values of all four payments
total_pv <- sum(present_values)
total_pv

# EXERCISE SOLUTION: Find the present value of four payments
payments <- c(1000, 1200, 1400, 1600)
t <- 0:3
r <- 0.05

# Discount each payment at its own time
present_values <- payments / (1 + r)^t

# Add the present values
total_pv <- sum(present_values)

present_values
total_pv

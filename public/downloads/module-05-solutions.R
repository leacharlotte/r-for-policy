# R for Policy — Module 05: Functions
# Complete module: 4 lessons, all worked examples and exercise solutions.
# These are the reference solutions; they do not include your browser edits.
# Run sections in order, or source this entire file in R.

# SETUP
# Install once, if needed: install.packages(c("dplyr"))
library(dplyr)

# Synthetic practice data: no real observations or empirical estimates.
# The same CSV data used on the website are embedded below.
# read.csv(text = ...) reads this embedded CSV instead of a separate file.
# No additional data downloads or working-directory changes are required.
income_profile_csv <- "age,gender,annual_income,n_people\n20,Female,22000,1010\n20,Male,21000,830\n21,Female,24100,1040\n21,Male,23300,850\n22,Female,26100,1080\n22,Male,25500,880\n23,Female,28100,1100\n23,Male,27600,920\n24,Female,29900,1120\n24,Male,29700,950\n25,Female,31700,1130\n25,Male,31600,990\n26,Female,33300,1130\n26,Male,33500,1030\n27,Female,34800,1120\n27,Male,35200,1060\n28,Female,36200,1120\n28,Male,36900,1090\n29,Female,37500,1110\n29,Male,38400,1120\n30,Female,38700,1100\n30,Male,39900,1140\n31,Female,39800,1090\n31,Male,41300,1160\n32,Female,40700,1090\n32,Male,42500,1170\n33,Female,41600,1090\n33,Male,43700,1180\n34,Female,42400,1100\n34,Male,44700,1180\n35,Female,43100,1110\n35,Male,45700,1170\n36,Female,43700,1130\n36,Male,46600,1170\n37,Female,44200,1150\n37,Male,47400,1160\n38,Female,44700,1160\n38,Male,48100,1140\n39,Female,45100,1180\n39,Male,48700,1130\n40,Female,45400,1190\n40,Male,49200,1110\n41,Female,45800,1190\n41,Male,49700,1100\n42,Female,46000,1190\n42,Male,50100,1090\n43,Female,46300,1180\n43,Male,50500,1080\n44,Female,46500,1160\n44,Male,50700,1070\n45,Female,46700,1140\n45,Male,50900,1060\n46,Female,46800,1110\n46,Male,51100,1060\n47,Female,46900,1070\n47,Male,51200,1060\n48,Female,47000,1040\n48,Male,51200,1060\n49,Female,47000,1010\n49,Male,51200,1070\n50,Female,46900,970\n50,Male,51100,1070\n51,Female,46800,950\n51,Male,51000,1070\n52,Female,46600,930\n52,Male,50800,1080\n53,Female,46400,910\n53,Male,50600,1070\n54,Female,46000,900\n54,Male,50300,1070\n55,Female,45600,900\n55,Male,49900,1060\n56,Female,45000,900\n56,Male,49400,1040\n57,Female,44400,900\n57,Male,48900,1020\n58,Female,43600,900\n58,Male,48300,1000\n59,Female,42800,890\n59,Male,47700,970\n60,Female,41800,880\n60,Male,46900,940\n61,Female,40700,870\n61,Male,46100,900\n62,Female,39500,850\n62,Male,45100,860\n63,Female,38200,820\n63,Male,44100,830\n64,Female,36800,790\n64,Male,43000,790\n65,Female,35200,760\n65,Male,41800,750\n"

# ======================================================================
# LESSON 1: Write a function
# ======================================================================

# WORKED EXAMPLE
tax_payment <- function(y) {
  tau <- -1
  rho <- 0.12
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

# Call the function with income y = 40000
tax_payment(40000)

# Check: calculate the same payment directly
40000 - ((1 - (-1)) / (1 - 0.12)) * 40000^(1 - 0.12)

# EXERCISE SOLUTION: Define the function and calculate a payment
tax_payment <- function(y) {
  tau <- -1
  rho <- 0.12
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}
payment_30000 <- tax_payment(30000)
payment_30000

# FOLLOW-UP EXAMPLE: Use values defined outside a function
# Define the parameters outside the function
tau <- -1
rho <- 0.12

tax_payment <- function(y) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

# Use the values of tau and rho defined above
tax_payment(40000)

# Change tau outside the function, then call it again
tau <- -0.8
tax_payment(40000)

# ======================================================================
# LESSON 2: Apply a function to a vector
# ======================================================================

# WORKED EXAMPLE
tax_payment <- function(y) {
  tau <- -1
  rho <- 0.12
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

incomes <- c(20000, 40000, 60000)
payments <- tax_payment(incomes)
data.frame(income = incomes, tax = payments)

# Vectorisation also works with ordinary subtraction
a <- c(10, 20, 30)
b <- c(1, 2, 3)

# Subtract matching values: 10 - 1, 20 - 2, 30 - 3
a - b

# EXERCISE SOLUTION: Calculate payments and after-tax income
tax_payment <- function(y) {
  tau <- -1
  rho <- 0.12
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}
incomes <- c(15000, 30000, 45000, 60000)
payments <- tax_payment(incomes)
net_income <- incomes - payments
data.frame(income = incomes, tax = payments, net_income = net_income)

# ======================================================================
# LESSON 3: Apply a function to a dataset
# ======================================================================

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
tax_payment <- function(y) {
  tau <- -1
  rho <- 0.12
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

df_tax <- df %>%
  mutate(tax_at_mean = tax_payment(annual_income))

df_tax %>%
  select(age, gender, annual_income, tax_at_mean) %>%
  head()

# EXERCISE SOLUTION: Add tax and after-tax income to every row
tax_payment <- function(y) {
  tau <- -1
  rho <- 0.12
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}
df_tax <- df %>%
  mutate(
    tax_at_mean = tax_payment(annual_income),
    net_at_mean = annual_income - tax_at_mean
  )
head(df_tax)

# ======================================================================
# LESSON 4: Add arguments to a function
# ======================================================================

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

# Default schedule
tax_payment(40000)

# Override both parameters
tax_payment(40000, tau = -0.8, rho = 0.15)

# Override only tau; rho keeps its default
tax_payment(40000, tau = -0.8)

# EXERCISE SOLUTION: Compare tax payments before and after a change
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}
comparison <- df %>%
  mutate(
    tax_base = tax_payment(annual_income),
    tax_reform = tax_payment(annual_income, tau = -0.8, rho = 0.15),
    tax_change = tax_reform - tax_base
  )
head(comparison)

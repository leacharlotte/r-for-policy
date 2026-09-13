# R for Policy — Module 06: Loops
# Complete module: 3 lessons, all worked examples and exercise solutions.
# These are the reference solutions; they do not include your browser edits.
# Run sections in order, or source this entire file in R.

# SETUP
# Install once, if needed: install.packages(c("dplyr", "tidyr", "ggplot2"))
library(dplyr)
library(tidyr)
library(ggplot2)

# Synthetic practice data: no real observations or empirical estimates.
# The same CSV data used on the website are embedded below.
# read.csv(text = ...) reads this embedded CSV instead of a separate file.
# No additional data downloads or working-directory changes are required.
income_profile_csv <- "age,gender,annual_income,n_people\n20,Female,22000,1010\n20,Male,21000,830\n21,Female,24100,1040\n21,Male,23300,850\n22,Female,26100,1080\n22,Male,25500,880\n23,Female,28100,1100\n23,Male,27600,920\n24,Female,29900,1120\n24,Male,29700,950\n25,Female,31700,1130\n25,Male,31600,990\n26,Female,33300,1130\n26,Male,33500,1030\n27,Female,34800,1120\n27,Male,35200,1060\n28,Female,36200,1120\n28,Male,36900,1090\n29,Female,37500,1110\n29,Male,38400,1120\n30,Female,38700,1100\n30,Male,39900,1140\n31,Female,39800,1090\n31,Male,41300,1160\n32,Female,40700,1090\n32,Male,42500,1170\n33,Female,41600,1090\n33,Male,43700,1180\n34,Female,42400,1100\n34,Male,44700,1180\n35,Female,43100,1110\n35,Male,45700,1170\n36,Female,43700,1130\n36,Male,46600,1170\n37,Female,44200,1150\n37,Male,47400,1160\n38,Female,44700,1160\n38,Male,48100,1140\n39,Female,45100,1180\n39,Male,48700,1130\n40,Female,45400,1190\n40,Male,49200,1110\n41,Female,45800,1190\n41,Male,49700,1100\n42,Female,46000,1190\n42,Male,50100,1090\n43,Female,46300,1180\n43,Male,50500,1080\n44,Female,46500,1160\n44,Male,50700,1070\n45,Female,46700,1140\n45,Male,50900,1060\n46,Female,46800,1110\n46,Male,51100,1060\n47,Female,46900,1070\n47,Male,51200,1060\n48,Female,47000,1040\n48,Male,51200,1060\n49,Female,47000,1010\n49,Male,51200,1070\n50,Female,46900,970\n50,Male,51100,1070\n51,Female,46800,950\n51,Male,51000,1070\n52,Female,46600,930\n52,Male,50800,1080\n53,Female,46400,910\n53,Male,50600,1070\n54,Female,46000,900\n54,Male,50300,1070\n55,Female,45600,900\n55,Male,49900,1060\n56,Female,45000,900\n56,Male,49400,1040\n57,Female,44400,900\n57,Male,48900,1020\n58,Female,43600,900\n58,Male,48300,1000\n59,Female,42800,890\n59,Male,47700,970\n60,Female,41800,880\n60,Male,46900,940\n61,Female,40700,870\n61,Male,46100,900\n62,Female,39500,850\n62,Male,45100,860\n63,Female,38200,820\n63,Male,44100,830\n64,Female,36800,790\n64,Male,43000,790\n65,Female,35200,760\n65,Male,41800,750\n"

# ======================================================================
# LESSON 1: Repeat a calculation with a loop
# ======================================================================

# WORKED EXAMPLE
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

incomes <- c(20000, 40000, 60000)

for (y in incomes) {
  payment <- tax_payment(y)
  print(payment)
}

# EXERCISE SOLUTION: Calculate payments for three values of rho
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}
income <- 40000
rho_values <- c(0.08, 0.12, 0.16)
for (rho in rho_values) {
  payment <- tax_payment(income, tau = -1, rho = rho)
  print(payment)
}

# ======================================================================
# LESSON 2: Save the results of a loop
# ======================================================================

# WORKED EXAMPLE
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

# Set up a vector for storing results
payments <- numeric(0)

# Calculate and save the first payment
payment <- tax_payment(20000)
payments <- c(payments, payment)
payments

# Add the second payment to the saved results
payment <- tax_payment(40000)
payments <- c(payments, payment)
payments

# FOLLOW-UP EXAMPLE: Let the loop collect the payments
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

incomes <- c(20000, 40000, 60000)

# 1. Start with an empty vector
payments <- numeric(0)

# 2. Use the loop from Lesson 1 and save each payment
for (y in incomes) {
  payment <- tax_payment(y)
  print(payment)
  payments <- c(payments, payment)
}

# 3. Display all saved payments beside their incomes
data.frame(income = incomes, tax = payments)


# EXERCISE SOLUTION: Save payments for three values of rho
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}
income <- 40000
rho_values <- c(0.08, 0.12, 0.16)
payments <- numeric(0)
for (rho in rho_values) {
  payment <- tax_payment(income, tau = -1, rho = rho)
  payments <- c(payments, payment)
}
data.frame(rho = rho_values, tax_payment = payments)

# ======================================================================
# LESSON 3: Apply a function to a dataset
# ======================================================================

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

# 1. Copy the income data and choose the values of rho
df_tax <- df
rho_values <- c(0.1, 0.15)

for (rho in rho_values) {
  # 2. Create a column name for the current rho
  column_name <- paste0("tax_rho_", rho)

  # 3. Calculate the payments and save them in the new column
  df_tax[[column_name]] <- tax_payment(
    df$annual_income,
    tau = -1,
    rho = rho
  )
}

# Display the original data and the new tax columns
head(df_tax)

# EXERCISE SOLUTION: Add tax columns for three values of rho
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}
df_tax <- df
rho_values <- c(0.08, 0.12, 0.16)
for (rho in rho_values) {
  column_name <- paste0("tax_rho_", rho)
  df_tax[[column_name]] <- tax_payment(
    df$annual_income,
    tau = -1,
    rho = rho
  )
}
head(df_tax)

# FOLLOW-UP EXAMPLE: Compare the tax payments in a graph
tax_payment <- function(y, tau = -1, rho = 0.12) {
  y - ((1 - tau) / (1 - rho)) * y^(1 - rho)
}

# Recreate the two tax columns with a for loop
df_tax <- df
rho_values <- c(0.1, 0.15)
for (rho in rho_values) {
  column_name <- paste0("tax_rho_", rho)
  df_tax[[column_name]] <- tax_payment(
    df$annual_income,
    tau = -1,
    rho = rho
  )
}

# Move the two tax columns into long format
# names_prefix removes "tax_rho_" from the labels in the rho column
plot_data <- df_tax %>%
  pivot_longer(
    cols = c(tax_rho_0.1, tax_rho_0.15),
    names_to = "rho",
    names_prefix = "tax_rho_",
    values_to = "tax_payment"
  )

# Draw one line for each value of rho
p <- ggplot(plot_data, aes(
  x = annual_income, y = tax_payment, colour = rho
)) +
  geom_line(linewidth = 1) +
  labs(
    title = "Tax payments for different values of rho",
    x = "Annual income (in $)",
    y = "Tax payment (in $)",
    colour = "rho"
  ) +
  theme_minimal()
p

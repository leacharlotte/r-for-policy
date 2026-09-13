# R for Policy — Module 02: Vectors & formulas
# Complete module: 3 lessons, all worked examples and exercise solutions.
# These are the reference solutions; they do not include your browser edits.
# Run sections in order, or source this entire file in R.

# ======================================================================
# LESSON 1: One object, many values
# ======================================================================

# WORKED EXAMPLE
# Compare three monthly UBI increases
monthly <- c(100, 125, 150)
annual <- monthly * 12
annual
length(annual)

# Create a vector for policy years 1 to 4
years <- 1:4
years

# Create payment levels in steps of 25
payment_levels <- seq(from = 0, to = 100, by = 25)
payment_levels

# EXERCISE SOLUTION: Create payment and year vectors
monthly <- c(80, 100, 120)
annual <- monthly * 12
annual

years <- 1:5
years

payment_levels <- seq(from = 50, to = 150, by = 25)
payment_levels

# ======================================================================
# LESSON 2: Use built-in functions
# ======================================================================

# WORKED EXAMPLE
payments <- c(100, 125, 140)

# Add the three payments with sum()
total_payment <- sum(payments)
total_payment

# Check the sum manually: the result is the same
100 + 125 + 140

# Calculate their arithmetic average with mean()
average_payment <- mean(payments)
average_payment

# Check the average manually
(100 + 125 + 140) / 3

# Round the average to two decimal places
rounded_average <- round(average_payment, digits = 2)
rounded_average

# EXERCISE SOLUTION: Summarise three payments
payments <- c(80, 100, 125)
total_payment <- sum(payments)
average_payment <- mean(payments)
rounded_average <- round(average_payment, digits = 2)
total_payment
average_payment
rounded_average

# FOLLOW-UP EXAMPLE: Combine functions
payments <- c(80, 100, 125)

# Calculate the mean, then round it: 101.67
round(mean(payments), digits = 2)

# ======================================================================
# LESSON 3: Selecting elements
# ======================================================================

# WORKED EXAMPLE
income <- c(20000, 35000, 50000, 80000)

# Select the first value
income[1]

# Select several values: positions 1, 2 and 3
income[c(1:3)]

# Test one condition, then select the matching incomes
income >= 40000
income[income >= 40000]

# FOLLOW-UP EXAMPLE: Combine conditions
income <- c(20000, 35000, 50000, 80000)

# Combine two conditions: both must hold for each income
income >= 30000 & income < 80000
income[income >= 30000 & income < 80000]


# EXERCISE SOLUTION: Select by position and by condition
income <- c(20000, 30000, 50000, 80000, 120000)
first_three <- income[c(1:3)]
first_three

middle_income <- income[income >= 30000 & income < 80000]
middle_income

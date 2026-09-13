# R for Policy — Module 01: First steps in R
# Complete module: 3 lessons, all worked examples and exercise solutions.
# These are the reference solutions; they do not include your browser edits.
# Run sections in order, or source this entire file in R.

# ======================================================================
# LESSON 1: R as a calculator
# ======================================================================

# WORKED EXAMPLE
# Additional UBI per person per year
(1100 - 1000) * 12

# EXERCISE SOLUTION: Try a larger UBI expansion
(1125 - 1000) * 12

# ======================================================================
# LESSON 2: Saving values in objects
# ======================================================================

# WORKED EXAMPLE
# Save the monthly UBI increase per person
monthly_increase <- 100

# Calculate the additional annual payment
annual_increase <- monthly_increase * 12
annual_increase

# EXERCISE SOLUTION: Budget for the UBI expansion
monthly_increase <- 150
recipients <- 200
annual_budget <- monthly_increase * 12 * recipients
annual_budget

# ======================================================================
# LESSON 3: Reading and fixing errors
# ======================================================================

# WORKED EXAMPLE
# This lesson deliberately demonstrates an error.
# try() displays it and allows the rest of the module to run.
try({
  # This UBI calculation intentionally contains an error.
  monthly_increase <- "100"
  monthly_increase * 12
}, silent = FALSE)

# EXERCISE SOLUTION: Repair the UBI calculation
monthly_increase <- 100
annual_increase <- monthly_increase * 12
annual_increase

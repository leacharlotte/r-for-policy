# R for Policy — Module 03: Working with data
# Complete module: 6 lessons, all worked examples and exercise solutions.
# These are the reference solutions; they do not include your browser edits.
# Run sections in order, or source this entire file in R.

# SETUP
# Install once, if needed: install.packages(c("dplyr", "tidyr"))
library(dplyr)
library(tidyr)

# Synthetic practice data: no real observations or empirical estimates.
# The same CSV data used on the website are embedded below.
# read.csv(text = ...) reads this embedded CSV instead of a separate file.
# No additional data downloads or working-directory changes are required.
income_profile_csv <- "age,gender,annual_income,n_people\n20,Female,22000,1010\n20,Male,21000,830\n21,Female,24100,1040\n21,Male,23300,850\n22,Female,26100,1080\n22,Male,25500,880\n23,Female,28100,1100\n23,Male,27600,920\n24,Female,29900,1120\n24,Male,29700,950\n25,Female,31700,1130\n25,Male,31600,990\n26,Female,33300,1130\n26,Male,33500,1030\n27,Female,34800,1120\n27,Male,35200,1060\n28,Female,36200,1120\n28,Male,36900,1090\n29,Female,37500,1110\n29,Male,38400,1120\n30,Female,38700,1100\n30,Male,39900,1140\n31,Female,39800,1090\n31,Male,41300,1160\n32,Female,40700,1090\n32,Male,42500,1170\n33,Female,41600,1090\n33,Male,43700,1180\n34,Female,42400,1100\n34,Male,44700,1180\n35,Female,43100,1110\n35,Male,45700,1170\n36,Female,43700,1130\n36,Male,46600,1170\n37,Female,44200,1150\n37,Male,47400,1160\n38,Female,44700,1160\n38,Male,48100,1140\n39,Female,45100,1180\n39,Male,48700,1130\n40,Female,45400,1190\n40,Male,49200,1110\n41,Female,45800,1190\n41,Male,49700,1100\n42,Female,46000,1190\n42,Male,50100,1090\n43,Female,46300,1180\n43,Male,50500,1080\n44,Female,46500,1160\n44,Male,50700,1070\n45,Female,46700,1140\n45,Male,50900,1060\n46,Female,46800,1110\n46,Male,51100,1060\n47,Female,46900,1070\n47,Male,51200,1060\n48,Female,47000,1040\n48,Male,51200,1060\n49,Female,47000,1010\n49,Male,51200,1070\n50,Female,46900,970\n50,Male,51100,1070\n51,Female,46800,950\n51,Male,51000,1070\n52,Female,46600,930\n52,Male,50800,1080\n53,Female,46400,910\n53,Male,50600,1070\n54,Female,46000,900\n54,Male,50300,1070\n55,Female,45600,900\n55,Male,49900,1060\n56,Female,45000,900\n56,Male,49400,1040\n57,Female,44400,900\n57,Male,48900,1020\n58,Female,43600,900\n58,Male,48300,1000\n59,Female,42800,890\n59,Male,47700,970\n60,Female,41800,880\n60,Male,46900,940\n61,Female,40700,870\n61,Male,46100,900\n62,Female,39500,850\n62,Male,45100,860\n63,Female,38200,820\n63,Male,44100,830\n64,Female,36800,790\n64,Male,43000,790\n65,Female,35200,760\n65,Male,41800,750\n"

# ======================================================================
# LESSON 1: Read and inspect a dataset
# ======================================================================

# WORKED EXAMPLE
df <- read.csv(text = income_profile_csv)

# inspect data
head(df)
names(df)
nrow(df)

# EXERCISE SOLUTION: Load, count and select
df <- read.csv(text = income_profile_csv)
n_groups <- nrow(df)
n_groups

# Select annual_income and store it as a vector
incomes <- df$annual_income
incomes

# ======================================================================
# LESSON 2: Select and sort data
# ======================================================================

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
df %>%
  filter(gender == "Male") %>%
  select(age, annual_income) %>%
  head()

# EXERCISE SOLUTION: Select the female income profile
female_profile <- df %>%
  filter(gender == "Female") %>%
  select(age, annual_income)
head(female_profile)

# FOLLOW-UP EXAMPLE: Sort rows with arrange()
# Show the lowest incomes first
df %>%
  select(age, gender, annual_income) %>%
  arrange(annual_income) %>%
  head()

# Show the highest incomes first
df %>%
  select(age, gender, annual_income) %>%
  arrange(desc(annual_income)) %>%
  head()

# ======================================================================
# LESSON 3: Calculate new columns
# ======================================================================

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
df_new <- df %>%
  mutate(monthly_income = annual_income / 12)

df_new %>%
  select(age, gender, monthly_income) %>%
  head()

# FOLLOW-UP EXAMPLE: Use functions inside mutate()
df_rounded <- df %>%
  mutate(monthly_income = round(annual_income / 12, digits = 2))

df_rounded %>%
  select(age, gender, annual_income, monthly_income) %>%
  head()


# EXERCISE SOLUTION: Add monthly and total income
df_new <- df %>%
  mutate(
    monthly_income = annual_income / 12,
    total_income = annual_income * n_people
  )
head(df_new)

# ======================================================================
# LESSON 4: Handle missing values
# ======================================================================

# Prepare the data for this lesson
practice <- data.frame(
  age = c(25, 35, 45, 55),
  annual_income = c(31700, NA, 46700, 45600)
)

# WORKED EXAMPLE
# Identify missing incomes: TRUE means missing, FALSE means observed
is.na(practice$annual_income)

# By default, the missing value makes the mean NA
mean(practice$annual_income)

# Calculate the mean using only the observed incomes
mean(practice$annual_income, na.rm = TRUE)

# EXERCISE SOLUTION: Calculate the mean of the observed incomes
mean_observed <- mean(practice$annual_income, na.rm = TRUE)
mean_observed

# ======================================================================
# LESSON 5: Aggregation
# ======================================================================

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
df %>%
  group_by(gender) %>%
  summarise(
    total_people = sum(n_people),
    .groups = "drop"
  )

# EXERCISE SOLUTION: Compare the two profiles
summary_by_gender <- df %>%
  group_by(gender) %>%
  summarise(
    total_people = sum(n_people),
    total_income = sum(annual_income * n_people),
    mean_income = mean(annual_income),
    .groups = "drop"
  )
summary_by_gender

# FOLLOW-UP EXAMPLE: Use mutate() within groups
# Calculate the mean separately for women and men
# .by groups the data only for this calculation
df_with_mean <- df %>%
  mutate(
    group_mean = mean(annual_income),
    .by = gender
  )

# Inspect the original incomes and the new group mean
df_with_mean %>%
  select(age, gender, annual_income, group_mean) %>%
  head()

# ======================================================================
# LESSON 6: Reshape data
# ======================================================================

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
library(tidyr)

# Inspect two ages in long format
example_long <- df %>%
  filter(age %in% c(25, 35)) %>%
  select(age, gender, annual_income)
example_long

# Create one income column for women and one for men
example_wide <- example_long %>%
  pivot_wider(
    names_from = gender,
    values_from = annual_income
  )
example_wide

# EXERCISE SOLUTION: Reshape the complete income profiles
df_wide <- df %>%
  select(age, gender, annual_income) %>%
  pivot_wider(
    names_from = gender,
    values_from = annual_income
  )
head(df_wide)
nrow(df_wide)

# FOLLOW-UP EXAMPLE: From wide to long format
# Recreate the wide table from the exercise
df_wide <- df %>%
  select(age, gender, annual_income) %>%
  pivot_wider(
    names_from = gender,
    values_from = annual_income
  )
head(df_wide)

# Move Female and Male into a gender column and collect their incomes
df_long <- df_wide %>%
  pivot_longer(
    cols = c(Female, Male),
    names_to = "gender",
    values_to = "annual_income"
  )

head(df_long)
nrow(df_long)

# R for Policy — Module 04: Creating graphs
# Complete module: 3 lessons, all worked examples and exercise solutions.
# These are the reference solutions; they do not include your browser edits.
# Run sections in order, or source this entire file in R.

# SETUP
# Install once, if needed: install.packages(c("dplyr", "ggplot2"))
library(dplyr)
library(ggplot2)

# Synthetic practice data: no real observations or empirical estimates.
# The same CSV data used on the website are embedded below.
# read.csv(text = ...) reads this embedded CSV instead of a separate file.
# No additional data downloads or working-directory changes are required.
income_profile_csv <- "age,gender,annual_income,n_people\n20,Female,22000,1010\n20,Male,21000,830\n21,Female,24100,1040\n21,Male,23300,850\n22,Female,26100,1080\n22,Male,25500,880\n23,Female,28100,1100\n23,Male,27600,920\n24,Female,29900,1120\n24,Male,29700,950\n25,Female,31700,1130\n25,Male,31600,990\n26,Female,33300,1130\n26,Male,33500,1030\n27,Female,34800,1120\n27,Male,35200,1060\n28,Female,36200,1120\n28,Male,36900,1090\n29,Female,37500,1110\n29,Male,38400,1120\n30,Female,38700,1100\n30,Male,39900,1140\n31,Female,39800,1090\n31,Male,41300,1160\n32,Female,40700,1090\n32,Male,42500,1170\n33,Female,41600,1090\n33,Male,43700,1180\n34,Female,42400,1100\n34,Male,44700,1180\n35,Female,43100,1110\n35,Male,45700,1170\n36,Female,43700,1130\n36,Male,46600,1170\n37,Female,44200,1150\n37,Male,47400,1160\n38,Female,44700,1160\n38,Male,48100,1140\n39,Female,45100,1180\n39,Male,48700,1130\n40,Female,45400,1190\n40,Male,49200,1110\n41,Female,45800,1190\n41,Male,49700,1100\n42,Female,46000,1190\n42,Male,50100,1090\n43,Female,46300,1180\n43,Male,50500,1080\n44,Female,46500,1160\n44,Male,50700,1070\n45,Female,46700,1140\n45,Male,50900,1060\n46,Female,46800,1110\n46,Male,51100,1060\n47,Female,46900,1070\n47,Male,51200,1060\n48,Female,47000,1040\n48,Male,51200,1060\n49,Female,47000,1010\n49,Male,51200,1070\n50,Female,46900,970\n50,Male,51100,1070\n51,Female,46800,950\n51,Male,51000,1070\n52,Female,46600,930\n52,Male,50800,1080\n53,Female,46400,910\n53,Male,50600,1070\n54,Female,46000,900\n54,Male,50300,1070\n55,Female,45600,900\n55,Male,49900,1060\n56,Female,45000,900\n56,Male,49400,1040\n57,Female,44400,900\n57,Male,48900,1020\n58,Female,43600,900\n58,Male,48300,1000\n59,Female,42800,890\n59,Male,47700,970\n60,Female,41800,880\n60,Male,46900,940\n61,Female,40700,870\n61,Male,46100,900\n62,Female,39500,850\n62,Male,45100,860\n63,Female,38200,820\n63,Male,44100,830\n64,Female,36800,790\n64,Male,43000,790\n65,Female,35200,760\n65,Male,41800,750\n"

# ======================================================================
# LESSON 1: Draw your first income profile
# ======================================================================

# The exercise accepts geom_line() alone or a combination of geom_line() and geom_point().

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
male_profile <- df %>%
  filter(gender == "Male")

p <- ggplot(male_profile, aes(x = age, y = annual_income)) +
  geom_line() +
  geom_point()
p

# EXERCISE SOLUTION: Plot the female income profile
female_profile <- df %>%
  filter(gender == "Female")
p <- ggplot(female_profile, aes(x = age, y = annual_income)) +
  geom_line()
p

# ======================================================================
# LESSON 2: Plot multiple groups
# ======================================================================

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
female_profile <- df %>% filter(gender == "Female")

# A fixed colour for one line
ggplot(female_profile, aes(x = age, y = annual_income)) +
  geom_line(colour = "darkgreen")

# EXERCISE SOLUTION: Draw both profiles
p <- ggplot(df, aes(
  x = age, y = annual_income, colour = gender
)) +
  geom_line()
p

# ======================================================================
# LESSON 3: Add labels and clear units
# ======================================================================

# Prepare the data for this lesson
df <- read.csv(text = income_profile_csv)

# WORKED EXAMPLE
p <- ggplot(df, aes(x = age, y = annual_income, colour = gender)) +
  geom_line() +
  labs(
    title = "Income profiles by age",
    x = "Age", y = "Annual income (in $)",
    colour = "Gender", caption = "Synthetic data for practice"
  ) +
  theme_minimal()
p

# EXERCISE SOLUTION: Plot income in thousands of dollars
plot_data <- df %>%
  mutate(income_thousands = annual_income / 1000)
p <- ggplot(plot_data, aes(
  x = age, y = income_thousands, colour = gender
)) +
  geom_line() +
  labs(
    title = "Income profiles by age",
    x = "Age", y = "Annual income (in 1000$)",
    colour = "Gender", caption = "Synthetic data for practice"
  ) +
  theme_minimal()
p

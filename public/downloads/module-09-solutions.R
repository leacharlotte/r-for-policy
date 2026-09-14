# R for Policy — Module 09: R & RStudio
# Complete module: 3 lessons, all worked examples.
# These are the reference solutions; they do not include your browser edits.
# Run sections in order, or source this entire file in R.

# SETUP
# Install once, if needed: install.packages(c("dplyr", "tidyr", "ggplot2", "readxl", "writexl"))
library(dplyr)
library(tidyr)
library(ggplot2)
library(readxl)
library(writexl)

# ======================================================================
# LESSON 1: Install R and RStudio
# ======================================================================

# Install R from https://cran.r-project.org/ first.
# Then install RStudio Desktop: https://posit.co/download/rstudio-desktop/
# Open RStudio and run the following lines in its Console. Expected answer: 4.

# WORKED EXAMPLE
# Run in the RStudio Console
R.version.string
2 + 2

# ======================================================================
# LESSON 2: Write and run an R script
# ======================================================================

# Default panes: Source (top left), Console (bottom left), Environment (top right), Output with Plots/Files/Packages/Help (bottom right).
# Create first_script.R in RStudio using File > New File > R Script.
# Run a line or selection: Ctrl+Enter (Windows/Linux), Cmd+Return (Mac).
# Run the whole file with Source. print() makes results visible when sourcing.
# Optional practice: change 20000 to 25000. The new mean is about 31666.67.
# After running the example, try these two lines in RStudio:
# df <- data.frame(annual_income = incomes)
# View(df)
# View(df) opens an Excel-like table in the Data Viewer.

# WORKED EXAMPLE
# A short script using fictional incomes
incomes <- c(20000, 30000, 40000)
mean_income <- mean(incomes)
print(mean_income)

plot(incomes, type = "b",
     xlab = "Observation", ylab = "Annual income")

# ======================================================================
# LESSON 3: Projects, packages and course code
# ======================================================================

# Create mvpf-course with File > New Project > New Directory > New Project.
# Save scripts in the project folder and reopen its .Rproj file to continue.
# Install the packages listed at the top of this download before running it.
# Expected mean_income: 30000. Restart R and run from the beginning to check your workflow.

# WORKED EXAMPLE
library(dplyr)
library(tidyr)
library(ggplot2)

practice <- data.frame(income = c(20000, 30000, 40000))
summary_income <- practice %>%
  summarise(mean_income = mean(income))
print(summary_income)

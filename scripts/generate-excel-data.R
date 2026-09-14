# Run from the website folder after regenerating the practice CSV.
# Install once if needed: install.packages("writexl")
df <- read.csv("public/data/data_incomes.csv")
writexl::write_xlsx(list(Incomes = df), "public/data/data_incomes.xlsx")

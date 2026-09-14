# R for Policy — Module 08: Practice project
# Complete module: 7 lessons, all exercise solutions.
# These are the reference solutions; they do not include your browser edits.
# Run sections in order, or source this entire file in R.

# SETUP
# Install once, if needed: install.packages(c("dplyr", "tidyr", "ggplot2"))
library(dplyr)
library(tidyr)
library(ggplot2)

# Source: World Inequality Database (WID.world), https://wid.world/data/
# Snapshot downloaded 2026-09-14; original bulk series sptincj992.
# France, Germany, Switzerland, United States; 1980-2024; top 10% and bottom 50%.
# Share of pretax national income, equal-split adults aged 20 and older; fractions of 1.
# top10 rows: share of total income received by the top 10% of adults.
# bottom50 rows: share of total income received by the bottom 50% of adults.
# group identifies the share; income_share stores its value as a fraction of 1.
# Country/group labels simplified; WID values unchanged. Estimates may include interpolation or extrapolation.
# Definitions and methodology: https://wid.world/codes-dictionary/ and https://wid.world/methodology/
# The same CSV data used on the website are embedded below.
# read.csv(text = ...) reads this embedded CSV instead of a separate file.
# No additional data downloads or working-directory changes are required.
inequality_csv <- "country,year,group,income_share\nFrance,1980,bottom50,0.2266\nFrance,1980,top10,0.2876\nFrance,1981,bottom50,0.2276\nFrance,1981,top10,0.2854\nFrance,1982,bottom50,0.2285\nFrance,1982,top10,0.2826\nFrance,1983,bottom50,0.2277\nFrance,1983,top10,0.2833\nFrance,1984,bottom50,0.2259\nFrance,1984,top10,0.285\nFrance,1985,bottom50,0.2261\nFrance,1985,top10,0.2891\nFrance,1986,bottom50,0.2239\nFrance,1986,top10,0.2978\nFrance,1987,bottom50,0.223\nFrance,1987,top10,0.3032\nFrance,1988,bottom50,0.2225\nFrance,1988,top10,0.3078\nFrance,1989,bottom50,0.2176\nFrance,1989,top10,0.315\nFrance,1990,bottom50,0.2153\nFrance,1990,top10,0.3156\nFrance,1991,bottom50,0.2194\nFrance,1991,top10,0.3107\nFrance,1992,bottom50,0.2168\nFrance,1992,top10,0.3077\nFrance,1993,bottom50,0.215\nFrance,1993,top10,0.3065\nFrance,1994,bottom50,0.2128\nFrance,1994,top10,0.312\nFrance,1995,bottom50,0.2131\nFrance,1995,top10,0.3132\nFrance,1996,bottom50,0.2105\nFrance,1996,top10,0.3222\nFrance,1997,bottom50,0.2073\nFrance,1997,top10,0.3262\nFrance,1998,bottom50,0.2054\nFrance,1998,top10,0.3329\nFrance,1999,bottom50,0.2061\nFrance,1999,top10,0.3325\nFrance,2000,bottom50,0.2054\nFrance,2000,top10,0.3359\nFrance,2001,bottom50,0.2067\nFrance,2001,top10,0.3378\nFrance,2002,bottom50,0.2037\nFrance,2002,top10,0.3361\nFrance,2003,bottom50,0.2019\nFrance,2003,top10,0.3375\nFrance,2004,bottom50,0.1994\nFrance,2004,top10,0.3431\nFrance,2005,bottom50,0.2\nFrance,2005,top10,0.3426\nFrance,2006,bottom50,0.2021\nFrance,2006,top10,0.3403\nFrance,2007,bottom50,0.1985\nFrance,2007,top10,0.3492\nFrance,2008,bottom50,0.1979\nFrance,2008,top10,0.352\nFrance,2009,bottom50,0.2032\nFrance,2009,top10,0.333\nFrance,2010,bottom50,0.2023\nFrance,2010,top10,0.3381\nFrance,2011,bottom50,0.2043\nFrance,2011,top10,0.3392\nFrance,2012,bottom50,0.2082\nFrance,2012,top10,0.3292\nFrance,2013,bottom50,0.2092\nFrance,2013,top10,0.3233\nFrance,2014,bottom50,0.2112\nFrance,2014,top10,0.3249\nFrance,2015,bottom50,0.2055\nFrance,2015,top10,0.3334\nFrance,2016,bottom50,0.2065\nFrance,2016,top10,0.3338\nFrance,2017,bottom50,0.2059\nFrance,2017,top10,0.3364\nFrance,2018,bottom50,0.2034\nFrance,2018,top10,0.3433\nFrance,2019,bottom50,0.2048\nFrance,2019,top10,0.3406\nFrance,2020,bottom50,0.2055\nFrance,2020,top10,0.3384\nFrance,2021,bottom50,0.2026\nFrance,2021,top10,0.349\nFrance,2022,bottom50,0.2034\nFrance,2022,top10,0.344\nFrance,2023,bottom50,0.203\nFrance,2023,top10,0.3403\nFrance,2024,bottom50,0.203\nFrance,2024,top10,0.3403\nGermany,1980,bottom50,0.2325\nGermany,1980,top10,0.286\nGermany,1981,bottom50,0.2338\nGermany,1981,top10,0.2814\nGermany,1982,bottom50,0.236\nGermany,1982,top10,0.2804\nGermany,1983,bottom50,0.2342\nGermany,1983,top10,0.2847\nGermany,1984,bottom50,0.237\nGermany,1984,top10,0.2849\nGermany,1985,bottom50,0.2359\nGermany,1985,top10,0.2871\nGermany,1986,bottom50,0.2334\nGermany,1986,top10,0.2937\nGermany,1987,bottom50,0.2304\nGermany,1987,top10,0.3015\nGermany,1988,bottom50,0.2239\nGermany,1988,top10,0.3159\nGermany,1989,bottom50,0.2177\nGermany,1989,top10,0.3246\nGermany,1990,bottom50,0.2162\nGermany,1990,top10,0.3255\nGermany,1991,bottom50,0.221\nGermany,1991,top10,0.3149\nGermany,1992,bottom50,0.224\nGermany,1992,top10,0.3096\nGermany,1993,bottom50,0.2273\nGermany,1993,top10,0.3043\nGermany,1994,bottom50,0.229\nGermany,1994,top10,0.2997\nGermany,1995,bottom50,0.2309\nGermany,1995,top10,0.2979\nGermany,1996,bottom50,0.2248\nGermany,1996,top10,0.3064\nGermany,1997,bottom50,0.2201\nGermany,1997,top10,0.3154\nGermany,1998,bottom50,0.2151\nGermany,1998,top10,0.3217\nGermany,1999,bottom50,0.2155\nGermany,1999,top10,0.3213\nGermany,2000,bottom50,0.2162\nGermany,2000,top10,0.3229\nGermany,2001,bottom50,0.2153\nGermany,2001,top10,0.3239\nGermany,2002,bottom50,0.2096\nGermany,2002,top10,0.3241\nGermany,2003,bottom50,0.2149\nGermany,2003,top10,0.3165\nGermany,2004,bottom50,0.2105\nGermany,2004,top10,0.3289\nGermany,2005,bottom50,0.198\nGermany,2005,top10,0.3481\nGermany,2006,bottom50,0.1972\nGermany,2006,top10,0.3531\nGermany,2007,bottom50,0.191\nGermany,2007,top10,0.3691\nGermany,2008,bottom50,0.1909\nGermany,2008,top10,0.3676\nGermany,2009,bottom50,0.1911\nGermany,2009,top10,0.3725\nGermany,2010,bottom50,0.1931\nGermany,2010,top10,0.3669\nGermany,2011,bottom50,0.1908\nGermany,2011,top10,0.3679\nGermany,2012,bottom50,0.1897\nGermany,2012,top10,0.3632\nGermany,2013,bottom50,0.1827\nGermany,2013,top10,0.3776\nGermany,2014,bottom50,0.1814\nGermany,2014,top10,0.3826\nGermany,2015,bottom50,0.1824\nGermany,2015,top10,0.3817\nGermany,2016,bottom50,0.1843\nGermany,2016,top10,0.3811\nGermany,2017,bottom50,0.1858\nGermany,2017,top10,0.3781\nGermany,2018,bottom50,0.1885\nGermany,2018,top10,0.3737\nGermany,2019,bottom50,0.188\nGermany,2019,top10,0.3745\nGermany,2020,bottom50,0.188\nGermany,2020,top10,0.3745\nGermany,2021,bottom50,0.1882\nGermany,2021,top10,0.3742\nGermany,2022,bottom50,0.1878\nGermany,2022,top10,0.3764\nGermany,2023,bottom50,0.1877\nGermany,2023,top10,0.3765\nGermany,2024,bottom50,0.1877\nGermany,2024,top10,0.3765\nSwitzerland,1980,bottom50,0.2373\nSwitzerland,1980,top10,0.305\nSwitzerland,1981,bottom50,0.2371\nSwitzerland,1981,top10,0.3051\nSwitzerland,1982,bottom50,0.237\nSwitzerland,1982,top10,0.3072\nSwitzerland,1983,bottom50,0.2365\nSwitzerland,1983,top10,0.3092\nSwitzerland,1984,bottom50,0.2345\nSwitzerland,1984,top10,0.3112\nSwitzerland,1985,bottom50,0.233\nSwitzerland,1985,top10,0.3124\nSwitzerland,1986,bottom50,0.2344\nSwitzerland,1986,top10,0.3123\nSwitzerland,1987,bottom50,0.2346\nSwitzerland,1987,top10,0.3117\nSwitzerland,1988,bottom50,0.2365\nSwitzerland,1988,top10,0.3085\nSwitzerland,1989,bottom50,0.2385\nSwitzerland,1989,top10,0.305\nSwitzerland,1990,bottom50,0.2376\nSwitzerland,1990,top10,0.3029\nSwitzerland,1991,bottom50,0.2398\nSwitzerland,1991,top10,0.3016\nSwitzerland,1992,bottom50,0.2386\nSwitzerland,1992,top10,0.2994\nSwitzerland,1993,bottom50,0.2379\nSwitzerland,1993,top10,0.2978\nSwitzerland,1994,bottom50,0.2402\nSwitzerland,1994,top10,0.2983\nSwitzerland,1995,bottom50,0.2419\nSwitzerland,1995,top10,0.2983\nSwitzerland,1996,bottom50,0.2348\nSwitzerland,1996,top10,0.3138\nSwitzerland,1997,bottom50,0.2327\nSwitzerland,1997,top10,0.3197\nSwitzerland,1998,bottom50,0.23\nSwitzerland,1998,top10,0.3242\nSwitzerland,1999,bottom50,0.2323\nSwitzerland,1999,top10,0.3175\nSwitzerland,2000,bottom50,0.2284\nSwitzerland,2000,top10,0.3242\nSwitzerland,2001,bottom50,0.2295\nSwitzerland,2001,top10,0.3141\nSwitzerland,2002,bottom50,0.2328\nSwitzerland,2002,top10,0.3049\nSwitzerland,2003,bottom50,0.2252\nSwitzerland,2003,top10,0.3242\nSwitzerland,2004,bottom50,0.2241\nSwitzerland,2004,top10,0.3303\nSwitzerland,2005,bottom50,0.2188\nSwitzerland,2005,top10,0.3429\nSwitzerland,2006,bottom50,0.2178\nSwitzerland,2006,top10,0.3502\nSwitzerland,2007,bottom50,0.2222\nSwitzerland,2007,top10,0.3362\nSwitzerland,2008,bottom50,0.2314\nSwitzerland,2008,top10,0.3108\nSwitzerland,2009,bottom50,0.2291\nSwitzerland,2009,top10,0.3175\nSwitzerland,2010,bottom50,0.22\nSwitzerland,2010,top10,0.339\nSwitzerland,2011,bottom50,0.2219\nSwitzerland,2011,top10,0.3398\nSwitzerland,2012,bottom50,0.225\nSwitzerland,2012,top10,0.3299\nSwitzerland,2013,bottom50,0.2235\nSwitzerland,2013,top10,0.3311\nSwitzerland,2014,bottom50,0.2239\nSwitzerland,2014,top10,0.3289\nSwitzerland,2015,bottom50,0.225\nSwitzerland,2015,top10,0.3272\nSwitzerland,2016,bottom50,0.2235\nSwitzerland,2016,top10,0.3255\nSwitzerland,2017,bottom50,0.2259\nSwitzerland,2017,top10,0.3215\nSwitzerland,2018,bottom50,0.2312\nSwitzerland,2018,top10,0.3124\nSwitzerland,2019,bottom50,0.2331\nSwitzerland,2019,top10,0.3084\nSwitzerland,2020,bottom50,0.2331\nSwitzerland,2020,top10,0.3084\nSwitzerland,2021,bottom50,0.2324\nSwitzerland,2021,top10,0.3104\nSwitzerland,2022,bottom50,0.228\nSwitzerland,2022,top10,0.3201\nSwitzerland,2023,bottom50,0.2304\nSwitzerland,2023,top10,0.3146\nSwitzerland,2024,bottom50,0.2304\nSwitzerland,2024,top10,0.3146\nUnited States,1980,bottom50,0.2008\nUnited States,1980,top10,0.3384\nUnited States,1981,bottom50,0.1969\nUnited States,1981,top10,0.3433\nUnited States,1982,bottom50,0.1916\nUnited States,1982,top10,0.346\nUnited States,1983,bottom50,0.1832\nUnited States,1983,top10,0.3536\nUnited States,1984,bottom50,0.1796\nUnited States,1984,top10,0.3649\nUnited States,1985,bottom50,0.1782\nUnited States,1985,top10,0.3655\nUnited States,1986,bottom50,0.1761\nUnited States,1986,top10,0.3634\nUnited States,1987,bottom50,0.1736\nUnited States,1987,top10,0.3747\nUnited States,1988,bottom50,0.1687\nUnited States,1988,top10,0.3924\nUnited States,1989,bottom50,0.1698\nUnited States,1989,top10,0.3878\nUnited States,1990,bottom50,0.1685\nUnited States,1990,top10,0.3876\nUnited States,1991,bottom50,0.1671\nUnited States,1991,top10,0.3832\nUnited States,1992,bottom50,0.16\nUnited States,1992,top10,0.3941\nUnited States,1993,bottom50,0.1611\nUnited States,1993,top10,0.391\nUnited States,1994,bottom50,0.1617\nUnited States,1994,top10,0.3913\nUnited States,1995,bottom50,0.1574\nUnited States,1995,top10,0.399\nUnited States,1996,bottom50,0.1547\nUnited States,1996,top10,0.408\nUnited States,1997,bottom50,0.1524\nUnited States,1997,top10,0.4155\nUnited States,1998,bottom50,0.1528\nUnited States,1998,top10,0.4192\nUnited States,1999,bottom50,0.1514\nUnited States,1999,top10,0.4228\nUnited States,2000,bottom50,0.1506\nUnited States,2000,top10,0.4273\nUnited States,2001,bottom50,0.1531\nUnited States,2001,top10,0.4194\nUnited States,2002,bottom50,0.154\nUnited States,2002,top10,0.4149\nUnited States,2003,bottom50,0.1509\nUnited States,2003,top10,0.4164\nUnited States,2004,bottom50,0.1478\nUnited States,2004,top10,0.4242\nUnited States,2005,bottom50,0.1432\nUnited States,2005,top10,0.4359\nUnited States,2006,bottom50,0.1408\nUnited States,2006,top10,0.4429\nUnited States,2007,bottom50,0.1431\nUnited States,2007,top10,0.4404\nUnited States,2008,bottom50,0.1429\nUnited States,2008,top10,0.4356\nUnited States,2009,bottom50,0.1425\nUnited States,2009,top10,0.4245\nUnited States,2010,bottom50,0.1387\nUnited States,2010,top10,0.4381\nUnited States,2011,bottom50,0.1356\nUnited States,2011,top10,0.4426\nUnited States,2012,bottom50,0.1315\nUnited States,2012,top10,0.4559\nUnited States,2013,bottom50,0.1345\nUnited States,2013,top10,0.449\nUnited States,2014,bottom50,0.1314\nUnited States,2014,top10,0.4558\nUnited States,2015,bottom50,0.1321\nUnited States,2015,top10,0.455\nUnited States,2016,bottom50,0.1295\nUnited States,2016,top10,0.4536\nUnited States,2017,bottom50,0.1348\nUnited States,2017,top10,0.4546\nUnited States,2018,bottom50,0.1334\nUnited States,2018,top10,0.4581\nUnited States,2019,bottom50,0.1358\nUnited States,2019,top10,0.4567\nUnited States,2020,bottom50,0.137\nUnited States,2020,top10,0.4461\nUnited States,2021,bottom50,0.1346\nUnited States,2021,top10,0.4607\nUnited States,2022,bottom50,0.1334\nUnited States,2022,top10,0.4686\nUnited States,2023,bottom50,0.1344\nUnited States,2023,top10,0.4676\nUnited States,2024,bottom50,0.1344\nUnited States,2024,top10,0.4676\n"

# ======================================================================
# LESSON 1: Read the WID data
# ======================================================================

# Prepare the data for this lesson
.wid_source <- read.csv(text = inequality_csv)


# EXERCISE SOLUTION: Import the CSV
df <- read.csv(text = inequality_csv)
head(df)

# ======================================================================
# LESSON 2: Inspect the dataset
# ======================================================================

# Prepare the data for this lesson
.wid_source <- read.csv(text = inequality_csv)
df <- .wid_source


# EXERCISE SOLUTION: Count observations and list variables
n_observations <- nrow(df)
column_names <- names(df)
n_observations
column_names

# ======================================================================
# LESSON 3: Prepare the data
# ======================================================================

# Prepare the data for this lesson
.wid_source <- read.csv(text = inequality_csv)
df <- .wid_source


# EXERCISE SOLUTION: Filter and add share_pct
df <- df %>%
  filter(year >= 2000) %>%
  mutate(share_pct = income_share * 100)
head(df)

# ======================================================================
# LESSON 4: Compare the countries
# ======================================================================

# Prepare the data for this lesson
.wid_source <- read.csv(text = inequality_csv)
df <- local({ data <- .wid_source[.wid_source$year >= 2000, ]; data$share_pct <- data$income_share * 100; data })


# EXERCISE SOLUTION: Create country_comparison
country_comparison <- df %>%
  filter(year == 2024, group == "top10") %>%
  select(country, share_pct) %>%
  arrange(desc(share_pct))
country_comparison

# ======================================================================
# LESSON 5: Reshape the data
# ======================================================================

# Prepare the data for this lesson
.wid_source <- read.csv(text = inequality_csv)
df <- local({ data <- .wid_source[.wid_source$year >= 2000, ]; data$share_pct <- data$income_share * 100; data })


# EXERCISE SOLUTION: Create comparison
comparison <- df %>%
  select(country, year, group, share_pct) %>%
  pivot_wider(names_from = group, values_from = share_pct)
head(comparison)

# ======================================================================
# LESSON 6: Measure change over time
# ======================================================================

# Prepare the data for this lesson
.wid_source <- read.csv(text = inequality_csv)
comparison <- local({
  data <- local({ data <- .wid_source[.wid_source$year >= 2000, ]; data$share_pct <- data$income_share * 100; data })
  top <- data[data$group == "top10", c("country", "year", "share_pct")]
  bottom <- data[data$group == "bottom50", c("country", "year", "share_pct")]
  result <- merge(top, bottom, by = c("country", "year"))
  names(result)[3:4] <- c("top10", "bottom50")
  result
})


# EXERCISE SOLUTION: Create changes
changes <- comparison %>%
  group_by(country) %>%
  summarise(change_pp = top10[year == 2024] - top10[year == 2000])
changes

# ======================================================================
# LESSON 7: Plot the trends
# ======================================================================

# Prepare the data for this lesson
.wid_source <- read.csv(text = inequality_csv)
df <- local({ data <- .wid_source[.wid_source$year >= 2000, ]; data$share_pct <- data$income_share * 100; data })


# EXERCISE SOLUTION: Create and display p
p <- df %>%
  filter(group == "top10") %>%
  ggplot(aes(x = year, y = share_pct, colour = country)) +
  geom_line() +
  labs(x = "Year", y = "Top 10% income share (%)", colour = "Country", caption = "Source: WID.world") +
  theme_minimal()
p

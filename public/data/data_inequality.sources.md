# WID income inequality: sources and definitions

Publisher: World Inequality Database (WID.world). Retrieved 2026-09-14 (UTC).

This is a fixed extract of WID estimates for France, Germany, Switzerland and the United States, 1980–2024. It contains 360 country-year-group observations. Source modification dates, original URLs and checksums are recorded in wid-inequality-metadata.json.

## What is measured?

The indicator is the share of pretax national income received by a group of adults aged 20 and older, using WID's equal-split population definition. Income is split equally within couples or households, following each country's methodology. Pretax income includes social-insurance benefits and deducts the associated contributions; it precedes personal income taxes and other redistribution such as social assistance. It includes labour and capital income.

Rows labelled `top10` (`p90p100`) report the share of total income received by the top 10% of adults. Rows labelled `bottom50` (`p0p50`) report the share of total income received by the bottom 50% of adults. In the teaching CSV, `group` identifies which share is reported and `income_share` stores its value as a fraction of 1. Total income here means pretax national income. The income share of the middle 40% is not included, so the two shares do not sum to 100%. Each year's groups are defined by that year's income ranking; this is not a panel following the same individuals.

`income_share` is a fraction of total pretax national income, as provided by WID. Multiplying it by 100 gives a percentage. It is neither a currency amount nor an individual's income. The bulk-download indicator in this snapshot is `sptincj992` (legacy dictionary spelling: `sptinc992j`).

## Preparation and interpretation

Only the specified series were selected. Country and group labels were simplified and `value` was renamed `income_share`. All selected values are unchanged. No missing observations were invented or filled by this project. The teaching CSV has four columns; the selected original WID records, including quality scores, remain in `wid-inequality-source.csv`.

WID estimates combine sources such as surveys, tax records and national accounts. Source coverage and methods differ by country. Some estimates use interpolation or extrapolation and WID may revise them. A trend describes the published income shares; it does not on its own identify a cause. Top-income shares describe one aspect of inequality, rather than the whole distribution.

## Sources

- Data and downloads: https://wid.world/data/
- Indicator, percentile and population definitions: https://wid.world/codes-dictionary/
- Methodology and country-specific research: https://wid.world/methodology/
- DINA methods and equal-split definitions: https://prod.wid.world/www-site/uploads/2020/09/WorldInequalityLab_DINA_Guidelines_2024.pdf
- R package documentation (fraction units and quality fields): https://cran.r-project.org/web/packages/wid/refman/wid.html
- France original bulk file: https://wid.world/bulk_download/WID_data_FR.csv
- Germany original bulk file: https://wid.world/bulk_download/WID_data_DE.csv
- Switzerland original bulk file: https://wid.world/bulk_download/WID_data_CH.csv
- United States original bulk file: https://wid.world/bulk_download/WID_data_US.csv

To refresh: run `python3 scripts/update-wid-data.py` from the website folder, review the changes, and regenerate the materials. Website builds use the saved snapshot and do not contact WID.

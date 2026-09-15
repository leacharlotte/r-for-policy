"""Refresh the pinned WID extract manually; ordinary website builds never fetch data.

Usage: python3 scripts/update-wid-data.py
Review the new values and exercise checks before publishing an updated snapshot.
"""
import argparse
import csv
import datetime
import hashlib
import io
import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COUNTRIES = {'FR': 'France', 'DE': 'Germany', 'CH': 'Switzerland', 'US': 'United States'}
GROUPS = {'p0p50': 'bottom50', 'p90p100': 'top10'}
YEARS = range(1980, 2025)
VARIABLES = {'sptincj992', 'sptinc992j'}  # Current bulk code and legacy WID spelling.
FIELDS = ['country', 'variable', 'percentile', 'year', 'value', 'age', 'pop', 'data_quality']


def fetch(country):
    url = f'https://wid.world/bulk_download/WID_data_{country}.csv'
    with urllib.request.urlopen(url, timeout=90) as response:
        raw = response.read()
        source = {'url': url, 'last_modified': response.headers.get('last-modified'),
                  'sha256': hashlib.sha256(raw).hexdigest(), 'bytes': len(raw)}
    reader = csv.DictReader(io.StringIO(raw.decode('utf-8-sig')), delimiter=';')
    rows = [row for row in reader if row['variable'] in VARIABLES
            and row['percentile'] in GROUPS and int(row['year']) in YEARS]
    return {'source': source, 'rows': rows}


def validate(extracts):
    for country, extract in extracts.items():
        keys = [(row['percentile'], int(row['year'])) for row in extract['rows']]
        expected = {(group, year) for group in GROUPS for year in YEARS}
        assert len(keys) == len(expected) and set(keys) == expected, f'Incomplete/duplicate series: {country}'
        for row in extract['rows']:
            assert row['country'] == country and row['variable'] in VARIABLES
            assert row['age'] == '992' and row['pop'] == 'j'
            assert 0 < float(row['value']) < 1, f'Invalid share: {row}'
        for year in YEARS:
            total = sum(float(row['value']) for row in extract['rows'] if int(row['year']) == year)
            assert total < 1, f'Overlapping/invalid income shares: {country}, {year}'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--from-cache', type=Path, help='Reuse previously downloaded country JSON files.')
    args = parser.parse_args()
    if args.from_cache:
        extracts = {code: json.loads((args.from_cache / f'{code}.json').read_text()) for code in COUNTRIES}
    else:
        with ThreadPoolExecutor(max_workers=4) as pool:
            extracts = dict(zip(COUNTRIES, pool.map(fetch, COUNTRIES)))
    validate(extracts)
    rows = sorted((row for extract in extracts.values() for row in extract['rows']),
                  key=lambda row: (COUNTRIES[row['country']], int(row['year']), GROUPS[row['percentile']]))
    data_dir = ROOT / 'public' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    # Keep the selected original fields, including the observation-level quality flag.
    raw_file = data_dir / 'wid-inequality-source.csv'
    with raw_file.open('w', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS, delimiter=';', lineterminator='\n')
        writer.writeheader()
        writer.writerows({field: row.get(field, '') for field in FIELDS} for row in rows)
    clean_file = data_dir / 'data_inequality.csv'
    with clean_file.open('w', newline='') as handle:
        writer = csv.writer(handle, lineterminator='\n')
        writer.writerow(['country', 'year', 'group', 'income_share'])
        writer.writerows([COUNTRIES[row['country']], row['year'], GROUPS[row['percentile']], row['value']] for row in rows)
    metadata = {
        'publisher': 'World Inequality Database (WID.world)',
        'retrieved_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'source_page': 'https://wid.world/data/',
        'definition_url': 'https://wid.world/codes-dictionary/',
        'methodology_url': 'https://wid.world/methodology/',
        'country_sources': {code: extract['source'] for code, extract in extracts.items()},
        'variable': sorted({row['variable'] for row in rows}),
        'concept': 'Share of pretax national income, equal-split adults aged 20 and older',
        'years': [min(YEARS), max(YEARS)], 'countries': COUNTRIES, 'groups': GROUPS,
        'rows': len(rows), 'missing_values': 0,
        'transformations': ['Select the listed countries, years, population unit and percentile groups.',
                            'Replace country and percentile codes with readable labels.',
                            'Rename value to income_share; preserve every selected value as supplied.',
                            'Retain original fields and data_quality scores in wid-inequality-source.csv.',
                            'No observations simulated, interpolated, rounded or deleted within the selected series by this project.'],
        'caveat': 'WID publishes estimates assembled from multiple sources. Its series can include interpolation or extrapolation and may be revised. Country methods and source coverage differ.',
        'extract_sha256': hashlib.sha256(raw_file.read_bytes()).hexdigest(),
        'teaching_csv_sha256': hashlib.sha256(clean_file.read_bytes()).hexdigest(),
    }
    (data_dir / 'wid-inequality-metadata.json').write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + '\n')
    date = metadata['retrieved_at_utc'][:10]
    notes = f'''# WID income inequality: sources and definitions

Publisher: World Inequality Database (WID.world). Retrieved {date} (UTC).

This is a fixed extract of WID estimates for France, Germany, Switzerland and the United States, 1980–2024. It contains 360 country-year-group observations. Source modification dates, original URLs and checksums are recorded in wid-inequality-metadata.json.

## What is measured?

The indicator is the share of pretax national income received by a group of adults aged 20 and older, using WID's equal-split population definition. Income is split equally within couples or households, following each country's methodology. Pretax income includes social-insurance benefits and deducts the associated contributions; it precedes personal income taxes and other redistribution such as social assistance. It includes labour and capital income.

Rows labelled `top10` (`p90p100`) report the share of total income received by the top 10% of adults by income. Rows labelled `bottom50` (`p0p50`) report the share of total income received by the bottom 50% of adults by income. In the teaching CSV, `group` identifies which share is reported and `income_share` stores its value as a fraction of 1. Total income here means pretax national income. The income share of the middle 40% is not included, so the two shares do not sum to 100%. Each year's groups are defined by that year's income ranking; this is not a panel following the same individuals.

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
'''
    for country, extract in extracts.items():
        notes += f"- {COUNTRIES[country]} original bulk file: {extract['source']['url']}\n"
    notes += '\nTo refresh: run `python3 scripts/update-wid-data.py` from the website folder, review the changes, and regenerate the materials. Website builds use the saved snapshot and do not contact WID.\n'
    (data_dir / 'data_inequality.sources.md').write_text(notes)
    print(f'Saved {len(rows)} WID observations; source records, definitions and retrieval metadata included.')


if __name__ == '__main__':
    main()

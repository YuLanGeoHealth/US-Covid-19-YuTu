#!/bin/bash

## retrieve from GITHUB daily & processing
python3 ./UpdatedDaily_range.py

## import into CovidCase
PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy cases FROM './latestupdate.csv' DELIMITER ',' CSV HEADER;"
## Done
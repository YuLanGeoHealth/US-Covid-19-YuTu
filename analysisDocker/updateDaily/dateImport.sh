#!/bin/bash

## retrieve from GITHUB daily & processing
python3 ./UpdatedDaily.py

## import into CovidCase
PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy cases FROM './yesterday.csv' DELIMITER ',' CSV HEADER;"
## Done
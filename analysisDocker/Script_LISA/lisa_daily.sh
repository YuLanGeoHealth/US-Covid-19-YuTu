#!/bin/bash

#yesterday
q="$(date --date=' 1 days ago' '+%Y-%m-%d')" 
echo $q

#export shp with cases on yesterday from db cases&county(boundary db)
pgsql2shp -f "/mnt/sqldata/lisa$q" -h covidData -u postgres -P password covid19 "SELECT geoid, collect_date, cases.case_avg7/county.pop as caseper, geom FROM county INNER JOIN cases ON geoid = cases.fips where collect_date = '$q'"

#run py script
# python3 lisa_daily.py

#import into db of lisa 
# PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy lisa FROM './yesterday_lisa.csv' DELIMITER ',' CSV HEADER;"

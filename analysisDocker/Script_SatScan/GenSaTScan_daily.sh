#!/bin/bash

# STARTDATE="2022-07-01"
STARTDATE=$(date +"%Y-%m-%d" --date='-51 day')
# ENDDATE="2022-03-31"
ENDDATE=$(date +"%Y-%m-%d" --date='-1 day') #current date

# database
CASECODE="\COPY (SELECT * FROM cases WHERE (collect_date >='"$STARTDATE"' and collect_date <='"$ENDDATE"')) TO '/mnt/sqldata/cases.csv' DELIMITER ',' CSV HEADER;"
POPCODE="\COPY (SELECT fips, pop_total FROM population)TO '/mnt/sqldata/pop.csv' DELIMITER ',' CSV HEADER;" 
# fips,lat,long,daily_case,collect_date,case_avg7
# collect data from database
psql -h covidData -c "$CASECODE" "dbname=covid19 user=postgres password=password"
psql -h covidData -c "$POPCODE" "dbname=covid19 user=postgres password=password"

start=$(date -d $STARTDATE +%s)
end=$(date -d $ENDDATE +%s) 

python3 dailySaTScanRange_daily.py $STARTDATE $ENDDATE 


# run satscan for all( use the school pc)
for i in `find /mnt/batch/ -type f -name "*.prm"`;
do
    "/usr/local/SaTScan/SaTScanBatch64" "$i"

done

#rr.txt 
for i in `find /mnt/results/ -type f -name "*.rr.txt"`;
do
    echo "$i"
    python3 addname_daily.py $i
done

#dealing with gis file; cluster relatie risk of the county.
for i in `find /mnt/results/ -type f -name "*.gis.txt"`;
do
    echo "$i"
    python3 addnameGIS_daily.py $i
done

PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy sat_cluster FROM '/mnt/final/cluster_rr.csv' DELIMITER ',' CSV HEADER;"

#import into db of rr_location
PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy county_rr FROM '/mnt/final/rr.csv' DELIMITER ',' CSV HEADER;"






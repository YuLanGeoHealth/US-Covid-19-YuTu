#!/bin/bash
STARTDATE="2022-08-16"
ENDDATE="2022-08-20"

start=$(date -d $STARTDATE +%s)
# end=$(($(date -d $ENDDATE +%s)+ 86400 ))
end=$(date -d $ENDDATE +%s)


d="$start"
while [ $d -le $end ]
do
    q=$(date -d @$d +%Y-%m-%d)
    pgsql2shp -f "/mnt/sqldata/lisa$q" -h covidData -u postgres -P password covid19 "SELECT geoid, collect_date, cases.case_avg7/county.pop as caseper, geom FROM county INNER JOIN cases ON geoid = cases.fips where collect_date = '$q'"
    d=$(( $d + 86400 ))
done

#run lisa analysis. but it will stop at 15 or less shpfiles.
python3 lisa.py 


# merge into one 
touch '/mnt/Script_LISA/data/allcounties_temp.txt'
for i in `find /mnt/Script_LISA/data/ -type f -name "*.csv"`;
do
    echo "$i"
    cat "$i" >> "/mnt/Script_LISA/data/allcounties_temp.txt"
done

sed -e '2,${/^ID/d' -e '}' ./data/allcounties_temp.txt> latest.csv

#import into db of lisa 
# PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy lisa FROM './latest.csv' DELIMITER ',' CSV HEADER;"



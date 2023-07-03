# #!/bin/bash
# #For one state 

# STARTDATE="2021-06-01"

STARTDATE="2021-12-21"
# ENDDATE="2022-03-31"
ENDDATE="2022-01-25"

#database
# CASECODE="\COPY (SELECT * FROM cases WHERE (collect_date >='"$STARTDATE"' and collect_date <='"$ENDDATE"')) TO '/mnt/sqldata/temp.csv' DELIMITER ',' CSV HEADER;"
# POPCODE="\COPY (SELECT fips, pop_total FROM population)TO '/mnt/sqldata/pop.csv' DELIMITER ',' CSV HEADER;" 
# fips,lat,long,daily_case,collect_date,case_avg7
# collect data from database
# psql -h covidData -c "$CASECODE" "dbname=covid19 user=postgres password=password"
# psql -h covidData -c "$POPCODE" "dbname=covid19 user=postgres password=password"

# start=$(date -d $STARTDATE +%s)
# end=$(($(date -d $ENDDATE +%s) + 86400))

# d="$start"
# while [ $d -le $end ]
# do
#     date -d @$d +%Y-%m-%d

#     d=$(( $d + 86400 ))

#     # generate satscan prm for each day
#     python3 dailySaTScanRange_wi.py $STARTDATE $d 
# done


# run satscan for all( use the school pc)
for i in `find /mnt/batch/ -type f -name "*.prm"`;
do
    "/usr/local/SaTScan/SaTScanBatch64" "$i"
done

#add time stamp
for i in `find /mnt/results/ -type f -name "*.rr.txt"`;
do
    echo "$i"
    python3 mergeRR.py $i
done

# merge into one 
touch '/mnt/final/allcounties_temp.txt'
for i in `find /mnt/final -type f -name "*.csv"`;
do
    echo "$i"
    cat "$i" >> "/mnt/final/allcounties_temp.txt"
done

python3 addname.py '/mnt/final/allcounties_temp.txt' $STARTDATE $ENDDATE

python3 mergeSHP.py $STARTDATE $ENDDATE
#dealing with gis file; cluster relatie risk of the county.
#add time stamp
for i in `find /mnt/results/ -type f -name "*.gis.txt"`;
do
    echo "$i"
    python3 mergeGIS.py $i
done

# # merge into one 
touch '/mnt/final/gis/allclusters_temp.txt'
for i in `find /mnt/final/gis -type f -name "*.csv"`;
do
    echo "$i"
    cat "$i" >> "/mnt/final/gis/allclusters_temp.txt"
done

python3 addnameGIS.py '/mnt/final/gis/allclusters_temp.txt' $STARTDATE $ENDDATE





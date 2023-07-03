# #!/bin/bash
# #For one state 
STARTDATE="2022-08-16"
# ENDDATE="2022-03-31"
ENDDATE="2022-08-20"

# STARTDATE="2021-01-01"
# ENDDATE="2021-02-20"
sqlstart="2022-06-15" ##include 50days data for the first date

CASECODE="\COPY (SELECT * FROM cases WHERE (collect_date >='"$sqlstart"' and collect_date <='"$ENDDATE"')) TO '/mnt/sqldata/cases.csv' DELIMITER ',' CSV HEADER;"
POPCODE="\COPY (SELECT fips, pop_total FROM population)TO '/mnt/sqldata/pop.csv' DELIMITER ',' CSV HEADER;" 

# collect data from database
psql -h covidData -c "$CASECODE" "dbname=covid19 user=postgres password=password"
psql -h covidData -c "$POPCODE" "dbname=covid19 user=postgres password=password"

start=$(date -d $STARTDATE +%s)
end=$(($(date -d $ENDDATE +%s) + 86400))

d="$start"
while [ $d -le $end ]
do
    date -d @$d +%Y-%m-%d
    # generate satscan prm for each day if first date not the 2020-01-22
    python3 dailySaTScanRange_windows.py $STARTDATE $d 

    d=$(( $d + 86400 ))

done


# # run satscan for all( use the school pc)
# for i in `find /mnt/batch/ -type f -name "*.prm"`;
# do
#     "/usr/local/SaTScan/SaTScanBatch64" "$i"
# done

# #add time stamp
# for i in `find /mnt/results/ -type f -name "*.rr.txt"`;
# do
#     echo "$i"
#     python3 mergeRR.py $i
# done

# # merge into one 
# touch '/mnt/final/allcounties_temp.txt'
# for i in `find /mnt/final -type f -name "*.csv"`;
# do
#     echo "$i"
#     cat "$i" >> "/mnt/final/allcounties_temp.txt"
# done

# python3 addname.py '/mnt/final/allcounties_temp.txt' $STARTDATE $ENDDATE

# python3 mergeSHP.py $STARTDATE $ENDDATE





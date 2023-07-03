# #!/bin/bash
# #For one state 

STARTDATE="2021-11-30"
ENDDATE="2022-02-28"
# STATE="55" 
# FIPSS=$STATE"000"
# FIPSE=$STATE"999"
# CASECODE="\COPY (SELECT * FROM cases WHERE (fips>"$FIPSS" and fips<="$FIPSE") and (collect_date >='"$STARTDATE"' and collect_date <='"$ENDDATE"')) TO '/mnt/sqldata/temp.csv' DELIMITER ',' CSV HEADER;"
# POPCODE="\COPY (SELECT fips, pop_total FROM population WHERE (fips>"$FIPSS" and fips<="$FIPSE"))TO '/mnt/sqldata/pop.csv' DELIMITER ',' CSV HEADER;" 

# # collect data from database
# psql -h covidData -c "$CASECODE" "dbname=covid19 user=postgres password=password"
# psql -h covidData -c "$POPCODE" "dbname=covid19 user=postgres password=password"

start=$(date -d $STARTDATE +%s)
end=$(($(date -d $ENDDATE +%s) + 86400))

d="$start"
while [ $d -le $end ]
do
    date -d @$d +%Y-%m-%d

    d=$(( $d + 86400 ))

    # generate satscan prm for each day
    python3 dailySaTScanRange_windows.py $STARTDATE $d 
done


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





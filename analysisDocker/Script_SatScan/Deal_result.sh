# #!/bin/bash
# #For one state 

STARTDATE="2022-08-16"
ENDDATE="2022-08-20"

#add time stamp
for i in `find /mnt/results/ -type f -name "*.rr.txt"`;
do
    echo "$i"
    python3 mergeRR.py $i
done

# # merge into one 
touch '/mnt/final/rr/allcounties_temp.txt'
for i in `find /mnt/final -type f -name "*.csv"`;
do
    echo "$i"
    cat "$i" >> "/mnt/final/rr/allcounties_temp.txt"
done

python3 addname.py '/mnt/final/rr/allcounties_temp.txt' $STARTDATE $ENDDATE

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


# #import into db of rr_cluster
# PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy sat_cluster FROM '/mnt/final/cluster_2022070120220815.csv' DELIMITER ',' CSV HEADER;"

# #import into db of rr_location
# PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy county_rr FROM '/mnt/final/rr_2022070120220815.csv' DELIMITER ',' CSV HEADER;"


# PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy sat_cluster FROM '/mnt/final/cluster_2022081620220820.csv' DELIMITER ',' CSV HEADER;"

# PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy county_rr FROM '/mnt/final/rr_2022081620220820.csv' DELIMITER ',' CSV HEADER;"

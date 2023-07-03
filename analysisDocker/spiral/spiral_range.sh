#export rr for spiral
# PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\COPY (SELECT * FROM county_rr WHERE col_date >'2022-08-15' ORDER BY col_date ASC) TO './rr.csv' DELIMITER ',' CSV HEADER;"

# generate spiral result
python3 spiral.py

# import into database
PGPASSWORD=password psql -U postgres -d covid19 -h covidData -c "\copy spiral FROM '/mnt/spiral/results.csv' DELIMITER ',' CSV HEADER;"


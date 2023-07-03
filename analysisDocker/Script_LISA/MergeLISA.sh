# #!/bin/bash

# merge into one 
touch '/mnt/Script_LISA/data/allcounties_temp.txt'
for i in `find /mnt/Script_LISA/data/ -type f -name "*.csv"`;
do
    echo "$i"
    cat "$i" >> "/mnt/Script_LISA/data/allcounties_temp.txt"
done

sed -e '2,${/^ID/d' -e '}' ./data/allcounties_temp.txt> latest.csv

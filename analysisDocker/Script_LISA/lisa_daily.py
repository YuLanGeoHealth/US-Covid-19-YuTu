import string
import pygeoda
import pandas as pd

# importing the library
import os
 
# giving directory name
dirname = '/mnt/sqldata/'
 
# df store all results
alllisa = pd.DataFrame(columns=['GEOID', 'daily', 'date','lisa_v','lisa_p','lisa_c'])

# iterating over all files
for files in os.listdir(dirname):
    if files.endswith('.shp'):
        print(files)  # printing file name of desired extension
        dir = dirname + '/' + files
        shp = pygeoda.open(dir)

        #Queen Contiguity Weights
        queen_w = pygeoda.queen_weights(shp)
        nbrs = queen_w.get_neighbors(0)
        fips = shp['GEOID']#fips
        avg7 = shp['CASEPER'] #avg 7 days cases divided by population

        lm = pygeoda.local_moran(queen_w, avg7) #lisa

        lisa_df=pd.DataFrame(fips, columns =['ID'])
        lisa_df['daily'] = shp['CASEPER']
        lisa_df['date'] = shp['COLLECT_DA']
        lisa_df['lisa_v'] = lm.lisa_values() # lisa I value
        lisa_df['lisa_p'] = lm.lisa_pvalues() # lisa P value
        lisa_df['lisa_c'] = lm.lisa_clusters() # lisa Cluster class; 1 high-high
        alllisa = lisa_df

        # convert column "GEOID" to int64 dtype
        alllisa = alllisa.astype({"ID": int})
        alllisa = alllisa.astype({"ID": str})
        alllisa['ID'] = alllisa['ID'].str.zfill(5)
        # alllisa.drop('GEOID', inplace=True, axis=1)

        # Applying the condition to visual clusters
        alllisa.loc[alllisa["lisa_c"] == 1, "clusterN"] = 4
        alllisa.loc[alllisa["lisa_c"] == 2, "clusterN"] = 1
        alllisa.loc[alllisa["lisa_c"] == 3, "clusterN"] = 3
        alllisa.loc[alllisa["lisa_c"] == 4, "clusterN"] = 2
        alllisa=alllisa.dropna(subset=['clusterN']) #drop other categories
        alllisa = alllisa.astype({"clusterN": int})

        # Applying the condition to visual p values
        alllisa.loc[(alllisa["lisa_p"] <= 0.0001)& (alllisa["lisa_p"] > 0), "p"] = 4
        alllisa.loc[(alllisa["lisa_p"] <= 0.001) & (alllisa["lisa_p"] > 0.0001) , "p"] = 3
        alllisa.loc[(alllisa["lisa_p"] <= 0.01) & (alllisa["lisa_p"] > 0.001), "p"] = 2
        alllisa.loc[(alllisa["lisa_p"] <= 0.05) & (alllisa["lisa_p"] > 0.01), "p"] = 1
        alllisa = alllisa.astype({"p": int})

        # outfile = './'+files.strip(".shp")+'.csv'
        outfile = './yesterdaylisa.csv'
        alllisa.to_csv(outfile, index = False)  


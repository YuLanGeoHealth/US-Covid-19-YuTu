# %%
import pandas as pd 
import sys
from datetime import datetime
var1 = sys.argv[1]
# var1 = '/Users/yu/work/py/SatScan/results/allcounties_temp.txt'
df = pd.read_csv(var1,names=['ID','RR_C','RR_L','date'], sep=',')
# %%

df = df.sort_values(by='date')
df = df.dropna()
# %%
STARTDATE = sys.argv[2]
ENDDATE = sys.argv[3]

fullname = STARTDATE.replace('-','')+ENDDATE.replace('-','')
# %%
df.to_csv("/mnt/final/cluster_"+fullname+".csv",index = False)
# %%

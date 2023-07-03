# %%
import pandas as pd 
import sys
from datetime import datetime
var1 = sys.argv[1]
# var1 = '/Users/yu/work/py/SatScan/results/allcounties_temp.txt'
df = pd.read_csv(var1,names=['FPIS','RR','date'], sep=',')
# %%

df = df.sort_values(by='date')
df = df.dropna()
# df = df.drop(['NID'], axis = 1)
# %%
STARTDATE = sys.argv[2]
ENDDATE = sys.argv[3]

fullname = STARTDATE.replace('-','')+ENDDATE.replace('-','')
# %%
df.to_csv("/mnt/final/rr_"+fullname+".csv",index = False)
# %%

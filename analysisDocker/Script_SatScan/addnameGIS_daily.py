# %%
import pandas as pd 
import sys
from datetime import datetime
var1 = sys.argv[1]
# var1 = '/Users/yu/work/py/SatScan/results/allcounties_temp.txt'
df = pd.read_csv(var1,names=['ID','clusterN','p','rm1','Observed_C','Expected_C','ODE_C','RR_C','pop_C','Observed_L','Expected_L','ODE_L','RR_L','pop_L','x','y','F'], sep='\s+')
# %%
filename = var1.strip(".gis.txt")
filename = filename[-8:-2]
i = datetime.strptime(filename, "%y%m%d")
date = (str(int(i.strftime('%Y'))))+'-'+str(i.strftime('%m'))+'-'+str(i.strftime('%d'))
droplist = ['clusterN','p','rm1','Observed_C','Expected_C','ODE_C','pop_C','Observed_L','Expected_L','ODE_L','pop_L','x','y','F']
df = df.drop(columns=droplist)
df['date'] = date
df = df.sort_values(by='date')
df = df.dropna()
# %%
# STARTDATE = sys.argv[2]
# ENDDATE = sys.argv[3]

# fullname = STARTDATE.replace('-','')+ENDDATE.replace('-','')
# %%
df.to_csv("/mnt/final/cluster_rr.csv",index = False)
# %%

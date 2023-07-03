# %%
import pandas as pd 
import sys
from datetime import datetime
var1 = sys.argv[1]
# var1 = '/Users/yu/work/py/SatScan/batch//results/71921-080121a4.rr.txt'
df = pd.read_csv(var1,names=['ID','clusterN','p','rm1','Observed_C','Expected_C','ODE_C','RR_C','pop_C','Observed_L','Expected_L','ODE_L','RR_L','pop_L','x','y','F'], sep='\s+')
# %%
filename = var1.strip(".gis.txt")
filename = filename[-8:-2]
i = datetime.strptime(filename, "%y%m%d")
date = (str(int(i.strftime('%Y'))))+'-'+str(i.strftime('%m'))+'-'+str(i.strftime('%d'))
# %%
df['date'] = date
droplist = ['clusterN','p','rm1','Observed_C','Expected_C','ODE_C','pop_C','Observed_L','Expected_L','ODE_L','pop_L','x','y','F']
df = df.drop(columns=droplist)
# %%
df.to_csv('/mnt/final/gis/cluster_'+filename+'.csv',index=False,header=False)
# %%

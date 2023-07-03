# %%
import pandas as pd 
import sys
from datetime import datetime
var1 = sys.argv[1]
# var1 = '/Users/yu/work/py/SatScan/batch//results/71921-080121a4.rr.txt'
df = pd.read_csv(var1,names=['ID','Observed','Expected','OE','RR'], sep='\s+')
# %%
filename = var1.strip(".rr.txt")
filename = filename[-8:-2]
i = datetime.strptime(filename, "%y%m%d")
date = (str(int(i.strftime('%Y'))))+'-'+str(i.strftime('%m'))+'-'+str(i.strftime('%d'))
# %%
df['date'] = date
droplist =['Observed','Expected','OE']
df = df.drop(columns=droplist)
# %%
df.to_csv('/mnt/final/rr/rr_'+filename+'.csv',index=False,header=False)
# %%

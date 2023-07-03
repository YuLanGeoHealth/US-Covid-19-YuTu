# %%
import pandas as pd 
import sys
from datetime import datetime
var1 = sys.argv[1]
filename = var1.strip(".rr.txt")
filename = filename[-8:-2]
i = datetime.strptime(filename, "%y%m%d")
df = pd.read_csv(var1,names=['ID','Observed','Expected','OE','RR'], sep='\s+')
date = (str(int(i.strftime('%Y'))))+'-'+str(i.strftime('%m'))+'-'+str(i.strftime('%d'))
df['date'] = date
droplist =['Observed','Expected','OE']
df = df.drop(columns=droplist)
# var1 = '/Users/yu/work/py/SatScan/results/allcounties_temp.txt'

# %%

# df = df.sort_values(by='date')
df = df.dropna()
# df = df.drop(['NID'], axis = 1)
# %%
# STARTDATE = sys.argv[2]
# ENDDATE = sys.argv[3]

# fullname = STARTDATE.replace('-','')+ENDDATE.replace('-','')
# %%
df.to_csv("/mnt/final/rr.csv",index = False)
# %%

# %%
## source code of extract latest data from JSU github

import numpy as np
import pandas as pd

# %%

## only collect latest's cases (yesterday)
from datetime import date
from datetime import timedelta
yesterday = date.today() - timedelta(days = 1)
yesterday = yesterday.strftime("%-m/%-d/%y")

url_casesUS = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv'
df_cases = pd.read_csv(url_casesUS)
df_cases = df_cases.drop(columns = ["iso2","iso3","code3","UID","Admin2","Province_State", "Country_Region","Combined_Key"])
df_cases = df_cases.dropna()
df_cases = df_cases[(df_cases.Lat != 0.0)]
df_cases = df_cases[(df_cases.FIPS > 1000)]
df_cases = df_cases[(df_cases.FIPS < 2000) | (df_cases.FIPS > 3000)] #AK =2
df_cases = df_cases[(df_cases.FIPS < 15000) | (df_cases.FIPS > 16000)] #HI =15
df_cases = df_cases[(df_cases.FIPS < 60000) ] #American Samoa,Guam,Northern Mariana Islands,Puerto Rico,Virgin Islands
df_cases = df_cases.reset_index(drop = True)
# df_cases


# %%
# columns = ['FIPS', 'Admin2','Province_State','Lat', 'Long_',yesterday]
columns = ['FIPS', 'Lat', 'Long_']
df_yesterday = df_cases[columns]
df_yesterday.rename(columns={'Long_': 'Long'}, inplace=True)
# df_yesterday

# %%
yesterday_date = date.today() - timedelta(days = 1)
yesterday_date = yesterday_date.strftime("%Y-%m-%d")
# yesterday_date

# %%
df_date = df_cases.iloc[:, [-8,-7,-6,-5,-4,-3,-2,-1]]
# df_date

# %%
df_date1 = pd.DataFrame()
for i in range(0,7):
    name = str(i+1)
    df_date1[name] = df_date.iloc[:,i+1] - df_date.iloc[:,i]
# df_date1

# %%
df_date1['case_avg7'] = df_date1.mean(axis=1)

# %%

# df_date1

# %%
df_ready = df_yesterday[["FIPS","Lat","Long"]]
df_ready['dayly_cases']= df_date1['7']  
df_ready['collect_date'] = yesterday_date
df_ready['case_avg7'] = df_date1['case_avg7']

df_ready = df_ready.dropna()
df_ready['FIPS'] = df_ready['FIPS'].astype(int)
df_ready['case_avg7'] = df_ready['case_avg7'].round(0).astype(int)
# df_ready

# %%
for i in range(0,len(df_ready['case_avg7'])):
    if df_ready['case_avg7'][i] < 0:
        df_ready['case_avg7'][i] = 0
# df_ready

# %%
# yesterday_id = yesterday.replace('/','')
print(yesterday_date)
df_ready.to_csv('./'+ yesterday_date + '.csv', index = False, header = False)
df_ready.to_csv('./yesterday.csv', index = False, header = False)


## genreate daily 7 average cases all us continent counties for Database
import pandas as pd 
startDate = '8/13/22' ##at least 7days
endDate = '8/20/22' #latest

## extract data according to time ##
# import pandas as pd
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

dfnew = df_cases[df_cases.columns[0:4]]

# daily cases, not culmulative
for i in range(4,len(df_cases.columns)):
    dfnew[df_cases.columns[i]] = df_cases[df_cases.columns[i]]- df_cases[df_cases.columns[i-1]]

## extract data according to time ##
# import pandas as pd
df = dfnew 

interval = 1 
## add date want to be inclued in the exported
from datetime import datetime
from datetime import timedelta


## make sure the time range is consitents with interval
a = datetime.strptime(startDate, "%m/%d/%y")
b = datetime.strptime(endDate, "%m/%d/%y")
delta = b-a 
mod_days = (delta.days + 1)%interval
if mod_days != 0:
    b = datetime.strptime(endDate, "%m/%d/%y") - timedelta(days = mod_days)
endDate = (str(int(b.strftime('%m')))+'/'+str(int(b.strftime('%d')))+'/'+b.strftime('%y'))


DataIncluded = []
timeRange = pd.date_range(startDate, endDate).to_pydatetime()
for i in timeRange:
    #print(i.strftime('%m/%d/%y').replace('0',''))
    DataIncluded.append((str(int(i.strftime('%m')))+'/'+str(int(i.strftime('%d')))+'/'+i.strftime('%y')))

#df_drop = df.drop(['UID', 'iso2','iso3','code3','Province_State','Country_Region','Combined_Key'], axis=1) #drop cols
df_drop = df
## the list for all the inclued collumn 
allcol=['FIPS','Lat','Long_']  #date not inclued
for i in DataIncluded:
    allcol.append(i)

#
df_temp = df_drop[allcol]

df_temp = df_temp.dropna()
df_temp = df_temp[(df_temp.Lat != 0.0)]
df_temp = df_temp[(df_temp.FIPS < 2000) | (df_temp.FIPS > 3000)] #AK =2
df_temp = df_temp[(df_temp.FIPS < 15000) | (df_temp.FIPS > 16000)] #HI =15
df_temp = df_temp[(df_temp.FIPS < 60000) ]  #American Samoa,Guam,Northern Mariana Islands,Puerto Rico,Virgin Islands
df_temp = df_temp.reset_index(drop = True)

# organized date into one column
alltemp = []
temp =[]
import datetime
for i in DataIncluded:
    for j in range(0,len(df_temp[i])):
        # print(df_temp['FIPS'][j])
        temp = [int(df_temp['FIPS'][j]),df_temp['Lat'][j],df_temp['Long_'][j],df_temp[i][j],datetime.datetime.strptime(i, "%m/%d/%y").strftime("%Y/%m/%d")]
        # print(temp)
        alltemp.append(temp)


# creat df for satscan
column_names = ['FIPS','Lat','Long', 'case','date']
df_cumulative = pd.DataFrame(alltemp,columns = column_names)

## 7 day rolling average
df_avg7 = df_cumulative
df_avg7["avg7"]= df_cumulative["case"]
avgdays = 7

## cal average cases
new_column_names = ["FIPS", "Lat", "Long", "case", "date","avg7","oldIndex"]
newdf = pd.DataFrame(columns = new_column_names) # create a new df
uniqueFIPS = df_avg7.FIPS.unique().tolist()

# avg 7 case
for fips in uniqueFIPS:
    df_test = df_avg7.loc[df_avg7['FIPS'] == fips]
    df_test['oldIndex'] = df_test.index
    df_test = df_test.reset_index(drop = True)
    sDate = df_test["date"][0]
    sDate_avg = (datetime.datetime.strptime(sDate, '%Y/%m/%d').date() + timedelta(days = avgdays )).strftime("%Y/%m/%d") #start days for avg
    start_index = df_test.index[df_test['date']==sDate_avg].tolist()[0]-1
    for i in range(start_index,len(df_test)):
        df_test['avg7'][i] = (df_test['case'][i]+df_test['case'][i-1]+df_test['case'][i-2]+df_test['case'][i-3]+df_test['case'][i-4]+df_test['case'][i-5]+df_test['case'][i-6])/7.0
    newdf = newdf.append(df_test)

newdf.set_index('oldIndex', inplace=True)
newdf = newdf.sort_index()

df_final = newdf
for i in range(0,len(df_final['avg7'])):
    if df_final['avg7'][i] < 0:
        df_final['avg7'][i] = 0
       # print(df_satscan['case'][i])


df_final.to_csv('/mnt/updateDaily/update.csv', index = False)

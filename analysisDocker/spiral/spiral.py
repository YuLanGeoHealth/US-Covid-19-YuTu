import pandas as pd

statename= pd.read_csv("/mnt/spiral/states.csv") #don't change this
rr = pd.read_csv("/mnt/spiral/rr.csv") #rr.csv for locations

datelist = rr["date"].unique().tolist()

state_avg_rr = pd.DataFrame(columns=['fips','date','RR','state','code'])
listavg =[]
for date in datelist:
  state = pd.DataFrame()
  state = rr[rr["date"] == date]
  for fips in statename["fips"]:
    min = fips*1000
    max = (fips+1)*1000
    state_name = statename[statename["fips"]==fips]["state"].values[0]
    state_code = statename[statename["fips"]==fips]["code"].values[0]
    n=0
    temprr = 0
    for id in state["ID"]:
      if id >min and id <max:
        temprr = rr[(rr["date"] == date)&(rr["ID"]==id)]["RR"].values[0] + temprr
        n = n+1
    rravg = temprr/n
    state_avg_rr.loc[len(state_avg_rr)] = [fips, date, rravg, state_name,state_code]

state_avg_rr.to_csv("/mnt/spiral/results.csv",index=False)
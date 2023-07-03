# %%
## source code of extract latest data from JSU github

import pandas as pd

df =pd.read_csv("update.csv")
dfnew = df[df['date']>"2022/08/15"]
dfnew.to_csv("latestupdate.csv",index=False)
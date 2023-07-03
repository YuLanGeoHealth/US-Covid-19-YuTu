import pandas as pd

dfrr = pd.read_csv("/mnt/3dvisu/allcluster.csv")
dfcoor = pd.read_csv("/mnt/3dvisu/uscounties.csv")

dfrr['id'] = dfrr['id'].astype(str)
dfcoor['id'] = dfcoor['id'].astype(str)

dfnew = pd.merge(dfrr,dfcoor, how="left", on="id")

dfnew.to_csv("/mnt/3dvisu/results_3d.csv", index=False)
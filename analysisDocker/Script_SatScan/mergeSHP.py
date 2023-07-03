# %%
import pandas as pd
import geopandas as gpd
import sys

# %%
STARTDATE = sys.argv[1]
ENDDATE = sys.argv[2]

fullname = STARTDATE.replace('-','')+ENDDATE.replace('-','')# %%

# %%
from pathlib import Path
shpname = '/mnt/results/'+'cluster_'+str(fullname)+'.shp'

folder = Path("/mnt/results/")
shapefiles = folder.glob("*col.shp")
gdf = pd.concat([
    gpd.read_file(shp)
    for shp in shapefiles
]).pipe(gpd.GeoDataFrame)
gdf.to_file(shpname)


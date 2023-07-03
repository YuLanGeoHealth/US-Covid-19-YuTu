# %%
### Generate satscan data and parameter files

# %%
# libs
import pandas as pd 
import sys
from datetime import datetime
from datetime import timedelta

timestamp = int(sys.argv[2])
date_time = datetime.fromtimestamp(timestamp)
var2 = datetime.strftime(date_time,"%Y-%m-%d")

ori = sys.argv[1]
ori_time =  datetime.strptime(ori,"%Y-%m-%d")


tempmax = 50 #max of temporal 
start_possible = date_time + timedelta(days = -tempmax) #make the start date within tempmax
print(start_possible)

if ori_time>=start_possible:
    var1 = start_possible
else:
    var1 = ori_time

var1 = datetime.strftime(var1,"%Y-%m-%d")
print (var1,"~~~", var2)

## User input parameters
# define a time range
startDate = var1
endDate = var2

directory = "/mnt/results/"
savedir = "/mnt/batch/"
# %%
## extract data according to time ##
df = pd.read_csv('/mnt/wizipcode/wi-zipcode_cases.csv')
fipslist = df.GEOID.unique().tolist()

## make sure the time range is consitents with interval
a = datetime.strptime(startDate, "%Y-%m-%d")
b = datetime.strptime(endDate, "%Y-%m-%d")

# %%

DataIncluded = []
timeRange = pd.date_range(startDate, endDate).to_pydatetime()
for i in timeRange:
    DataIncluded.append((str(int(i.strftime('%Y'))))+'-'+str(i.strftime('%m'))+'-'+str(i.strftime('%d')))


# %%

alltemp = df.loc[df['collect_date'].isin(DataIncluded)]

df_satscan = alltemp.reset_index(drop = True)

# %%
filename = endDate.replace('-', '')

folder = savedir +filename+'_'
prmdir = directory + filename+'_'
print(prmdir)
print(folder)
# %%
# output files for satscan: cas and geo
df_geo = df_satscan[['GEOID','lat','long']]
df_geo = df_geo.set_index('GEOID')

df_cas = df_satscan[['GEOID','case_avg7','collect_date']]
df_cas['case_avg7'] = df_cas['case_avg7'].astype(int)
df_cas = df_cas.set_index('GEOID')

df_pop = pd.read_csv('/mnt/wizipcode/wi-zipcode_pop.csv')
df_pop['d'] = 'unspecified'
df_pop = df_pop.reindex(['GEOID','d','pop_total'], axis=1)
df_pop = df_pop.loc[df_pop['GEOID'].isin(fipslist)]
df_pop = df_pop.set_index('GEOID')
df_pop.to_csv(folder+'pop.csv',sep = " ", header = False)


df_geo.to_csv(folder+'geo.csv',sep = " ", header = False)
df_cas.to_csv(folder+'case.csv',sep = " ", header = False)

# %%
# generate .prm for satscan
# [Input]
start_prm = str(datetime.strptime(startDate, "%Y-%m-%d").strftime("%Y/%m/%d"))
end_prm = str(datetime.strptime(endDate, "%Y-%m-%d").strftime("%Y/%m/%d"))
case = folder+'case.csv'
geo = folder+'geo.csv'
pop = folder+'pop.csv' 
input_text=f"[Input]\n \
;case data filename\n \
CaseFile={case}\n \
;control data filename\n \
ControlFile=\n \
;time precision (0=None, 1=Year, 2=Month, 3=Day, 4=Generic)\n \
PrecisionCaseTimes=3\n \
;study period start date (YYYY/MM/DD)\n \
StartDate={start_prm}\n \
;study period end date (YYYY/MM/DD)\n \
EndDate={end_prm}\n \
;population data filename\n \
PopulationFile={pop}\n \
;coordinate data filename\n \
CoordinatesFile={geo}\n \
;use grid file? (y/n)\n \
UseGridFile=n\n \
;grid data filename\n \
GridFile=\n \
;coordinate type (0=Cartesian, 1=latitude/longitude)\n \
CoordinatesType=1\n \
\n"

# print(input_text)

# %%
# [Analysis]
analysis_type = 4 #Prospective Space-Time (1-7)

analysis_text = f"[Analysis]\n \
;analysis type (1=Purely Spatial, 2=Purely Temporal, 3=Retrospective Space-Time, 4=Prospective Space-Time, 5=Spatial Variation in Temporal Trends, 6=Prospective Purely Temporal, 7=Seasonal Temporal)\n \
AnalysisType={analysis_type}\n \
;model type (0=Discrete Poisson, 1=Bernoulli, 2=Space-Time Permutation, 3=Ordinal, 4=Exponential, 5=Normal, 6=Continuous Poisson, 7=Multinomial, 8=Rank, 9=UniformTime)\n \
ModelType=0\n \
;scan areas (1=High Rates(Poison,Bernoulli,STP); High Values(Ordinal,Normal); Short Survival(Exponential); Higher Trend(Poisson-SVTT), 2=Low Rates(Poison,Bernoulli,STP); Low Values(Ordinal,Normal); Long Survival(Exponential); Lower Trend(Poisson-SVTT), 3=Both Areas)\n \
ScanAreas=1\n \
;time aggregation units (0=None, 1=Year, 2=Month, 3=Day, 4=Generic)\n \
TimeAggregationUnits=3\n \
;time aggregation length (Positive Integer)\n \
TimeAggregationLength={1}\n \
\n"

# print(analysis_text)

# %%
# [Output]
result_name = str(startDate.replace('-',''))+'-'+str(endDate.replace('-',''))+'a'+str(analysis_type)+'.txt'
outputdir = directory + result_name
output_text = f"[Output]\n \
;analysis main results output filename\n \
ResultsFile={outputdir}\n \
;output Google Earth KML file (y/n)\n \
OutputGoogleEarthKML=n\n \
;output shapefiles (y/n)\n \
OutputShapefiles=n\n \
;output cartesian graph file (y/n)\n \
OutputCartesianGraph=n\n \
;output cluster information in ASCII format? (y/n)\n \
MostLikelyClusterEachCentroidASCII=y\n \
;output cluster information in dBase format? (y/n)\n \
MostLikelyClusterEachCentroidDBase=y\n \
;output cluster case information in ASCII format? (y/n)\n \
MostLikelyClusterCaseInfoEachCentroidASCII=y\n \
;output cluster case information in dBase format? (y/n)\n \
MostLikelyClusterCaseInfoEachCentroidDBase=y\n \
;output location information in ASCII format? (y/n)\n \
CensusAreasReportedClustersASCII=y\n \
;output location information in dBase format? (y/n)\n \
CensusAreasReportedClustersDBase=y\n \
;output risk estimates in ASCII format? (y/n)\n \
IncludeRelativeRisksCensusAreasASCII=y\n \
;output risk estimates in dBase format? (y/n)\n \
IncludeRelativeRisksCensusAreasDBase=y\n \
;output simulated log likelihoods ratios in ASCII format? (y/n)\n \
SaveSimLLRsASCII=n\n \
;output simulated log likelihoods ratios in dBase format? (y/n)\n \
SaveSimLLRsDBase=n\n \
;generate Google Maps output (y/n)\n \
OutputGoogleMaps=n\n \
\n"

# print(output_text)

# %%
# others
other_text = f"[Multiple Data Sets]\n \
; multiple data sets purpose type (0=Multivariate, 1=Adjustment)\n \
MultipleDataSetsPurposeType=0\n \
\n \
[Data Checking]\n \
;study period data check (0=Strict Bounds, 1=Relaxed Bounds)\n \
StudyPeriodCheckType=0\n \
;geographical coordinates data check (0=Strict Coordinates, 1=Relaxed Coordinates)\n \
GeographicalCoordinatesCheckType=0\n \
\n \
[Locations Network]\n \
;locations network filename\n \
LocationsNetworkFilename=\n \
;use locations network file\n \
UseLocationsNetworkFile=n\n \
;purpose of locations network file (0=Coordinates File Override, 1=Network Definition)\n \
PurposeLocationsNetworkFile=1\n \
\n \
[Spatial Neighbors]\n \
;use neighbors file (y/n)\n \
UseNeighborsFile=n\n \
;neighbors file\n \
NeighborsFilename=\n \
;use meta locations file (y/n)\n \
UseMetaLocationsFile=n\n \
;meta locations file\n \
MetaLocationsFilename=\n \
;multiple coordinates type (0=OnePerLocation, 1=AtLeastOneLocation, 2=AllLocations)\n \
MultipleCoordinatesType=0\n \
\n \
[Spatial Window]\n \
;maximum spatial size in population at risk (<=50%)\n \
MaxSpatialSizeInPopulationAtRisk=50\n \
;restrict maximum spatial size - max circle file? (y/n)\n \
UseMaxCirclePopulationFileOption=n\n \
;maximum spatial size in max circle population file (<=50%)\n \
MaxSpatialSizeInMaxCirclePopulationFile=50\n \
;maximum circle size filename\n \
MaxCirclePopulationFile=\n \
;restrict maximum spatial size - distance? (y/n)\n \
UseDistanceFromCenterOption=n\n \
;maximum spatial size in distance from center (positive integer)\n \
MaxSpatialSizeInDistanceFromCenter=1\n \
;include purely temporal clusters? (y/n)\n \
IncludePurelyTemporal=n\n \
;window shape (0=Circular, 1=Elliptic)\n \
SpatialWindowShapeType=0\n \
;elliptic non-compactness penalty (0=NoPenalty, 1=MediumPenalty, 2=StrongPenalty)\n \
NonCompactnessPenalty=1\n \
;isotonic scan (0=Standard, 1=Monotone)\n \
IsotonicScan=0\n \
\n \
[Temporal Window]\n \
;minimum temporal cluster size (in time aggregation units)\n \
MinimumTemporalClusterSize=1\n \
;how max temporal size should be interpretted (0=Percentage, 1=Time)\n \
MaxTemporalSizeInterpretation=0\n \
;maximum temporal cluster size (<=90%)\n \
MaxTemporalSize={tempmax}\n \
;include purely spatial clusters? (y/n)\n \
IncludePurelySpatial=n\n \
;temporal clusters evaluated (0=All, 1=Alive, 2=Flexible Window)\n \
IncludeClusters=0\n \
;flexible temporal window start range (YYYY/MM/DD,YYYY/MM/DD)\n \
IntervalStartRange=2000/1/1,2000/12/31\n \
;flexible temporal window end range (YYYY/MM/DD,YYYY/MM/DD)\n \
IntervalEndRange=2000/1/1,2000/12/31\n \
\n \
[Cluster Restrictions]\n \
;risk limit high clusters (y/n)\n \
RiskLimitHighClusters=n\n \
;risk threshold high clusters (1.0 or greater)\n \
RiskThresholdHighClusters=1\n \
;risk limit low clusters (y/n)\n \
RiskLimitLowClusters=n\n \
;risk threshold low clusters (0.000 - 1.000)\n \
RiskThresholdLowClusters=1\n \
;minimum cases in low rate clusters (positive integer)\n \
MinimumCasesInLowRateClusters=0\n \
;minimum cases in high clusters (positive integer)\n \
MinimumCasesInHighRateClusters=2\n \
\n \
[Space and Time Adjustments]\n \
;time trend adjustment type (0=None, 2=LogLinearPercentage, 3=CalculatedLogLinearPercentage, 4=TimeStratifiedRandomization, 5=CalculatedQuadratic, 1=TemporalNonparametric)\n \
TimeTrendAdjustmentType=0\n \
;time trend adjustment percentage (>-100)\n \
TimeTrendPercentage=0\n \
;time trend type - SVTT only (Linear=0, Quadratic=1)\n \
TimeTrendType=0\n \
;adjust for weekly trends, nonparametric\n \
AdjustForWeeklyTrends=n\n \
;spatial adjustments type (0=None, 1=SpatiallyStratifiedRandomization, 2=SpatialNonparametric)\n \
SpatialAdjustmentType=0\n \
;use adjustments by known relative risks file? (y/n)\n \
UseAdjustmentsByRRFile=n\n \
;adjustments by known relative risks file name (with HA Randomization=1)\n \
AdjustmentsByKnownRelativeRisksFilename=\n \
\n \
[Inference]\n \
;p-value reporting type (Default p-value=0, Standard Monte Carlo=1, Early Termination=2, Gumbel p-value=3)\n \
PValueReportType=0\n \
;early termination threshold\n \
EarlyTerminationThreshold=50\n \
;report Gumbel p-values (y/n)\n \
ReportGumbel=n\n \
;Monte Carlo replications (0, 9, 999, n999)\n \
MonteCarloReps=999\n \
;adjust for earlier analyses(prospective analyses only)? (y/n)\n \
AdjustForEarlierAnalyses=n\n \
;prospective surveillance start date (YYYY/MM/DD)\n \
ProspectiveStartDate=2000/12/31\n \
;perform iterative scans? (y/n)\n \
IterativeScan=n\n \
;maximum iterations for iterative scan (0-32000)\n \
IterativeScanMaxIterations=10\n \
;max p-value for iterative scan before cutoff (0.000-1.000)\n \
IterativeScanMaxPValue=0.05\n \
\n \
[Cluster Drilldown]\n \
;perform detected cluster standard drilldown (y/n)\n \
PerformStandardDrilldown=n\n \
;perform detected cluster Bernoulli drilldown (y/n)\n \
PerformBernoulliDrilldown=n\n \
;minimum number of locations in detected cluster to perform drilldown (positive integer)\n \
DrilldownMinimumClusterLocations=2\n \
;minimum number of cases in detected cluster to perform drilldown (positive integer)\n \
DrilldownMinimumClusterCases=10\n \
;p-value cutoff of detected cluster to perform drilldown (0.000-1.000)\n \
DrilldownClusterPvalueCutoff=0.05\n \
;adjust for weekly trends, purely spatial Bernoulli drilldown\n \
DrilldownAdjustForWeeklyTrends=n\n \
\n \
[Miscellaneous Analysis]\n \
;calculate Oliveira's F\n \
CalculateOliveira=n\n \
;number of bootstrap replications for Oliveira calculation (minimum=100, multiple of 100)\n \
NumBootstrapReplications=1000\n \
;p-value cutoff for cluster's in Oliveira calculation (0.000-1.000)\n \
OliveiraPvalueCutoff=0.05\n \
;frequency of prospective analyses type (0=Same Time Aggregation, 1=Daily, 2=Weekly, 3=Monthy, 4=Quarterly, 5=Yearly)\n \
ProspectiveFrequencyType=0\n \
;frequency of prospective analyses  (positive integer)\n \
ProspectiveFrequency=1\n \
\n \
[Power Evaluation]\n \
;perform power evaluation - Poisson only (y/n)\n \
PerformPowerEvaluation=n\n \
;power evaluation method (0=Analysis And Power Evaluation Together, 1=Only Power Evaluation With Case File, 2=Only Power Evaluation With Defined Total Cases)\n \
PowerEvaluationsMethod=0\n \
;total cases in power evaluation\n \
PowerEvaluationTotalCases=600\n \
;critical value type (0=Monte Carlo, 1=Gumbel, 2=User Specified Values)\n \
CriticalValueType=0\n \
;power evaluation critical value .05 (> 0)\n \
CriticalValue05=0\n \
;power evaluation critical value .001 (> 0)\n \
CriticalValue01=0\n \
;power evaluation critical value .001 (> 0)\n \
CriticalValue001=0\n \
;power estimation type (0=Monte Carlo, 1=Gumbel)\n \
PowerEstimationType=0\n \
;number of replications in power step\n \
NumberPowerReplications=1000\n \
;power evaluation alternative hypothesis filename\n \
AlternativeHypothesisFilename=\n \
;power evaluation simulation method for power step (0=Null Randomization, 1=N/A, 2=File Import)\n \
PowerEvaluationsSimulationMethod=0\n \
;power evaluation simulation data source filename\n \
PowerEvaluationsSimulationSourceFilename=\n \
;report power evaluation randomization data from power step (y/n)\n \
ReportPowerEvaluationSimulationData=n\n \
;power evaluation simulation data output filename\n \
PowerEvaluationsSimulationOutputFilename=\n \
\n \
[Spatial Output]\n \
;automatically launch map viewer - gui only (y/n)\n \
LaunchMapViewer=n\n \
;create compressed KMZ file instead of KML file (y/n)\n \
CompressKMLtoKMZ=n\n \
;whether to include cluster locations kml output (y/n)\n \
IncludeClusterLocationsKML=y\n \
;threshold for generating separate kml files for cluster locations (positive integer)\n \
ThresholdLocationsSeparateKML=1000\n \
;report hierarchical clusters (y/n)\n \
ReportHierarchicalClusters=y\n \
;criteria for reporting secondary clusters(0=NoGeoOverlap, 1=NoCentersInOther, 2=NoCentersInMostLikely,  3=NoCentersInLessLikely, 4=NoPairsCentersEachOther, 5=NoRestrictions)\n \
CriteriaForReportingSecondaryClusters=0\n \
;report gini clusters (y/n)\n \
ReportGiniClusters=n\n \
;gini index cluster reporting type (0=optimal index only, 1=all values)\n \
GiniIndexClusterReportingType=0\n \
;spatial window maxima stops (comma separated decimal values[<=50%] )\n \
SpatialMaxima=1,2,3,4,5,6,8,10,12,15,20,25,30,40,50\n \
;max p-value for clusters used in calculation of index based coefficients (0.000-1.000)\n \
GiniIndexClustersPValueCutOff=0.05\n \
;report gini index coefficents to results file (y/n)\n \
ReportGiniIndexCoefficents=n\n \
;restrict reported clusters to maximum geographical cluster size? (y/n)\n \
UseReportOnlySmallerClusters=n\n \
;maximum reported spatial size in population at risk (<=50%)\n \
MaxSpatialSizeInPopulationAtRisk_Reported=50\n \
;restrict maximum reported spatial size - max circle file? (y/n)\n \
UseMaxCirclePopulationFileOption_Reported=n\n \
;maximum reported spatial size in max circle population file (<=50%)\n \
MaxSizeInMaxCirclePopulationFile_Reported=50\n \
;restrict maximum reported spatial size - distance? (y/n)\n \
UseDistanceFromCenterOption_Reported=n\n \
;maximum reported spatial size in distance from center (positive integer)\n \
MaxSpatialSizeInDistanceFromCenter_Reported=1\n \
\n \
[Temporal Output]\n \
;output temporal graph HTML file (y/n)\n \
OutputTemporalGraphHTML=n\n \
;temporal graph cluster reporting type (0=Only most likely cluster, 1=X most likely clusters, 2=Only significant clusters)\n \
TemporalGraphReportType=0\n \
;number of most likely clusters to report in temporal graph (positive integer)\n \
TemporalGraphMostMLC=1\n \
;significant clusters p-value cutoff to report in temporal graph (0.000-1.000)\n \
TemporalGraphSignificanceCutoff=0.05\n \
\n \
[Other Output]\n \
;report critical values for .01 and .05? (y/n)\n \
CriticalValue=n\n \
;report cluster rank (y/n)\n \
ReportClusterRank=n\n \
;print ascii headers in output files (y/n)\n \
PrintAsciiColumnHeaders=n\n \
;user-defined title for results file\n \
ResultsTitle=\n \
\n \
[Elliptic Scan]\n \
;elliptic shapes - one value for each ellipse (comma separated decimal values)\n \
EllipseShapes=1.5,2,3,4,5\n \
;elliptic angles - one value for each ellipse (comma separated integer values)\n \
EllipseAngles=4,6,9,12,15\n \
\n \
[Power Simulations]\n \
;simulation methods (0=Null Randomization, 1=N/A, 2=File Import)\n \
SimulatedDataMethodType=0\n \
;simulation data input file name (with File Import=2)\n \
SimulatedDataInputFilename=\n \
;print simulation data to file? (y/n)\n \
PrintSimulatedDataToFile=n\n \
;simulation data output filename\n \
SimulatedDataOutputFilename=\n \
\n \
[Run Options]\n \
;number of parallel processes to execute (0=All Processors, x=At Most X Processors)\n \
NumberParallelProcesses=0\n \
;suppressing warnings? (y/n)\n \
SuppressWarnings=n\n \
;log analysis run to history file? (y/n)\n \
LogRunToHistoryFile=n\n \
;analysis execution method  (0=Automatic, 1=Successively, 2=Centrically)\n \
ExecutionType=0\n \
\n \
[System]\n \
;system setting - do not modify\n \
Version=10.0.0"

# %%
prm_file = open(folder+'.prm','w')
prm_file.write(input_text + output_text + analysis_text + other_text)
prm_file.close()



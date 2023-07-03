// https://observablehq.com/@randomfractals/vega-datasets@224
import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Vega Datasets

List of [vega-datasets](https://github.com/vega/vega-datasets) used in
[Vega](https://github.com/vega/vega/tree/master/docs/examples) and 
[Vega-Lite](https://github.com/vega/vega-lite/tree/master/examples/specs) examples for data preview.

This notebook 📓 uses [d3-fetch](https://github.com/d3/d3-fetch) to fetch selected dataset and
[fin-hypergrid](https://github.com/fin-hypergrid/core) high performance canvas-based grid renderer 
for fast data display and scrolling.

**Note**: this data preview utility 🛠️ notebook 📓 can be used to preview any public online
[Apache Arrow](https://observablehq.com/@randomfractals/apache-arrow), 
**csv** or **json** array data. Just paste your data url to fetch it ;)
`
)}

function _dataSet(select,dataSets){return(
select({
  title: 'dataset',
  description: 'select dataset to fetch',
  options: dataSets
})
)}

function _dataUrl(text,dataParam,baseUrl,dataSet){return(
text({
  placeholder: 'type data url and click fetch', 
  description: 'data url to fetch',
  value: `${dataParam ? dataParam : baseUrl + dataSet}`,
  submit: 'fetchData'})
)}

function _shareLink(md,dataUrl){return(
md `*share a link to your [data](https://observablehq.com/@randomfractals/vega-datasets?data=${dataUrl})*`
)}

function _data(fetchData,dataUrl){return(
fetchData(dataUrl)
)}

function _6(html){return(
html `<div id="grid"></div>`
)}

function _dataGrid(Hypergrid){return(
new Hypergrid(document.querySelector('div#grid'), {data: []})
)}

function _8(showData,data,dataGrid){return(
showData(data, dataGrid)
)}

function _9(md){return(
md `## Styles`
)}

function _styles(html){return(
html`
<style>
input[type="text"] {
  width: 700px;
}
#grid {
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid #666;
}
<style>
`
)}

function _11(md){return(
md `## Data`
)}

function _dataParam(URLSearchParams,html){return(
new URLSearchParams(html`<a href>`.search).get('data')
)}

function _baseUrl(){return(
'https://raw.githubusercontent.com/vega/vega-datasets/master/data/'
)}

function _dataSets(){return(
['airports.csv', 'co2-concentration.csv', 'disasters.csv', 'flights-3m.csv', 'flights-airport.csv',
           'gapminder-health-income.csv', 'github.csv', 'iowa-electricity.csv', 'la-riots.csv', 'lookup_groups.csv',
           'lookup_people.csv', 'population_engineers_hurricanes.csv', 'seattle-temps.csv', 'seattle-weather.csv',
           'sf-temps.csv', 'sp500.csv', 'stocks.csv', 'us-employment.csv', 'weather.csv', 'windvectors.csv', 'zipcodes.csv',
           'barley.json', 'birdstrikes.json', 'budget.json', 'budgets.json', 'burtin.json', 'cars.json', 'climate.json',
           'countries.json', 'crimea.json', 'driving.json', 'flare-dependencies.json', 'flare.json', 
           'flights-2k.json', 'flights-5k.json', 'flights-10k.json', 'flights-20k.json', 
           'flights-200k.json', 'flights-200k.arrow',
           'gapminder.json', 'income.json', 'iris.json', 'jobs.json', 'londonCentroids.json',
           'monarchs.json', 'movies.json', 'normal-2d.json', 'points.json',
           'udistrict.json', 'unemployment-across-industries.json', 'us-state-capitals.json',
           'weball26.json', 'wheat.json']
)}

function _fetchData(d3Fetch,loadArrowData){return(
async function fetchData(dataUrl) {
  let data = [];
  console.log('fetchData:dataUrl:', dataUrl);
  if (dataUrl.endsWith('.csv')) {
    data = await d3Fetch.csv(dataUrl);
  } 
  else if (dataUrl.endsWith('.json')) {
    data = await d3Fetch.json(dataUrl);
  }
  else if (dataUrl.endsWith('.arrow')) {
    data = loadArrowData(dataUrl);
  }
  return data;
}
)}

function _loadArrowData(arrow){return(
async function loadArrowData(dataUrl){
  const response = await fetch(dataUrl);
  const arrayBuffer = await response.arrayBuffer();
  const table = arrow.Table.from(new Uint8Array(arrayBuffer));
  const rows = Array(table.length);
  const fields = table.schema.fields.map(d => d.name);  
  for (let i=0, n=rows.length; i<n; ++i) {
    const proto = {};
    fields.forEach((fieldName, index) => {
      const column = table.getColumnAt(index);
      proto[fieldName] = column.get(i);
    });
    rows[i] = proto;
  }
  return rows;
}
)}

function _showData(){return(
function showData(data, grid) {
  grid.reset();
  grid.setData({data: data});
  grid.behaviorChanged();
  grid.repaint();
  return grid;
}
)}

function _18(md){return(
md `## Imports`
)}

function _d3Fetch(require){return(
require("d3-fetch@1.1.2")
)}

function _Hypergrid(require){return(
require('https://fin-hypergrid.github.io/core/3.2.1/build/fin-hypergrid.js').catch(() => window.fin.Hypergrid)
)}

function _arrow(require){return(
require('apache-arrow@0.4.1')
)}

function _outro(md){return(
md `## Outro

See online [Vega Editor Examples](https://vega.github.io/editor/#/examples) or get
[Vega Viewer](https://twitter.com/TarasNovak/status/1123973629635629056) vscode extention I created to play with these data sets and Vega **json** specs for maps 🗺️ & graphs 📈 🤗
`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof dataSet")).define("viewof dataSet", ["select","dataSets"], _dataSet);
  main.variable(observer("dataSet")).define("dataSet", ["Generators", "viewof dataSet"], (G, _) => G.input(_));
  main.variable(observer("viewof dataUrl")).define("viewof dataUrl", ["text","dataParam","baseUrl","dataSet"], _dataUrl);
  main.variable(observer("dataUrl")).define("dataUrl", ["Generators", "viewof dataUrl"], (G, _) => G.input(_));
  main.variable(observer("shareLink")).define("shareLink", ["md","dataUrl"], _shareLink);
  main.variable(observer("data")).define("data", ["fetchData","dataUrl"], _data);
  main.variable(observer()).define(["html"], _6);
  main.variable(observer("dataGrid")).define("dataGrid", ["Hypergrid"], _dataGrid);
  main.variable(observer()).define(["showData","data","dataGrid"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("styles")).define("styles", ["html"], _styles);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("dataParam")).define("dataParam", ["URLSearchParams","html"], _dataParam);
  main.variable(observer("baseUrl")).define("baseUrl", _baseUrl);
  main.variable(observer("dataSets")).define("dataSets", _dataSets);
  main.variable(observer("fetchData")).define("fetchData", ["d3Fetch","loadArrowData"], _fetchData);
  main.variable(observer("loadArrowData")).define("loadArrowData", ["arrow"], _loadArrowData);
  main.variable(observer("showData")).define("showData", _showData);
  main.variable(observer()).define(["md"], _18);
  const child1 = runtime.module(define1);
  main.import("select", child1);
  main.import("text", child1);
  main.variable(observer("d3Fetch")).define("d3Fetch", ["require"], _d3Fetch);
  main.variable(observer("Hypergrid")).define("Hypergrid", ["require"], _Hypergrid);
  main.variable(observer("arrow")).define("arrow", ["require"], _arrow);
  main.variable(observer("outro")).define("outro", ["md"], _outro);
  return main;
}

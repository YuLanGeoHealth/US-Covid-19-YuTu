// https://observablehq.com/@d3/moving-average@184
function _1(md,N){return(
md`# Moving Average

${N}-day moving average of homicides per day. Data: [City of Chicago](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2)`
)}

function _N(html)
{
  const form = html`<form>
  <input name=i type=number min=1 max=365 value=100 step=1 style="width:40px;">
  <span style="font-size:smaller;font-style:oblique;">days (N)</span>
</form>`;
  form.i.oninput = () => form.value = form.i.valueAsNumber;
  form.i.oninput();
  return form;
}


function _chart(d3,width,height,xAxis,yAxis,area,values)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);
  
  svg.append("g")
      .call(yAxis);

  svg.append("path")
      .attr("fill", "steelblue")
      .attr("d", area(values));

  return svg.node();
}


function _movingAverage(){return(
function movingAverage(values, N) {
  let i = 0;
  let sum = 0;
  const means = new Float64Array(values.length).fill(NaN);
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
    sum += values[i];
  }
  for (let n = values.length; i < n; ++i) {
    sum += values[i];
    means[i] = sum / N;
    sum -= values[i - N + 1];
  }
  return means;
}
)}

function _values(movingAverage,bins,N){return(
movingAverage(bins.map(d => d.length), N)
)}

async function _data(d3,FileAttachment,parseDate){return(
d3.csvParse(await FileAttachment("chicago-homicide-dates.csv").text(), ({date}) => parseDate(date))
)}

function _parseDate(d3){return(
d3.timeParse("%m/%d/%Y %I:%M:%S %p")
)}

function _bins(d3,x,data){return(
d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(d3.timeDay))
  (data)
)}

function _area(d3,x,bins,y){return(
d3.area()
    .defined(d => !isNaN(d))
    .x((d, i) => x(bins[i].x0))
    .y0(y(0))
    .y1(y)
)}

function _x(d3,data,margin,width){return(
d3.scaleTime()
    .domain(d3.extent(data))
    .range([margin.left, width - margin.right])
)}

function _y(d3,values,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(values)]).nice()
    .rangeRound([height - margin.bottom, margin.top])
)}

function _xAxis(height,margin,d3,x){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
)}

function _yAxis(margin,d3,y,width){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.1))
)}

function _height(){return(
500
)}

function _margin(){return(
{top: 20, right: 12, bottom: 30, left: 30}
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["chicago-homicide-dates.csv", {url: new URL("./files/8271ea93a0683bf205b173733f35ecd232a405e45dbd70fa5b4ef239ec7855d0b3596c721a0d84e68e8aab1a9a45b76d78eb37dd198e98e668588d5a527e592d", import.meta.url), mimeType: null, toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md","N"], _1);
  main.variable(observer("viewof N")).define("viewof N", ["html"], _N);
  main.variable(observer("N")).define("N", ["Generators", "viewof N"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","area","values"], _chart);
  main.variable(observer("movingAverage")).define("movingAverage", _movingAverage);
  main.variable(observer("values")).define("values", ["movingAverage","bins","N"], _values);
  main.variable(observer("data")).define("data", ["d3","FileAttachment","parseDate"], _data);
  main.variable(observer("parseDate")).define("parseDate", ["d3"], _parseDate);
  main.variable(observer("bins")).define("bins", ["d3","x","data"], _bins);
  main.variable(observer("area")).define("area", ["d3","x","bins","y"], _area);
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], _x);
  main.variable(observer("y")).define("y", ["d3","values","height","margin"], _y);
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","width"], _yAxis);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}

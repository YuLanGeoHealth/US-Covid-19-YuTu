// https://observablehq.com/@ylan1/animated-bivariate-map-of-covid-19-2021@992
import define1 from "./450051d7f1174df8@254.js";
import define2 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md
`# Animated Bivariate Map of COVID-19 2020~2022`
)}

function _2(md){return(
md
`This map shows the bivariate map of relative risk of cluster and relative risk of county. The value of two variables are ranged from lowest, low, medium to high. You can hover the county to get details.`
)}

function _colors(html,schemes)
{
  const form = html`<form style="display: flex; align-items: center; min-height: 33px; font: 12px sans-serif;"><label><select name=i>${schemes.map(c => Object.assign(html`<option>`, {textContent: c.name}))}</select><span style="margin-left: 0.5em;">color scheme</span></label></form>`;
  form.i.selectedIndex = 1;
  form.oninput = () => form.value = schemes[form.i.selectedIndex].colors;
  form.oninput();
  return form;
}


function _date(Scrubber,dates,d3){return(
Scrubber(dates.map(x => d3.timeParse("%Y-%m-%d")(x)), {
  autoplay: false,
  loop: false,
  delay: 100,
  format: date => date.toLocaleString("en", {month: "long", day: "numeric",year:"numeric"})
})
)}

function _map(d3,DOM,topojson,us,color,data,dateToString,date,states,format,legend)
{
 const width = 1200
  const height = 600
  const margin = 10


 // create SVG element
  let svg = d3.select(DOM.svg(width, height));
     
  const path = d3.geoPath();

    // Add the text box for State
  svg.append("text")
    .attr("x", margin*14)
    .attr("y",height-30)
    .attr("dy", ".35em")
    .text();
  
  const aa = svg.append("g");
  const countyMap = aa.append("g")
    .attr("transform","translate("+margin+","+margin+")")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
      .attr("fill", d => color(data.get(d.id+" "+dateToString(date))))
      .attr("d", path)
    .on("mouseover", function(d) {
  d3.select(this)
    .attr("stroke" , "orange")
})
        .on("mouseout", function(d) {
  d3.select(this)
    .attr("stroke" , "null")
})
      .on('click', function(e, d) {
    d3.selectAll("path")
        .style('stroke', null);
      d3.select(this)
      .style('stroke', 'orange');
         svg.select("text").text(`${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}, ID: ${d.id}`);
  })
    .append("title")
    .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
${format(data.get(d.id+" "+ dateToString(date)))}`);

  svg.append(legend)
    .attr("transform", "translate(100,500)");
      //.attr("transform", "translate(870,450)");
  
aa.append("path")
    .attr("transform","translate("+margin+","+margin+") ")
      //.datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));
  
  // Update the fill based on date scrubber
  function update(date) {
      countyMap.attr("fill", function(d) {
        var fclass = data.get(d.id+" "+dateToString(date));
       //console.log(d.id+" "+dateToString(date))
        //console.log(fclass)
        //console.log(data.get(d.id+" "+dateToString(date)))
        //if (fclass) {
       //   var fcolor = color(fclass);
       // } else {
        //  var fcolor = "#cccc";
       // }
      //  return fcolor ;

      });
   }
var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', zoomed);
  
  function zoomed(event) {
    const {transform} = event;
    aa.attr("transform", transform);
    aa.attr("stroke-width", 1 / transform.k);
  }
  
aa.call(zoom);
  
  
  //return svg.node();
  return Object.assign(svg.node(), {update});
}


function _legend(DOM,svg,n,d3,colors,data,labelsRR,labels){return(
() => {
  const k = 24;
  const arrow = DOM.uid();
  return svg`<g font-family=sans-serif font-size=10>
  <g transform="translate(-${k * n / 2},-${k * n / 2}) rotate(-45 ${k * n / 2},${k * n / 2})">
    <marker id="${arrow.id}" markerHeight=10 markerWidth=10 refX=6 refY=3 orient=auto>
      <path d="M0,0L9,3L0,6Z" />
    </marker>
    ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => svg`<rect width=${k} height=${k} x=${i * k} y=${(n - 1 - j) * k} fill=${colors[j * n + i]}>
      <title>${data.title[0]}${ labelsRR[j]&&` (${labelsRR[j]})`  }
${data.title[1]}${labels[i] && ` (${labels[i]})`}</title>
    </rect>`)}
    <line marker-end="${arrow}" x1=0 x2=${n * k} y1=${n * k} y2=${n * k} stroke=black stroke-width=1.5 />
    <line marker-end="${arrow}" y2=0 y1=${n * k} stroke=black stroke-width=1.5 />
    <text font-weight="bold" dy="0.71em" transform="rotate(90) translate(${n / 2 * k},6)" text-anchor="middle">${data.title[0]}</text>
    <text font-weight="bold" dy="0.71em" transform="translate(${n / 2 * k},${n * k + 6})" text-anchor="middle">${data.title[1]}</text>
  </g>
</g>`;
}
)}

function _7(md){return(
md
`## Data
Load the case data, county JSON file, and state JSON file. Create an array of dates for the data scrubber.`
)}

async function _datestest(d3)
{
  const data = await d3.csv("https://raw.githubusercontent.com/YuLan1014/covid/main/allcluster.csv", d => {
    return d.date;
  });
  return [...new Set(data)];
}


async function _dates(FileAttachment)
{
  const data = await FileAttachment("allcluster.csv").csv();
  var dd = data.map(function(d) { return d.date; });
   return [...new Set(dd)];

}


async function _rrmap(FileAttachment)
{
  const testww = await FileAttachment("allcluster.csv").csv();
 return new Map(testww.map(({id,rr_c,rr_l,date}) => [(id+ " "+date), [+rr_c, +rr_l]]))
 }


function _data(rrmap){return(
Object.assign( 
rrmap
,{title: ["RR of cluster", "RR of county"]},)
)}

async function _datatest(d3){return(
Object.assign(new Map(
  // await d3.csv("https://raw.githubusercontent.com/YuLan1014/covid/main/allgis_res_2021.csv", ({ID,RR_C,RR_L,date}) => [(ID+ " "+date), [+RR_C, +RR_L]])), 
                       await d3.csv("https://raw.githubusercontent.com/YuLan1014/covid/main/allcluster.csv", ({id,rr_c,rr_l,date}) => [(id+ " "+date), [+rr_c, +rr_l]])), 
                     {title: ["RR of cluster", "RR of county"]}
                    )
)}

function _labelsRR(){return(
["Group 1", "Group 2","Group 3", "Group 4"]
)}

function _labels(){return(
["Group 1", "Group 2","Group 3", "Group 4"]
)}

function _n(colors){return(
Math.floor(Math.sqrt(colors.length))
)}

function _x(d3,data,n){return(
d3.scaleQuantile(Array.from(data.values(), d => d[0]), d3.range(n))
)}

function _y(d3,data,n){return(
d3.scaleQuantile(Array.from(data.values(), d => d[1]), d3.range(n))
)}

function _path(d3){return(
d3.geoPath()
)}

function _color(colors,y,x,n)
{
  return value => {
    if (!value) return "#ccc";
    let [a, b] = value;
    return colors[y(b) + x(a) * n];
  };
}


function _21(md){return(
md
`## D3 Setup
Setup some useful D3 items. The \`\`color\`\` function will be used to map cases to the associated quantile color. The \`\`path\`\` and \`\`projection\`\` functions are needed for mapping the JSON data.
`
)}

function _format(data,labelsRR,x,labels,y){return(
(value) => {
  if (!value) return "N/A";
  let [a, b] = value;
  return `${data.title[0]} ${a} ${labelsRR[x(a)] && ` (${labelsRR[x(a)]})`}
${data.title[1]} ${b} ${labels[y(b)] && ` (${labels[y(b)]})`}`;
}
)}

function _schemes(){return(
[
  {
    name: "RdBu", 
    colors: [
      "#D3CFE6", "#A5BEDB", "#76ADD0","#489CC5",
      "#D0A2CE", "#A395C5", "#7588BA","#477AB1",
      "#CD74B5", "#A06BAD", "#7361A4","#46589C",
      "#CA479E", "#9E4196", "#713B8F","#453687"
    ]
  },
    {
    name: "RdBu", 
    colors: [
      "#D3CFE6", "#A5BEDB", "#76ADD0","#489CC5",
      "#D0A2CE", "#A395C5", "#7588BA","#477AB1",
      "#CD74B5", "#A06BAD", "#7361A4","#46589C",
      "#CA479E", "#9E4196", "#713B8F","#453687"
    ]
  }
]
)}

function _states(us){return(
new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
)}

function _us(FileAttachment){return(
FileAttachment("counties-albers-10m@9.json").json()
)}

function _topojson(require){return(
require("topojson-client@3")
)}

function _d3(require){return(
require("d3@6")
)}

function _33(md){return(
md
` ## Import Useful Tools
Import legend and date scrubber from Mike Bostok, and a general purpose slider from Jeremy Ashkenas.
`
)}

function _37(md){return(
md
`## Helper Functions
Helper function to convert JS dates to format used in the data
`
)}

function _dateToString(){return(
function dateToString(date) {
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
}
)}

function _39(md){return(
md
`## Canvas Properties
Set canvas properties, update behavior, and load D3.
`
)}

function _width(){return(
500
)}

function _height(){return(
400
)}

function _update(map,date){return(
map.update(date)
)}

function _43(md){return(
md
`## References

1. Animated Map of COVID-19 Cases:
https://observablehq.com/@onoratod/animated-map-of-covid-19-cases

2. Bivariate Choropleth:
https://observablehq.com/@d3/bivariate-choropleth
`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["counties-albers-10m@9.json", {url: new URL("./files/e006bc50810dbc00e9b0f0af7920c1b1a08a10d5983220090195290a1fbb112e3552eb5298206c9334b0468cf1b427969b5d18ddcd4b77665df2b675ef128bd6.json", import.meta.url), mimeType: "application/json", toString}],
    ["allcluster.csv", {url: new URL("../data/allcluster.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof colors")).define("viewof colors", ["html","schemes"], _colors);
  main.variable(observer("colors")).define("colors", ["Generators", "viewof colors"], (G, _) => G.input(_));
  main.variable(observer("viewof date")).define("viewof date", ["Scrubber","dates","d3"], _date);
  main.variable(observer("date")).define("date", ["Generators", "viewof date"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["d3","DOM","topojson","us","color","data","dateToString","date","states","format","legend"], _map);
  main.variable(observer("legend")).define("legend", ["DOM","svg","n","d3","colors","data","labelsRR","labels"], _legend);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("datestest")).define("datestest", ["d3"], _datestest);
  main.variable(observer("dates")).define("dates", ["FileAttachment"], _dates);
  main.variable(observer("rrmap")).define("rrmap", ["FileAttachment"], _rrmap);
  main.variable(observer("data")).define("data", ["rrmap"], _data);
  main.variable(observer("datatest")).define("datatest", ["d3"], _datatest);
  main.variable(observer("labelsRR")).define("labelsRR", _labelsRR);
  main.variable(observer("labels")).define("labels", _labels);
  main.variable(observer("n")).define("n", ["colors"], _n);
  main.variable(observer("x")).define("x", ["d3","data","n"], _x);
  main.variable(observer("y")).define("y", ["d3","data","n"], _y);
  main.variable(observer("path")).define("path", ["d3"], _path);
  main.variable(observer("color")).define("color", ["colors","y","x","n"], _color);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("format")).define("format", ["data","labelsRR","x","labels","y"], _format);
  main.variable(observer("schemes")).define("schemes", _schemes);
  main.variable(observer("states")).define("states", ["us"], _states);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer()).define(["md"], _33);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("slider", child2);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("dateToString")).define("dateToString", _dateToString);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("update")).define("update", ["map","date"], _update);
  main.variable(observer()).define(["md"], _43);
  return main;
}

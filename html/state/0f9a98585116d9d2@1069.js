import define1 from "./450051d7f1174df8@254.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./914e43ec3e9f41dc@893.js";
import define4 from "./8d271c22db968ab0@160.js";

function _1(md){return(
md
`# Animated Bivariate Map & Time Spiral Map of COVID-19 2021`
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


function _options(form,html){return(
form(html`<form style="font-size: 12pt">
COVID: <label for="cases"><input name="field" id="cases" type="radio" value="cases" group="f" checked>Relative Risk</label><BR>
Align:
<select name="align">
<option value="center">Center</option>
<option value="base">Base</option>
</select>
&nbsp;Layers:
<select name="layers">
<option value="2">2</option>
<option value="3" selected>3</option>
<option value="4">4</option>
</select>
&nbsp;Color Scheme:
<select name="scheme">
<option value="OrRd">OrRd</option>
<option value="YlGnBu">YlGnBu</option>
<option value="RdPu">RdPu</option>
</select>
<div style="font-size:10pt;font-style:italic">Click a state to lock or switch the highlight. Click the same state again or empty space to release the focus.</div>
</form>`)
)}

function _date(Scrubber,dates,d3){return(
Scrubber(dates.map(x => d3.timeParse("%Y-%m-%d")(x)), {
  autoplay: false,
  loop: false,
  delay: 100,
  format: date => date.toLocaleString("en", {month: "long", day: "numeric",year:"numeric"})
})
)}

function _map(d3,DOM,topojson,us,color,data,dateToString,date,states,format,legend,options,diameter,getStatesNumber,days,GridMap,map_spiral,TimeSpiral,data_spiral)
{
  const width = 1200
  const height = 500
  const margin = 10


 // create SVG element
  let svg = d3.select(DOM.svg(width, height));
     //.style("background", options.theme === "dark" ? "#2e2e2e" : "#e0e0e0");
  const path = d3.geoPath();

    // Add the text box for State
  svg.append("text")
    .attr("x",  width/3)
    .attr("y",height-30)
    .attr("dy", ".35em")
    .text();
 
  const bim = svg.append("g");

  var countyMap = bim.append("g")
   .attr("transform","translate("+margin/2+","+margin+") scale(0.7)")
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
      svg.select("text").text(`${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}, ID: ${d.id}`)
        handleClick_bi(d);
        //handleClick;
  })
    .append("title")
    .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
${format(data.get(d.id+" "+ dateToString(date)))}`);
  
  bim.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("transform","translate("+margin/2+","+margin+") scale(0.7)")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

    
  svg.append(legend)
    .attr("transform",  "translate("+ 9*margin +","+ 42*margin +")");
      //.attr("transform", "translate(870,450)");
  
  // Update the fill based on date scrubber
  function update(date) {
      countyMap.attr("fill", function(d) {
        var fclass = data.get(d.id+" "+dateToString(date));
      });

   }


  //spiral map
    var focus;

  var spiralMap = svg.append("g")
    .attr("width", width/2)
   .attr("transform","translate("+ (width/2+margin*2) +","+ "0) scale(0.7)")
    .style("cursor", "default")
    //.style("max-width", "100%")
    .on("click", () => focus = null);


  // TimeSpiral needs getBBox()
// document.body.append(svg.node());
  
  const p = options.scheme === "OrRd" ? 
        d3.interpolateOrRd : 
        options.scheme === "YlGnBu" ? d3.interpolateYlGnBu : d3.interpolateRdPu;

  // Mini cartogram    
  const mapSize = diameter / 4.2, mg = spiralMap.append("g");
  let dataset = getStatesNumber(options.field, days - 1);
  // midnight issue
  if (!dataset || dataset.length === 0)
    dataset = getStatesNumber(options.field, days - 2);
  
  const gmap = new GridMap(mg)
    .size([mapSize, mapSize])                
    .style({
      shape: "square",
      sizeByValue: false,
      showOverlay: false,
      showMapLegend: false,
      showCellText: false
    })    
    .field({name: "state", code: "code", total: "number"})
    .cellPalette(p)
    .mapGrid(map_spiral)
    .data(dataset)
    .onClick(handleClick)
    .onMouseEnter((e, d) => {if (!focus) renderSpiral(d); })
    .render();
    
  function handleClick(e,d) {
      focus = focus !== d ? d : null;
      //console.log(focus);
      if (focus) renderSpiral(d);
      e.stopPropagation();
  }

    function handleClick_bi(d) {
      var sel_state = `${states.get(d.id.slice(0, 2)).name}`;
      //console.log(sel_state);
     const bi_select = dataset.find(d => d.state === sel_state);
    if (bi_select) renderSpiral({state: bi_select.state, total: bi_select.number}); 
  }
  
  
  // Move map to the center of the spiral
  const size = gmap.actualSize;
  mg.attr("transform", `translate(${(diameter-size[0])/2.2},${(diameter-size[1])/2})`);
 
  const {state, number} = renderLabels();
  
  // Use California as the default data
  const ca = dataset.find(d => d.code === "CA");
  if (ca) renderSpiral({state: ca.state, total: ca.number});  
  
  function renderSpiral(d) {   
    spiralMap.select(".spiral").remove();
    
    const g = spiralMap.append("g").attr("class", "spiral");
    const chart = new TimeSpiral(g)
    .size([diameter, diameter])
    .layers(+options.layers)
    .innerRadius(diameter / 8)
    .style({
      align: options.align,
      tickColor: options.theme === "dark" ? "white" : "#666",
      tickSize: "9pt",
      showTicks: true,
      tickInterval: "monthly"
    })
    .palette(p)
    .field({value: `new${options.field}`})
    .data(data_spiral(d.state))
    .render();

    state.text(d.state);
    //console.log(d);
    number.text(d3.format(".3f")(d.total));
  }
  
  function renderLabels() {
    const label = spiralMap.append("g")
      .attr("font-size", "10pt")
      .attr("text-anchor", "center")
      .attr("fill", options.theme === "dark" ? "white" : "#666")    
      .attr("transform", `translate(${(diameter-size[0])/2},${(diameter-size[1])/2})`);

    const state = label.append("text"),
          number = label.append("text").attr("dy", "1em");
    return {state, number};
  }
var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', zoomed);
  
  function zoomed(event) {
    const {transform} = event;
    bim.attr("transform", transform);
    bim.attr("stroke-width", 1 / transform.k);
  }
bim.call(zoom);
// svg.call(zoom);  
  svg.node().remove();

  return Object.assign(svg.node(), {update});
}


function _legend(DOM,svg,n,d3,colors,data,labelsRR,labels){return(
() => {
  const k = 16;
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

function _src(statedata,d3,ms)
{   
  const td = new Date("2021-12-03");
  //const data = await d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv", d => {  
  const data = statedata.map(d => {
    const date = d3.timeParse('%Y-%m-%d')(d.date);
    const y = date.getFullYear(), m = date.getMonth();
    const ldy = new Date(y, m + 1, 0);    
    return {
      date: date,
      dayDiff: Math.floor((td - date) / ms.day), // diff from today
      lastDay: date.getTime() === ldy.getTime(), // last day of the month
      month: (y - 2021) * 12 + m,
      state: d.state,
      fips: +d.fips,
      cases: +d.RR
      //deaths: +d.deaths
    }
  });
  
  // last day of dataset
  const last = data[data.length - 1].date.getTime();  
  for(let i = data.length - 1; i > 0; i--) {
      const row = data[i];
      if (row.date.getTime() === last)
        row.lastDay = true;
      else
        break;
  }
  
  return data;
}


function _getStates(src){return(
field => {  
  const data = src.filter(d => d.lastDay);

  const m_month = Math.max.apply(null, data.map(d => d.month));
  const m_fips = Math.max.apply(null, data.map(d => d.fips));  

  // Map state by fips
  const states = new Array(m_fips);
  for(let i = 0; i <= m_fips; i++) {
    const row = data.find(d => d.fips === i);
    if (row) states[i] = row.state;
  }
  
  // Generate a m_fips * m_month matrix
  const matrix = new Array(m_fips + 1).fill(null);  
  for(let i = 0; i <= m_fips; i++) {    
    matrix[i] = new Array(m_month + 1);
  }
  
  // Fill matrix with object, newcases and newdeaths are zeros for now, will be calcualted in the next step 
  data.forEach(d => matrix[d.fips][d.month] = { 
    cases: d.cases, 
    //deaths: d.deaths, 
    newcases: d.cases 
    //newdeaths: d.deaths 
  });
  
  const result = matrix.map((d, i) => {
    const row = new Object();
    row.state = states[i];
    // Process data by month
    for(let m = 0; m < d.length; m++) {    
      const mdata = d[m];
      if (mdata && m > 0) {        
        const prev = d[m - 1];
        // Calculate newcases and newdeaths
        if (prev) {
          mdata.newcases = mdata.cases ;
          //mdata.newdeaths = mdata.deaths - prev.deaths;
        }
      }      
      // yy-mm format
      const ycode = 20 + Math.floor(m / 12);
      const mcode = m - Math.floor(m / 12) * 12 + 1;
      row[`${ycode}-${String(mcode).padStart(2, "0")}`] = mdata ? mdata[field] : 0;
    }
    return row;
  }).filter(d => d.state);  
  
  const total = {state: "Total"};
  result.columns = Object.keys(result[0]); 
  const months = result.columns.slice(1);
  
  for(let month of months) {
    let sum = 0;
    for(let row of result) sum += row[month];
    total[month] = sum;
  }  
  result.unshift(total)
  
  return result;  
}
)}

function _ms(){return(
{
  day: 24 * 3600 * 1000,
  week: 7 * 24 * 3600 * 1000  
}
)}

async function _statedata(d3){return(
await d3.csv("https://raw.githubusercontent.com/YuLan1014/covid/main/stateName.csv")
)}

function _getYesterdayNumbers(getStatesLastNDays){return(
(field, sorted) => {
  const 
    states = getStatesLastNDays("newcases", 1, false, true),
    date = Object.keys(states[0])[2];
  
  const a = states.map(d => ({
    state: d.state,
    code: d.code,
    number: d[date]
  }));
  
  return sorted ? a.sort((a, b) => b.number - a.number) : a;
}
)}

function _getStatesLastNDays(src,mapID){return(
(field, days, total, code) => {
  const data = src.filter(d => d.dayDiff <= days + 1);
  
  const m_fips = Math.max.apply(null, data.map(d => d.fips));  

  // Map state by fips
  const states = new Array(m_fips);
  for(let i = 0; i <= m_fips; i++) {
    const row = data.find(d => d.fips === i);
    if (row) states[i] = row.state;
  }
  
  // Generate a m_fips * days matrix
  const matrix = new Array(m_fips + 1).fill(null);  
  for(let i = 0; i <= m_fips; i++) {    
    matrix[i] = new Array(days + 1);
  }
  
  // Fill matrix with object, newcases and newdeaths will be calcualted in the next step 
  data.forEach(d => matrix[d.fips][d.dayDiff - 1] = { 
    cases: d.cases, 
    deaths: d.deaths, 
    newcases: d.cases
    //newdeaths: d.deaths 
  });
  
  // Pregenerate date strings for each day
  const td = new Date("2021-12-03"), dates = [];
  for (let i = 1;i <= days; i++) {    
    td.setDate(td.getDate() - 1);
    dates.push(`${td.getFullYear()}/${td.getMonth() + 1}/${td.getDate()}`);
  }
  
  const result = matrix.map((d, i) => {
    const row = new Object();
    row.state = states[i];
    if (code) {
      const c = mapID.get(row.state);
      row.code = c !== undefined ? c : "";
    }
    // Process data by day
    for(let dy = 0; dy < d.length - 1; dy++) {    
      const dydata = d[dy];
      if (dydata) {        
        const prev = d[dy + 1];
        // Calculate newcases and newdeaths
        if (prev) {
          dydata.newcases = dydata.cases;
          //dydata.newdeaths = dydata.deaths - prev.deaths;
        }
      }      
      row[dates[dy]] = dydata ? dydata[field] : 0;
    }
    return row;
  }).filter(d => d.state);  
  
  result.columns = Object.keys(result[0]);  
 
  if (total) {
    const total = {state: "Total", code: ""};
    result.columns = Object.keys(result[0]); 
    const ds = result.columns.slice(code ? 2 : 1);

    for(let day of ds) {
      let sum = 0;
      for(let row of result) sum += row[day];
      total[day] = sum;
    }  
    result.unshift(total)
  }
  
  return result;  
}
)}

function _14(getYesterdayNumbers){return(
getYesterdayNumbers("newcases", true)
)}

function _getStatesNumber(days,mapID,src){return(
(field, date) => {
  const td = days, mapper = mapID;
  
  var data;  
  if (typeof date === "number") 
    data = src.filter(d => td - d.dayDiff === date);
  else
    data = src.filter(d => d.date.getTime() === date.getTime());
  
  return data.map(d => ({
    state: d.state,
    code: mapper.get(d.state),
    number: d[field]
  }));
}
)}

function _firstDay(src){return(
src[0].date
)}

function _days(src,ms)
{
  const first = src[0].date;
  const last = src[src.length - 1].date;
  return Math.floor((last - first) / ms.day) + 1;
}


function _18(md){return(
md
`## Data
Load the case data, county JSON file, and state JSON file. Create an array of dates for the data scrubber.`
)}

async function _dates(d3)
{
  const data = await d3.csv("https://raw.githubusercontent.com/YuLan1014/covid/main/allgis_res_2021.csv", d => {
    return d.date;
  });
  return [...new Set(data)];
}


async function _data(d3){return(
Object.assign(new Map(
  await d3.csv("https://raw.githubusercontent.com/YuLan1014/covid/main/allgis_res_2021.csv", ({ID,RR_C,RR_L,date}) => [(ID+ " "+date), [+RR_C, +RR_L]])), 
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

function _color(colors,y,x,n)
{
  return value => {
    if (!value) return "#ccc";
    let [a, b] = value;
    return colors[y(b) + x(a) * n];
  };
}


function _27(md){return(
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

function _34(md){return(
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
`## Source code of spiral map
`
)}

function _TimeSpiral(d3){return(
class TimeSpiral {
    constructor(container) {
        this._container = container;
        this._g = null;

        this._width = 800;
        this._height = 600;

        this._innerRadius = 50;
        this._maxRadius = 0;
        this._layers = 5;
        this._precision = 32;
        this._layerHeight = 0;
        this._charBox = null;

        this._style = {
            align: "base",
            barWidth: "skinny",
            rounded: true,
            colorBy: "value",
            tickInterval: "monthly",
            showTicks: true,
            tickColor: "#999",
            tickSize: "8pt",
            titleFormat: ",.0d",
            reverseColor: false
        };
        this._centered = true;
        this._skinny = true;

        this._palette = d3.interpolateYlGnBu;

        this._data = null;
        this._min = 0;
        this._max = 0;
        this._firstDay = null;
        this._lastDay = null;
        this._chartData = null;
        this._field = {
            date: "date",
            value: "value"
        };

        this._time = null;
        this._size = null;
        this._color = null;
        this._spiral = null;
        this._offsets = null;

        this._spiralLength = 0;
        this._barWidth = 0;

        this._bars = null;
        this._ticks = null;
    }

    size(_) {
        return arguments.length ? (this._width = _[0], this._height = _[1], this) : [this._width, this._height];
    }

    innerRadius(_) {
        return arguments.length ? (this._innerRadius = _, this) : this._innerRadius;
    }

    layers(_) {
        return arguments.length ? (this._layers = _, this) : this._layers;
    }

    style(_) {
        return arguments.length ? (this._style = Object.assign(this._style, _), this) : this._style;
    }

    palette(_) {
        return arguments.length ? (this._palette = _, this) : this._palette;
    }

    field(_) {
        return arguments.length ? (this._field = Object.assign(this._field, _), this) : this._field;
    }

    data(_) {
        return arguments.length ? (this._data = _, this) : this._field;
    }

    render() {
        this._init();
        this._renderSpiral();
        this._process();
        this._initScales();

        this._calculateBars();
        this._renderBars();
        if (this._style.showTicks) this._renderAxis();
    }

    _init() {
        this._getCharBox();

        var max = (this._width < this._height ? this._width : this._height) / 2;
        this._layerHeight = (max - this._innerRadius) / (this._layers + 1) - this._charBox.height;
        this._maxRadius = max - this._layerHeight;
        this._centered = this._style.align === "center";
        this._skinny = this._style.barWidth === "skinny";
    }

    _getCharBox() {
        var text;
        try {
            text = this._container.append("text")
                .attr("font-size", this._style.tickSize)
                .text("M");
            this._charBox = text.node().getBBox();
        }
        finally {
            if (text) text.remove();
        }
    }

    _process() {
        const ext = d3.extent(this._data.map(d => d[this._field.value]));
        this._min = ext[0];
        this._max = ext[1];

        this._firstDay = this._data[0][this._field.date];
        this._lastDay = this._data[this._data.length - 1][this._field.date];

        this._spiralLength = this._spiral.node().getTotalLength();
        this._barWidth = this._spiralLength / this._data.length / (this._skinny ? 2 : 1);
    }

    _calculateBars() {
        const bars = this._data.map(d => {
            const
                date = d[this._field.date],
                value = d[this._field.value],
                size = this._size(value),
                t = this._time(date),
                p1 = this._spiral.node().getPointAtLength(t),
                p2 = this._spiral.node().getPointAtLength(t - this._barWidth);

            return {
                date: date,
                day: date.getDate(),
                value: value,
                t: t,
                x: p1.x,
                y: this._centered ? p1.y - size / 2 : p1.y,
                y0: p1.y,
                yr: p1.y, // rotate y
                offset: 0, // tick text offset
                size: size,
                angle: Math.atan2(p2.y, p2.x) * 180 / Math.PI - 90
            };
        });

        this._offsets = [];
        if (this._centered) {
            bars.forEach((d, i) => {
                if (d.day === 1) {
                    const sample = [];
                    for (let j = i; j < i + 5 && j < bars.length; j++) {
                        sample.push(bars[j].size);
                    }

                    this._offsets.push({
                        t: d.t,
                        height: d3.max(sample)
                    })
                }
            });
        }

        this._bars = bars;
    }

    _initScales() {
        this._initColors();

        this._time = d3.scaleTime()
            .domain([this._firstDay, this._lastDay])
            .range([0, this._spiralLength]);

        this._size = d3.scaleLinear()
            .domain([this._min, this._max]).nice()
            .range([5, this._layerHeight]);
    }

    _initColors() {
        const style = this._style;
        if (style.colorBy === "time") {
            const months = d3.timeMonth
                .every(1)
                .range(this._firstDay, this._lastDay);

            this._color = d3.scaleOrdinal()
                .domain(months.map(d => d.getFullYear() + "." + d.getMonth()))
                .range(this._palette);
        }
        else {
            this._color = d3
                .scaleSequential(this._palette)
                .domain(style.reverseColor ? [this._max, this._min] : [this._min, this._max]);
        }
    }

    _renderSpiral() {
        this._g = this._container.append("g")
            .attr("transform", `translate(${this._width / 2},${this._height / 2})`);

        this._spiral = this._g.append("path")
            .attr("id", "axis")
            .attr("fill", "none")
            .attr("stroke", "none")
            .attr("stroke-width", 0.5)
            .attr("d", this._axisSpiral(this._precision * 2 * this._layers + 1));
    }

    _axisSpiral(length) {
        return d3.lineRadial()
            .angle((d, i) => Math.PI / this._precision * i)
            .radius((d, i) => i * (this._maxRadius - this._innerRadius) / length + this._innerRadius)({ length });
    }

    _renderBars() {
        const w = this._barWidth, hw = w / 2;

        var color;
        if (this._style.colorBy === "value")
            color = d => this._color(d.value);
        else
            color = d => {
                const key = d.date.getFullYear() + "." + d.date.getMonth();
                return this._color(key);
            };

        const bars = this._g.selectAll(".bar")
            .data(this._bars)
            .join("rect")
            .attr("class", "bar")
            .attr("fill", color)
            .attr("opacity", 1)            
            .attr("x", d => d.x).attr("y", d => d.y)
            .attr("width", w).attr("height", d => d.size)
            .attr("transform", d => `rotate(${d.angle},${d.x},${d.yr})`)
            .on("mouseover", (e, d) => {
                bars.transition().duration(250).attr("opacity", _ => _ === d ? 1 : 0.5);
            })
            .on("mouseout", (e, d) => {
                bars.transition().duration(250).attr("opacity", 1);
            });
      
        if (this._style.rounded) bars.attr("rx", hw).attr("ry", hw);

        bars.append("title")
            .text(d => {
                const date = `${d.date.getFullYear()}-${d.date.getMonth() + 1}-${d.date.getDate()}`;
                const value = d3.format(this._style.titleFormat)(d.value);
                return `${date}\n${value}`;
            });
    }

    _renderAxis() {
        const
            style = this._style,
            w = this._barWidth, hw = w / 2, wh = w + hw,
            offset = this._skinny ? wh : hw;

        var ticks;
        if (style.tickInterval === "monthly")
            ticks = d3.timeMonth.every(1).range(this._firstDay, this._lastDay);
        else
            ticks = this._time.ticks();

        const data = ticks.map(d => {
            const t = this._time(d);
            const bar = this._bars.find(_ => _.t === t);
            if (bar && this._centered) {
                const offset = this._offsets.find(_ => _.t === t);
                bar.offset = (offset ? offset.height : this._layerHeight) / 2 + w;
            }
            return bar;
        }).filter(d => d);

        const lineOffset = this._centered ? 0 : this._charBox.height;
        this._ticks = this._g.selectAll(".tick")
            .data(data)
            .join("g")
            .attr("class", "tick")
            .attr("fill", style.tickColor)
            .attr("font-size", style.tickSize)
            .call(g => g.append("line")
                .attr("stroke", style.tickColor)
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "1,1")
                .attr("x1", d => d.x + offset).attr("y1", d => d.y0 + hw)
                .attr("x2", d => d.x + offset).attr("y2", d => d.y0 - d.offset - lineOffset)
                .attr("transform", d => `rotate(${d.angle},${d.x},${d.y0})`));

        this._ticks
            .append("text")
            .attr("dy", this._centered ? w : "1em")
            .attr("x", d => d.x - offset + 3).attr("y", d => d.y0 + d.offset)
            .attr("transform", d => `rotate(${d.angle + 180},${d.x},${d.y0})`)
            .text(d => `${d.date.getFullYear()}-${d.date.getMonth() + 1}`);
    }
}
)}

function _41(md){return(
md`### Appendix of spiral map`
)}

async function _mapID(d3,FileAttachment){return(
new Map(d3.csvParse(await FileAttachment("state_fips.csv").text(), d3.autoType).map(d => [d.stname, d.stusps]))
)}

function _map_spiral(){return(
[[0, 0, ""], [1, 0, ""], [2, 0, ""], [3, 0, ""], [4, 0, ""], [5, 0, ""], [6, 0, ""], [7, 0, ""], [8, 0, ""], [9, 0, ""], [10, 0, ""], [11, 0, "ME"], [1, 1, ""], [2, 1, ""], [3, 1, ""], [4, 1, ""], [5, 1, ""], [6, 1, "WI"], [7, 1, ""], [8, 1, ""], [9, 1, ""], [10, 1, "VT"], [11, 1, "NH"], [0, 2, ""], [1, 2, "WA"], [2, 2, "ID"], [3, 2, "MT"], [4, 2, "ND"], [5, 2, "MN"], [6, 2, "IL"], [7, 2, "MI"], [8, 2, ""], [9, 2, "NY"], [10, 2, "MA"], [11, 2, ""], [0, 3, ""], [1, 3, "OR"], [2, 3, "NV"], [3, 3, "WY"], [4, 3, "SD"], [5, 3, "IA"], [6, 3, "IN"], [7, 3, "OH"], [8, 3, "PA"], [9, 3, "NJ"], [10, 3, "CT"], [11, 3, "RI"], [0, 4, ""], [1, 4, "CA"], [2, 4, "UT"], [3, 4, "CO"], [4, 4, "NE"], [5, 4, "MO"], [6, 4, "KY"], [7, 4, "WV"], [8, 4, "VA"], [9, 4, "MD"], [10, 4, "DE"], [11, 4, ""], [0, 5, ""], [1, 5, ""], [2, 5, "AZ"], [3, 5, "NM"], [4, 5, "KS"], [5, 5, "AR"], [6, 5, "TN"], [7, 5, "NC"], [8, 5, "SC"], [9, 5, "DC"], [10, 5, ""], [11, 5, ""],  [1, 6, ""], [2, 6, ""], [3, 6, ""], [4, 6, "OK"], [5, 6, "LA"], [6, 6, "MS"], [7, 6, "AL"], [8, 6, "GA"], [9, 6, ""], [10, 6, ""], [11, 6, ""], [0, 7, ""], [1, 7, ""], [2, 7, ""], [3, 7, ""], [4, 7, "TX"], [5, 7, ""], [6, 7, ""], [7, 7, ""], [8, 7, ""], [9, 7, "FL"], [10, 7, ""], [11, 7, ""]].map(d => ({ col: d[0], row: d[1], code: d[2] }))
)}

function _data_spiral(src){return(
(state) => {
  const filtered = src.filter(d => d.state === state);            
  for (let i = filtered.length - 1; i >= 1; i--) {
    const c = filtered[i], p = filtered[i - 1];
    c.newcases = c.cases - p.cases;
    //c.newdeaths = c.deaths - p.deaths;
  }
  filtered[0].newcases = 0;  
  //filtered[0].newdeaths = 0;
  return filtered;
}
)}

function _today(){return(
new Date("2021-12-03")
)}

function _yesterday(today)
{
  const yd = today;
  return new Date(yd.setDate(yd.getDate() ));
}


function _diameter(width){return(
width/2
)}

function _50(md){return(
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
    ["state_fips.csv", {url: new URL("./files/26edb36af0fde039070b2cdaf9a865171e244f093ab0697c0f55b88c81cdc1ed53576b24a3e6c4813d58d732eec847c031838bef446909ac33691ab14035bb9a.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof colors")).define("viewof colors", ["html","schemes"], _colors);
  main.variable(observer("colors")).define("colors", ["Generators", "viewof colors"], (G, _) => G.input(_));
  main.variable(observer("viewof options")).define("viewof options", ["form","html"], _options);
  main.variable(observer("options")).define("options", ["Generators", "viewof options"], (G, _) => G.input(_));
  main.variable(observer("viewof date")).define("viewof date", ["Scrubber","dates","d3"], _date);
  main.variable(observer("date")).define("date", ["Generators", "viewof date"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["d3","DOM","topojson","us","color","data","dateToString","date","states","format","legend","options","diameter","getStatesNumber","days","GridMap","map_spiral","TimeSpiral","data_spiral"], _map);
  main.variable(observer("legend")).define("legend", ["DOM","svg","n","d3","colors","data","labelsRR","labels"], _legend);
  main.variable(observer("src")).define("src", ["statedata","d3","ms"], _src);
  main.variable(observer("getStates")).define("getStates", ["src"], _getStates);
  main.variable(observer("ms")).define("ms", _ms);
  main.variable(observer("statedata")).define("statedata", ["d3"], _statedata);
  main.variable(observer("getYesterdayNumbers")).define("getYesterdayNumbers", ["getStatesLastNDays"], _getYesterdayNumbers);
  main.variable(observer("getStatesLastNDays")).define("getStatesLastNDays", ["src","mapID"], _getStatesLastNDays);
  main.variable(observer()).define(["getYesterdayNumbers"], _14);
  main.variable(observer("getStatesNumber")).define("getStatesNumber", ["days","mapID","src"], _getStatesNumber);
  main.variable(observer("firstDay")).define("firstDay", ["src"], _firstDay);
  main.variable(observer("days")).define("days", ["src","ms"], _days);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("dates")).define("dates", ["d3"], _dates);
  main.variable(observer("data")).define("data", ["d3"], _data);
  main.variable(observer("labelsRR")).define("labelsRR", _labelsRR);
  main.variable(observer("labels")).define("labels", _labels);
  main.variable(observer("n")).define("n", ["colors"], _n);
  main.variable(observer("x")).define("x", ["d3","data","n"], _x);
  main.variable(observer("y")).define("y", ["d3","data","n"], _y);
  main.variable(observer("color")).define("color", ["colors","y","x","n"], _color);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("format")).define("format", ["data","labelsRR","x","labels","y"], _format);
  main.variable(observer("schemes")).define("schemes", _schemes);
  main.variable(observer("states")).define("states", ["us"], _states);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer()).define(["md"], _34);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("slider", child2);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("dateToString")).define("dateToString", _dateToString);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer("TimeSpiral")).define("TimeSpiral", ["d3"], _TimeSpiral);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("mapID")).define("mapID", ["d3","FileAttachment"], _mapID);
  main.variable(observer("map_spiral")).define("map_spiral", _map_spiral);
  main.variable(observer("data_spiral")).define("data_spiral", ["src"], _data_spiral);
  main.variable(observer("today")).define("today", _today);
  main.variable(observer("yesterday")).define("yesterday", ["today"], _yesterday);
  main.variable(observer("diameter")).define("diameter", ["width"], _diameter);
  const child3 = runtime.module(define3);
  main.import("GridMap", child3);
  const child4 = runtime.module(define4);
  main.import("form", child4);
  main.variable(observer()).define(["md"], _50);
  return main;
}

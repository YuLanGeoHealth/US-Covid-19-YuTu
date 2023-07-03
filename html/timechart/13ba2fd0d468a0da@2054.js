import define1 from "./450051d7f1174df8@254.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./dd37a4c605d90472@184.js";
import define4 from "./01b9f5889f32d3e6@1602.js";

function _1(md) {
  return md`
# Animated Bivariate Map & TimeChart of COVID-19 for all
  `;
}

function _2(md) {
  return md`
This map shows the bivariate map of relative risk of cluster and relative risk of county. The value of two variables are ranged from lowest, low, medium to high. You can hover the county to get details.
  `;
}

function _colors(html, schemes) {
  const form = html`<form
    style="display: flex; align-items: center; min-height: 33px; font: 12px sans-serif;"
  >
    <label
      ><select name="i">
        ${schemes.map((c) =>
          Object.assign(html`<option></option>`, { textContent: c.name })
        )}</select
      ><span style="margin-left: 0.5em;">color scheme</span></label
    >
  </form>`;
  form.i.selectedIndex = 1;
  form.oninput = () => (form.value = schemes[form.i.selectedIndex].colors);
  form.oninput();
  return form;
}

function _date(Scrubber, dates, d3) {
  return Scrubber(
    dates.map((x) => d3.timeParse("%Y-%m-%d")(x)),
    {
      autoplay: false,
      loop: false,
      delay: 100,
      format: (date) =>
        date.toLocaleString("en", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
    }
  );
}

function _currentState(
  d3,
  DOM,
  topojson,
  us,
  color,
  data,
  dateToString,
  date,
  states,
  format,
  legend,
  html
) {
  const width = 1000;
  const height = 600;
  const margin = 10;
  var sel_state;

  // create SVG element
  let svg = d3.select(DOM.svg(width, height));
  // .attr("viewBox", [0, 0, 975, 610]);
  const path = d3.geoPath();

  // Add the text box for State
  svg
    .append("text")
    .attr("x", margin * 20)
    .attr("y", height - 20)
    .attr("dy", ".35em")
    .text();

  const bim = svg.append("g");

  var countyMap = bim
    .append("g")
    //.attr("transform","translate("+margin*25+","+margin+") scale(0.7)")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
    .attr("fill", (d) => color(data.get(d.id + " " + dateToString(date))))
    .attr("d", path)
    .on("mouseover", function (d) {
      d3.select(this).attr("stroke", "orange");
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("stroke", "null");
    })
    .on("click", clicked)
    .append("title")
    .text(
      (d) => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
${format(data.get(d.id + " " + dateToString(date)))}`
    );

  bim
    .append("path")
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    // .attr("transform","translate("+margin*25+","+margin+") scale(0.7)")
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  svg
    .append(legend)
    .attr("transform", "translate(" + 9 * margin + "," + 50 * margin + ")");
  //.attr("transform", "translate(870,450)");

  // select and unselect
  var selected;
  var selects = [];
  var testdic = {};
  function clicked(e, d) {
    svg
      .select("text")
      .text(`${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}`);
    if (!testdic.hasOwnProperty(d.id)) {
      selected = this;
      //selects.push(d.id);
      testdic[d.id] = d.properties.name;
      testdic[d.properties.name] = states.get(d.id.slice(0, 2)).name;
      d3.select(selected).style("stroke", "yellow");
      //console.log(testdic)
    }
    //else if(selects.includes(d.id)){
    //  selected = this;
    //  d3.select(selected).style('stroke', null);
    //  selected = undefined;
    //  selects= arrayRemove(selects, d.id);
    else if (testdic.hasOwnProperty(d.id)) {
      selected = this;
      d3.select(selected).style("stroke", null);
      selected = undefined;
      delete testdic[d.id];
      delete testdic[d.properties.name];
    }
    map.value = testdic;
    map.dispatchEvent(new CustomEvent("input"));
  }
  //remove function
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  // Update the fill based on date scrubber
  function update(date) {
    countyMap.attr("fill", function (d) {
      var fclass = data.get(d.id + " " + dateToString(date));
    });
  }

  var zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  function zoomed(event) {
    const { transform } = event;
    bim.attr("transform", transform);
    bim.attr("stroke-width", 1 / transform.k);
  }
  bim.call(zoom);
  // svg.call(zoom);
  svg.node().remove();

  //return Object.assign(svg.node(), {update});

  const map = html`<div>
    ${svg.node()}
    <div value="[]"></div>
  </div>`;
  return map;

  function updateState(id) {
    map.value = id;
    console.log(id);
    map.dispatchEvent(new CustomEvent("input"));
  }
}

function _variable(Inputs) {
  return Inputs.radio(["RR within the cluster", "Daily Cases 7-days avg"], {
    value: "RR within the cluster",
    label: "Variable",
  });
}

function _name(html, width, TimeAxis, interval, start, stop) {
  return html` <div style="width: ${width}px">
    ${TimeAxis({ interval, start, stop, width })}
  </div>`;
}

function _visu(html, width, testmerge, timeChart) {
  return html` <div style="width: ${width}px">
    ${testmerge.map((d) =>
      timeChart(d.data, { title: d.name, scheme: d.color_s })
    )}
  </div>`;
}

function _legend(DOM, svg, n, d3, colors, data, labelsRR, labels) {
  return () => {
    const k = 16;
    const arrow = DOM.uid();
    return svg`<g font-family=sans-serif font-size=10>
  <g transform="translate(-${(k * n) / 2},-${(k * n) / 2}) rotate(-45 ${
      (k * n) / 2
    },${(k * n) / 2})">
    <marker id="${
      arrow.id
    }" markerHeight=10 markerWidth=10 refX=6 refY=3 orient=auto>
      <path d="M0,0L9,3L0,6Z" />
    </marker>
    ${d3.cross(d3.range(n), d3.range(n)).map(
      ([i, j]) => svg`<rect width=${k} height=${k} x=${i * k} y=${
        (n - 1 - j) * k
      } fill=${colors[j * n + i]}>
      <title>${data.title[0]}${labelsRR[j] && ` (${labelsRR[j]})`}
${data.title[1]}${labels[i] && ` (${labels[i]})`}</title>
    </rect>`
    )}
    <line marker-end="${arrow}" x1=0 x2=${n * k} y1=${n * k} y2=${
      n * k
    } stroke=black stroke-width=1.5 />
    <line marker-end="${arrow}" y2=0 y1=${
      n * k
    } stroke=black stroke-width=1.5 />
    <text font-weight="bold" dy="0.71em" transform="rotate(90) translate(${
      (n / 2) * k
    },6)" text-anchor="middle">${data.title[0]}</text>
    <text font-weight="bold" dy="0.71em" transform="translate(${(n / 2) * k},${
      n * k + 6
    })" text-anchor="middle">${data.title[1]}</text>
  </g>
</g>`;
  };
}

function _10(md) {
  return md`
## Data

Load the case data, county JSON file, and state JSON file. Create an array of dates for the data scrubber.
  `;
}

async function _dates(FileAttachment) {
  const data = await FileAttachment("allcluster.csv").csv();
  var dd = data.map(function (d) {
    return d.date;
  });
  return [...new Set(dd)];
}

async function _rrmap(FileAttachment) {
  const testww = await FileAttachment("allcluster.csv").csv();
  return new Map(
    testww.map(({ id, rr_c, rr_l, date }) => [id + " " + date, [+rr_c, +rr_l]])
  );
}

function _data(rrmap) {
  return Object.assign(rrmap, { title: ["RR of cluster", "RR of county"] });
}

function _labelsRR() {
  return ["Group 1", "Group 2", "Group 3", "Group 4"];
}

function _labels() {
  return ["Group 1", "Group 2", "Group 3", "Group 4"];
}

function _n(colors) {
  return Math.floor(Math.sqrt(colors.length));
}

function _x(d3, data, n) {
  return d3.scaleQuantile(
    Array.from(data.values(), (d) => d[0]),
    d3.range(n)
  );
}

function _y(d3, data, n) {
  return d3.scaleQuantile(
    Array.from(data.values(), (d) => d[1]),
    d3.range(n)
  );
}

function _color(colors, y, x, n) {
  return (value) => {
    if (!value) return "#ccc";
    let [a, b] = value;
    return colors[y(b) + x(a) * n];
  };
}

async function _all_data(FileAttachment) {
  return await FileAttachment("timechart.csv").csv({ typed: true });
}

async function _all_data2(FileAttachment) {
  return await FileAttachment("allcluster.csv").csv({ typed: true });
}

async function _all_data3(FileAttachment) {
  return await FileAttachment("cases_timechart.csv").csv({ typed: true });
}

function _StateName() {
  return [
    "Alabama",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];
}

function _24(currentState) {
  return Object.keys(currentState);
}

function _25(currentState) {
  return parseInt(Object.keys(currentState)[0]);
}

function _raw_data(all_data, currentState) {
  return all_data.filter(function (currentElement) {
    var valuelist = Object.keys(currentState);
    // the current value is an object, so you can check on its properties
    // return currentElement.ID>fips && currentElement.ID < fips+1000;
    // console.log(currentElement);
    for (const list of valuelist) {
      if (currentElement.ID === parseInt(list)) {
        // if (currentElement.ID === list)
        // console.log(currentElement);
        return currentElement.ID;
      }
    }
  });
}

function _27(topojson, us) {
  return topojson.feature(us, us.objects.counties).features;
}

function _raw_data_bi(variable, all_data3, currentState, all_data2) {
  switch (variable) {
    case "Daily Cases 7-days avg":
      var rawdata = all_data3.filter(function (currentElement) {
        var valuelist = Object.keys(currentState);
        for (const list of valuelist) {
          if (currentElement.id === parseInt(list)) {
            // if (currentElement.id === list)
            //console.log(currentElement);
            return currentElement.id;
          }
        }
      });
      break;

    case "RR within the cluster":
      var rawdata = all_data2.filter(function (currentElement) {
        var valuelist = Object.keys(currentState);
        for (const list of valuelist) {
          if (currentElement.id === parseInt(list)) {
            // if (currentElement.id === list)
            console.log(currentElement);
            return currentElement.id;
          }
        }
      });
      break;
  }
  return rawdata;
}

function _states_timechart(d3, raw_data) {
  return [...d3.group(raw_data, (d) => d.ID).keys()];
}

function _cases_per_day(d3, states_timechart, raw_data, currentState) {
  return d3.sort(
    states_timechart.map((state) => {
      const state_data = raw_data.filter((d) => d.ID === state);
      const data = state_data.map((dd, i) => {
        let new_cases = dd.RR_L;
        return {
          date: dd.date,
          value: new_cases,
        };
      });
      if (state < 10000) {
        state = "0" + state;
      }
      var countyname = currentState[state];
      var statename = currentState[countyname];
      var name = countyname + ", " + statename;
      var color_s = "reds";
      return {
        color_s,
        name,
        data,
      };
    })
    // Sort by the date where the moving average is the highest
    // s => -d3.greatestIndex(movingAverage(s.data.map(d => d.value), 7))
  );
}

function _cases_per_day2(
  d3,
  states_timechart,
  raw_data_bi,
  variable,
  currentState
) {
  return d3.sort(
    states_timechart.map((state) => {
      const state_data = raw_data_bi.filter((d) => d.id === state);
      switch (variable) {
        // case "Observed Cases":
        //   var selvar = "Observed";
        //    var name ="#Cases";
        // break;
        case "Daily Cases 7-days avg":
          var selvar = "case_avg7";
          var name = "7-days avg";
          break;
        case "RR within the cluster":
          var selvar = "rr_c";
          var name = "INcluster";
          break;
      }
      const data = state_data.map((dd, i) => {
        let new_cases = dd[selvar];
        // let new_cases = dd.Observed;
        return {
          date: dd.date,
          value: new_cases,
        };
      });
      if (state < 10000) {
        state = "0" + state;
      }
      var countyname = currentState[state];
      var statename = currentState[countyname];
      var color_s = "blues";
      return {
        color_s,
        name,
        data,
      };
    })
    // Sort by the date where the moving average is the highest
    // s => -d3.greatestIndex(movingAverage(s.data.map(d => d.value), 7))
  );
}

function _cases_merge(cases_per_day, cases_per_day2) {
  return cases_per_day.concat(cases_per_day2);
}

function _testmerge(cases_per_day, cases_per_day2) {
  var temp = [];
  for (let i = 0; i < cases_per_day.length; i++) {
    temp.push(cases_per_day[i]);
    temp.push(cases_per_day2[i]);
  }
  return temp;
}

function _interval(d3) {
  return d3.utcDay;
}

function _start(d3, raw_data) {
  return d3.min(raw_data, (d) => d.date);
}

function _stopold(d3, raw_data) {
  return d3.max(raw_data, (d) => d.date);
}

function _stop(d3, stopold) {
  return d3.timeDay.offset(stopold, 1);
}

function _38(md) {
  return md`
## D3 Setup

Setup some useful D3 items. The \`color\` function will be used to map cases to the associated quantile color. The \`path\` and \`projection\` functions are needed for mapping the JSON data.
  `;
}

function _format(data, labelsRR, x, labels, y) {
  return (value) => {
    if (!value) return "N/A";
    let [a, b] = value;
    return `${data.title[0]} ${a} ${labelsRR[x(a)] && ` (${labelsRR[x(a)]})`}
${data.title[1]} ${b} ${labels[y(b)] && ` (${labels[y(b)]})`}`;
  };
}

function _schemes() {
  return [
    {
      name: "RdBu",
      colors: [
        "#D3CFE6",
        "#A5BEDB",
        "#76ADD0",
        "#489CC5",
        "#D0A2CE",
        "#A395C5",
        "#7588BA",
        "#477AB1",
        "#CD74B5",
        "#A06BAD",
        "#7361A4",
        "#46589C",
        "#CA479E",
        "#9E4196",
        "#713B8F",
        "#453687",
      ],
    },
    {
      name: "RdBu",
      colors: [
        "#D3CFE6",
        "#A5BEDB",
        "#76ADD0",
        "#489CC5",
        "#D0A2CE",
        "#A395C5",
        "#7588BA",
        "#477AB1",
        "#CD74B5",
        "#A06BAD",
        "#7361A4",
        "#46589C",
        "#CA479E",
        "#9E4196",
        "#713B8F",
        "#453687",
      ],
    },
  ];
}

function _41(topojson, us) {
  return topojson.feature(us, us.objects.counties).features;
}

function _states(us) {
  return new Map(us.objects.states.geometries.map((d) => [d.id, d.properties]));
}

function _us(FileAttachment) {
  return FileAttachment("counties-albers-10m@9.json").json();
}

function _topojson(require) {
  return require("topojson-client@3");
}

function _d3(require) {
  return require("d3@6");
}

function _46(md) {
  return md`
    ## Import Useful Tools

    Import legend and date scrubber from Mike Bostok, and a general purpose slider from Jeremy Ashkenas.
  `;
}

function _51(md) {
  return md`
## Helper Functions

Helper function to convert JS dates to format used in the data
  `;
}

function _dateToString() {
  return function dateToString(date) {
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  };
}

function _53(md) {
  return md`
## Source code of spiral map
  `;
}

function _54(md) {
  return md`
### Appendix of timechart map
  `;
}

function _timeChart2(TimeChart, interval, start, stop, width) {
  return TimeChart.defaults({
    interval,
    start,
    stop,
    dateFormat: "%m/%d/%Y",
    width: width,
    marginTop: 2,
    marginLeft: 10,
    marginRight: 10,
    scheme: "blues",
  });
}

function _timeChart(TimeChart, interval, start, stop, width) {
  return TimeChart.defaults({
    interval,
    start,
    stop,
    dateFormat: "%m/%d/%Y",
    width: width,
    marginTop: 2,
    scheme: "reds",
  });
}

function _57(md) {
  return md`
## References

1. Animated Map of COVID-19 Cases:
   https://observablehq.com/@onoratod/animated-map-of-covid-19-cases

2. Bivariate Choropleth:
   https://observablehq.com/@d3/bivariate-choropleth
  `;
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() {
    return this.url;
  }
  const fileAttachments = new Map([
    [
      "counties-albers-10m@9.json",
      {
        url: new URL(
          "./files/e006bc50810dbc00e9b0f0af7920c1b1a08a10d5983220090195290a1fbb112e3552eb5298206c9334b0468cf1b427969b5d18ddcd4b77665df2b675ef128bd6.json",
          import.meta.url
        ),
        mimeType: "application/json",
        toString,
      },
    ],
    [
      "timechart.csv",
      {
        url: new URL("../../data/timechart.csv", import.meta.url),
        mimeType: "text/csv",
        toString,
      },
    ],
    [
      "cases_timechart.csv",
      {
        url: new URL("../../data/cases_timechart.csv", import.meta.url),
        mimeType: "text/csv",
        toString,
      },
    ],
    [
      "allcluster.csv",
      {
        url: new URL("../../data/allcluster.csv", import.meta.url),
        mimeType: "text/csv",
        toString,
      },
    ],
  ]);
  main.builtin(
    "FileAttachment",
    runtime.fileAttachments((name) => fileAttachments.get(name))
  );
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main
    .variable(observer("viewof colors"))
    .define("viewof colors", ["html", "schemes"], _colors);
  main
    .variable(observer("colors"))
    .define("colors", ["Generators", "viewof colors"], (G, _) => G.input(_));
  main
    .variable(observer("viewof date"))
    .define("viewof date", ["Scrubber", "dates", "d3"], _date);
  main
    .variable(observer("date"))
    .define("date", ["Generators", "viewof date"], (G, _) => G.input(_));
  main
    .variable(observer("viewof currentState"))
    .define(
      "viewof currentState",
      [
        "d3",
        "DOM",
        "topojson",
        "us",
        "color",
        "data",
        "dateToString",
        "date",
        "states",
        "format",
        "legend",
        "html",
      ],
      _currentState
    );
  main
    .variable(observer("currentState"))
    .define("currentState", ["Generators", "viewof currentState"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof variable"))
    .define("viewof variable", ["Inputs"], _variable);
  main
    .variable(observer("variable"))
    .define("variable", ["Generators", "viewof variable"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("name"))
    .define(
      "name",
      ["html", "width", "TimeAxis", "interval", "start", "stop"],
      _name
    );
  main
    .variable(observer("visu"))
    .define("visu", ["html", "width", "testmerge", "timeChart"], _visu);
  main
    .variable(observer("legend"))
    .define(
      "legend",
      ["DOM", "svg", "n", "d3", "colors", "data", "labelsRR", "labels"],
      _legend
    );
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("dates")).define("dates", ["FileAttachment"], _dates);
  main.variable(observer("rrmap")).define("rrmap", ["FileAttachment"], _rrmap);
  main.variable(observer("data")).define("data", ["rrmap"], _data);
  main.variable(observer("labelsRR")).define("labelsRR", _labelsRR);
  main.variable(observer("labels")).define("labels", _labels);
  main.variable(observer("n")).define("n", ["colors"], _n);
  main.variable(observer("x")).define("x", ["d3", "data", "n"], _x);
  main.variable(observer("y")).define("y", ["d3", "data", "n"], _y);
  main
    .variable(observer("color"))
    .define("color", ["colors", "y", "x", "n"], _color);
  main
    .variable(observer("all_data"))
    .define("all_data", ["FileAttachment"], _all_data);
  main
    .variable(observer("all_data2"))
    .define("all_data2", ["FileAttachment"], _all_data2);
  main
    .variable(observer("all_data3"))
    .define("all_data3", ["FileAttachment"], _all_data3);
  main.variable(observer("StateName")).define("StateName", _StateName);
  main.variable(observer()).define(["currentState"], _24);
  main.variable(observer()).define(["currentState"], _25);
  main
    .variable(observer("raw_data"))
    .define("raw_data", ["all_data", "currentState"], _raw_data);
  main.variable(observer()).define(["topojson", "us"], _27);
  main
    .variable(observer("raw_data_bi"))
    .define(
      "raw_data_bi",
      ["variable", "all_data3", "currentState", "all_data2"],
      _raw_data_bi
    );
  main
    .variable(observer("states_timechart"))
    .define("states_timechart", ["d3", "raw_data"], _states_timechart);
  main
    .variable(observer("cases_per_day"))
    .define(
      "cases_per_day",
      ["d3", "states_timechart", "raw_data", "currentState"],
      _cases_per_day
    );
  main
    .variable(observer("cases_per_day2"))
    .define(
      "cases_per_day2",
      ["d3", "states_timechart", "raw_data_bi", "variable", "currentState"],
      _cases_per_day2
    );
  main
    .variable(observer("cases_merge"))
    .define("cases_merge", ["cases_per_day", "cases_per_day2"], _cases_merge);
  main
    .variable(observer("testmerge"))
    .define("testmerge", ["cases_per_day", "cases_per_day2"], _testmerge);
  main.variable(observer("interval")).define("interval", ["d3"], _interval);
  main.variable(observer("start")).define("start", ["d3", "raw_data"], _start);
  main
    .variable(observer("stopold"))
    .define("stopold", ["d3", "raw_data"], _stopold);
  main.variable(observer("stop")).define("stop", ["d3", "stopold"], _stop);
  main.variable(observer()).define(["md"], _38);
  main
    .variable(observer("format"))
    .define("format", ["data", "labelsRR", "x", "labels", "y"], _format);
  main.variable(observer("schemes")).define("schemes", _schemes);
  main.variable(observer()).define(["topojson", "us"], _41);
  main.variable(observer("states")).define("states", ["us"], _states);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main
    .variable(observer("topojson"))
    .define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer()).define(["md"], _46);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("slider", child2);
  const child3 = runtime.module(define3);
  main.import("movingAverage", child3);
  const child4 = runtime.module(define4);
  main.import("TimeChart", child4);
  main.import("TimeAxis", child4);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer("dateToString")).define("dateToString", _dateToString);
  main.variable(observer()).define(["md"], _53);
  main.variable(observer()).define(["md"], _54);
  main
    .variable(observer("timeChart2"))
    .define(
      "timeChart2",
      ["TimeChart", "interval", "start", "stop", "width"],
      _timeChart2
    );
  main
    .variable(observer("timeChart"))
    .define(
      "timeChart",
      ["TimeChart", "interval", "start", "stop", "width"],
      _timeChart
    );
  main.variable(observer()).define(["md"], _57);
  return main;
}

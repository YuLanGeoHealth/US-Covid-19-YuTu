// https://observablehq.com/@observablehq/timechart@1602
function _1(md){return(
md`<h1 style="display: none;">Observable TimeChart</h1>

# TimeChart

TimeChart is an importable component for visualizing time-series data. It can show many signals time-aligned as space-efficient horizon charts. If you hover over a chart, all charts on the page show the value at that time, aiding interpretation.`
)}

function _2(TimeAxis,interval,start,stop){return(
TimeAxis({interval, start, stop})
)}

function _blues(TimeChart,wave,interval,start,stop){return(
TimeChart(wave({max: 100, round: true}), {title: "Blues", interval, start, stop, max: 100, scheme: "blues", marginTop: -16})
)}

function _greens(TimeChart,add,wave,interval,start,stop){return(
TimeChart(add(wave({max: 100, round: true, shift: 50, pow: 20}), wave({max: 20, round: true, period: 12})), {title: "Greens", interval, start, stop, max: 120, scheme: "greens", marginTop: -16})
)}

function _reds(TimeChart,add,blues,greens,interval,start,stop){return(
TimeChart(add(blues, greens), {title: "Reds", interval, start, stop, max: 130, scheme: "reds", marginTop: -16})
)}

function _6(md){return(
md`To use in your notebook:

~~~js
import {TimeChart, TimeAxis} from "@observablehq/timechart"
~~~

Then, call TimeChart and TimeAxis to create charts as described below.`
)}

function _7(md){return(
md`---

## Configuration

TimeChart expects a consistent *x*-axis across plots so that you can see coincident patterns. TimeChart also expects exactly one data point per pixel to maximize data density. When you call TimeChart and TimeAxis, you pass in these options.`
)}

function _interval(d3){return(
d3.utcMinute.every(10)
)}

function _stop(interval){return(
interval()
)}

function _start(interval,stop,width){return(
interval.offset(stop, -width)
)}

function _11(md){return(
md`TimeChart expects *interval* to be specified as a [d3-time interval](https://github.com/d3/d3-time), though you can also use a named time interval such as “hour” or “minute” if you prefer.`
)}

function _12(md){return(
md`---

## Example usage

First we need data: an array of {*date*, *value*} objects at the expected time interval, such as hourly. TimeChart treats missing data as having zero value. We’ll use fake data here (a sine wave with random noise). You’ll want to replace this fake data with a [database client](/@observablehq/databases) or by fetching from an API.`
)}

function _signups(wave){return(
wave({min: 0, max: 200, period: 120, round: true})
)}

function _14(md){return(
md`Next we need an axis. This is a separate component so that it needn’t be repeated for each chart. Sprinkle as many as you like throughout your notebook.`
)}

function _15(TimeAxis,interval,start,stop){return(
TimeAxis({interval, start, stop})
)}

function _16(md){return(
md`Lastly, a chart! TimeChart takes two arguments, *data* and *options*. The *data* an array of {*date*, *value*} objects, as shown above. Three options are required, and below we pass in the corresponding cells of the same name we defined above:

* *interval* - the time interval of the data (*e.g.*, hourly)
* *start* - the start time of the chart (inclusive)
* *stop* - the stop time of the chart (exclusive)

In addition, we recommend:

* *title* - so that people know what they’re looking at
* *max* - the maximum expected *y*-value, for consistency over time`
)}

function _17(TimeChart,signups,interval,start,stop){return(
TimeChart(signups, {interval, start, stop, title: "Sign-ups", max: 240})
)}

function _18(md){return(
md`TimeChart generates a [horizon chart](/@d3/horizon-chart) with four bands by default. You can change the number of bands as desired. A single band will produce a conventional area chart.`
)}

function _19(TimeChart,signups,interval,start,stop){return(
TimeChart(signups, {interval, start, stop, title: "Sign-ups", max: 240, bands: 1})
)}

function _20(md){return(
md`The *scheme* option, which defaults to RdGy—red for negative, gray for positive—controls which colors are used for the bands. All ColorBrewer sequential and diverging color schemes are supported; see [D3 Color Schemes](/@d3/color-schemes). You may also pass in an array of arrays as the *scheme* argument following the same structure as D3 (*e.g.*, d3.schemeBlues).`
)}

function _21(TimeChart,signups,interval,start,stop){return(
TimeChart(signups, {interval, start, stop, title: "Sign-ups", max: 240, scheme: "PuRd"})
)}

function _22(md){return(
md`---

## Advanced usage: negative values

If the data includes negative values, these values will by default hang down from the top of the chart in red.`
)}

function _23(TimeChart,posneg,interval,start,stop){return(
TimeChart(posneg, {interval, start, stop})
)}

function _24(md){return(
md`Plotting negative values is also useful for paired signals, for example incoming (positive) and outgoing (negative) traffic volume to a network switch. Set the *marginTop* option to -16 to remove the gap between cells.`
)}

function _25(TimeChart,wave,interval,start,stop){return(
TimeChart(wave({min: 0, max: 1}), {title: "Incoming", interval, start, stop, max: 1, format: "+.2f"})
)}

function _26(TimeChart,wave,interval,start,stop){return(
TimeChart(wave({min: 0, max: -1}), {title: "Outgoing", interval, start, stop, max: 1, marginTop: -16, format: "+.2f"})
)}

function _27(md){return(
md`The *mode* option changes the behavior of the horizon chart for negative values. The allowed values are:

* *offset* - negative values to hang down from the top
* *mirror* - reflect so that negative values grow up from the bottom

The default *offset* mode is preferred for accessibility, as *mirror* relys solely on hue to distinguish between positive and negative values. To better show the two modes, below are single-band charts without random noise.`
)}

function _28(TimeChart,wave,interval,start,stop){return(
TimeChart(wave({min: -1, max: 1, noise: 0}), {interval, start, stop, bands: 1, mode: "offset"})
)}

function _29(TimeChart,wave,interval,start,stop){return(
TimeChart(wave({min: -1, max: 1, noise: 0}), {interval, start, stop, bands: 1, mode: "mirror"})
)}

function _30(md){return(
md`You should choose a diverging color scheme when plotting negative values: BrBG, PRGn, PiYG, PuOr, RdBu, RdGy, RdYlBu, RdYlGn, or Spectral. If you specify a sequential color scheme (such as blues), negative values will be drawn in gray.`
)}

function _31(TimeChart,posneg,interval,start,stop){return(
TimeChart(posneg, {interval, start, stop, scheme: "piyg"})
)}

function _32(TimeChart,posneg,interval,start,stop){return(
TimeChart(posneg, {interval, start, stop, scheme: "rdbu"})
)}

function _33(TimeChart,posneg,interval,start,stop){return(
TimeChart(posneg, {interval, start, stop, scheme: "blues"})
)}

function _posneg(wave){return(
wave({min: -1, max: 1})
)}

function _35(md){return(
md`---

## Advanced usage: custom defaults

The TimeChart.defaults function returns a TimeChart-like function that has the specified options as defaults. This is useful to avoid repeating options that should by shared by all charts on the page, such as *interval*, *start*, and *stop*. You can also change the default color scheme.`
)}

function _timeChart(TimeChart,interval,start,stop){return(
TimeChart.defaults({interval, start, stop, scheme: "purples"})
)}

function _timeAxis(TimeAxis,interval,start,stop){return(
TimeAxis.defaults({interval, start, stop})
)}

function _38(timeAxis){return(
timeAxis()
)}

function _39(timeChart,signups){return(
timeChart(signups, {title: "Sign-ups"})
)}

function _40(md){return(
md`---

## Advanced usage: onclick

The *onclick* option takes a function to be called when the user clicks on the chart. You can use this, for example, to open another notebook or to drive something else on the page (say with a mutable). Call this.invert(*event*) to have TimeChart lookup the data that was clicked on.`
)}

function _41(timeChart,signups,open){return(
timeChart(signups, {
  title: "Sign-ups", 
  onclick(event) {
    const {date} = this.invert(event);
    open(`/d/e817ba556034bba5?date=${date.toISOString()}`, `target=_blank`);
  }
})
)}

function _42(md){return(
md`---

## Advanced usage: views

TimeChart is compatible with Observable’s viewof operator. The value of the chart is the data you pass in.`
)}

function _florps(timeChart,wave){return(
timeChart(wave(), {title: "Florps"})
)}

function _44(florps){return(
florps
)}

function _45(md){return(
md`---

## Advanced usage: multiple charts in one cell

Typically each chart goes in its own cell for ease of ordering and commenting. But if desired you can combine multiple charts and an axis in a cell as shown below.`
)}

function _46(html,timeAxis,wave,timeChart){return(
html`${timeAxis()}${[wave(), wave()].map((data, i) => timeChart(data, {title: `wave ${i}`}))}`
)}

function _47(md){return(
md`---

## Implementation`
)}

function _TimeChart(d3,localeFormat,maybeInterval,maybeCurve,maybeScheme,maybeMode,DOM,round,addEventListener,Inputs,removeEventListener)
{
  let clientX = document.body.clientWidth + 14;

  function TimeChart(data, options = {}) {

    // If data is a promise, render nothing, then replace it with the actual chart later.
    if (typeof data.then === "function") {
      const chart = TimeChart([], options);
      Promise.resolve(data).then((data) => chart.replaceWith(TimeChart(data, options)));
      return chart;
    }

    // Extract option.s
    let {
      interval,
      max = d3.quantile(data, 0.99, d => Math.abs(d.value) || NaN) || 1,
      label, // alias for title
      title = label,
      locale = "en-US",
      dateFormat = localeFormat(locale),
      format = localeFormat(locale),
      marginTop = 0, // try -16 to remove the gap between cells
      marginLeft = 0,
      marginRight = 0,
      height = 49, // inclusive of margin
      width,
      stop,
      start,
      bands = 4,
      onclick,
      curve = d3.curveStepBefore,
      scheme = d3.schemeRdGy,
      mode = "offset"
    } = options;
  
    // Normalize string arguments
    if (typeof format === "string") format = d3.format(format);
    else if (typeof format !== "function") format = localeFormat(locale, format);
    if (typeof dateFormat === "string") dateFormat = d3.utcFormat(dateFormat);
    else if (typeof dateFormat !== "function") dateFormat = localeFormat(locale, dateFormat);
    interval = maybeInterval(interval);
    curve = maybeCurve(curve);
    scheme = maybeScheme(scheme);
    mode = maybeMode(mode);
    bands = Math.floor(bands);
    if (!(bands >= 1 && bands < scheme.length)) throw new Error(`invalid bands: ${bands}`);
    if (stop === undefined) stop = interval();
    if (start === undefined) start = interval.offset(stop, -width);
    
    // Normalize the color scheme
    let colors;
    if (scheme.length < 11) { // assume sequential, pad with greys
      colors = scheme[Math.max(3, bands)];
      if (bands < 3) colors = colors.slice(3 - bands).concat(new Array(3 - bands));
      colors = [...d3.reverse(d3.schemeGreys[colors.length]), undefined, ...colors];
    } else { // otherwise assume diverging
      colors = scheme[Math.max(3, 2 * bands + 1)];
    }

    // Normalize the data to the given interval, filling in any missing data with zeroes.
    const values = new Map(data.map(d => [+d.date, +d.value]));
    const [ymin, ymax] = d3.extent(values, ([, value]) => value);
    data = interval.range(start, stop).map(date => ({date, value: values.get(+date) || 0}));
    if (width === undefined) width = data.length;

    const x = d3.scaleUtc([start, stop], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear([0, max], [0, -bands * height]);
    const clip = DOM.uid("clip");
    const path = DOM.uid("path");

    const svg = d3.create("svg")
        .attr("viewBox", `0 ${-marginTop} ${width} ${height}`)
        .attr("width", width)
        .attr("height", height)
        .property("style", `
          display: block;
          font: 12px var(--sans-serif, system-ui, sans-serif);
          font-variant-numeric: tabular-nums;
          margin: 0 0 ${+marginTop}px calc(100% - ${width}px);
          overflow: visible;
        `);

    const tooltip = svg.append("title");

    svg.append("clipPath")
        .attr("id", clip.id)
      .append("rect")
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

    svg.append("defs").append("path")
        .attr("id", path.id)
        .attr("d", d3.area()
            .curve(curve)
            .defined(d => !isNaN(d.value))
            .x(d => round(x(d.date)))
            .y0(0)
            .y1(d => round(y(d.value)))
          (data));

    const g = svg.append("g")
        .attr("clip-path", clip);

    g.append("g")
      .selectAll("use")
      .data(d3.range(bands)
        .map(i => [i, colors[i + 1 + (colors.length >> 1)]])
        .filter(([i, color]) => color != null && ymax > max * i / bands))
      .join("use")
        .attr("fill", ([, color]) => color)
        .attr("transform", ([i]) => `translate(0,${(i + 1) * height})`)
        .attr("xlink:href", path.href);

    g.append("g")
      .selectAll("use")
      .data(d3.range(bands)
        .map(i => [i, colors[(colors.length >> 1) - 1 - i]])
        .filter(([i, color]) => color != null && -ymin > max * i / bands))
      .join("use")
        .attr("fill", ([, color]) => color)
        .attr("transform", mode === "mirror"
            ? ([i]) => `translate(0,${(i + 1) * height}) scale(1,-1)`
            : ([i]) => `translate(0,${-i * height})`)
        .attr("xlink:href", path.href);

    const overlay = svg.append("g");

    if (title != null) overlay.append("text")
        .attr("class", "title")
        .attr("font-weight", "bold")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("y", 2 * 16)
        .attr("dy", "0.32em")
        .text(title + "");

    overlay.append("text")
        .attr("class", "label")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("text-anchor", "end")
        .attr("y", height - 16 - 1)
        .attr("dx", -3)
        .attr("dy", "0.32em");

    overlay.selectAll("text")
      .select(function() {
        const clone = this.cloneNode(true);
        return this.parentNode.insertBefore(clone, this);
      })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4);

    overlay.append("line")
        .attr("class", "line")
        .attr("stroke", "white")
        .attr("stroke-dasharray", "1,1")
        .style("mix-blend-mode", "screen")
        .attr("y1", 0)
        .attr("y2", height);

    overlay.select("line").clone(true)
        .attr("stroke", "black")
        .attr("stroke-dashoffset", 1);

    const overlayLine = overlay.selectAll(".line");
    const overlayLabel = overlay.selectAll(".label");
    const overlayText = overlay.selectAll(".title");

    function invert(event) {
      const [mx] = d3.pointer(event, svg.node());
      const i = d3.bisector(d => d.date).left(data, x.invert(mx), 0, data.length - 1);
      return data[i];
    }

    function mousemoved(event) {
      clientX = event.clientX;
      const d = invert(event);
      overlayLabel.attr("x", x(d.date)).text(format(d.value));
      overlayLine.attr("x1", x(d.date) - 0.5).attr("x2", x(d.date) - 0.5);
      tooltip.text(dateFormat(d.date));
    }

    function resized() {
      overlayText.attr("x", Math.max(0, width - document.body.clientWidth) + 4);
    }

    resized();
    addEventListener("resize", resized);
    addEventListener("mousemove", mousemoved);
    requestAnimationFrame(() => mousemoved({clientX, clientY: 0}));

    Inputs.disposal(svg.node()).then(() => {
      removeEventListener("resize", resized);
      removeEventListener("mousemove", mousemoved);
    });

    return Object.assign(svg.node(), {onclick, value: data, invert});
  }

  TimeChart.defaults = defaults => {
    return (data, options) => {
      return TimeChart(data, {...defaults, ...options});
    };
  };

  return TimeChart;
}


function _TimeAxis(maybeInterval,html,d3)
{
  function TimeAxis({
    interval,
    width,
    height = 33,
    marginLeft = 0,
    marginRight = 0,
    stop,
    start,
  } = {}) {
    interval = maybeInterval(interval);
    if (stop === undefined) stop = interval();
    if (start === undefined) start = interval.offset(stop, -width);
    if (width === undefined) width = interval.range(start, stop).length;
    return html`<svg viewBox="0 0 ${width} ${height}" width=${width} height=${height} style="display: block; margin-left: calc(100% - ${width}px);">
    ${d3.create("svg:g")
        .call(d3.axisTop(d3.scaleTime([start, stop], [marginLeft, width - marginRight])).ticks(width / 120))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone(true).attr("y2", "100vh").attr("stroke-opacity", 0.12))
        .attr("transform", `translate(0, 33)`)
      .node()}
  </svg>`;
  }

  TimeAxis.defaults = defaults => {
    return options => {
      return TimeAxis({...defaults, ...options});
    };
  };

  return TimeAxis;
}


function _round(){return(
function round(x) {
  return Math.round(x * 2) / 2;
}
)}

function _maybeInterval(d3,camelize){return(
function maybeInterval(interval) {
  if (interval == null) throw new Error("missing interval");
  if (!(interval && typeof interval.range === "function")) {
    const i = (interval + "").toLowerCase();
    switch (i) {
      case "millisecond":
      case "second":
      case "minute":
      case "hour":
      case "day":
      case "week":
      case "sunday":
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "month":
      case "year":
        return d3[`utc${camelize(i)}`];
    }
    throw new Error(`invalid interval: ${interval}`);
  }
  return interval;  
}
)}

function _maybeCurve(d3,camelize){return(
function maybeCurve(curve) {
  if (curve == null) throw new Error("missing curve");
  if (typeof curve !== "function") {
    const c = d3[`curve${camelize(curve)}`];
    if (c === undefined) throw new Error(`unknown curve: ${curve}`);
    curve = c;
  }
  return curve;
}
)}

function _maybeScheme(d3){return(
function maybeScheme(scheme) {
  if (scheme == null) throw new Error("missing scheme");
  if (!Array.isArray(scheme)) {
    const s = (scheme + "").toLowerCase();
    switch (s) {
      case "brbg": return d3.schemeBrBG;
      case "prgn": return d3.schemePRGn;
      case "piyg": return d3.schemePiYG;
      case "puor": return d3.schemePuOr;
      case "rdbu": return d3.schemeRdBu;
      case "rdgy": return d3.schemeRdGy;
      case "rdylbu": return d3.schemeRdYlBu;
      case "rdylgn": return d3.schemeRdYlGn;
      case "spectral": return d3.schemeSpectral;
      case "blues": return d3.schemeBlues;
      case "greens": return d3.schemeGreens;
      case "greys": return d3.schemeGreys;
      case "oranges": return d3.schemeOranges;
      case "purples": return d3.schemePurples;
      case "reds": return d3.schemeReds;
      case "bugn": return d3.schemeBuGn;
      case "bupu": return d3.schemeBuPu;
      case "gnbu": return d3.schemeGnBu;
      case "orrd": return d3.schemeOrRd;
      case "pubu": return d3.schemePuBu;
      case "pubugn": return d3.schemePuBuGn;
      case "purd": return d3.schemePuRd;
      case "rdpu": return d3.schemeRdPu;
      case "ylgn": return d3.schemeYlGn;
      case "ylgnbu": return d3.schemeYlGnBu;
      case "ylorbr": return d3.schemeYlOrBr;
      case "ylorrd": return d3.schemeYlOrRd;
    }
    throw new Error(`invalid scheme: ${scheme}`);
  }
  return scheme;
}
)}

function _maybeMode(){return(
function maybeMode(mode) {
  switch (mode = (mode + "").toLowerCase()) {
    case "offset": case "mirror": return mode;
  }
  throw new Error(`unknown mode: ${mode}`);
}
)}

function _camelize(){return(
function camelize(string) {
  return string
    .toLowerCase()
    .split(/-/g)
    .map(([f, ...r]) => `${f.toUpperCase()}${r.join("")}`)
    .join("");
}
)}

function _localeFormat(){return(
function localeFormat(locale, format) {
  return date => date.toLocaleString(locale, format);
}
)}

function _wave(interval,start,stop){return(
function wave({
  min = 0,
  max = 1, 
  shift = 0,
  period = 24 * 6, // matching the default 10-minute interval
  noise = 0.2,
  pow = 1,
  round = false
} = {}) {
  return interval.range(start, stop).map((date, i) => {
    const t = (Math.sin((i - shift) / period * 2 * Math.PI) + 1) / 2;
    const n = Math.random();
    let value = +min + (max - min) * (t ** pow * (1 - noise) + n * noise);
    if (round) value = Math.round(value);
    return {date, value};
  });
}
)}

function _add(d3){return(
function add(first, ...series) {
  return first.map(({date, value}, i) => ({date, value: value + d3.sum(series, s => s[i].value)}));
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["TimeAxis","interval","start","stop"], _2);
  main.variable(observer("viewof blues")).define("viewof blues", ["TimeChart","wave","interval","start","stop"], _blues);
  main.variable(observer("blues")).define("blues", ["Generators", "viewof blues"], (G, _) => G.input(_));
  main.variable(observer("viewof greens")).define("viewof greens", ["TimeChart","add","wave","interval","start","stop"], _greens);
  main.variable(observer("greens")).define("greens", ["Generators", "viewof greens"], (G, _) => G.input(_));
  main.variable(observer("viewof reds")).define("viewof reds", ["TimeChart","add","blues","greens","interval","start","stop"], _reds);
  main.variable(observer("reds")).define("reds", ["Generators", "viewof reds"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("interval")).define("interval", ["d3"], _interval);
  main.variable(observer("stop")).define("stop", ["interval"], _stop);
  main.variable(observer("start")).define("start", ["interval","stop","width"], _start);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("signups")).define("signups", ["wave"], _signups);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["TimeAxis","interval","start","stop"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["TimeChart","signups","interval","start","stop"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["TimeChart","signups","interval","start","stop"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["TimeChart","signups","interval","start","stop"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["TimeChart","posneg","interval","start","stop"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["TimeChart","wave","interval","start","stop"], _25);
  main.variable(observer()).define(["TimeChart","wave","interval","start","stop"], _26);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer()).define(["TimeChart","wave","interval","start","stop"], _28);
  main.variable(observer()).define(["TimeChart","wave","interval","start","stop"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["TimeChart","posneg","interval","start","stop"], _31);
  main.variable(observer()).define(["TimeChart","posneg","interval","start","stop"], _32);
  main.variable(observer()).define(["TimeChart","posneg","interval","start","stop"], _33);
  main.variable(observer("posneg")).define("posneg", ["wave"], _posneg);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer("timeChart")).define("timeChart", ["TimeChart","interval","start","stop"], _timeChart);
  main.variable(observer("timeAxis")).define("timeAxis", ["TimeAxis","interval","start","stop"], _timeAxis);
  main.variable(observer()).define(["timeAxis"], _38);
  main.variable(observer()).define(["timeChart","signups"], _39);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer()).define(["timeChart","signups","open"], _41);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer("viewof florps")).define("viewof florps", ["timeChart","wave"], _florps);
  main.variable(observer("florps")).define("florps", ["Generators", "viewof florps"], (G, _) => G.input(_));
  main.variable(observer()).define(["florps"], _44);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer()).define(["html","timeAxis","wave","timeChart"], _46);
  main.variable(observer()).define(["md"], _47);
  main.variable(observer("TimeChart")).define("TimeChart", ["d3","localeFormat","maybeInterval","maybeCurve","maybeScheme","maybeMode","DOM","round","addEventListener","Inputs","removeEventListener"], _TimeChart);
  main.variable(observer("TimeAxis")).define("TimeAxis", ["maybeInterval","html","d3"], _TimeAxis);
  main.variable(observer("round")).define("round", _round);
  main.variable(observer("maybeInterval")).define("maybeInterval", ["d3","camelize"], _maybeInterval);
  main.variable(observer("maybeCurve")).define("maybeCurve", ["d3","camelize"], _maybeCurve);
  main.variable(observer("maybeScheme")).define("maybeScheme", ["d3"], _maybeScheme);
  main.variable(observer("maybeMode")).define("maybeMode", _maybeMode);
  main.variable(observer("camelize")).define("camelize", _camelize);
  main.variable(observer("localeFormat")).define("localeFormat", _localeFormat);
  main.variable(observer("wave")).define("wave", ["interval","start","stop"], _wave);
  main.variable(observer("add")).define("add", ["d3"], _add);
  return main;
}

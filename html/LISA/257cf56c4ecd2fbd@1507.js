import define1 from "./450051d7f1174df8@254.js";
import define2 from "./e93997d5089d7165@2303.js";

function _1(md) {
  return md`
# Local LISA & SatScan Animated Bivariate Map of COVID-19 2021
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

function _colors_li(html, schemes_lisa) {
  const form = html`<form
    style="display: flex; align-items: center; min-height: 33px; font: 12px sans-serif;"
  >
    <label
      ><select name="i">
        ${schemes_lisa.map((c) =>
          Object.assign(html`<option></option>`, { textContent: c.name })
        )}</select
      ><span style="margin-left: 0.5em;">color scheme</span></label
    >
  </form>`;
  form.i.selectedIndex = 1;
  form.oninput = () => (form.value = schemes_lisa[form.i.selectedIndex].colors);
  form.oninput();
  return form;
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

function _schemes_lisa() {
  return [
    {
      name: "LISA",
      colors: [
        "#eff3ff",
        "#cbc9e2",
        "#fa9fb5",
        "#fb6a4a",
        "#bdd7e7",
        "#9e9ac8",
        "#f768a1",
        "#ef3b2c",
        "#6baed6",
        "#756bb1",
        "#dd3497",
        "#cb181d",
        "#2171b5",
        "#54278f",
        "#ae017e",
        "#99000d",
      ],
    },
    {
      name: "LISA1",
      colors: [
        "#eff3ff",
        "#cbc9e2",
        "#fa9fb5",
        "#fb6a4a",
        "#bdd7e7",
        "#9e9ac8",
        "#f768a1",
        "#ef3b2c",
        "#6baed6",
        "#756bb1",
        "#dd3497",
        "#cb181d",
        "#2171b5",
        "#54278f",
        "#ae017e",
        "#99000d",
      ],
    },
  ];
}

async function _dates(FileAttachment) {
  // const data = await d3.csv("https://raw.githubusercontent.com/YuLan1014/covid/main/allcluster.csv", d => {
  //   return d.date;
  // });
  // return [...new Set(data)];
  const data = await FileAttachment("allcluster.csv").csv();
  var dd = data.map(function (d) {
    return d.date;
  });
  return [...new Set(dd)];
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

function _map(
  d3,
  DOM,
  legend,
  topojson,
  us,
  color_satscan,
  data_satscan,
  dateToString,
  date,
  states,
  format_satscan,
  legend_lisa,
  color,
  data_lisa,
  format
) {
  const width = 1400;
  const height = 430;
  const margin = 10;

  // create SVG element
  let svg = d3.select(DOM.svg(width, height));
  const path = d3.geoPath();

  // Add the text box for State
  svg
    .append("text")
    .attr("x", width / 2 - margin * 10)
    .attr("y", height - 30)
    .attr("dy", ".35em")
    .text();

  //satscan
  svg
    .append(legend)
    .attr("transform", "translate(" + 9 * margin + "," + 35 * margin + ")");

  const aa = svg.append("g");
  var satMap = aa
    .append("g")
    .attr(
      "transform",
      "translate(" + margin / 2 + "," + margin + ") scale(0.7)"
    )
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
    .attr("fill", (d) =>
      color_satscan(data_satscan.get(d.id + " " + dateToString(date)))
    )
    .attr("d", path)
    .on("mouseover", function (d) {
      d3.select(this).attr("stroke", "orange");
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("stroke", "null");
    })
    .on("click", function (e, d) {
      d3.selectAll("path").style("stroke", null);
      d3.select(this).style("stroke", "orange");
      svg
        .select("text")
        .text(
          `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}, ID: ${
            d.id
          }`
        );
    })
    .append("title")
    .text(
      (d) => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
${format_satscan(data_satscan.get(d.id + " " + dateToString(date)))}`
    );

  aa.append("path")
    .attr(
      "transform",
      "translate(" + margin / 2 + "," + margin + ") scale(0.7)"
    )
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  //lisa
  svg
    .append(legend_lisa)
    .attr(
      "transform",
      "translate(" + (width / 2 - 2 * margin) + "," + 35 * margin + ")"
    );
  var countyMap = aa
    .append("g")
    //.attr("transform","translate(580,10) scale(0.6)")
    .attr(
      "transform",
      "translate(" + (width / 2 - 2 * margin) + "," + margin + ") scale(0.7)"
    )
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
    .attr("fill", (d) => color(data_lisa.get(d.id + " " + dateToString(date))))
    .attr("d", path)
    .on("mouseover", function (d) {
      d3.select(this).attr("stroke", "orange");
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("stroke", "null");
    })
    .on("click", function (e, d) {
      d3.selectAll("path").style("stroke", null);
      d3.select(this).style("stroke", "orange");
      svg
        .select("text")
        .text(
          `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}, ID: ${
            d.id
          }`
        );
    })
    .append("title")
    .text(
      (d) => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
${format(data_lisa.get(d.id + " " + dateToString(date)))}`
    );

  aa.append("path")
    .attr(
      "transform",
      "translate(" + (width / 2 - 2 * margin) + "," + margin + ") scale(0.7)"
    )
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  // Update the fill based on date scrubber
  function update(date) {
    countyMap.attr("fill", function (d) {
      var fclass = data_lisa.get(d.id + " " + dateToString(date));
    });
    satMap.attr("fill", function (d) {
      var fclass = data_satscan.get(d.id + " " + dateToString(date));
    });
  }
  var zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  function zoomed(event) {
    const { transform } = event;
    aa.attr("transform", transform);
    aa.attr("stroke-width", 1 / transform.k);
  }

  aa.call(zoom);

  //return svg.node();
  return Object.assign(svg.node(), { update });
}

function _legend_lisa(
  DOM,
  svg,
  n,
  d3,
  colors_li,
  data_lisa,
  label_p,
  label_lisa
) {
  return () => {
    const k = 12;
    const arrow = DOM.uid();
    return svg`<g font-family=sans-serif font-size=10 id = "svg1">
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
      } fill=${colors_li[j * n + i]}>
      <title>${data_lisa.title[0]}${label_p[j] && ` (${label_p[j]})`}
${data_lisa.title[1]}${label_lisa[i] && ` (${label_lisa[i]})`}</title>
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
    },6)" text-anchor="middle">${data_lisa.title[0]}</text>
    <text font-weight="bold" dy="0.71em" transform="translate(${(n / 2) * k},${
      n * k + 6
    })" text-anchor="middle">${data_lisa.title[1]}</text>
  </g>
</g>`;
  };
}

function _legend(DOM, svg, n, d3, colors, data_satscan, labelsRR, labels) {
  return () => {
    const k = 12;
    const arrow = DOM.uid();
    return svg`<g font-family=sans-serif font-size=10 id = "svg2">
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
      <title>${data_satscan.title[0]}${labelsRR[j] && ` (${labelsRR[j]})`}
${data_satscan.title[1]}${labels[i] && ` (${labels[i]})`}</title>
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
    },6)" text-anchor="middle">${data_satscan.title[0]}</text>
    <text font-weight="bold" dy="0.71em" transform="translate(${(n / 2) * k},${
      n * k + 6
    })" text-anchor="middle">${data_satscan.title[1]}</text>
  </g>
</g>`;
  };
}

async function _rrmap(FileAttachment) {
  const testww = await FileAttachment("allcluster.csv").csv();
  return new Map(
    testww.map(({ id, rr_c, rr_l, date }) => [id + " " + date, [+rr_c, +rr_l]])
  );
}

function _data_satscan(rrmap) {
  return Object.assign(rrmap, { title: ["RR of cluster", "RR of county"] });
}

async function _lisamap(FileAttachment) {
  const testww = await FileAttachment("lisa.csv").csv();
  return new Map(
    testww.map(({ id, p, clustern, date }) => [
      id + " " + date,
      [+p, +clustern],
    ])
  );
}

function _data_lisa(lisamap) {
  return Object.assign(lisamap, { title: ["p value ", "Group "] });
}

function _labels() {
  return ["Group 1", "Group 2", "Group 3", "Group 4"];
}

function _label_p() {
  return ["0.05", "0.01", "0.001", "0.0001"];
}

function _labelsRR() {
  return ["Group 1", "Group 2", "Group 3", "Group 4"];
}

function _label_lisa() {
  return ["Low-Low", "Low-High", "High-Low", "High-High"];
}

function _n(colors) {
  return Math.floor(Math.sqrt(colors.length));
}

function _x(d3, n) {
  return d3.scaleLinear([1, 2, 3, 4], d3.range(n));
}

function _x_satscan(d3, data_satscan, n) {
  return d3.scaleQuantile(
    Array.from(data_satscan.values(), (d) => d[0]),
    d3.range(n)
  );
}

function _y(d3, n) {
  return d3.scaleLinear([1, 2, 3, 4], d3.range(n));
}

function _y_satscan(d3, data_satscan, n) {
  return d3.scaleQuantile(
    Array.from(data_satscan.values(), (d) => d[1]),
    d3.range(n)
  );
}

function _color_satscan(colors, y_satscan, x_satscan, n) {
  return (value) => {
    if (!value) return "#ccc";
    let [a, b] = value;
    return colors[y_satscan(b) + x_satscan(a) * n];
  };
}

function _color(colors_li, y, x, n) {
  return (value) => {
    if (!value || value === undefined) return "#ccc";
    let [a, b] = value;
    return colors_li[y(b) + x(a) * n];
  };
}

function _format(data_lisa, label_p, x, label_lisa, y) {
  return (value) => {
    if (!value) return "N/A";
    let [a, b] = value;
    return `${data_lisa.title[0]}${label_p[x(a)] && `${label_p[x(a)]}`} 
${data_lisa.title[1]}${label_lisa[y(b)] && `${label_lisa[y(b)]}`}`;
  };
}

function _format_satscan(data_satscan, labelsRR, x_satscan, labels, y_satscan) {
  return (value) => {
    if (!value) return "N/A";
    let [a, b] = value;
    return `${data_satscan.title[0]} ${a} ${
      labelsRR[x_satscan(a)] && ` ${labelsRR[x_satscan(a)]}`
    } 
${data_satscan.title[1]} ${b} ${labels[y_satscan(b)] && ` ${labels[y_satscan(b)]}`}`;
  };
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

function _dateToString() {
  return function dateToString(date) {
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  };
}

function _update(map, date) {
  return map.update(date);
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
      "allcluster.csv",
      {
        url: new URL("../../data/allcluster.csv", import.meta.url),
        mimeType: "text/csv",
        toString,
      },
    ],
    [
      "lisa.csv",
      {
        url: new URL("../../data/lisa.csv", import.meta.url),
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
  main
    .variable(observer("viewof colors"))
    .define("viewof colors", ["html", "schemes"], _colors);
  main
    .variable(observer("colors"))
    .define("colors", ["Generators", "viewof colors"], (G, _) => G.input(_));
  main
    .variable(observer("viewof colors_li"))
    .define("viewof colors_li", ["html", "schemes_lisa"], _colors_li);
  main
    .variable(observer("colors_li"))
    .define("colors_li", ["Generators", "viewof colors_li"], (G, _) =>
      G.input(_)
    );
  main.variable(observer("schemes")).define("schemes", _schemes);
  main.variable(observer("schemes_lisa")).define("schemes_lisa", _schemes_lisa);
  main.variable(observer("dates")).define("dates", ["FileAttachment"], _dates);
  main
    .variable(observer("viewof date"))
    .define("viewof date", ["Scrubber", "dates", "d3"], _date);
  main
    .variable(observer("date"))
    .define("date", ["Generators", "viewof date"], (G, _) => G.input(_));
  main
    .variable(observer("map"))
    .define(
      "map",
      [
        "d3",
        "DOM",
        "legend",
        "topojson",
        "us",
        "color_satscan",
        "data_satscan",
        "dateToString",
        "date",
        "states",
        "format_satscan",
        "legend_lisa",
        "color",
        "data_lisa",
        "format",
      ],
      _map
    );
  main
    .variable(observer("legend_lisa"))
    .define(
      "legend_lisa",
      [
        "DOM",
        "svg",
        "n",
        "d3",
        "colors_li",
        "data_lisa",
        "label_p",
        "label_lisa",
      ],
      _legend_lisa
    );
  main
    .variable(observer("legend"))
    .define(
      "legend",
      ["DOM", "svg", "n", "d3", "colors", "data_satscan", "labelsRR", "labels"],
      _legend
    );
  main.variable(observer("rrmap")).define("rrmap", ["FileAttachment"], _rrmap);
  main
    .variable(observer("data_satscan"))
    .define("data_satscan", ["rrmap"], _data_satscan);
  main
    .variable(observer("lisamap"))
    .define("lisamap", ["FileAttachment"], _lisamap);
  main
    .variable(observer("data_lisa"))
    .define("data_lisa", ["lisamap"], _data_lisa);
  main.variable(observer("labels")).define("labels", _labels);
  main.variable(observer("label_p")).define("label_p", _label_p);
  main.variable(observer("labelsRR")).define("labelsRR", _labelsRR);
  main.variable(observer("label_lisa")).define("label_lisa", _label_lisa);
  main.variable(observer("n")).define("n", ["colors"], _n);
  main.variable(observer("x")).define("x", ["d3", "n"], _x);
  main
    .variable(observer("x_satscan"))
    .define("x_satscan", ["d3", "data_satscan", "n"], _x_satscan);
  main.variable(observer("y")).define("y", ["d3", "n"], _y);
  main
    .variable(observer("y_satscan"))
    .define("y_satscan", ["d3", "data_satscan", "n"], _y_satscan);
  main
    .variable(observer("color_satscan"))
    .define(
      "color_satscan",
      ["colors", "y_satscan", "x_satscan", "n"],
      _color_satscan
    );
  main
    .variable(observer("color"))
    .define("color", ["colors_li", "y", "x", "n"], _color);
  main
    .variable(observer("format"))
    .define(
      "format",
      ["data_lisa", "label_p", "x", "label_lisa", "y"],
      _format
    );
  main
    .variable(observer("format_satscan"))
    .define(
      "format_satscan",
      ["data_satscan", "labelsRR", "x_satscan", "labels", "y_satscan"],
      _format_satscan
    );
  main.variable(observer("states")).define("states", ["us"], _states);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main
    .variable(observer("topojson"))
    .define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("slider", child2);
  main.variable(observer("dateToString")).define("dateToString", _dateToString);
  main.variable(observer("update")).define("update", ["map", "date"], _update);
  return main;
}

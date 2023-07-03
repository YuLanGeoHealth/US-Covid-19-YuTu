import define1 from "./746209ee3f3ea6d2@224.js";
import define2 from "./99d748bec11c4235@418.js";
import define3 from "./17428bc970543296@1461.js";
import define4 from "./a33468b95d0b15b0@808.js";
import define5 from "./e93997d5089d7165@2303.js";

function _1(md) {
  return md`
# 3D Relative Risk of U.S. Lower 48 with Plotly with basemap
  `;
}

function _start(date) {
  return date({ value: "2021-01-01" });
}

function _end(date) {
  return date({ value: "2021-05-01" });
}

function _MinRR(slider) {
  return slider({
    min: 0,
    max: 20,
    step: 1,
    value: 2,
    title: "Minimum Relative Risk",
    // description: "Integers from zero through 10"
  });
}

function _scatter3D(
  d3,
  colorScheme,
  populationRange,
  distinctPopulations,
  newpts,
  start,
  zipData,
  population,
  width,
  end,
  DOM,
  Plotly
) {
  const interpolator = (normalizedPopulation) => [
    normalizedPopulation,
    d3.scaleSequential(colorScheme)(normalizedPopulation),
  ];
  const getColorScale = d3
    .scaleSequential(interpolator)
    .domain(populationRange);
  const colorscale = distinctPopulations.map((d) => getColorScale(d));
  const zipScatter = [
    {
      x: newpts.map((d) => d.X),
      y: newpts.map((d) => d.Y),
      z: newpts.map((d) => start),
      mode: "lines",
      hoverinfo: "text",
      hovertext: "Basemap",
      // name: 'Boundary',
      lines: { width: 0.1, color: "blue" },
      type: "scatter3d",
    },
    {
      x: zipData.map((d) => d.X),
      z: zipData.map((d) => d.date),
      y: zipData.map((d) => d.Y),
      // name:'Relative Risk',
      mode: "markers",
      opacity: 0.5,
      marker: {
        size: 5,
        color: population,
        opacity: 0.5,
        colorscale, // https://plotly.com/javascript/colorscales/
      },
      hovertemplate:
        "Date" +
        ": %{z} <br>" +
        "RR: %{text[0]}<br>" +
        "Name: %{text[1]}, " +
        "%{text[2]}<br>" +
        "<extra></extra>",
      text: zipData.map((d) => [d.RR_L, d.county_full, d.state_id]),
      type: "scatter3d",
    },
  ]; // zipScatter
  const layout = {
    width: width,
    height: width / 1.5,
    title: "3D Relative Risk of COVID-19",
    showlegend: false,
    scene: {
      // https://plotly.com/python/3d-camera-controls/
      camera: { eye: { x: 0.25, y: 1, z: 1 } },
      aspectmode: "manual", // https://plotly.com/javascript/reference/layout/scene/#layout-scene-aspectmode
      aspectratio: { x: 1.25, y: 1, z: 0.5 },
      xaxis: {
        title: { text: "Longitude" },
        // range: d3.extent(newpts, d => +d.X).reverse().map(d => Math.ceil(d))
        range: [-66.37, -125.41],
        backgroundcolor: "rgb(105, 105,105)",
        gridcolor: "rgb(105, 105,105)",
        showbackground: true,
        // zerolinecolor: "rgb(255, 255, 255)"
      },
      yaxis: {
        title: { text: "Latitude" },
        range: [50.23, 23.8066],
        backgroundcolor: "rgb(105, 105,105)",
        gridcolor: "rgb(105, 105,105)",
        showbackground: true,
        // zerolinecolor: "rgb(255, 255, 255)"
      },
      // range: d3.extent(newpts, d=> +d.Y).reverse().map(d => Math.ceil(d))},
      zaxis: {
        title: { text: "" },
        range: [start, end],
        backgroundcolor: "rgb(192, 192,192)",
        gridcolor: "rgb(233,116,81)",
        showbackground: true,
        zerolinecolor: "rgb(233,116,81)",
      },
    },
    margin: {
      l: 10,
      r: 10,
      b: 10,
      t: 30,
      pad: 10,
    },
  }; // layout

  const div = DOM.element("div");

  Plotly.react(div, zipScatter, layout);

  return div;
}

function _t(legend, width, d3, populationRange, colorScheme) {
  return legend({
    width: width * 0.8,
    color: d3.scaleSequential(populationRange, colorScheme),
    ticks: 5,
    title: "Relative risk",
  });
}

function _population(zipData) {
  return zipData.map((d) => d.RR_L);
}

function _distinctPopulations(population) {
  return [...new Set(population)].sort((a, b) => a - b);
}

function _populationRange(d3, distinctPopulations) {
  return [
    d3.min(distinctPopulations, (s) => +s),
    d3.max(distinctPopulations, (s) => +s),
  ];
}

function _colorScheme(d3, colorSchemes, colorInterpolatorPicker) {
  const interpolators = d3.range(colorSchemes.length * 2).map((d) => {
    if (d % 2 == 0) {
      return { name: colorSchemes[d / 2].strColorScheme.substring(11) };
    } else {
      return {
        name: colorSchemes[(d - 1) / 2].strColorScheme.substring(11) + " (I)",
        value: (t) => colorSchemes[(d - 1) / 2].fnColorScheme(1 - t),
      };
    }
  });

  const colorScheme = colorInterpolatorPicker({
    title: "Color Scheme",
    value: "YlOrRd",
    interpolators: interpolators,
    w: 100,
  });

  return colorScheme;
}

async function _geoJSON(fetchData) {
  const json = await fetchData(
    "https://raw.githubusercontent.com/YuLan1014/covid/main/gz_2010_us_050_00_20m.json"
  );
  return json;
}

function _newpts(geoJSON) {
  const newpts = []; //list of points defining boundaries of polygons
  for (let i in geoJSON["features"]) {
    let feature = geoJSON["features"][i];
    if (feature["geometry"]["type"] == "Polygon") {
      let polygon1 = feature["geometry"]["coordinates"][0];
      for (let j = 0; j < polygon1.length; j++) {
        let coorX = polygon1[j][0];
        let coorY = polygon1[j][1];
        newpts.push({ X: coorX, Y: coorY });
      }
      newpts.push({ X: null, Y: null });
    } else if (feature["geometry"]["type"] == "MultiPolygon") {
      let multip = feature["geometry"]["coordinates"];
      for (let j = 0; j < multip.length; j++) {
        for (let z = 0; z < multip[j].length; z++) {
          for (let n = 0; n < multip[j][z].length; n++) {
            let coorX = multip[j][z][n][0];
            let coorY = multip[j][z][n][1];
            newpts.push({ X: coorX, Y: coorY });
          }
          newpts.push({ X: null, Y: null });
        }
      }
    }
  }
  return newpts;
}

async function _zipData(fetchData, MinRR, start, end) {
  // const data = await fetchData("https://raw.githubusercontent.com/YuLan1014/covid/main/test.csv");
  const data = await fetchData(
    "https://raw.githubusercontent.com/YuLan1014/covid/main/rr3dnew.csv"
  );
  //const lower48Abr = Object.keys(lower48);

  const filtered = data.filter((d) => d.RR_L > MinRR);
  const filtered_date = filtered.filter(
    (d) => d.date >= start && d.date <= end
  );
  //Assign each zipcode the state's population for visualization purposes.
  //In reality, a zip code would be assigned a measure specific to it geographic area
  // filtered.forEach(d => d.rr >1);

  return filtered_date;
}

function _d3(require) {
  return require("d3@6");
}

function _Plotly(require) {
  return require("https://cdn.plot.ly/plotly-latest.min.js");
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main
    .variable(observer("viewof start"))
    .define("viewof start", ["date"], _start);
  main
    .variable(observer("start"))
    .define("start", ["Generators", "viewof start"], (G, _) => G.input(_));
  main.variable(observer("viewof end")).define("viewof end", ["date"], _end);
  main
    .variable(observer("end"))
    .define("end", ["Generators", "viewof end"], (G, _) => G.input(_));
  main
    .variable(observer("viewof MinRR"))
    .define("viewof MinRR", ["slider"], _MinRR);
  main
    .variable(observer("MinRR"))
    .define("MinRR", ["Generators", "viewof MinRR"], (G, _) => G.input(_));
  main
    .variable(observer("scatter3D"))
    .define(
      "scatter3D",
      [
        "d3",
        "colorScheme",
        "populationRange",
        "distinctPopulations",
        "newpts",
        "start",
        "zipData",
        "population",
        "width",
        "end",
        "DOM",
        "Plotly",
      ],
      _scatter3D
    );
  main
    .variable(observer("t"))
    .define(
      "t",
      ["legend", "width", "d3", "populationRange", "colorScheme"],
      _t
    );
  main
    .variable(observer("population"))
    .define("population", ["zipData"], _population);
  main
    .variable(observer("distinctPopulations"))
    .define("distinctPopulations", ["population"], _distinctPopulations);
  main
    .variable(observer("populationRange"))
    .define("populationRange", ["d3", "distinctPopulations"], _populationRange);
  main
    .variable(observer("viewof colorScheme"))
    .define(
      "viewof colorScheme",
      ["d3", "colorSchemes", "colorInterpolatorPicker"],
      _colorScheme
    );
  main
    .variable(observer("colorScheme"))
    .define("colorScheme", ["Generators", "viewof colorScheme"], (G, _) =>
      G.input(_)
    );
  main.variable(observer("geoJSON")).define("geoJSON", ["fetchData"], _geoJSON);
  main.variable(observer("newpts")).define("newpts", ["geoJSON"], _newpts);
  main
    .variable(observer("zipData"))
    .define("zipData", ["fetchData", "MinRR", "start", "end"], _zipData);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("fetchData", child1);
  const child2 = runtime.module(define2);
  main.import("colorSchemes", child2);
  const child3 = runtime.module(define3);
  main.import("colorInterpolatorPicker", child3);
  const child4 = runtime.module(define4);
  main.import("legend", child4);
  const child5 = runtime.module(define5);
  main.import("date", child5);
  const child6 = runtime.module(define5);
  main.import("slider", child6);
  main.variable(observer("Plotly")).define("Plotly", ["require"], _Plotly);
  return main;
}

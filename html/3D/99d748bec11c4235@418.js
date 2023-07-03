// https://observablehq.com/@mariodelgadosr/programmatic-collection-of-interpolated-d3-color-schemes@418
import define1 from "./17428bc970543296@1461.js";

function _1(md){return(
md`# Programmatic Collection of Interpolated [D3 Color Schemes](https://observablehq.com/@d3/color-schemes)

...Or when failure leads to success.

The following function will generate an iterable array of the available interpolated [D3 color schemes](https://observablehq.com/@d3/color-schemes) for the [loaded](https://github.com/observablehq/stdlib/blob/master/README.md#require) [D3 module](https://www.jsdelivr.com/?query=author%3A%20d3) in a notebook.`
)}

function _getInterpolateColorSchemes(d3){return(
function getInterpolateColorSchemes() {
  const colorSchemes = [];
  
  Object.keys(d3)
    .filter(k => k.startsWith("interpolate"))
    .forEach(k => {
                    try {
                      const scheme = d3[k](1);
                      if ( typeof scheme == "string" && scheme.startsWith("rgb") )  
                        colorSchemes.push({fnColorScheme:d3[k] , strColorScheme: k });
                    }
                    catch (e){}
                  }
            ) 
  
  return colorSchemes;
}
)}

function _3(md){return(
md `The function returns an object array of available D3 interpolated color schemes: `
)}

function _colorSchemes(getInterpolateColorSchemes){return(
getInterpolateColorSchemes()
)}

function _5(colorSchemes){return(
colorSchemes.map(c => c.strColorScheme.substring(11))
)}

function _6(md,colorSchemes,ramp,colorInterpolatorPicker,d3,getInverseInterpolation){return(
md `The function's output can then be used; as in the following [ramp](https://observablehq.com/@mbostock/color-ramp) calls for the first five color scheme references of the [colorSchemes](#colorSchemes) array below :

| Color Scheme | ramp Syntax | Output |
|---|---|---|
| ${colorSchemes[0].strColorScheme}  | ramp(colorSchemes[0].fnColorScheme)| ${ramp(colorSchemes[0].fnColorScheme)} |
| ${colorSchemes[1].strColorScheme}  | ramp(colorSchemes[1].fnColorScheme)| ${ramp(colorSchemes[1].fnColorScheme)} |
| ${colorSchemes[2].strColorScheme}  | ramp(colorSchemes[2].fnColorScheme)| ${ramp(colorSchemes[2].fnColorScheme)} |
| ${colorSchemes[3].strColorScheme}  | ramp(colorSchemes[3].fnColorScheme)| ${ramp(colorSchemes[3].fnColorScheme)} |
| ${colorSchemes[4].strColorScheme}  | ramp(colorSchemes[4].fnColorScheme)| ${ramp(colorSchemes[4].fnColorScheme)} |

Or fed dynamcially to a [picker](https://observablehq.com/@zechasault/color-schemes-and-interpolators-picker):

${colorInterpolatorPicker (
  { title: "Interpolators (and their inverse (I) ) from colorSchemes",
    value: "Cool (I)",
   //interpolators: colorSchemes.map(c => ({name: c.strColorScheme.substring(11)} )), 
     interpolators: d3.range(colorSchemes.length * 2).map(d => {

         if (d % 2 == 0) {
           return (
                    {name: colorSchemes[d / 2].strColorScheme.substring(11)}
                  )
         } else {  
            return (
                    { name: colorSchemes[(d-1)/2 ].strColorScheme.substring(11) + " (I)" ,
                      value: getInverseInterpolation(colorSchemes[(d-1) /2].fnColorScheme)
                    } 
                   ) 
          } 
       }) ,
    w: 300})
 } 
The  [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) in function [*getInterpolateColorSchemes*](#getInterpolateColorSchemes) implements the [*success from failure*](https://www.brainyquote.com/quotes/thomas_a_edison_132683) strategy:
~~~js
function getInterpolateColorSchemes() {
  const colorSchemes = [];
  
  Object.keys(d3)
    .filter(k => k.startsWith("interpolate"))
    .forEach(k => {
                    try {
                      const scheme = d3[k](1);
                      if ( typeof scheme == "string" && scheme.startsWith("rgb") )  
                        colorSchemes.push({fnColorScheme:d3[k] , strColorScheme: k });
                    }
                    catch (e){}
                  }
            ) 
  
  return colorSchemes;
} 
~~~`
)}

function _sliderDemo(md){return(
md`## Import syntax for *getInterpolateColorSchemes*

~~~js
import {getInterpolateColorSchemes} from "@mariodelgadosr/programmatic-collection-of-interpolated-d3-color-schemes"
~~~`
)}

function _8(md){return(
md `### [Ramp](https://observablehq.com/@mbostock/color-ramp), getInverseInterpolation, [Interpolators Picker](https://observablehq.com/@zechasault/color-schemes-and-interpolators-picker), [Interpolator Picker](https://observablehq.com/@zechasault/color-schemes-and-interpolators-picker)`
)}

function _ramp(DOM){return(
function ramp(color, n = 10) {
  const canvas = DOM.canvas(n, 1);
  canvas.style.height = "20px";
  const context = canvas.getContext("2d");
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}
)}

function _getInverseInterpolation(){return(
function getInverseInterpolation(fnInterpolate) {
  
  //https://observablehq.com/@d3/sequential-scales#t1
  return t => fnInterpolate(1-t);
  
  /* Scenic route:
  
  return d3.interpolateRgbBasis(d3.range(255)
                                  .map(t => d3.scaleSequential(fnInterpolate).domain([255,0])(t))
                               );
  */
  
}
)}

function _12(md){return(
md `## Frameworks`
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("getInterpolateColorSchemes")).define("getInterpolateColorSchemes", ["d3"], _getInterpolateColorSchemes);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("colorSchemes")).define("colorSchemes", ["getInterpolateColorSchemes"], _colorSchemes);
  main.variable(observer()).define(["colorSchemes"], _5);
  main.variable(observer()).define(["md","colorSchemes","ramp","colorInterpolatorPicker","d3","getInverseInterpolation"], _6);
  main.variable(observer("sliderDemo")).define("sliderDemo", ["md"], _sliderDemo);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("ramp")).define("ramp", ["DOM"], _ramp);
  main.variable(observer("getInverseInterpolation")).define("getInverseInterpolation", _getInverseInterpolation);
  const child1 = runtime.module(define1);
  main.import("colorInterpolatorPicker", child1);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}

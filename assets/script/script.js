$(document).ready(function () {

    /** Sidebar Collapse */
    $('#sidebar-collapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
    });

}); //document.ready

//Buscando dados do JSON
/*fetch('./data/data.json')
    .then(response => response.json())
    .then(result => {
        getData(result);
    })
    .catch(err => { console.error('fetch failed', err); });

function getData(data) {
    
}*/



var data = [
    { Year: '1995', Total: 1000 },
    { Year: '1996', Total: 2330 },
    { Year: '1997', Total: 4540 },
    { Year: '1998', Total: 5558 },
    { Year: '1999', Total: 1239 },
    { Year: '2000', Total: 4349 },
    { Year: '2001', Total: 7039 },
    { Year: '2002', Total: 4034 },
    { Year: '2003', Total: 3035 },
    { Year: '2004', Total: 2043 },
    { Year: '2005', Total: 1035 }
];

var colors = d3.hsl("steelblue");

// Set the dimensions of the canvas / graph
let margin = { top: 30, right: 20, bottom: 30, left: 50 },
    width, // width gets defined below
    height = 500 - margin.top - margin.bottom;

width = parseInt(d3.select('#main').style('width'), 10) - margin.left - margin.right;

// Set the scales ranges
var xScale = d3.scaleBand();
var yScale = d3.scaleLinear().range([height, 0]);

// Define xAxis and yAxis
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

//let svg = d3.select('#graph');
// Add the svg canvas
var svg = d3.select("#main")
    .append("div")
    .classed("svg-div", true) //container class to make it responsive
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .classed("svg-content", true);

var artboard = svg.append("g")
    .attr("viewBox", "0 0 300 " + (height + margin.top + margin.bottom))
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the domain range from the data
var xScale = d3.scaleBand()
    .domain(data.map(function (d) { return d.Year }))
    .range([0, width])
    .padding(.2);
//.range([0, width])
yScale.domain([
    d3.min(data, function (d) { return Math.floor(d.Total - 200); }),
    d3.max(data, function (d) { return Math.floor(d.Total + 200); })
]);

// Add the X and Y Axis
var xAxisEl = artboard.append("g")
    .attr("transform", "translate(0," + height + ")");
var yAxisEl = artboard.append("g")
    .call(yAxis);

var rectGrp = svg.append('g')
    .attr("viewBox", [0, 0, width, height])
    .attr("preserveAspectRatio", "none")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

rectGrp.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width', (d, i) => {
        return xScale.bandwidth(d.Year);
    })
    //.attr('width', xScale.bandwidth())
    .attr('height', function (d, i) {
        return height - yScale(d.Total);
    })
    .attr('x', function (d, i) {
        return xScale(d.Year);
    })
    .attr('y', function (d, i) {
        return yScale(d.Total)
    })
    .attr('fill', function (d, i) {
        return colors;
    });

/**
 * Function what draw the chart -------------------------------------------------------------------------
 */
function setChart() {
    // reset the width
    width = parseInt(d3.select('#main').style('width'), 10) - margin.left - margin.right;

    // set the svg dimensions
    svg.attr("width", width + margin.left + margin.right);

    // Set new range for xScale
    xScale.range([0, width])
        .padding(.2);

    // give the x axis the resized scale
    xAxis.scale(xScale);

    // draw the new xAxis
    xAxisEl.call(xAxis);

};

// call this once to draw the chart initially
setChart();

// redraw chart on resize
window.addEventListener('resize', setChart);
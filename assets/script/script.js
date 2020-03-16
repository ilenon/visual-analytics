$(document).ready(function () {

    /** Sidebar Collapse */
    $('#sidebar-collapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
    });

}); //document.ready

var json = './data/total.json';
/**
 * Loading data from Json'.
 */
document.addEventListener("DOMContentLoaded", function (event) {
    fetch(json)
        .then((response) => { return response.json(); })
        .then((data) => {
            //var parsedData = parseData(data);
            console.log(data)
            drawChart(data);
            //createTable(parsedData);
        })
        .catch((err) => { console.log(err); })
});

/**
 * Parse data into key-value pairs
 * @param {object} data Object containing historical data of BPI
 */
function parseData(data) {
    var arr = [];
    for (var i in data) {
        //console.log(new Date(data[i].year))
        arr.push({
            total: data[i].total,
            ecommerce: +data[i].ecommerce,
            year: +data[i].year
        });
    }
    return arr;
}

function drawChart(data) {

    var colors = d3.hsl("steelblue");

    // Set the dimensions of the canvas / graph
    let margin = { top: 30, right: 20, bottom: 30, left: 20 },
        width, // width gets defined below
        height = 400 - margin.top - margin.bottom;

    width = parseInt(d3.select('#chartID').style('width'), 10) - margin.left - margin.right;

    // Set the scales ranges
    var xScale = d3.scaleBand();
    var yScale = d3.scaleLinear();

    var formatPercent = d3.format("0.1");

    // Define xAxis and yAxis
    var xAxis = d3.axisBottom().scale(xScale)
        .tickSize(10)
        .tickPadding(5);

    // Add svg canvas
    var svg = d3.select("#chartID")
        .append("div")
        .classed("svg-div border", true) //container class to make it responsive
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .classed("svg-content", true);

    var artboard = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // set the domain range from the data
    xScale.domain(data.map(function (d) { return d.product }))
        .range([0, width])
        .padding(.2);
    yScale.domain(d3.extent(data, function (d) {
        console.log(d.total);
        return d.total;
    }))
        .range([height, 0]);
    //yScale.domain([0, d3.max(data, (d) => { return d.total })]);

    // Add the X and Y Axis
    var xAxisEl = artboard.append("g")
        .attr("transform", "translate(0," + height + ")");

    var rectGrp = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    rectGrp.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', (d) => {
            return xScale.bandwidth(d.product);
        })
        //.attr('width', xScale.bandwidth())
        .attr('height', function (d, i) {
            console.log(height - yScale(d.total))
            return height - yScale(d.total);
        })
        .attr('x', function (d) {
            return xScale(d.product);
        })
        .attr('y', function (d, i) {
            return yScale(d.total)
        })
        .attr('fill', function (d, i) {
            return colors;
        });

    svg.append('text')
        .attr('x', 20)
        .attr('y', 20)
        .text('% of E-commerce total');

    svg.selectAll('rect')
        .on('mouseenter', function (actual, i) {
            d3.select(this).attr('opacity', 0.5)
        })
        .on('mouseleave', function (actual, i) {
            d3.select(this).attr('opacity', 1)
        })

    /**
     * Function to resize svg -----------------------------------------------------------------
     */
    function setChart() {
        // reset the width
        width = parseInt(d3.select('.svg-div').style('width'), 10) - margin.left - margin.right;

        // set the svg dimensions
        svg.attr("width", width + margin.left + margin.right);
        rectGrp.attr("width", width + margin.left + margin.right);

        // Set new range for xScale
        xScale.range([0, width])
            .padding(.2);

        // give the x axis the resized scale
        xAxis.scale(xScale);

        // draw the new xAxis
        xAxisEl.call(xAxis);

        d3.selectAll('rect')
            .attr('width', (d) => {
                return xScale.bandwidth(d.product);
            })
            .attr('x', function (d) {
                return xScale(d.product);
            });
    };

    setChart();
    window.addEventListener('resize', setChart);

}; // Draw Chart Function


/**
 * *************************************************************************************
 * Create table
 * *************************************************************************************
 */
function createTable(data) {

    Object.keys(data).forEach((i) => {

        var tbody = document.getElementById('tbody');
        tbody.innerHTML += "<tr>" +
            "<td>" + data[i].year + "</td>" +
            "<td class'total'>" + data[i].total + "</td>" +
            "<td>" + data[i].ecommerce + "</td>" +
            "</tr>"

    });

    var svgHeight = 40;

    var svg = d3.selectAll('.total')
        .data(data)
        .enter()
        .append('rect')
        .attr('y', (d) => {
            return svgHeight;
        })



};


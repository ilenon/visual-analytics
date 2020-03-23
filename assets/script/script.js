$(document).ready(function () {

    /** Sidebar Collapse */
    $('#sidebar-collapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
    });

}); //document.ready

var percent = './data/percent.json';
var total = './data/total.json';
var data = './data/data.json';
/**
 * Loading data from Json'.
 */
document.addEventListener("DOMContentLoaded", function (event) {
    fetch(percent)
        .then((response) => { return response.json(); })
        .then((data) => {
            drawChart(data);
        })
        .catch((err) => { console.log(err); })

    fetch(data)
        .then((response) => { return response.json(); })
        .then((data) => {
            var parsedData = getTotal(data);
            createTable(parsedData);
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

function getTotal(data) {
    var arr = [];
    for (var i in data) {
        arr.push({
            year: i,
            total: +data[i][0].total,
            ecommerce: +data[i][0].ecommerce,
        });
    }
    return arr;
}

function drawChart(data) {

    // Set the dimensions of the canvas / graph
    let margin = { top: 30, right: 20, bottom: 30, left: 200 },
        width, // width gets defined below
        height = 400 - margin.top - margin.bottom;

    width = parseInt(d3.select('#chartID').style('width'), 10) - margin.left - margin.right;

    var xScale = d3.scaleLinear()
        .domain([0, 18])
        .range([1, width]);
    var yScale = d3.scaleBand()
        .rangeRound([0, height])
        .domain(data.map((d) => d.product))
        .padding(.2);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    var graph = d3.select('#chartID')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        ;

    var bar = graph.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', (d, i) => {
            return 'translate(' + margin.left + ',' + yScale(d.product) + ')';
        });

    var gy = graph.append("g")
        .attr('fill', 'black')
        .attr('transform', 'translate(170, 10)')
        .call(yAxis);

    var svg = d3.select('svg');

    svg.selectAll('text')
        .attr('fill', '#000');

    bar.append('rect')
        .attr('width', (d) => {
            return xScale(d.total);
        })
        .attr('height', yScale.bandwidth())
        .attr('y', 0)
        .attr('x', 0);

    bar.append('text')
        .attr('x', (d) => {
            return xScale(d.total) - (margin.right / 5);
        })
        .attr('y', (d) => {
            return yScale.bandwidth(d.product) / 2;
        })
        .attr('dy', '.35em')
        .text((d) => {
            if (!d.total) {
                return d.total;
            } else {
                return d.total + "%";
            }

        });

    /**
     * Function to resize svg -----------------------------------------------------------------
     */
    function setChart() {
        // reset the width
        width = parseInt(d3.select('#chartID').style('width'), 10) - margin.left - margin.right;

        // set the svg dimensions
        graph.attr("width", width + margin.left + margin.right);
        xScale = d3.scaleLinear()
            .domain([0, 18])
            .range([1, width]);
        bar.selectAll('rect')
            .attr('width', (d) => {
                return xScale(d.total);
            });
        bar.selectAll('text')
            .attr('x', (d) => {
                return xScale(d.total) - (margin.right / 5);
            })
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


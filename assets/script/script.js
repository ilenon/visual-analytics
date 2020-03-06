$(document).ready(function () {

    /** Sidebar Collapse */
    $('#sidebar-collapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
    });

}); //document.ready

//Buscando dados do JSON
fetch('./data/data.json')
    .then(response => response.json())
    .then(result => {
        getData(result);
    })
    .catch(err => { console.error('fetch failed', err); });

function getData(data) {
    let columns = ['product'];
    Object.keys(data).forEach(col => {
        columns.push(col);
    });

    var table = d3.select('.table').append('table')
    var thead = table.append('thead')
    var tbody = table.append('tbody');

    // append the header row
    thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function (column) { return column; });

    Object.keys(data).forEach(i => {
        var item = data[i];

        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
            .data(item)
            .enter()
            .append('tr');

        var col = ['product', 'total', 'atual'];

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
            .data(function (row) {
                return col.map(function (column) {
                    return { value: row[column] };
                });
            })
            .enter()
            .append('td')
            .text(function (d) {
                return d.value;
            });

    });

}
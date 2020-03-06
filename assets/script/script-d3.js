let year = [];
let select = document.getElementById('year').innerHTML;
d3.json("./../data/data.json")
    .then(data => {
        Object.keys(data).forEach(el => {
            select.append('<option value="' + el + '">' + el + '</option>');
        });
    });

console.log(year);
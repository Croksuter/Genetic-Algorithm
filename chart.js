
function getRandom(start, end) {
    return start + (Math.floor(Math.random() * (end - start + 1)));
}

var legends = ['SiteA', 'SiteB'];
var seriesData = [
    {
        name: 'Prey_speed',
        data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    },
    {
        name: 'Prey_size',
        data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
];
console.log(seriesData);
var baseNow = new Date();
var startSecond = baseNow.getSeconds() - seriesData[0].data.length - 1;
var categories = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var container = document.getElementById('chart-area');
var data = {
    categories: categories,
    series: seriesData
};
var options = {
    chart: {
        width: 1160,
        height: 540,
        title: 'History'
    },
    xAxis: {
        title: 'seconds',
        labelInterval: 3,
        tickInterval: 'auto'
    },
    yAxis: {
        title: 'users'
    },
    series: {
        spline: true,
        showDot: true,
        shifting: true
    },
    tooltip: {
        grouped: true
    }
};
var chart = tui.chart.lineChart(container, data, options);
let generation = 1;

chart.on('load', function () {
    var index = categories.length;
    setInterval(function () {
        var now = new Date();
        var category = [generation];
        var values = [getRandom(150, 200), getRandom(150, 200)];
        generation += 1;
        chart.addData(category, values);
        index += 1;
    }, 1000);
});

var margin = {
            top: 20,
            right: 50,
            bottom: 30,
            left: 80
        },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#viz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    dragit.time = {
        min: 0,
        max: 19,
        step: 1,
        current: 0,
        offset: 1997
    };
    dragit.object.offsetX = margin.left;

    data = [{
        "name": "Total Renewable Energy Consumption",
        "years": [{
            "year": 1997,
            "value": 7.014094
        }, {
            "year": 1998,
            "value": 6.491263
        }, {
            "year": 1999,
            "value": 6.513709
        }, {
            "year": 2000,
            "value": 6.104191
        }, {
            "year": 2001,
            "value": 5.159914
        }, {
            "year": 2002,
            "value": 5.726055
        }, {
            "year": 2003,
            "value": 5.944089
        }, {
            "year": 2004,
            "value": 6.07464
        }, {
            "year": 2005,
            "value": 6.233426
        }, {
            "year": 2006,
            "value": 6.636681
        }, {
            "year": 2007,
            "value": 6.522846
        }, {
            "year": 2008,
            "value": 7.174265
        }, {
            "year": 2009,
            "value": 7.603782
        }, {
            "year": 2010,
            "value": 8.030007
        }, {
            "year": 2011,
            "value": 8.998931
        }, {
            "year": 2012,
            "value": 8.706167
        }, {
            "year": 2013,
            "value": 9.271152
        }, {
            "year": 2014,
            "value": 9.558241
        }, {
            "year": 2015,
            "value": 9.577439
        }]
    }, {
        "name": "Total Primary Energy Consumption",
        "years": [{
            "year": 1997,
            "value": 94.600335
        }, {
            "year": 1998,
            "value": 95.017733
        }, {
            "year": 1999,
            "value": 96.648388
        }, {
            "year": 2000,
            "value": 98.816542
        }, {
            "year": 2001,
            "value": 96.169665
        }, {
            "year": 2002,
            "value": 97.643473
        }, {
            "year": 2003,
            "value": 97.917499
        }, {
            "year": 2004,
            "value": 100.089696
        }, {
            "year": 2005,
            "value": 100.187712
        }, {
            "year": 2006,
            "value": 99.484477
        }, {
            "year": 2007,
            "value": 101.014734
        }, {
            "year": 2008,
            "value": 98.890725
        }, {
            "year": 2009,
            "value": 94.117574
        }, {
            "year": 2010,
            "value": 97.44439
        }, {
            "year": 2011,
            "value": 96.841665
        }, {
            "year": 2012,
            "value": 94.415976
        }, {
            "year": 2013,
            "value": 97.148007
        }, {
            "year": 2014,
            "value": 98.317365
        }, {
            "year": 2015,
            "value": 97.553287
        }]
    }]

    x.domain(d3.extent(data[1].years, function(d) {
        return d.year;
    })).nice();
    y.domain([0, d3.max(data, function(d) {
        return d3.max(d.years, function(e) {
            return e.value;
        })
    }) + 20]).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Time");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Quadrillion Btu")

    var gPoints = svg.selectAll(".points")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "points")
        .attr("transform", function(d) {
            return "translate(" + x(d.years[dragit.time.current].year) + ", " + y(d.years[dragit.time.current].value) + ")";
        })
        .on("mouseenter", dragit.trajectory.display)
        .on("mouseleave", dragit.trajectory.remove)
        .call(dragit.object.activate)

    gPoints.append("circle")
        .attr("r", 10)
        .attr("cx", 0)
        .attr("cy", 0)
        .style("fill", function(d) {
            return color(d.name);
        })


    gPoints.append("text")
        .attr("x", 50)
        .attr("y", 0)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d.name;
        });


    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(-200," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });

    function update(v, t) {

        dragit.time.current = v || dragit.time.current;

        gPoints.transition().duration(100)
            .attr("transform", function(d) {
                return "translate(" + x(d.years[dragit.time.current].year) + ", " + y(d.years[dragit.time.current].value) + ")";
            })
    }

    function init() {

        dragit.init("svg");

        dragit.data = data.map(function(d, i) {
            console.log(d);
            return d.years.map(function(e, i) {
                return [x(e.year) + margin.left, y(e.value) + margin.top];
            })
        });

        dragit.evt.register("update", update);
        dragit.utils.slider("#slider", false)

        dragit.trajectory.toggleAll('selected');
    }

    init();
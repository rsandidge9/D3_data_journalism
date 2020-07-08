//Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

//Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100

};


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins. 
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var scatterChart = svg.append('g');


d3.select("scatter").append("div").attr("class", "tooltip").style("opacity", 0);


// Import Data 
d3.csv("data.csv").then(function (healthData) {
    //Print healthdata
    console.log(healthData)
    // Step 1: Parse Data/Cast as numbers 
    // ============================== 
    healthData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;

    });


    // Step 2: Create scale functions 
    // ============================== 
    var xLinearScale = d3.scaleLinear().range([0, width]);
    var yLinearScale = d3.scaleLinear().range([height, 0]);


    // Step 3: Create axis functions 
    // ============================== 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    var xMin;
    var xMax;
    var yMin;
    var yMax;

    function setMinMax() {
        xMax = d3.max(healthData, function (d) {
            return parseFloat(d.poverty)
        });
        xMin = d3.min(healthData, function (d) {
            return parseFloat(d.poverty)
        });
        yMin = d3.min(healthData, function (d) {
            return parseFloat(d.healthcare)
        });
        yMax = d3.max(healthData, function (d) {
            return parseFloat(d.healthcare)
        });
    }
    setMinMax()

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    //console.log(xMin);
    //console.log(yMax);


    // Step 4: Append Axes to the chart 
    // ============================== 
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);


    chartGroup.append("g")
        .call(leftAxis);


    // Step 5: Create Circles 
    // ============================== 
    var circles = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
    circles
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty + 1.25))
        .attr("cy", d => yLinearScale(d.healthcare + .2))
        .attr("r", "12")
        .attr("fill", "purple")
        .attr("opacity", .5)
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (abbr);
        });
    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circles.on("click", function (data) {
        toolTip.show(data);
    });
    // onmouseout event
    on("mouseout", function (data, index) {
        toolTip.hide(data);
    });
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty and Healthcare");
    chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty");
}).catch(function (error) {
    console.log(error);

})
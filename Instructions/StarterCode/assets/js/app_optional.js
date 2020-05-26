// @TODO: YOUR CODE HERE!
// url="https://raw.githubusercontent.com/busy0312/W16_D3/master/Instructions/StarterCode/assets/data/data.csv"
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
    top: 50,
    right: 40,
    bottom: 90,
    left: 85
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "bubble");
// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare'

// function used for updating x-scale var upon click on axis label
function xScale(original_Data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(original_Data, d => d[chosenXAxis]) * 0.8,
        d3.max(original_Data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, chartWidth]);

    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(original_Data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(original_Data, d => d[chosenYAxis]) * 0.8,
        d3.max(original_Data, d => d[chosenYAxis]) * 1.2
        ])
        .range([chartHeight, 0]);

    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderAxes_y(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

function renderAbbr_x(abbrGroup, xLinearScale, chosenXAxis) {
    abbrGroup.transition()
        .duration(1000)
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .text(d => d.abbr)
    return abbrGroup
}
function renderAbbr_y(abbrGroup, yLinearScale, chosenYAxis) {
    abbrGroup.transition()
        .duration(1000)
        .attr("dy", d => yLinearScale(d[chosenYAxis]))
        .text(d => d.abbr)

    return abbrGroup
}


(async function () {
    var url = "https://raw.githubusercontent.com/busy0312/W16_D3/master/Instructions/StarterCode/assets/data/data.csv"
    var original_Data = await d3.csv(url).catch(function (error) {
        console.log(error);
    });
    // Parse data to interger
    original_Data.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    var xLinearScale = xScale(original_Data, chosenXAxis)

    var yLinearScale = yScale(original_Data, chosenYAxis)

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0,${chartHeight})`)
        .call(bottomAxis)


    var yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .call(leftAxis)


    var node = chartGroup.selectAll('.nodes')
        .data(original_Data)
        .enter().append('g')
        .attr('class', 'nodes')

    var circlesGroup = node.append('circle')
        .attr("r", "10")
        .attr("fill", "pink")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))


    var abbrGroup = node.append("text")
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .attr("dy", d => yLinearScale(d[chosenYAxis] - 0.2))
        .attr('text-anchor', 'middle')
        .attr('fill', "white")
        .text(d => d.abbr)
        .classed('abbr', true);

    // Create group for x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);


    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty(%)")

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age(Median)")

    var householdLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("active", true)
        .text("Household Income(Median)")

    // create group for y axis lables
    var ylabelGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")

    var healthlabel = ylabelGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthecare(%)");

    var smokeslabel = ylabelGroup.append("text")
        .attr("y", 0 - (margin.left - 20))
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("value", "smokes") // value to grab for event listener
        .classed("active", true)
        .text("Smokes(%)");


    var obeselabel = ylabelGroup.append("text")
        .attr("y", 0 - (margin.left - 40))
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obese(%)");


    // y axis labels event listener
    ylabelGroup.selectAll('text')
        .on('click', function () {
            // get value of selection
            var value = d3.select(this).attr('value');
            if (value !== chosenYAxis) {
                // replaces chosenYAxis with value
                chosenYAxis = value;
                // updates y scale for new data
                yLinearScale = yScale(original_Data, chosenYAxis);
                // updates y axis with transition
                yAxis = renderAxes_y(yLinearScale, yAxis);
                // updates circles with new y values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)
                // updates the abbr within circles
                abbrGroup = renderAbbr_y(abbrGroup, yLinearScale, chosenYAxis)
                // changes classes to change bold text
                if (chosenYAxis === "healthcare") {
                    healthlabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeslabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeselabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    smokeslabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthlabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeselabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    obeselabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthlabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeslabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        })

    // x axis labels event listener
    xlabelsGroup.selectAll('text')
        .on('click', function () {
            // get value of selection
            var value = d3.select(this).attr('value');
            if (value !== chosenXAxis) {
                // replaces chosenXAxis with value
                chosenXAxis = value;
                // updates x scale for new data
                xLinearScale = xScale(original_Data, chosenXAxis);
                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);
                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)
                // updates the abbr within circles
                abbrGroup = renderAbbr_x(abbrGroup, xLinearScale, chosenXAxis)
                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    householdLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    householdLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    householdLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }

            }
        })

})();



























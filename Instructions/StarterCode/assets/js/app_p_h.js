// @TODO: YOUR CODE HERE!
// url="https://raw.githubusercontent.com/busy0312/W16_D3/master/Instructions/StarterCode/assets/data/data.csv"


async function makeResponsive() {
  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  // clear svg is not empty
  if (!svgArea.empty()) {
      svgArea.remove();
  }

var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;


var margin = {
  top: 50,
  right: 40,
  bottom: 50,
  left: 20
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

var url="https://raw.githubusercontent.com/busy0312/W16_D3/master/Instructions/StarterCode/assets/data/data.csv"
var original_Data = await d3.csv(url).catch(function(error) {
  console.log(error);
});

    // Print the milesData
    console.log(original_Data)
    // Parse data to interger
    original_Data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income	= +data.income;
        data.healthcare	= +data.healthcare;
        data.obesity= +data.obesity;
        data.smokes= +data.smokes;
      });

      var xLinearScale = d3.scaleLinear()
      .domain([9,d3.max(original_Data,data => data.poverty)])
      .range([0,chartWidth]);

      var yLinearScale = d3.scaleLinear()
      .domain([3,d3.max(original_Data,data => data.healthcare)])
      .range([chartHeight, 0]);

      var xAxis = d3.axisBottom(xLinearScale);
      var yAxis = d3.axisLeft(yLinearScale);

      chartGroup.append('g')
      .attr('transform',`translate(0,${chartHeight})`)
      .call(xAxis)
      

      chartGroup.append('g')
      .call(yAxis)

      var node = chartGroup.selectAll('.nodes')
      .data(original_Data)
      .enter().append('g')
      .attr('class', 'nodes')

      node.append('circle')
      .attr("r", "10")
      .attr("fill", "pink")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))

      node.append("text")
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy",d => yLinearScale(d.healthcare)+2)
      .attr('text-anchor','middle')
      .attr('fill',"white")
      .text(d=>d.abbr);

}

makeResponsive();



d3.select(window).on("resize", makeResponsive);

















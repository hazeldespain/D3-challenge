// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart

async function makeResponsive() {


    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    const svgWidth = window.innerWidth;
    const svgHeight = window.innerHeight;

    const margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };

    const height = svgHeight - margin.top - margin.bottom;
    const width = svgWidth - margin.left - margin.right;

    // Append SVG element
    const svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // Append group element
    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read CSV
   const csvData = await d3.csv("assets/data/data.csv");
   console.log(csvData);

    // parse data
    csvData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    // create scales
    const xLinearScale = d3.scaleLinear()
        .range([0, width]);

    const yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(csvData, d => d.poverty)])
        .range([height, 0]);

    // create axes
    const xAxis = d3.axisBottom(xLinearScale).ticks(6);
    const yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // append axes
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chart.append("g")
        .call(yAxis);

    // line generator
    const line = d3.line()
        .x(d => xLinearScale(d.obesity))
        .y(d => yLinearScale(d.poverty));

    // append line
    chart.append("path")
        .data([csvData])
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "red");

    // append circles
    
    //day 3 activity 10 -
    
    let circlesGroup = chart.selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        //added these attr classes - correct?
        .attr("class","stateCircle")
        .attr("class", "stateText")
        ////
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", 10);
        // .attr("fill", "blue")
        // .attr("stroke-width", "1")
        // .attr("stroke", "black");

    // Step 1: Initialize Tooltip
    const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
        return (`<strong>${d.abbr}<strong><hr> poverty rate: ${d.poverty}<hr> obesity rate: ${d.obesity}
        `);
        });

    // Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
        toolTip.hide(d);
        });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
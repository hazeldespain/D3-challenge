// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
async function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    const svgArea = d3.select("body").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

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
        .select(".chart")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // Append group element
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read CSV
    const asc_csv = await d3.csv("data.csv");

    // parse data
    asv_csv.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    // create scales
    const xLinearScale = d3.scaleLinear()
        .domain(d3.extent(asc_csv, d => d.obesity))
        .range([0, width]);

    const yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(asc_csv, d => d.poverty)])
        .range([height, 0]);

    // create axes
    const xAxis = d3.axisBottom(xLinearScale).ticks(6);
    const yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // append axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    // line generator
    const line = d3.line()
        .x(d => xLinearScale(d.obesity))
        .y(d => yLinearScale(d.poverty));

    // append line
    chartGroup.append("path")
        .data([asc_csv])
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "red");

    // append circles
    const circlesGroup = chartGroup.selectAll("circle")
        .data(asc_csv)
        .enter()
        .append("circle")
        //added these attr classes
        .attr("class","stateCircle")
        .attr("class", "stateText")
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

    // Step 1: Initialize Tooltip
    const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
        return (`<strong>${d.state}<strong><hr> poverty rate: ${d.poverty}<hr> obesity rate: ${d.obesity}
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

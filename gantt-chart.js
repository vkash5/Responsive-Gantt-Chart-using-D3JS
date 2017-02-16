d3.json("gantt-chart.json", function (taskArray) {
    init(taskArray, true);
});
/**
 * Represents a function to initialize neccesary things after successful fetching data from json
 *@param {array of objects} taskArray - The array contains the list of tasks and their details
 */
function init(taskArray, randomColor, color) {
    const defaultColor = "#F44336";
    const barHeight = 24;
    const gap = barHeight + 20;
    const gapOffsetDesktop = gap - 10;
    const topPadding = 75;
    const sidePadding = 150;
    const breakpoint = 760;
    var barColor = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#607D8B"];
    if (randomColor != true) {
        barColor = [];
        if (color == undefined) {
            color = defaultColor;
        }
        barColor.push(color);
    }
    var textWrapFlag = 1;
    var mobileLabelRectWidth = [];
    var tooltipYposn = [];
    var width = window.innerWidth;
    width *= 0.9;
    width -= 90;
    var w = width;
    var h = taskArray.length * gap + 2 * topPadding;
    var svg = d3.select(".svg")
        .append("svg")
        .attr("width", "100%")
        .attr("height", h)
        .attr("class", "svg");
    // div for tooltip
    var tooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var dateFormat = d3.time.format("%Y-%m-%d %I:%M%p");
    var minStartTime = d3.min(taskArray, function (d) {
        return dateFormat.parse(d.startTime);
    });

    var maxEndTime = d3.max(taskArray, function (d) {
        return dateFormat.parse(d.endTime);
    });

    var timeScale = d3.time.scale()
        .domain([minStartTime, maxEndTime])
        .range([0, width]);

    var title = svg.append("text")
        .text("Event Management of Sapient")
        .attr("x", window.innerWidth / 2.25)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", 18)
        .attr("fill", "#009FFC");

    /**
     * Represents a function to make gantt chart
     */
    function makeGant() {

        makeGrid();
        drawRects();
        vertLabels();

    }

    makeGant();
    /**
     * Represents a function to draw rectangles of task and their inner texts 
     */
    function drawRects() {

        var rectangles = svg.append('g')
            .selectAll("rect")
            .data(taskArray)
            .enter();


        var innerRects = rectangles.append("rect")
            .attr("height", barHeight)
            .attr("stroke", "none");

        var mobileLabelRect = rectangles.append("rect")
            .attr("y", function (d, i) {
                return i * gap - 15 + topPadding;
            })
            .attr("opacity", '0.3')
            .attr("height", 15)
            .attr("stroke", 'none')
            .attr("class", "mobile-label-rect");

        var rectText = rectangles.append("text")
            .attr("y", function (d, i) {
                return i * gap - 4 + topPadding;
            })
            .attr("font-size", 11)
            .attr("class", "rect-text")
            .attr("text-height", barHeight)
            .attr("font-style", "italic")
            .attr("fill", "#000000");

    }

    /**
     * Represents a function to make grid
     */

    function makeGrid() {
        xAxis = d3.svg.axis()
            .scale(timeScale)
            .orient('bottom')
            .ticks(10)
            .tickSize(-h + topPadding + 20, 0, 0)
            .tickFormat(d3.time.format('%-I'));

        var grid = svg.append('g')
            .attr('class', 'grid')
            .attr('transform', 'translate(' + sidePadding + ', ' + (h - 50) + ')')
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("fill", "#000")
            .attr("stroke", "none")
            .attr("font-size", 12);

        twelevePM = d3.selectAll(".grid text")
            .filter(function () {
                return d3.select(this).text() == "12";
            });

    }

    /**
     * Represents a function to write vertical labels of each rectangular tasks
     */

    function vertLabels() {
        var axisText = svg.append("g")
            .selectAll("text")
            .data(taskArray)
            .enter()
            .append("text")
            .text(function (d) {
                return d.task;
            })
            .each(wrap)
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gap + topPadding + barHeight / 1.5;
            })
            .attr("font-size", 14)
            .attr("class", "vert-labels")
            .attr("text-anchor", "start")
            .attr("text-height", 14)
            .attr("fill", "black")
            .on("mouseover", function (d, i) {
                if (d.task.length > 13) {
                    tooltipDiv.transition()
                        .duration(200)
                        .style("opacity", 0.9)
                        .style("left", (sidePadding - 80) + "px")
                        .style("top", tooltipYposn[i] - 45 + "px");

                    tooltipDiv.html(d.task);
                }


            })
            .on("mouseout", function (d) {
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
            });;

    }

    /**
     * Represents a function to truncate the text with ellipses in case of text overflow
     */
    function wrap(d) {
        var width = window.innerWidth;
        if (textWrapFlag == 1) {
            width = 125;
        } else {
            width *= 0.9;
            width -= 30;
            width -= timeScale(dateFormat.parse(d.startTime));
        }
        var self = d3.select(this),
            textLength = self.node().getComputedTextLength(),
            text = self.text();
        while (textLength + 7 > (width) && text.length > 0) {
            text = text.slice(0, -1);
            self.text(text + '...');
            textLength = self.node().getComputedTextLength();
        }
        if (textWrapFlag == 0) {
            mobileLabelRectWidth.push(textLength + 7);
        }
    }

    /**
     * Represents an Event Listener to be called on page resize to make gantt chart responsive
     */
    window.addEventListener("resize", reRender);

    function reRender() {
        width = window.innerWidth;
        width *= 0.9;
        const paddingHorizontal = 15;
        const mobileSidePadding = 15;
        if (window.innerWidth >= breakpoint) {
            width -= (sidePadding + paddingHorizontal);
        } else {

            width -= (mobileSidePadding + paddingHorizontal);
        }

        timeScale.range([0, width]);

        title.attr("x", window.innerWidth / 2.25);

        if (window.innerWidth < breakpoint) {
            var MobileLabelColor = [];
            h = taskArray.length * gap + 2 * topPadding;
            svg.attr("height", h);
            xAxis.scale(timeScale)
                .tickSize(-h + topPadding + 20, 0, 0);

            textWrapFlag = 0;
            d3.selectAll(".rect-text")
                .attr("display", "block")
                .attr("x", function (d) {
                    return timeScale(dateFormat.parse(d.startTime)) + mobileSidePadding * 1 + 3;
                })
                .text(function (d) {
                    return d.task;
                }).each(wrap);

            d3.selectAll(".mobile-label-rect")
                .attr("display", "block")
                .attr("x", function (d) {
                    return timeScale(dateFormat.parse(d.startTime)) + mobileSidePadding * 1;
                })
                .attr("fill", function (d) {
                    var colorIndex = Math.floor(Math.random() * (barColor.length - 1));
                    MobileLabelColor.push(colorIndex);
                    return barColor[colorIndex];
                })
                .attr("width", function (d, i) {
                    return mobileLabelRectWidth[i];
                });
            mobileLabelRectWidth = [];
            d3.selectAll(".vert-labels")
                .attr("display", "none");

            svg.selectAll("rect")
                .data(taskArray)
                .attr("x", function (d) {
                    return timeScale(dateFormat.parse(d.startTime)) + mobileSidePadding;
                })
                .attr("y", function (d, i) {
                    return i * gap + topPadding;
                })
                .attr("width", 0)
                .attr("fill", function (d, i) {
                    return barColor[MobileLabelColor[i]];
                })
                .transition()
                .duration(1000)
                .attr("width", function (d) {
                    return (timeScale(dateFormat.parse(d.endTime)) - timeScale(dateFormat.parse(d.startTime)));
                });

            d3.select(".grid")
                .call(xAxis)
                .attr('transform', 'translate(' + mobileSidePadding + ',' + (h - 50) + ')');

        } else {

            h = taskArray.length * gapOffsetDesktop + 2 * topPadding;
            svg.attr("height", h);
            xAxis.scale(timeScale)
                .tickSize(-h + topPadding + 20, 0, 0);

            d3.selectAll(".rect-text")
                .attr("display", "none");

            d3.selectAll(".mobile-label-rect")
                .attr("display", "none")

            d3.selectAll(".vert-labels")
                .attr("y", function (d, i) {
                    tooltipYposn.push(i * gapOffsetDesktop + topPadding + barHeight / 1.5);
                    return i * gapOffsetDesktop + topPadding + barHeight / 1.5;
                })
                .attr("display", "block");

            svg.selectAll("rect")
                .data(taskArray)
                .attr("x", function (d) {
                    return timeScale(dateFormat.parse(d.startTime)) + sidePadding;
                })
                .attr("y", function (d, i) {
                    return i * gapOffsetDesktop + topPadding;
                })
                .attr("width", 0)
                .attr("fill", function (d) {
                    var colorIndex = Math.floor(Math.random() * (barColor.length - 1));
                    return barColor[colorIndex];
                })
                .transition()
                .duration(1000)
                .attr("width", function (d) {
                    return (timeScale(dateFormat.parse(d.endTime)) - timeScale(dateFormat.parse(d.startTime)));
                });

            d3.select(".grid")
                .call(xAxis)
                .attr('transform', 'translate(' + sidePadding + ',' + (h - 50) + ')');

        }

        twelevePM.text("12P");

    }

    reRender();

}
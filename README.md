# Responsive-Gantt-Chart-using-D3JS
This project is about making a responsive gantt chart using D3JS library. Also the mobile view is triggered after a particular breakpoint. The color of the bars of gantt chart are customizable as random or a particular color. 

Introduction:
Purpose of this task is to render responsive and dynamic Gantt charts using D3JS.
Gantt chart is a chart in which a series of horizontal lines shows the amount of work done or production completed in certain periods of time in relation to the amount planned for those periods.
D3.js is a JavaScript library for manipulating documents based on data. D3 allows binding of arbitrary data to a Document Object Model (DOM), and then applies data-driven transformations to the document.

In addition to above features d3 also simplifies application of 
•	transitions 
•	color scales 
•	axis function which handles rendering of x-axis values in required format.
Proof of concept:
	Set the width of the main canvas on window resize to make grid responsive.

	Set the height of the main canvas based on the number of tasks fetched from json file.

	Create a JSON file with task details, their start time and end time (format  is %I:%M%p).   Following is the json data that we are using. It is also hosted on https://api.myjson.com/17j2tx this link. 
                                                                                                                                      
	Create a timescale with domain and range according to maximum end time and minimum start time.

Date format:  %Y=Year, %m=month, %d=date, %I=Hours (12 hour format),  %M=minutes, %p=AM/PM
Ex: "2017-02-09 8:00 am"

	Create a function makeGant (). This function in turn calls 3 more functions makeGrid, drawRects and vertLabels.

	makeGrid(): This function uses timescale to create x-axis of Gantt chart and creates vertical lines to denote time intervals in x-axis.

D3.svg.axis() function takes timescale as input and also sets the display format as %-I ( non-zero padded 12 hour format).
Ticks are the number of units in x-axis. 
Tick size is the height of grid lines on x-axis.
In time scale, we define domain and range for x-axis according to json data.
D3 maps the values in domain to appropriate values in range. 

	drawRects (): This function creates rectangles of Gantt chart to represent tasks.

We create rectangular bars according to input data and we modify their position according to their start times and end times.
The text to be shown in mobile mode above rectangular bars is also generated here and its display is set to none for desktop view.
	vertLabels(): This function creates Vertical labels corresponding to each task.

This is a function to generate vertical labels in desktop view.
It  also handles the positioning of vertical labels  and calls wrap function which wraps the  text if it overflows and appends  ellipses after truncating the text.

	Set the breakpoint for mobile and render the mobile view after breakpoint.

For mobile view, breakpoint  is set to 760px . After 760px view structure changes and is displayed as per mobile wireframe.
             

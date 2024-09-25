# Visualization 6406 Project

* *Date Created*: 01 FEB 2022
* *Last Modification Date*: 05 APR 2022

## Authors

* [Milan Ganesh Acharya](ml650738@dal.ca) - *(Developer)*


## Getting Started

The Git repository can be found at:
https://git.cs.dal.ca/acharya/csci-6406-visualization/-/tree/main/project 


### Prerequisites

To have a local copy of this project up and running on your local machine, you will first need to install the following software / libraries / plug-ins

```
Node
```

*See the following section for detailed step-by-step instructions on how to install this software / libraries / plug-ins*


## Installing

### Mac OS

The following steps are for installing prerequisites on a Mac OS system:  
Install Homebrew (if unavailable)
1. Open the terminal and type in the command:
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install Node
1. In the terminal type the command:
```
brew install node
```

### Windows

Install Node
1. Download the node package installer from 'https://nodejs.org/en/download/'.  
2. Once downloaded, complete the installation procedure.


## Building

Build React App  
1. Copy the project folder to the local system.
2. Open the console, and navigate to the root of the project folder.
3. Once in the root folder, run the command:
```
npm i
```


## Running

1. Run the following command from the console to start the application
```
npm start
```
2. Once the server is started, the the browser is automatically opened, and the page is loaded. If this does not happen, open any web browser (preferrably Chrome) and open the URL: 'http://localhost:3000/'.


## Built With

* [React](https://reactjs.org/) - The web framework used
* [Bootstrap](https://getbootstrap.com/) - The front-end framework used
* [D3](https://d3js.org/) - The visualization framework used


## Functionalities

### Global Trends/Cumulative Figure

1. Choropleth map of Covid-19 cases shown based on the type of data (Confirmed/Death/Recovered) selected from the dropdown.  
2. Hover over the map, to display tooltip with information about the country.
3. Clicking on the country updates the bar graph for the selected country.
4. Table of Top-10 Covid-19 affected countries based on the type (Confirmed/Death/Recovered).

### Global Trends/Corona Spread Timeseries

1. Animated Bubble map of cases shown based on the type of data (Confirmed/Death/Recovered).  
2. The map is also updated, as the slider bar is dragged.  
3. Multi-line graph showing the last 30 days of cases (by type) in the Top-10 countries.
4. Donut Chart showing the Top-10 cumulative number of cases (by type).

### Canada Trends

1. Shows two bubble maps of Canada, for cases in the provinces.  
2. The bubbles are hover activated, which updates the the Scatter Plot with cases in the province for the last 30 days.


## Acknowledgement

1. The Covid-19 logo used in the application was taken from [1].  
2. The datasets used in the application have come from [2].


## References

[1] “DSS, Inc..,” DSS, Inc. [Online]. Available: https://www.dssinc.com/. [Accessed: 05-Apr-2022].  
[2] “Home,” Humanitarian Data Exchange. [Online]. Available: https://data.humdata.org/dataset/novel-coronavirus-2019-ncov-cases. [Accessed: 05-Apr-2022].  
[3] Muratkemaldar, “Muratkemaldar/using-react-hooks-with-D3 at 12-geo,” GitHub. [Online]. Available: https://github.com/muratkemaldar/using-react-hooks-with-d3/tree/12-geo. [Accessed: 05-Apr-2022].  
[4] Urvashi, “REACT + D3: Implementing a Pie Chart,” Medium, 10-Oct-2020. [Online]. Available: https://ihsavru.medium.com/react-d3-implementing-a-pie-chart-dc7bf13ff418. [Accessed: 05-Apr-2022].  
[5] Leaozinho, “Rendering a map with a tooltip in react/D3,” Stack Overflow, 01-Sep-1968. [Online]. Available: https://stackoverflow.com/questions/64978096/rendering-a-map-with-a-tooltip-in-react-d3. [Accessed: 05-Apr-2022].  
[6] “Example X and y axis with D3 and react,” No Time Dad, 14-Jun-2021. [Online]. Available: https://www.notimedad.dev/x-y-axis-d3-react/. [Accessed: 05-Apr-2022].  
[7] M. Pallewatte, “Manujith Pallewatte,” Pluralsight, 24-Apr-2020. [Online]. Available: https://www.pluralsight.com/guides/drawing-charts-in-react-with-d3. [Accessed: 05-Apr-2022].  
[8] Javascript d3.js HTML range slider with play/pause loop. [Online]. Available: https://www.demo2s.com/javascript/javascript-d3-js-html-range-slider-with-play-pause-loop.html. [Accessed: 05-Apr-2022].  
[9] Y. Holtz, Basic connected scatter plot in d3.js. [Online]. Available: https://d3-graph-gallery.com/graph/connectedscatter_basic.html. [Accessed: 05-Apr-2022].  
[10] Y. Holtz, Basic barplot in d3.js. [Online]. Available: https://d3-graph-gallery.com/graph/barplot_basic.html. [Accessed: 05-Apr-2022].  
[11] Y. Holtz, Basic line chart in d3.js. [Online]. Available: https://d3-graph-gallery.com/graph/line_basic.html. [Accessed: 05-Apr-2022].  
[12] Y. Holtz, “Bubble map with color and size mapped to data in d3.js: Explanation and reproducible code.,” in d3.js. [Online]. Available: https://d3-graph-gallery.com/graph/bubblemap_circleFeatures.html. [Accessed: 05-Apr-2022].  
[13] RTGit, “D3+react multiline chart (version 3, animation),” CodeSandbox, 06-Jan-2021. [Online]. Available: https://codesandbox.io/s/d3react-multiline-chart-version-3-animation-o5y57. [Accessed: 05-Apr-2022].  

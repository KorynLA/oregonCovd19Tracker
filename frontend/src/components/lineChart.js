import React, { Component } from 'react';
import * as d3 from 'd3';
import '../styles/svgBg.css';
import { displayImportantDates } from './sharedFunctions'

//Creates dimensions for the graph
const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};

//Class is exported and called when a new chart is being created
class LineChart extends Component {
  state = {
    //Array that will contain the county lines created for the graph
    cases: [], 
    counties: [],
    dates: [],
    choice: null,
    //d3 helpers for scaling and generating the lines for the graph
    xScaleCases: d3.scaleTime().range([margin.left, width - margin.right]),
    yScaleCases: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    caseLineGenerator: d3.line(),
    lineGenerator: d3.line(),
    //d3 helper to generate different colors that will be used for the various county lines
    color: d3.scaleOrdinal(d3.schemeCategory10)
  };
  //Creates the axis for the graph
  xAxis = d3.axisBottom().scale(this.state.xScaleCases)
    .tickFormat(d3.timeFormat('%B %d'));
  yAxis = d3.axisLeft().scale(this.state.yScaleCases)
    .tickFormat(d => `${d}`);
  
/***
* Invoked before render and during updates
* Updates the state of the shared variables of the class
* Returns the state of the newly updated cases array, counties array, choice, and dates
***/
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const {xScaleCases, yScaleCases, caseLineGenerator, lineGenerator } = prevState;
    const {data} = nextProps;
    const choice = nextProps.choice;
    const dateProp = nextProps.importantDate;

    let caseMax = 0;
    const cases = new Array();
    let counties = new Array();
    let timeDomain;
    let dates = new Array();
    for(let county in data) {
      // Calculate timeDomain (xAxis of graphs)
      timeDomain = d3.extent(data[county], d => new Date(d.date_of_cases));
      
      counties.push(county);
      data[county].map((d)=>{
        if(d[choice] > caseMax) {
          caseMax=d[choice];
        }
      });

      // calculate line for the county cases and push it onto the cases array
      caseLineGenerator.x(d => xScaleCases(new Date(d.date_of_cases)));
      caseLineGenerator.y(d  => yScaleCases(d[choice]));
      cases.push(caseLineGenerator(data[county]));
      
      //Generate the lines using the dates in the date prop passed and push to a date array
      const currentTime = new Date();
      for(let date in dateProp) {
        let dateObj = new Date(dateProp[date]);
        if(dateObj.getMonth() <= currentTime.getMonth()) {
          lineGenerator.x(d => xScaleCases(new Date(dateProp[date])));
          lineGenerator.y(d  => yScaleCases(d[choice]));
          dates.push(lineGenerator(data[county]));
        }
      }
    }
    
    //calculate scale for positive cases
    xScaleCases.domain(timeDomain);
    yScaleCases.domain([0, caseMax]);
    return {cases, counties, choice, dates};
  }

  /*** 
  * Goes through every line in the cases array and returns its path with the color generated
  * using a counter to call the color from the d3 color helper
  * The path to each newly colored line will be added to the graph
  ***/
  displayLines() {
    var counter = -1;
    return this.state.cases.map( line => {
      counter+=1;
      return (<g><path d={line} fill='none' text="he" stroke={this.state.color(counter)} strokeWidth='2' /></g>);
    });
  }
  
  /***
  * Returns the county and its associated color on the left of the graph
  ***/
  displayLegend() {
    let colorChangeCounter = -1;
    const marginYChange = margin.top;
    const marginYChangeText = margin.top+10;
    let marginYMultiplier = -1;

    return this.state.cases.map( help => {
      colorChangeCounter++;
      marginYMultiplier++;
      return (<g><rect x={margin.left+25} y={marginYChange+(marginYMultiplier*15)} width="10" height="10" fill={this.state.color(colorChangeCounter)}></rect>
        <text y={marginYChangeText+(marginYMultiplier*15)} x={margin.left+36}>{this.state.counties[marginYMultiplier]}</text></g>);
      marginYChange+=10;
    });
  }
  /***
  * Operates on the DOM once the component is updated (different data is passed)
  * Changes the x and y axis / graph
  ***/
  componentDidUpdate() {
    d3.select(this.refs.xAxis).transition().call(this.xAxis);
    d3.select(this.refs.yAxis).transition().call(this.yAxis);
  }

  render() {
    return (
      <div>
        <div>
          <svg class="lineChart" width={width} height={height}>
            {this.displayLines()}
            {displayImportantDates(this.state.dates)}
            <g>
              {this.displayLegend()}
              <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
              <g ref='yAxis' transform={`translate(${margin.left}, 0)`} />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

export default LineChart;
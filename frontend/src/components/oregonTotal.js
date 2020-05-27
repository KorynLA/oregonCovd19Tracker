import React, { Component } from 'react';
import * as d3 from 'd3';
import '../styles/svgBg.css';
import { displayImportantDates } from './sharedFunctions'

//Creates dimensions for the graph
const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};

//Class is exported and called when the Oregon Total data chart is being created
class OregonTotal extends Component {
  state = {
    //Variable that contains the line for the case values
    cases: null, 
    // d3 helpers for scaling and generating the lines for the graph
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    lineGenerator: d3.line(),
    dateLineGenerator: d3.line(),
    //Array that holds important date lines
    dates: []
  };
  //Creates the axis for the graph
  xAxis = d3.axisBottom().scale(this.state.xScale)
    .tickFormat(d3.timeFormat('%B %d'));
  yAxis = d3.axisLeft().scale(this.state.yScale)
    .tickFormat(d => `${d}`);

/***
* Invoked before render and during updates
* Updates the state of the shared variables of the class
* Returns the state of the newly updated cases array and dates
***/
  static getDerivedStateFromProps(nextProps, prevState) {
    // data hasn't been loaded yet so do nothing
    if (!nextProps.data) return null; 
    
    const {data} = nextProps;
    const dateProp = nextProps.importantDate;
    const {xScale, yScale, lineGenerator, dateLineGenerator} = prevState;
    const choice = nextProps.choice;
    let dates = new Array();

    // Calculate scale domains
    const timeDomain = d3.extent(data, d => new Date(d.date_of_cases));
    const caseMax = d3.max(data, d => d[choice]);

    //calculate the time and amount scaling for the graphs
    xScale.domain(timeDomain);
    yScale.domain([0, caseMax]);

    // calculate case lines
    lineGenerator.x(d => xScale(new Date(d.date_of_cases)));
    lineGenerator.y(d  => yScale(d[choice]));
    let cases = lineGenerator(data);
    
    //calculate important date lines
    const currentTime = new Date();
    for(let date in dateProp) {
      let dateObj = new Date(dateProp[date]);
      if(dateObj.getMonth() <= currentTime.getMonth()) {
        dateLineGenerator.x(d => xScale(new Date(dateProp[date])));
        dateLineGenerator.y(d  => yScale(d[choice]));
        dates.push(dateLineGenerator(data));
      }
    }
    return {cases, dates};
  }
  
  /***
  * Operates on the DOM once the component is updated (different data is passed)
  * Changes the x and y axis / graph
  ***/
  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }
  render() {
    return (
      <div>
      <svg class="lineChart" width={width} height={height}>
        <path d={this.state.cases} fill='none' stroke="red" strokeWidth='2' />
        {displayImportantDates(this.state.dates)}
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
          <g ref='yAxis' transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
      </div>
    );
  }
}

export default OregonTotal;
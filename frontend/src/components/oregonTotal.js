import React, { Component } from 'react';
import * as d3 from 'd3';
import '../styles/svgBg.css';
import { displayImportantDates } from './sharedFunctions'
const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};

class OregonTotal extends Component {
  state = {
    cases: null, // svg path command for all the high temps
    // d3 helpers
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    lineGenerator: d3.line(),
    dateLineGenerator: d3.line(),
    dates: []
  };

  xAxis = d3.axisBottom().scale(this.state.xScale)
    .tickFormat(d3.timeFormat('%B %d'));
  yAxis = d3.axisLeft().scale(this.state.yScale)
    .tickFormat(d => `${d}`);

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    
    const {data} = nextProps;
    const dateProp = nextProps.importantDate;
    const {xScale, yScale, lineGenerator, dateLineGenerator} = prevState;
    const choice = nextProps.choice;
    let dates = new Array();

    // Calculate scale domains
    const timeDomain = d3.extent(data, d => new Date(d.date_of_cases));
    const caseMax = d3.max(data, d => d[choice]);

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
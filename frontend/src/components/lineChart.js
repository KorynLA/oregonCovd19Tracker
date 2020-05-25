import React, { Component } from 'react';
import * as d3 from 'd3';
import '../styles/svgBg.css';
import { displayImportantDates } from './sharedFunctions'
const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};

class LineChart extends Component {
  state = {
    cases: [], // svg path command for low temps,
    counties: [],
    xScaleCases: d3.scaleTime().range([margin.left, width - margin.right]),
    yScaleCases: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    choice: null,
    caseLineGenerator: d3.line(),
    lineGenerator: d3.line(),
    dates: [],
    color: d3.scaleOrdinal(d3.schemeCategory10)
  };

  xAxis = d3.axisBottom().scale(this.state.xScaleCases)
    .tickFormat(d3.timeFormat('%B %d'));
  yAxis = d3.axisLeft().scale(this.state.yScaleCases)
    .tickFormat(d => `${d}`);

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

      // calculate line for cases
      caseLineGenerator.x(d => xScaleCases(new Date(d.date_of_cases)));
      caseLineGenerator.y(d  => yScaleCases(d[choice]));
      cases.push(caseLineGenerator(data[county]));
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

  displayLines() {
    var counter = -1;
    return this.state.cases.map( line => {
      counter+=1;
      return (<g><path d={line} fill='none' text="he" stroke={this.state.color(counter)} strokeWidth='2' /></g>);
    });
  }

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

  componentDidUpdate() {
    d3.selectAll("svg > *").remove();
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
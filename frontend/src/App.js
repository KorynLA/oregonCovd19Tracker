
import React, { Component } from 'react';
import './styles/App.css';
import LineChart from './components/lineChart';
//import CasesLineChart from './components/casesLineChart';
import DailyChange from './components/dailyChanges';
import OregonTotal from './components/oregonTotal';

class App extends Component {
  state = {
    totalCovdData: {},
    countyPopulation: {},
    countyCovdData: {},
    countyChosen: 'metro',
    important:{'St.Patricks': '2020-03-17', 'Easter': '2020-04-12', 'Cinco De Mayo': '2020-05-05',
    "Mother's Day": '2020-05-10', "Phase 1 OR reopen": '2020-05-15','Memorial Day':'2020-05-25', "Father's Day":'2020-06-21', 'Independence Day': '2020-07-04', 'Labor Day':'2020-09-07',
    'Halloween':'2020-10-31', 'Veterans Day':'2020-11-11', 'Thanksgiving': '2020-26-11', 'First Day Hanukkah': '2020-12-11', 'Christmas Day': '2020-12-25', 
    'New Years Eve': '2020-12-31', 'New Years Day': '2021-01-01'},
  };

  componentDidMount() {
    Promise.all([
      fetch('http://localhost:3000/eastern'),
      fetch('http://localhost:3000/metro'),
      fetch('http://localhost:3000/central'),
      fetch('http://localhost:3000/southwestern'),
      fetch('http://localhost:3000/total'),
      fetch('http://localhost:3000/willamette'),
      fetch('http://localhost:3000/counties')
    ])
    .then(responses => Promise.all(responses.map(resp => resp.json())))
    .then(([eastern, metro, central, southwestern, total, willamette, counties]) => {
      this.setState({countyCovdData: {eastern, metro, central, southwestern, willamette}});
      this.setState({totalCovdData: total});
      this.setState({countyPopulation: counties});
    }).finally(console.log("resolved"));
  }

  updateCountyChosen = (e) => {
    this.setState({countyChosen: e.target.value});
  }

  displayDates() {
    var currentTime = new Date("2020-05-14");
    var newTime = new Date("2020-05-14");
    var list = [];
    for(let name in this.state.important) {
      var dateObj = new Date(this.state.important[name]);
      if(dateObj.getMonth() <= newTime.getMonth()) {
        list.push(<li>{name}: {this.state.important[name].substr(5).replace('-', '/')}</li>);
      }
    }
    return list;
  }
  dropdown() {
    return (
      <select class="dropdown" name='city' onChange={this.updateCountyChosen}>
        <option value='metro'>Portland Metro</option>
        <option value='willamette'>Willamette Valley and North Coast</option>
        <option value='southwestern'>Southwestern Oregon</option>
        <option value='central'>Central Oregon</option>
        <option value='eastern'>Eastern Oregon</option>
      </select>
    );
  }

  displayUserChoiceData() {
    return (
      <div>
        <h3>Positive Cases</h3>
        <LineChart data={this.state.countyCovdData[this.state.countyChosen]} choice="positive_cases" importantDate={this.state.important}/>
        <h3> Deaths </h3>
        <LineChart data={this.state.countyCovdData[this.state.countyChosen]} choice="deaths" importantDate={this.state.important}/>
      </div>
    );
  }

  displayORTotalData(){
    return (
      <div>
        <h3>Total Oregon Positive Cases</h3>
        <OregonTotal data={this.state.totalCovdData} choice = "positive_cases" importantDate={this.state.important}/>
        <h3>Total Oregon Deaths</h3>
        <OregonTotal data={this.state.totalCovdData} choice = "deaths" importantDate={this.state.important}/>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <h1>
          Oregon COVID-19 Cases
        </h1>
        {this.dropdown()}
        <DailyChange populationData={this.state.countyPopulation} data={this.state.countyCovdData[this.state.countyChosen]} /> 
        <div class="dates">
          <h4 class="dateHeader"> Dates marked on graphs </h4>
          {this.displayDates()}
        </div>
        {this.displayUserChoiceData()}
        {this.displayORTotalData()}
      </div>
    );
  }
}export default App;
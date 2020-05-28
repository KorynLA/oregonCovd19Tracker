
import React, { Component } from 'react';
import './styles/App.css';
import LineChart from './components/lineChart';
//import CasesLineChart from './components/casesLineChart';
import DailyChange from './components/dailyChanges';
import OregonTotal from './components/oregonTotal';

//Main class called in index.js
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
  
  /***
  * When component is mounted calls the endpoints containing the data
  * waits until the data is retrived and sets their state
  ***/
  componentDidMount() {
    Promise.all([
      fetch('https://fierce-bastion-38811.herokuapp.com/api/eastern'),
      fetch('https://fierce-bastion-38811.herokuapp.com/api/metro'),
      fetch('https://fierce-bastion-38811.herokuapp.com/api/central'),
      fetch('https://fierce-bastion-38811.herokuapp.com/api/southwestern'),
      fetch('https://fierce-bastion-38811.herokuapp.com/api/total'),
      fetch('https://fierce-bastion-38811.herokuapp.com/api/willamette'),
      fetch('https://fierce-bastion-38811.herokuapp.com/api/counties')
    ])
    .then(responses => Promise.all(responses.map(resp => resp.json())))
    .then(([eastern, metro, central, southwestern, total, willamette, counties]) => {
      this.setState({countyCovdData: {eastern, metro, central, southwestern, willamette}});
      this.setState({totalCovdData: total});
      this.setState({countyPopulation: counties});
    }).finally(console.log("resolved"));
  }

  //updates the state of countyChosen when user decides to change the daily table to see
  updateCountyChosen = (e) => {
    this.setState({countyChosen: e.target.value});
  }

  /***
  * Takes the important dates up until todays date and creates an array with a list of the
  * important dates name and the assocaited value
  ***/
  displayDates() {
    var currentTime = new Date();
    var list = [];
    for(let name in this.state.important) {
      var dateObj = new Date(this.state.important[name]);
      if(dateObj.getMonth() <= currentTime.getMonth()) {
        list.push(<li>{name}: {this.state.important[name].substr(5).replace('-', '/')}</li>);
      }
    }
    return list;
  }

  //Creates a dropdown of OR regions for the user to see the daily change data
  dropdown() {
    return (
    <div>
      <select class="dropdown" name='city' onChange={this.updateCountyChosen}>
        <option value='metro'>Portland Metro</option>
        <option value='willamette'>Willamette Valley and North Coast</option>
        <option value='southwestern'>Southwestern Oregon</option>
        <option value='central'>Central Oregon</option>
        <option value='eastern'>Eastern Oregon</option>
      </select>
      </div>
    );
  }

  /***
  * Calls the linechart graph using "choice" which contains the county name
  * The county name data and the positive_cases and deaths choice are passed.
  * Both graphs (positive Cases and deaths are displayed)
  ***/
  displayUserChoiceData(choice) {
    return (
      <div>
        <h3>{choice} Positive Cases</h3>
        <LineChart data={this.state.countyCovdData[choice]} choice="positive_cases" importantDate={this.state.important}/>
        <h3>{choice} Deaths </h3>
        <LineChart data={this.state.countyCovdData[choice]} choice="deaths" importantDate={this.state.important}/>
      </div>
    );
  }
  
  /***
  * Displays OR positive_cases and deaths.
  * totalCovdData is passed which is formatted differently from countyCovdData
  ***/
  displayORTotalData(){
    return (
      <div>
        <h3>Oregon Total Positive Cases</h3>
        <OregonTotal data={this.state.totalCovdData} choice = "positive_cases" importantDate={this.state.important}/>
        <h3>Oregon Total Deaths</h3>
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
        <p>All data is from the <a href="https://govstatus.egov.com/OR-OHA-COVID-19">OHA website</a></p>
        <h3>{this.state.countyChosen} Daily Change</h3>
        {this.dropdown()}
        <DailyChange populationData={this.state.countyPopulation} data={this.state.countyCovdData[this.state.countyChosen]} /> 
        <div class="dates">
          <h4 class="dateHeader"> Dates marked on graphs </h4>
          {this.displayDates()}
        </div>
        {this.displayUserChoiceData('metro')}
        {this.displayUserChoiceData('central')}
        {this.displayUserChoiceData('southwestern')}
        {this.displayUserChoiceData('eastern')}
        {this.displayUserChoiceData('willamette')}
        {this.displayORTotalData()}
      </div>
    );
  }
}export default App;
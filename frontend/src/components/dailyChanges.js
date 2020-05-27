import React, { useState, useEffect } from 'react';
import '../styles/dailyChanges.css';

export default function DailyChange(props) {
	const [day, setDay] = useState("00-00");
	const [names, setNames] = useState([]);
	const [allData, setAllData] = useState([]);
	const [countyPopulation, setCountyPopulation] = useState([]);

	/***
	* Effect hook that is called when the covd data sent is updated or the population
	* data sent is changed. Updates the rendered page variables state with the user's choice.
	***/
	useEffect(() => {
		//If either of the props passed are null, return. Props were not passed correctly.
    	if (!props.data || !props.populationData) {
      		return;
    	}
    	const parseData = props.data;
   
    	let nameArray = [];
		for(let name in parseData) {
			nameArray.push(name);
	 	}
	 	//obtains the day from props.data and parses the date to 00/00 format
	 	const day=parseData[nameArray[0]][0].date_of_cases.substr(5,5).replace('-', '/');
    	setDay(day);
    	setNames(nameArray);
    	setAllData(parseData);
    	setCountyPopulation(props.populationData);
	}, [props.data, props.populationData]);
	
	/***
	* Uses the county name and "choice" made (death or positive case amounts)
	* Finds the difference between the most recent day and the previous day
	* Returns the integer value of the result, or 0 if null (default value when starting to render page)
	***/
	function getChange(name, choice) {
		const result = allData[name][0][choice]-allData[name][1][choice];
		return result ? result : 0;
	}

	/***
	* Uses the county name and "choice" made (death or positive case amounts)
	* Finds the difference between the most recent day and the previous day
	# Divides the difference between the total from the previous day to find the rate of change
	* Multiply by 100 to get the percentage value
	* Returns the integer value of the result, or 0 if null (default value when starting to render page)
	***/
	function getPercentChange(name, choice){
		const result=((allData[name][0][choice]-allData[name][1][choice])/allData[name][1][choice])*100;
		return result ? result : 0;
	}

	/***
	* Uses the county name and "choice" made (death or positive case amounts)
	* Goes through the countyPopulation array, finds the current chosen name for the county
	* Uses the population data found to determine the quotient amount (dividing the pop by 10,000)
	* Returns the rounded value of choice prevelance per 10,000 people
	***/
	function prevelancePerTenThousand(name, choice) {
		for(let i=0; i < countyPopulation.length; i++) {
			if(countyPopulation[i]["countyname"].replace(/\s/g,'').toUpperCase() == name.toUpperCase().replace(/\s/g,'').replace('_', '')) {
				let quotient=countyPopulation[i].population/10000;
				//rounds up if over or equal to .5, rounds down if below
				return Math.round(allData[name][0][choice]/quotient);
			}
		}
	}

	/***
	* Creates a variable that maps the array of namees. Calls the getChange() 
	* and prevelancePerTenThousand() for both choices "deaths" and "positive_cases"
	* Each result is appended to the county row as a cell within it 
	***/
  	const listItems = names.map((number) =>
    	<tr key={number.toString()}>
      		<td>{number.replace("_", " ")}</td>
      		<td>{getChange(number, "positive_cases")}</td>
      		<td>{Math.round((getPercentChange(number, "positive_cases")+ Number.EPSILON) * 100) / 100}</td>
      		<td>{prevelancePerTenThousand(number, "positive_cases")}</td>
      		<td>{getChange(number, "deaths")}</td>
      		<td>{Math.round((getPercentChange(number, "deaths")+ Number.EPSILON) * 100) / 100}</td>
      		<td>{prevelancePerTenThousand(number, "deaths")}</td>
    	</tr>
  	);
  	
	 return (
	 	<div>
	 		<h4> Last Updated: {day} </h4>
	 		<table>
	 		<tr>
	 			<th>County</th>
	 			<th>Positives</th>
	 			<th>Change (%)</th>
	 			<th>County Case(s) per 10,000*</th>
	 			<th>Deaths </th>
	 			<th>Change (%)</th>
	 			<th>County Death(s) per 10,000*</th>
	 		</tr>
	 		{listItems}
	 		</table>
	 		<p>*Based on 2019 county population data 
	 		from <a href="https://www.pdx.edu/prc/population-reports-estimates">Portland State University</a>.</p>
	 	</div>
	 );
}
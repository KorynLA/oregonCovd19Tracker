import React, { useState, useEffect } from 'react';
import '../styles/dailyChanges.css';
export default function DailyChange(props) {
	const [day, setDay] = useState("00-00-0000");
	const [names, setNames] = useState([]);
	const [allData, setAllData] = useState([]);
	const [countyPopulation, setCountyPopulation] = useState([]);
	//Called when the user updates the area to view data of
	//Sets the vars with the new props 
	useEffect(() => {
    	if (!props.data || !props.populationData) {
      		return;
    	}
    	const parseData = props.data;
   
    	let nameArray = [], dataArray = [], day;
		for(let name in parseData) {
			nameArray.push(name);
	 		day=new Date(parseData[name][0].date_of_cases);
	 	}

    	setDay(day.toLocaleDateString("en-US"));
    	setNames(nameArray);
    	setAllData(parseData);
    	setCountyPopulation(props.populationData);
	}, [props.data, props.populationData]);
	
	function getChange(name, choice) {
		const result = allData[name][0][choice]-allData[name][1][choice];
		return result ? result : 0;
	}

	function getPercentChange(name, choice){
		const result=((allData[name][0][choice]-allData[name][1][choice])/allData[name][1][choice])*100;
		return result ? result : 0;
	}
	function prevelancePerTenThousand(name, choice) {
		for(let i=0; i < countyPopulation.length; i++) {
			if(countyPopulation[i]["countyname"].replace(/\s/g,'').toUpperCase() == name.toUpperCase().replace(/\s/g,'').replace('_', '')) {
				let quotient=countyPopulation[i].population/10000;
				//occurances / quotient
				return Math.round(allData[name][0][choice]/quotient);
			}
		}
	}
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
	 		<h2> Last Updated: {day} </h2>
	 		<h3>Daily Increase</h3>
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
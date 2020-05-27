import React, { Component } from 'react';
/***
* Goes through each line created for the important dates and returns the path to create
* the line. The lines are added to the line chart that it was called from.
***/
export function displayImportantDates(lineGenerator) {
    return lineGenerator.map( line => {
      return (<path d={line} fill='none' stroke='black' strokeWidth='1' />);
    });
 }
import React, { Component } from 'react';

export function displayImportantDates(lineGenerator) {
    return lineGenerator.map( line => {
      return (<path d={line} fill='none' stroke='black' strokeWidth='1' />);
    });
 }
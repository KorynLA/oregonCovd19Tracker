# Oregon COVID-19 Tracker
## Table of Contents
   * [Tools Used](#tools_used)
   * [Frontend](#frontend)
   * [Backend](#backend)
   * [Database Schema](#database_schema)
   * [Deployment](#deployment)
## **Tools Used** <a name="tools_used"></a>
The frontend was created with React using the D3JS libray and the backend was created with Nodejs and Express. The data displayed was scraped using python through opening a connection to the Oregon Health Authority website and using BeautifulSoup. The data is loaded into a PostgreSQL database. This was deployed using Heroku. 

## **Frontend Routes** <a name="frontend"></a>
### / 
Main page: Displays the daily changes table. The region to view is chosen by the user with a dropdown form. All regional graphs and OR total graphs are displayed below.

## **Backend Endpoints** <a name="backend"></a>
### /api/total
 - GET
 - Returns Oregon total data
 - Format: JSON
 - Fields: date_of_cases, deaths, positive_cases
   - Returned as: [{"date_of_cases":"2020-05-26T00:00:00.000Z","positive_cases":3967,"deaths":148} ...]
### /api/central
 - GET
 - Returns county data for Wasco, Sherman, Gilliam, Jefferson, Wheeler, Crook, Deschutes, Lake and Klamath.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
### /api/counties
 - GET
 - Returns population data for all counties in Oregon
 - Format: JSON 
 - Fields: countyName, population
### /api/eastern
 - GET
 - Returns county data for Morrow, Umatilla, Union, Wallowa, Baker, Grant, Harney and Malheur.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
### /api/metro
 - GET
 - Returns county data for Clackamas, Hood River, Multnomah and eastern Washington.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
### /api/index
 - GET
 - Returns dummy data
 - Format: JSON 
### /api/southwestern
 - GET
 - Returns county data for Douglas, Curry, Coos, Josephine and Jackson.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
### /api/willamette
 - GET
 - Returns county data for Clatsop, Columbia, Tillamook, Yamhill, Polk, Marion, Lincoln, Linn, Benton and Lane.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
### /
 - GET
 - Returns frontend view

## **Database Schema** <a name="database_schema"></a>
   - There is a table for every county in Oregon. Each county contains the same column names.
     - County tables: Clackamas, hood_river, Multnomah, Washington, Clatsop, Columbia, Tillamook, Yamhill, Polk, Marion, Lincoln, Linn, Benton, Lane, Douglas, Curry, Coos, Josephine, Jackson, Wasco, Sherman, Gilliam, Jefferson, Wheeler, Crook, Deschutes, Lake, Klamath, Morrow, Umatilla, _union, Wallowa, Baker, _grant, Harney and Malheur.
       - **CountyName**(indexed, date_of_cases, positive_cases, deaths) 
         - indexed is the unique identifier
 - Total(indexed, date_of_cases, positive_cases, deaths)
   - indexed is the unique identifier
 - Counties(counties_key, countyname, population)
   - counties_key is the unique identifier

## **Deployment** <a name="deployment"></a>
This project was deployed using a monorepo. In the main root there is a procfile and package.json file displaying how the project is loaded and ran with Heroku. 
   - The backend is initially ran then the frontend is built as a buildpack and called by the backend server when the user calls the site with the '/' route. 
   - Due to the frontend running as a route, the user has the ability to view the backend routes by adding the route ending to the URL. i.e. 'SITE_URL/api/total'

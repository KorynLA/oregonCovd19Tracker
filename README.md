## **Tools Used**
The frontend was created with React using the D3JS libray and the backend was created with Nodejs and Express. The data displayed was scraped using python through opening a connection to the Oregon Health Authority website and using BeautifulSoup. The data is loaded into a PostgreSQL database. This was deployed using Heroku. 

## **Frontend Routes**
### / 
Main page: Displays the daily changes table. The region to view is chosen by the user with a dropdown form. All regional graphs and OR total graphs are displayed below.

## **Backend Endpoints**
### /api/total
 - Returns Oregon total data
 - Format: JSON
 - Fields: date_of_cases, deaths, positive_cases
   - Returned as: [{"date_of_cases":"2020-05-26T00:00:00.000Z","positive_cases":3967,"deaths":148} ...]
### /api/central
 - Returns county data for Wasco, Sherman, Gilliam, Jefferson, Wheeler, Crook, Deschutes, Lake and Klamath.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
### /api/counties
 - Returns population data for all counties in Oregon
 - Format: JSON 
 - Fields: countyName, population
### /api/eastern
 - Returns county data for Morrow, Umatilla, Union, Wallowa, Baker, Grant, Harney and Malheur.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
### /api/metro
 - Returns county data for Clackamas, Hood River, Multnomah and eastern Washington.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
### /api/index
 - Returns dummy data
 - Format: JSON 
### /api/southwestern
 - Returns county data for Douglas, Curry, Coos, Josephine and Jackson.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
### /api/willamette
 - Returns county data for Clatsop, Columbia, Tillamook, Yamhill, Polk, Marion, Lincoln, Linn, Benton and Lane.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}

## **Database Schema + Data Model**
   - There is a table for every county in Oregon. Each county contains the same column names.
     - County tables: Clackamas, hood_river, Multnomah, Washington, Clatsop, Columbia, Tillamook, Yamhill, Polk, Marion, Lincoln, Linn, Benton, Lane, Douglas, Curry, Coos, Josephine, Jackson, Wasco, Sherman, Gilliam, Jefferson, Wheeler, Crook, Deschutes, Lake, Klamath, Morrow, Umatilla, _union, Wallowa, Baker, _grant, Harney and Malheur.
       - **CountyName**(indexed, date_of_cases, positive_cases, deaths) 
         - indexed is the unique identifier
 - Total(indexed, date_of_cases, positive_cases, deaths)
   - indexed is the unique identifier
 - Counties(counties_key, countyname, population)
   - counties_key is the unique identifier

## **Deployment**
This project was deployed using a monorepo. In the main root there is a procfile and package.json file displaying how the project is loaded and ran with Heroku. 
   - The backend is initially ran then the frontend is built as a buildpack and called by the backend server when the user calls the site with the '/' route. 
   - Due to the project being ran as a monorepo, the user has the ability to view the backend routes by adding the route ending to the URL.

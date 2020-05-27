# **Tools Used**
The frontend was created with React using the D3JS libray and the backend was created with Nodejs and Express. The data displayed was scraped using python through opening a connection to the Oregon Health Authority website and using BeautifulSoup. The data is loaded into a PostgreSQL database. This was deployed using Heroku. 

# **Frontend Routes**
## / 
Main page: Displays the daily changes table. The region to view is chosen by the user with a dropdown form. All regional graphs and OR total graphs are displayed below.

# **Backend Endpoints**
## /total
 - Returns Oregon total data
 - Format: JSON
 - Fields: date_of_cases, deaths, positive_cases
   - Returned as: [{"date_of_cases":"2020-05-26T00:00:00.000Z","positive_cases":3967,"deaths":148} ...]
## /central
 - Returns county data for Wasco, Sherman, Gilliam, Jefferson, Wheeler, Crook, Deschutes, Lake and Klamath.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
## /counties
 - Returns population data for all counties in Oregon
 - Format: JSON 
 - Fields: countyName, population
## /eastern
 - Returns county data for Morrow, Umatilla, Union, Wallowa, Baker, Grant, Harney and Malheur.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
## /metro
 - Returns county data for Clackamas, Hood River, Multnomah and eastern Washington.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
## /index
 - Returns dummy data
 - Format: JSON 
## /southwestern
 - Returns county data for Douglas, Curry, Coos, Josephine and Jackson.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}
## /willamette
 - Returns county data for Clatsop, Columbia, Tillamook, Yamhill, Polk, Marion, Lincoln, Linn, Benton and Lane.
 - Format: JSON
 - Fields:
   - countyName, date_of_cases, deaths, positive_cases
   - Returned as:
     - {"countyName":[{"date_of_cases":"202x-0x-xT00:00:00.000Z","positive_cases":x,"deaths":x}...], ...}

# **Database Schema + Data Model**
Clackamas, Hood River, Multnomah Eastern Washington 
Clatsop, Columbia, Tillamook, Yamhill, Polk, Marion, Lincoln, Linn, Benton and Lane
Douglas, Curry, Coos, Josephine and JacksonWasco, Sherman, Gilliam, Jefferson, Wheeler, Crook, Deschutes, Lake and KlamathMorrow, Umatilla, Union, Wallowa, Baker, Grant, Harney and Malheur 

# **Deployment**

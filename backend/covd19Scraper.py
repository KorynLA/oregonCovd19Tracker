from bs4 import BeautifulSoup
import requests
from collections import defaultdict
import re
import psycopg2
import datetime
import sys
from connectLocalDB import connectDatabase as localConnection
from connectHerokuDB import connectDatabase as herokuConnection

#########
# Scrapes OHA website obtaining all info contained in the tables
# Parses the date found and if it doesn't match todays date, exits
# Returns a tuple with the parsed date and text within the td Soup object
#########
def scrapeOHAWebsite():
	URL = 'https://govstatus.egov.com/OR-OHA-COVID-19'
	try:
		fetchedPage = requests.get(URL)
	except:
		print(fetchedPage)
		sys.exit()
	htmlTree = BeautifulSoup(fetchedPage.content, 'html.parser')
	cases = htmlTree.find_all('table', 'table table-bordered')

	#parse the string in the first td tag to obtain the date of the data
	unparsedDate = cases[0].tr.get_text()
	parsedDate = re.search(r"(\d+/\d+/\d+)", unparsedDate)
	updatedDate = parsedDate.group(0)

	if(datetime.datetime.strptime(updatedDate, "%m/%d/%Y").date().strftime('%m/%d/%Y') != datetime.date.today().strftime('%m/%d/%Y')):
		print("Website not updated today. Try again later.")
		sys.exit()
	else:
		print('Website Scraped.')
	return  (updatedDate, cases)

#########
# Uses database connection to update all table data using the scraped OHA info
# Database connection, cursor, and case information from OHA website is passed to the function
#########
def updateDatabase(dbLConnection, dbLCursor, dbHConnection, dbHCursor, caseDate, name, countyValues):
	if name == 'Grant':
		command="INSERT INTO _grant (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(caseDate, countyValues[0].strip(), countyValues[1].strip())
	elif name == 'Union':
		command="INSERT INTO _union (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(caseDate, countyValues[0].strip(), countyValues[1].strip())
	elif name == 'Hood River':
		command="INSERT INTO hood_river (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(caseDate, countyValues[0].strip(), countyValues[1].strip())
	else:
		command="INSERT INTO {} (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(name, caseDate, countyValues[0].strip(), countyValues[1].strip())
	print(command)
	dbLCursor.execute(command)
	dbLConnection.commit()
	dbHCursor.execute(command)
	dbHConnection.commit()

#Connect to Heroku and local Postgres DB clients
curL, conL = localConnection()
curH, conH = herokuConnection()

dateFound, tdArray = scrapeOHAWebsite()

#Determine if date has already been added to tables (uses total as case)
command = "SELECT date_of_cases FROM total WHERE total.date_of_cases='{}';".format(dateFound)
curL.execute(command)
if curL.fetchall():
	print("Date already added to tables.")
	sys.exit()

#cases 1 - total cases by county, wrapped in td tag
casesByCounty=tdArray[1].find_all('td')
#Create array of values [positive, deaths]
caseValues = []
#Counting to go through td tags for county names and their corresponding positive / deaths data 
counter = 0
for case in casesByCounty:
	#County name the following statements will be finding values for
	if(counter == 0):
		countyName = case.get_text().strip()
		counter+=1
	elif(counter > 0 and counter < 3 ):
		caseValues.append(case.get_text())
		counter+=1
	else:
		caseValues.append(case.get_text())
		counter = 0
		updateDatabase(conL, curL, conH, curH, dateFound, countyName, caseValues)
		caseValues = []

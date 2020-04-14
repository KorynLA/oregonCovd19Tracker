from bs4 import BeautifulSoup
import requests
from collections import defaultdict
import re
import psycopg2
import datetime
import sys

#########
# Attempts connection to postgreSQL database
# If connection cannot be created the program exits
# Returns a tuple with cursor and connection to the databse
#########
def connectDatabase():
	try:
		connection=psycopg2.connect(
		database="",
		host="",
		user="",
		password="",
		port="")
	except:
		print('Cannot connect to database.')
		sys.exit()
	cursor=connection.cursor()
	return (cursor, connection) 

#########
# Scrapes OHA website obtaining all info contained in the tables
# Parses the date found and if it doesn't match todays date, exits
# Returns a tuple with the parsed date and text within the td Soup object
#########
def scrapeOHAWebsite():
	URL = 'https://govstatus.egov.com/OR-OHA-COVID-19'
	fetchedPage = requests.get(URL)
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
		print('Starting database update.')
	return  (updatedDate, cases)

#########
# Uses database connection to update all table data using the scraped OHA info
# Database connection, cursor, and case information from OHA website is passed to the function
#########
def updateDatabase(databaseConnection, databaseCursor, caseDate, name, countyValues):
	if name == 'Grant':
		command="INSERT INTO _grant (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(caseDate, countyValues[0], countyValues[1])
	elif name == 'Union':
		command="INSERT INTO _union (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(caseDate, countyValues[0], countyValues[1])
	elif name == 'Hood River':
		command="INSERT INTO hood_river (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(caseDate, countyValues[0], countyValues[1])
	else:
		command="INSERT INTO {} (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(name, caseDate, countyValues[0], countyValues[1])
		print(command)
	databaseCursor.execute(command)
	connection.commit()

cur, con = connectDatabase()
dateFound, tdArray = scrapeOHAWebsite()

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
		updateDatabase(con, cur, dateFound, countyName, caseValues)
		caseValues = []
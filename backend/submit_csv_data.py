import csv
import psycopg2
import datetime

from connectLocalDB import connectDatabase as localConnection
from connectHerokuDB import connectDatabase as herokuConnection


#Connect to Heroku and local Postgres DB clients
curL, conL = localConnection()
curH, conH = herokuConnection()

#Open CSV spreadsheet and add data to PostgreSQL database
#Assumes excel format is: case date, county name, positives cases, and death amount.
with open('filename.csv', mode='r', encoding='utf-8-sig') as populationFile:
	reader = csv.reader(populationFile)
	for row in reader:
		if row[1] == 'Grant':
			command="INSERT INTO _grant (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(row[0], row[2], row[3])
		elif row[1] == 'Union':
			command="INSERT INTO _union (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(row[0], row[2], row[3])
		elif row[1] == 'Hood River':
			command="INSERT INTO hood_river (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(row[0], row[2], row[3])
		else:
			command="INSERT INTO {} (date_of_cases, positive_cases, deaths) VALUES ('{}', '{}', '{}');".format(row[1], row[0], row[2], row[3])
		print(command)
		curL.execute(command)
		conL.commit()
		curH.execute(command)
		conH.commit()
			#cursor.execute(command)
			#connection.commit()
 #VALUES (%s, %s);
conL.close()
conH.close()

# Project 2 - Come Fly with Me 
## Group Name: NoPreference
## Heroku Deployment
* the interactive webpages have been deployed to: [https://comeflywithmeow.herokuapp.com/](https://comeflywithmeow.herokuapp.com/).
-------------------------------
### Member Name: 
#### Daniel Ohriner
#### Aram Hovasapyan
#### Elloit Jackson
#### Weijing Zhang
#### Zhuohui "Nana" Liang

### Purpose 
* To identify the most popular flight routes by airline between various destination cities
* To avoid possible delayed routes for travalers. 

### Affected Parties
This data visualization will prove useful to frequent flyers (business travelers), last minute bookings, and various other traveling throughout the rest of 2018.

### Scope: 
Due to the volume of flights per day in the United States, we will focus on 3 airports (LAX, CHI, JFK) and look at the following details for March 2018 (1-month data):
*	Airport Traffic
*	Airport Statistics such as On Time, Delays, Cancelled, etc… (Can be broken out by airline as well)
*	Most Popular Airlines (The airports selected are not Hubs so they should have somewhat of an even balance)
*	Most popular Routes by Airline and by City

### Summary of Analysis/Finding/Results: 
*   Southwest Airlines has the highest delayed flights compared to all the airlines in US, the total counts is 22257, total percentage is 22.54% on March 2018
*   Hawaiian Airlines is the most on time airline on March 2018 compared to all the airlines in US,the total counts is 961, total percentage is 0.97%
*   LAX airport has the higest delayed flights compared to all airports in US, total counts is 4362, total percentage is 4.42%
*   JetBlue Airways is the most likely delayed Airline, it has the most hight delayed flights percentage 9.68%. Delta Air Lines is the on time airline in the all airlines in US, delayed fligts percentage is 3.93%.
*    GUM is the most likely delayed Airport, it has the most hight delayed flights percentage 1.25%. 
*   Although travelers at JFK and ORD experience over two times as much average weather delay time as compared to LAX travelers, LAX had the highest average departure delay and average late aircraft delay time among the 3 airports.
*   Each airport had the highest number of departures and arrivals from the same airline (LAX-Southwest Airlines, JFK-Jet Blue     Airways, ORD-Sky West Airlines)
*   Among all flight activity between LAX, JFK, and ORD the 3 flight routes with the highest # of flights were (1. ORD to LGA,     2. LAX to SFO, 3. LAX to JFK).

### High-Level Overview of Technical Skills
The visualization must include:
*	Python Flask powered RESTful API, HTML/CSS, JavaScript, and at least one database (MySQL, Mongo DB, SQLite, etc.)
*	Should fall into one of the four tracks:
   1. Custom “creative” D3.js project
   2. Combination of Web Scraping and Leaflet or Plotly
   3. Dashboard with multiple charts updating from same data source
   4. Thick server that performs multiple manipulation on data in database prior to visualization
*	Include one new JS library
*	Processed more than 600K records of data using Python and SQL
*	Include some level of UI

### Sample Data Visualizations
*original scratch
![1](/images/1.jpg)

![2](/images/2.jpg)


*end product
![3](/images/3.jpg)
![4](/images/4.jpg)
![5](/images/5.jpg)

### Restrictions
*	Timing: We only selected a short period of the time (March 2018) to explore the data as the dataset is enomously large and cannot be loaded to github successfully 
 
### References
* [https://aspm.faa.gov/apm/sys/AnalysisAP.asp](https://aspm.faa.gov/apm/sys/AnalysisAP.asp)
* [https://aspm.faa.gov/apm/sys/apm-server-x.asp](https://aspm.faa.gov/apm/sys/apm-server-x.asp)
* [https://developer.flightstats.com/api-docs/flightstatus/v2/airport](https://developer.flightstats.com/api-docs/flightstatus/v2/airport)
* [https://www.transtats.bts.gov/OT_Delay/OT_DelayCause1.asp?pn=1](https://www.transtats.bts.gov/OT_Delay/OT_DelayCause1.asp?pn=1)
* [https://status.flightstats.com/](https://status.flightstats.com/)

### Data Manipulation and Observation

```python

#SQLalchemy to bring Transtats airport data csv into SQLite 
#import dependencies
import pandas as pd
import numpy as np
import sqlite3
from pandas.io import sql
import subprocess

# import SQLalchemy dependencies
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

from sqlalchemy import Column, Integer, String, Float

import pymysql
pymysql.install_as_MySQLdb()

#read csv into dataframe
df = pd.read_csv('transtats_final.csv', sep=',',  dtype='unicode')

#inspect dataframe
df.head(10)

# In and output file paths
in_csv = 'transtats_final.csv'
out_sqlite = 'transtats_dataset_Finalversion.sqlite'

table_name = 'my_table_finalversion' # name for the SQLite database table
chunksize = 10000000 # number of lines to process at each iteration

# columns that should be read from the CSV file
columns = ['CARRIER', 'ORIGIN', 'ORIGIN_CITY_NAME', 'DEST', 'DEST_CITY_NAME', 'DEP_DELAY', 'WEATHER_DELAY', 'LATE_AIRCRAFT_DELAY'] 

# Get number of lines in the CSV file
nlines = subprocess.check_output(['wc', '-l', in_csv])
nlines = int(nlines.split()[0]) 

# connect to database
cnx = sqlite3.connect(out_sqlite)

# Iteratively read CSV and dump lines into the SQLite table
for i in range(0, nlines, chunksize):  # change 0 -> 1 if your csv file contains a column header
    
    df = pd.read_csv(in_csv,  
            header=None,  # no header, define column header manually later
            nrows=chunksize, # number of rows to read at each iteration
            skiprows=i)   # skip rows that were already read

# columns to read        
df.columns = columns

sql.to_sql(df, 
            name=table_name, 
            con=cnx, 
            index=False, # don't use CSV file index
            index_label='ORIGIN', # use a unique column from DataFrame as index
            if_exists='append') 



#write dataframe to SQlite
df.to_sql(out_sqlite, cnx, schema=None, if_exists='fail', index=True, index_label=None, chunksize=None, dtype=None)
```


```sql

/*SQL queries to analyze Transtats Airport data */
/* Total Flights out of LAX*/
SELECT ORIGIN, COUNT (ORIGIN)
FROM my_table_finalversion
WHERE ORIGIN= 'LAX' ;

/* Total Flights out of ORD*/
SELECT ORIGIN, COUNT (ORIGIN)
FROM my_table_finalversion
WHERE ORIGIN= 'ORD' ;

/* Total Flights out of JFK*/
SELECT ORIGIN, COUNT (ORIGIN)
FROM my_table_finalversion
WHERE ORIGIN= 'JFK' ;

/* # of Outbound flights ranked by destination for LAX*/
SELECT ORIGIN, DEST, COUNT(DEST)
FROM my_table_finalversion
Where Origin= 'LAX'
GROUP BY DEST
ORDER BY COUNT(DEST) DESC;

/* # of Outbound flights ranked by destination for JFK*/
SELECT ORIGIN, DEST, COUNT(DEST)
FROM my_table_finalversion
Where Origin= 'JFK'
GROUP BY DEST
ORDER BY COUNT(DEST) DESC;

/* # of Outbound flights ranked by destination for ORD*/
SELECT ORIGIN, DEST, COUNT(DEST)
FROM my_table_finalversion
Where Origin= 'ORD'
GROUP BY DEST
ORDER BY COUNT(DEST) DESC;

/* AVG departure delay for LAX/ORD/JFK*/
SELECT ORIGIN, avg(DEP_DELAY_NEW)
FROM my_table_finalversion
WHERE ORIGIN IN ('LAX', 'JFK', 'ORD')
GROUP BY Origin
ORDER BY avg(DEP_DELAY_NEW) DESC;

/* AVG late aircraft delay for LAX/ORD/JFK*/
SELECT ORIGIN, avg(LATE_AIRCRAFT_DELAY)
FROM my_table_finalversion
WHERE ORIGIN IN ('LAX', 'JFK', 'ORD')
GROUP BY Origin
ORDER BY avg(LATE_AIRCRAFT_DELAY) DESC;

/* Top 10 outbound destinations */

/* LAX */
SELECT ORIGIN, DEST, COUNT(DEST)
FROM my_table_finalversion
Where Origin= 'LAX'
GROUP BY DEST
ORDER BY COUNT(DEST) DESC
Limit 10;

/* ORD */
SELECT ORIGIN, DEST, COUNT(DEST)
FROM my_table_finalversion
Where Origin= 'ORD'
GROUP BY DEST
ORDER BY COUNT(DEST) DESC
Limit 10;

/* JFK */
SELECT ORIGIN, DEST, COUNT(DEST)
FROM my_table_finalversion
Where Origin= 'JFK'
GROUP BY DEST
ORDER BY COUNT(DEST) DESC
Limit 10;


/*Total Departures
-broken down by airline (top 3 and top 5) for LAX/ORD/JFK
*/

/* LAX */)
SELECT ORIGIN, CARRIER, COUNT(*) FROM my_table_finalversion WHERE ORIGIN='LAX' GROUP BY CARRIER ORDER BY COUNT(*) DESC
LIMIT 3;

SELECT ORIGIN, CARRIER, COUNT(*) FROM my_table_finalversion WHERE ORIGIN='LAX' GROUP BY CARRIER ORDER BY COUNT(*) DESC
LIMIT 5;

/* ORD */
SELECT ORIGIN, CARRIER, COUNT(*) FROM my_table_finalversion WHERE ORIGIN='ORD' GROUP BY CARRIER ORDER BY COUNT(*) DESC
LIMIT 3;

SELECT ORIGIN, CARRIER, COUNT(*) FROM my_table_finalversion WHERE ORIGIN='ORD' GROUP BY CARRIER ORDER BY COUNT(*) DESC
LIMIT 5;

/* JFK */
SELECT ORIGIN, CARRIER, COUNT(*) FROM my_table_finalversion WHERE ORIGIN='JFK' GROUP BY CARRIER ORDER BY COUNT(*) DESC
LIMIT 3;

SELECT ORIGIN, CARRIER, COUNT(*) FROM my_table_finalversion WHERE ORIGIN='JFK' GROUP BY CARRIER ORDER BY COUNT(*) DESC
LIMIT 5;



/* Total Arrivals
-broken down by airline (top 3 or 5) */

/*LAX*/
SELECT DEST, CARRIER, COUNT(*) 
FROM my_table_finalversion
WHERE DEST= 'LAX' 
GROUP BY CARRIER  ORDER BY COUNT(*) DESC
LIMIT 3;

SELECT DEST, CARRIER, COUNT(*) 
FROM my_table_finalversion
WHERE DEST= 'LAX' 
GROUP BY CARRIER  ORDER BY COUNT(*) DESC
LIMIT 5;

/*ORD*/
SELECT DEST, CARRIER, COUNT(*) 
FROM my_table_finalversion
WHERE DEST= 'ORD' 
GROUP BY CARRIER  ORDER BY COUNT(*) DESC
LIMIT 3;

SELECT DEST, CARRIER, COUNT(*) 
FROM my_table_finalversion
WHERE DEST= 'ORD' 
GROUP BY CARRIER  ORDER BY COUNT(*) DESC
LIMIT 5;

/*JFK*/
SELECT DEST, CARRIER, COUNT(*) 
FROM my_table_finalversion
WHERE DEST= 'JFK' 
GROUP BY CARRIER ORDER BY COUNT(*) DESC
LIMIT 3;

SELECT DEST, CARRIER, COUNT(*) 
FROM my_table_finalversion
WHERE DEST= 'JFK' 
GROUP BY CARRIER ORDER BY COUNT(*) DESC
LIMIT 5;


/*Avg Weather Delay for LAX/JFK/ORD */

SELECT ORIGIN, AVG (WEATHER_DELAY)
FROM my_table_finalversion
WHERE ORIGIN IN ('LAX', 'JFK', 'ORD')
GROUP BY Origin
ORDER BY AVG (WEATHER_DELAY) DESC;

```


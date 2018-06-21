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




```python
 # Dependencies
import pandas as pd
import numpy as np
import os
```


```python
# Read CSV file into a pandas DataFrame
data = pd.read_csv ("static/data/arrival_depart_data.csv")
```


```python
# Use `dropna` to drop any rows where there is missing data / reset data
data = data.dropna(axis=0).reset_index(drop=True)
data.count()
```




    id                       98695
    YEAR                     98695
    FL_DATE                  98695
    UNIQUE_CARRIER           98695
    AIRLINE_ID               98695
    CARRIER                  98695
    ORIGIN_AIRPORT_ID        98695
    ORIGIN_CITY_MARKET_ID    98695
    ORIGIN                   98695
    ORIGIN_CITY_NAME         98695
    DEST_AIRPORT_ID          98695
    DEST_CITY_MARKET_ID      98695
    DEST                     98695
    DEST_CITY_NAME           98695
    DEP_DELAY_NEW            98695
    TAXI_OUT                 98695
    WHEELS_OFF               98695
    WHEELS_ON                98695
    TAXI_IN                  98695
    ARR_DELAY_NEW            98695
    CANCELLED                98695
    DIVERTED                 98695
    FLIGHTS                  98695
    CARRIER_DELAY            98695
    WEATHER_DELAY            98695
    dtype: int64




```python
# Remove hawaii.sqlite if exists
os.remove("static/data/data.sqlite")
```


    ---------------------------------------------------------------------------

    FileNotFoundError                         Traceback (most recent call last)

    <ipython-input-8-4683cbe28d3c> in <module>()
          1 # Remove hawaii.sqlite if exists
    ----> 2 os.remove("static/data/data.sqlite")
    

    FileNotFoundError: [WinError 2] The system cannot find the file specified: 'static/data/data.sqlite'



```python
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric, Text, Float, Date
```


```python
# Create an engine to a SQLite database file called `hawaii.sqlite`
engine = create_engine("sqlite:///static/data/data.sqlite", echo=False)
```


```python
 # Create a connection to the engine called `conn`
conn = engine.connect()
```


```python
# Use `declarative_base` from SQLAlchemy to model the table as an ORM class


Base = declarative_base()

class Airportdata(Base):
    __tablename__ = 'airportdata'

    id = Column(Integer, primary_key=True)
    YEAR = Column(Integer)
    FL_DATE = Column(Text)
    UNIQUE_CARRIER = Column(Text)
    AIRLINE_ID = Column(Text)
    CARRIER = Column(Text)
    ORIGIN_AIRPORT_ID = Column(Text)
    ORIGIN_CITY_MARKET_ID = Column(Text)
    ORIGIN = Column(Text)
    ORIGIN_CITY_NAME = Column(Text)
    DEST_AIRPORT_ID = Column(Text)
    DEST_CITY_MARKET_ID = Column(Text)
    DEST = Column(Text)
    DEST_CITY_NAME = Column(Text)
    DEP_DELAY_NEW = Column(Float)
    TAXI_OUT = Column(Float)
    WHEELS_OFF = Column(Float)
    WHEELS_ON = Column(Float)
    TAXI_IN = Column(Float)
    ARR_DELAY_NEW = Column(Float)
    CANCELLED = Column(Float)
    DIVERTED = Column(Float)
    FLIGHTS = Column(Float)
    CARRIER_DELAY = Column(Float)
    WEATHER_DELAY = Column(Float)

    def __repr__(self):
        return f"id={self.id}, name={self.name}"
```


```python
 # Use `create_all` to create the tables in the database
Base.metadata.create_all(engine)
```


```python
 # Use Orient='records' to create a list of data to write
Mdata = data.to_dict(orient='records')
```


```python
 # Data is just a list of dictionaries that represent each row of data
print(Mdata[:1])
```

    [{'id': 4, 'YEAR': 2018, 'FL_DATE': '3/21/2018', 'UNIQUE_CARRIER': 'OH', 'AIRLINE_ID': 20397, 'CARRIER': 'OH', 'ORIGIN_AIRPORT_ID': 11057, 'ORIGIN_CITY_MARKET_ID': 31057, 'ORIGIN': 'CLT', 'ORIGIN_CITY_NAME': 'Charlotte, NC', 'DEST_AIRPORT_ID': 10434, 'DEST_CITY_MARKET_ID': 30434, 'DEST': 'AVP', 'DEST_CITY_NAME': 'Scranton/Wilkes-Barre, PA', 'DEP_DELAY_NEW': 39.0, 'TAXI_OUT': 12.0, 'WHEELS_OFF': 1721.0, 'WHEELS_ON': 1839.0, 'TAXI_IN': 2.0, 'ARR_DELAY_NEW': 23.0, 'CANCELLED': 0, 'DIVERTED': 0, 'FLIGHTS': 1, 'CARRIER_DELAY': 0.0, 'WEATHER_DELAY': 0.0}]
    


```python
 # Use MetaData from SQLAlchemy to reflect the tables
metadata = MetaData(bind=engine)
metadata.reflect()
```


```python
 # Save the reference to the table as a variable called `Mtable` 
Mtable = sqlalchemy.Table('airportdata', metadata, autoload=True)
```


```python
# Use `table.delete()` to remove any pre-existing data.
conn.execute(Mtable.delete()) 

```




    <sqlalchemy.engine.result.ResultProxy at 0x195b21a9828>




```python
 # Use `table.insert()` to insert the data into the table
# The SQL table is populated during this step
conn.execute(Mtable.insert(), Mdata)
```




    <sqlalchemy.engine.result.ResultProxy at 0x195b21dab70>




```python
 # Test that table works by fetching the first 5 rows. 
conn.execute("select * from airportdata limit 5").fetchall()
```




    [(4, 2018, '3/21/2018', 'OH', '20397', 'OH', '11057', '31057', 'CLT', 'Charlotte, NC', '10434', '30434', 'AVP', 'Scranton/Wilkes-Barre, PA', 39.0, 12.0, 1721.0, 1839.0, 2.0, 23.0, 0.0, 0.0, 1.0, 0.0, 0.0),
     (8, 2018, '3/25/2018', 'OH', '20397', 'OH', '11057', '31057', 'CLT', 'Charlotte, NC', '10434', '30434', 'AVP', 'Scranton/Wilkes-Barre, PA', 70.0, 15.0, 1755.0, 1916.0, 5.0, 63.0, 0.0, 0.0, 1.0, 4.0, 0.0),
     (10, 2018, '3/27/2018', 'OH', '20397', 'OH', '11057', '31057', 'CLT', 'Charlotte, NC', '10434', '30434', 'AVP', 'Scranton/Wilkes-Barre, PA', 77.0, 13.0, 1800.0, 1919.0, 4.0, 65.0, 0.0, 0.0, 1.0, 58.0, 0.0),
     (13, 2018, '3/30/2018', 'OH', '20397', 'OH', '11057', '31057', 'CLT', 'Charlotte, NC', '10434', '30434', 'AVP', 'Scranton/Wilkes-Barre, PA', 86.0, 19.0, 1815.0, 1921.0, 3.0, 66.0, 0.0, 0.0, 1.0, 66.0, 0.0),
     (16, 2018, '3/2/2018', 'OH', '20397', 'OH', '15624', '31504', 'VPS', 'Valparaiso, FL', '11057', '31057', 'CLT', 'Charlotte, NC', 43.0, 15.0, 1700.0, 1915.0, 5.0, 35.0, 0.0, 0.0, 1.0, 20.0, 0.0)]



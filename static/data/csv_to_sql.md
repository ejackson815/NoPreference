

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
data.count()
```




    id                       611988
    YEAR                     611988
    FL_DATE                  611988
    UNIQUE_CARRIER           611988
    AIRLINE_ID               611988
    CARRIER                  611988
    ORIGIN_AIRPORT_ID        611988
    ORIGIN_CITY_MARKET_ID    611988
    ORIGIN                   611988
    ORIGIN_CITY_NAME         611988
    DEST_AIRPORT_ID          611988
    DEST_CITY_MARKET_ID      611988
    DEST                     611988
    DEST_CITY_NAME           611988
    DEP_DELAY_NEW            594331
    TAXI_OUT                 594776
    WHEELS_OFF               594777
    WHEELS_ON                594446
    TAXI_IN                  594446
    ARR_DELAY_NEW            593329
    CANCELLED                611988
    DIVERTED                 611988
    FLIGHTS                  611988
    CARRIER_DELAY             98744
    WEATHER_DELAY             98744
    dtype: int64




```python
# Remove hawaii.sqlite if exists
os.remove("static/data/data.sqlite")
```


```python
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric, Text, Float, Date
```


```python
# Create an engine to a SQLite database file
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

    [{'id': 1, 'YEAR': 2018, 'FL_DATE': '3/18/2018', 'UNIQUE_CARRIER': 'OH', 'AIRLINE_ID': 20397, 'CARRIER': 'OH', 'ORIGIN_AIRPORT_ID': 11057, 'ORIGIN_CITY_MARKET_ID': 31057, 'ORIGIN': 'CLT', 'ORIGIN_CITY_NAME': 'Charlotte, NC', 'DEST_AIRPORT_ID': 10434, 'DEST_CITY_MARKET_ID': 30434, 'DEST': 'AVP', 'DEST_CITY_NAME': 'Scranton/Wilkes-Barre, PA', 'DEP_DELAY_NEW': 0.0, 'TAXI_OUT': 28.0, 'WHEELS_OFF': 1647.0, 'WHEELS_ON': 1757.0, 'TAXI_IN': 3.0, 'ARR_DELAY_NEW': 0.0, 'CANCELLED': 0, 'DIVERTED': 0, 'FLIGHTS': 1, 'CARRIER_DELAY': nan, 'WEATHER_DELAY': nan}]
    


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




    <sqlalchemy.engine.result.ResultProxy at 0x1b988694f28>




```python
 # Use `table.insert()` to insert the data into the table
# The SQL table is populated during this step
conn.execute(Mtable.insert(), Mdata)
```




    <sqlalchemy.engine.result.ResultProxy at 0x1b9886b4be0>




```python
 # Test that table works by fetching the first 5 rows. 
conn.execute("select * from airportdata limit 5").fetchall()
```




    [(1, 2018, '3/18/2018', 'OH', '20397', 'OH', '11057', '31057', 'CLT', 'Charlotte, NC', '10434', '30434', 'AVP', 'Scranton/Wilkes-Barre, PA', 0.0, 28.0, 1647.0, 1757.0, 3.0, 0.0, 0.0, 0.0, 1.0, None, None),
     (2, 2018, '3/19/2018', 'OH', '20397', 'OH', '11057', '31057', 'CLT', 'Charlotte, NC', '10434', '30434', 'AVP', 'Scranton/Wilkes-Barre, PA', 0.0, 17.0, 1647.0, 1806.0, 4.0, 0.0, 0.0, 0.0, 1.0, None, None),
     (3, 2018, '3/20/2018', 'OH', '20397', 'OH', '11057', '31057', 'CLT', 'Charlotte, NC', '10434', '30434', 'AVP', 'Scranton/Wilkes-Barre, PA', 3.0, 22.0, 1655.0, 1807.0, 4.0, 0.0, 0.0, 0.0, 1.0, None, None),
     (4, 2018, '3/21/2018', 'OH', '20397', 'OH', '11057', '31057', 'CLT', 'Charlotte, NC', '10434', '30434', 'AVP', 'Scranton/Wilkes-Barre, PA', 39.0, 12.0, 1721.0, 1839.0, 2.0, 23.0, 0.0, 0.0, 1.0, 0.0, 0.0),
     (5, 2018, '3/22/2018', 'OH', '20397', 'OH', '11057', '31057', 'CLT', 'Charlotte, NC', '10434', '30434', 'AVP', 'Scranton/Wilkes-Barre, PA', 0.0, 33.0, 1658.0, 1817.0, 3.0, 2.0, 0.0, 0.0, 1.0, None, None)]



import datetime as dt
import numpy as np
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func
from flask_sqlalchemy import SQLAlchemy

# Create an engine to a SQLite database file
engine = create_engine("sqlite:///static/data/data.sqlite", echo=False)
# Declare a Base using `automap_base()`
Base = automap_base() 
 # Use the Base class to reflect the database tables
Base.prepare(engine, reflect=True)
 # Assign the measuremens and stations classes to variables 
Airportdata = Base.classes.airportdata
session = Session(engine)

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    """Return the dashboard homepage."""
    return render_template("index.html")

@app.route("/plane")
def plane():
    """Return the dashboard homepage."""
    return render_template("plane.html")

@app.route("/detail")
def detail():
    """Return the dashboard homepage."""
    return render_template("detail.html")

@app.route("/summary")
def summary():
    """Return the dashboard homepage."""
    return render_template("summary.html")

@app.route("/summary_counts")
def counts():
    """Return the dashboard homepage."""
    return render_template("summary_counts.html")

@app.route("/summary_percentages")
def percentages():
    """Return the dashboard homepage."""
    return render_template("summary_percentages.html")

@app.route("/flight_mapping")
def mapping():
    """Return the dashboard homepage."""
    return render_template("airports.html")

@app.route("/names")
def names():
    all_samples = session.query(Airportdata).ORIGIN
    all_samples_df = pd.read_sql_query(all_samples, session.bind)
    return jsonify(list(all_samples_df.columns))


@app.route("/rawdata")
def rawdata():
    # query for the sample data
    data_ls = []
    for i in session.query(Airportdata.id, Airportdata.CARRIER, Airportdata.ORIGIN, Airportdata.DEST, Airportdata.CANCELLED).all(): 
        item = {}

        item['ID'] = i[0]
        item['CARRIER'] = i[1]
        item['ORIGIN'] = i[2]
        item['DEST'] = i[3]
        item['CANCELLED'] = i[4]
        data_ls.append(item)

    return jsonify(data_ls)


@app.route("/total")
def total():
    # query for the sample data
    data_ls1 = []
    for i in session.query(func.count(Airportdata.UNIQUE_CARRIER), func.sum(Airportdata.CANCELLED)).all(): 
        item = {}

        item['total_departure'] = int(i[0])
        item['total_cancelled'] = int(i[1])
        item['total_arrival'] = int(i[0]) - int(i[1])
        data_ls1.append(item)

    return jsonify(data_ls1)


@app.route("/LAX")
def lax():
    # query for the sample data
    data_ls2 = []
    for i in session.query(func.count(Airportdata.UNIQUE_CARRIER),func.sum(Airportdata.CANCELLED)).\
    filter(Airportdata.ORIGIN == "LAX").all():
        item = {}
        item['total_departure'] = int(i[0])
        item['total_cancelled'] = int(i[1])
        item['total_arrival'] = int(i[0]) - int(i[1])
        data_ls2.append(item)

    return jsonify(data_ls2)

@app.route("/JFK")
def jfk():
    # query for the sample data
    data_ls2 = []
    for i in session.query(func.count(Airportdata.UNIQUE_CARRIER),func.sum(Airportdata.CANCELLED)).\
    filter(Airportdata.ORIGIN == "JFK").all():
        item = {}
        item['total_departure'] = int(i[0])
        item['total_cancelled'] = int(i[1])
        item['total_arrival'] = int(i[0]) - int(i[1])
        data_ls2.append(item)

    return jsonify(data_ls2)

@app.route("/ORD")
def ord():
    # query for the sample data
    data_ls2 = []
    for i in session.query(func.count(Airportdata.UNIQUE_CARRIER),func.sum(Airportdata.CANCELLED)).\
    filter(Airportdata.ORIGIN == "ORD").all():
        item = {}
        item['total_departure'] = int(i[0])
        item['total_cancelled'] = int(i[1])
        item['total_arrival'] = int(i[0]) - int(i[1])
        data_ls2.append(item)

    return jsonify(data_ls2)


@app.route("/stats-by-departure-airport")
def statsByDepartureAirport() : 
    data = {}
    # temp = map(lambda airport: airport[0], session.query(Airportdata.ORIGIN).distinct(Airportdata.ORIGIN).all())
    # airports = list(set(temp))
    # for airportCode in airports: 
    for airport in session.query(Airportdata.ORIGIN).distinct(Airportdata.ORIGIN).all():
        airportCode = airport[0]
        for i in session.query(func.count(Airportdata.UNIQUE_CARRIER),func.sum(Airportdata.CANCELLED)).\
                filter(Airportdata.ORIGIN == airportCode).all():
            item = {}
            item['total_departure'] = int(i[0])
            item['total_cancelled'] = int(i[1])
            item['total_arrival'] = int(i[0]) - int(i[1])
            data[airportCode] = item
            pass
        pass
    return jsonify(data)


# call total departure, cancel anad arrival by departure airport
@app.route("/A/<airport>")
def a(airport=None):
    # query for the sample data
    data_ls2 = []
    for i in session.query(func.count(Airportdata.UNIQUE_CARRIER),func.sum(Airportdata.CANCELLED)).\
    filter(Airportdata.ORIGIN == airport).all():
        item = {}
        item['total_departure'] = int(i[0])
        item['total_cancelled'] = int(i[1])
        item['total_arrival'] = int(i[0]) - int(i[1])
        data_ls2.append(item)

    return jsonify(data_ls2)

# call total departure, cancel anad arrival by departure airport by carrier
@app.route("/B/<airport>")
@app.route("/B")
def b(airport="None"):
    # query for the sample data
    data_ls3 = []
    for i in session.query(Airportdata.CARRIER, func.count(Airportdata.CARRIER),func.sum(Airportdata.CANCELLED)).\
        filter(Airportdata.ORIGIN == "LAX").group_by(Airportdata.CARRIER).all():
            item = {}
            item['carrier'] = i[0]
            item['total_departure'] = int(i[1])
            item['total_cancelled'] = int(i[2])
            item['total_arrival'] = int(i[2]) - int(i[1])
            data_ls3.append(item)
    return jsonify(data_ls3)


# call total count by outbound destination for each airport
@app.route("/C/<airport>")
@app.route("/C")
def c(airport="None"):
    # query for the sample data
    data_ls4 = []
    for i in session.query(Airportdata.ORIGIN, Airportdata.DEST, func.count(Airportdata.DEST)).\
        filter(Airportdata.ORIGIN == "LAX").group_by(Airportdata.DEST).\
        order_by(func.count(Airportdata.DEST).desc()).all():
            item = {}
            item['aorigin'] = i[0]
            item['destination'] = i[1]
            item['tcount'] = int(i[2])
            data_ls4.append(item)

    return jsonify(data_ls4)

# call average delays by each carrier based on the given airport
@app.route("/D/<airport>")
@app.route("/D")
def d(airport="None"):
    # query for the sample data
    data_ls5 = []
    for i in session.query(Airportdata.CARRIER, func.avg(Airportdata.DEP_DELAY_NEW), func.avg(Airportdata.WEATHER_DELAY),func.avg(Airportdata.ARR_DELAY_NEW)).\
        filter(Airportdata.ORIGIN == "LAX").group_by(Airportdata.CARRIER).all():
            item = {}
            item['acarrier'] = i[0]
            item['depart_delay'] = int(i[1])
            item['weather_delay'] = int(i[2])
            item['arrival_delay'] = int(i[3])
            data_ls5.append(item)

    return jsonify(data_ls5)


if __name__ == '__main__':
    app.run(debug=True)
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





if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, render_template, jsonify, redirect
from flask_pymongo import PyMongo
import scrape_mars

app = Flask(__name__)

mongo = PyMongo(app)


@app.route("/")
def index():
    mars = mongo.db.mars.find_one()
    return render_template("index.html", mars=mars)

# Scrape Data and pull into Mongo DB
@app.route('/scrape')
def get():
    mars = mongo.db.mars
    marsdata = scrape_mars.scrape()
    mars.update({}, marsdata, upsert=True)
    return redirect("/", code=302)



if __name__ == "__main__":
    app.run()
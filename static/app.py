from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine,MetaData,Table,distinct
import json
from flask import Flask, jsonify
import numpy as np



# Create sqlite engine
engine = create_engine("sqlite:///../Resources/APYIndia.sqlite")

# Creat sqlalchemy session
Session = sessionmaker(bind = engine)
session = Session()

# Define table objects
metadata = MetaData()
metadata.reflect(bind=engine)


app = Flask(__name__)

# Flask routes
@app.route("/")
def welcome():
    """List all available routes."""
    return(
        f"Using the API below to get information about particular Crop in Data Replace ""CropName"" with Unique crop <br>"
        
        
        f"/api/season/production/cropName"

    )

@app.route("/api/season/production/<crop>")
def season(crop):
    # Create our session(link)from python to the db
   
    """Return a list of all APYIndia season"""
    
    # Creating table
    APYIndia_data = Table('APYIndia',metadata,autoload=True,autoload_with=engine)


    # Getting specific columns using session

    result = session.query(APYIndia_data.c.Crop_Year,APYIndia_data.c.Season,APYIndia_data.c.Production,\
                           APYIndia_data.c.Crop,APYIndia_data.c.State,APYIndia_data.c.District)\
        .filter(APYIndia_data.c.Crop.contains(crop))\
            .filter(~APYIndia_data.c.Season.contains('Whole Year'))\
            .filter(APYIndia_data.c.State.contains('Andaman and Nicobar Island'))\
                .filter(APYIndia_data.c.District.contains('NICOBARS')).all()
                  
        

    # Convert the result to list of dictionaries

    data = [{APYIndia_data.c.Crop_Year.name: row[0],APYIndia_data.c.Season.name: row[1],\
             APYIndia_data.c.Production.name:row[2],APYIndia_data.c.Crop.name:row[3],\
                APYIndia_data.c.State.name:row[4],APYIndia_data.c.District.name:row[5]} for row in result]

    
    # Close the session
    session.close()

    # Convert data to JSON
    return jsonify(data)

# Get list of crop names
@app.route("/api/season/production/cropName")
def getCropNames():
    # Create our session(link)from python to the db
   
    """Return a list of crop name from APYIndia"""
    
    # Creating table
    APYIndia_data = Table('APYIndia',metadata,autoload=True,autoload_with=engine)


    # Getting specific columns using session

    result = session.query(distinct(APYIndia_data.c.Crop)).all()
                  
        

    # Convert the result to list of dictionaries

    data = [{APYIndia_data.c.Crop.name:row[0]} for row in result]
  
    # Close the session
    session.close()

    # Convert data to JSON
    return jsonify(data)

#  Cross origin enable

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response 

if __name__=='__main__':
    app.run(debug = True)

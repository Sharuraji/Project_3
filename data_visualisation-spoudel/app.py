from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
import json

# Initialize Flask application
app = Flask(__name__)

# Configure SQLAlchemy to use PostgreSQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:PostGres_2024@localhost/crops_2024'

# Initialize SQLAlchemy with the Flask application
db = SQLAlchemy(app)

# Define your table with extend_existing=True
class CropsProduction(db.Model):
    __tablename__ = 'crops_india'
    __table_args__ = {'extend_existing': True}
    unique_id = db.Column(db.String(30), primary_key=True)
    country_state = db.Column(db.String(70))
    city = db.Column(db.String(70))
    crop = db.Column(db.String(50))
    crop_year = db.Column(db.Integer)
    season = db.Column(db.String(100))
    production = db.Column(db.Integer)
    latitude = db.Column(db.Float)   
    longitude = db.Column(db.Float)   

    def __repr__(self):
        return f"<Crops_Production(unique_id='{self.unique_id}', country_state='{self.country_state}', crop='{self.crop}', crop_year='{self.crop_year}', season='{self.season}', production='{self.production}', latitude='{self.latitude}', longitude='{self.longitude}')>"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    data = {}
    # Query the database to get production data for each city and crop
    results = db.session.query(
        CropsProduction.city,
        CropsProduction.crop,
        db.func.sum(CropsProduction.production).label('total_production'),
        CropsProduction.latitude,
        CropsProduction.longitude
    ).group_by(
        CropsProduction.city,
        CropsProduction.crop,
        CropsProduction.latitude,
        CropsProduction.longitude
    ).all()

    # Print out city names for debugging
    for result in results:
        print("City:", result.city)

    for result in results:
        city = result.city  # Ensure this is the correct column name for the city
        crop = result.crop
        production = result.total_production
        latitude = result.latitude
        longitude = result.longitude
        if city not in data:
            data[city] = []
        data[city].append({'crop': crop, 'production': production, 'latitude': latitude, 'longitude': longitude})

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)

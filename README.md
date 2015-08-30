Particle Power
==============

Twitch plays LED lights. Each authenticated user within Nucleus can vote once per LED strip on the strip color and animation. Each voting cycle lasts 10 seconds, which is probably a terrible, terrible idea.

## Installation

### Mongo Setup

MongoDB is used to store voting data. If you are testing this application locally, install MongoDB 2.6+ and run the following command to start your database:

`mongod --dbpath <db-storage-path>`

Then, point the application to the database by setting MONGO_URL in your environment or changing the default in `service/__init__.py`.

### Running the Application

`sudo pip install -r requirements.txt` 

`python runserver.py`
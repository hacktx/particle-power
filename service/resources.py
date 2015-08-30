import datetime
import json

from flask import request, abort
from flask.ext import restful
from flask.ext.restful import reqparse
from service import app, api, mongo
from bson.objectid import ObjectId

INTERVAL = 10  # num seconds between voting sessions

class VoteList(restful.Resource):
    def __init__(self, *args, **kwargs):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('user_id', type=str)
        self.parser.add_argument('color', type=str)
        self.parser.add_argument('animation', type=str)
        super(VoteList, self).__init__()

    def get(self, strip_name):
        d_cutoff = datetime.datetime.utcnow() - datetime.timedelta(seconds=INTERVAL)
        votes = mongo.db.votes.aggregate([
            { "$match": {
                "strip_name": strip_name,
                "created_at": { "$gte": d_cutoff }
            }},
            { "$project": {
                "strip_name": 1,
                "created_at": 1,
                "color": 1,
                "animation": 1,
                "voteCount": { "$size": "$votes" }
            }}
        ])

        return votes['result']

    def post(self, strip_name):
        args = self.parser.parse_args()
        if not args['user_id'] or not args['color'] or not args['animation']:
            abort(400)

        user_id = args['user_id']
        color = args['color']
        animation = args['animation']

        d = datetime.datetime.utcnow()
        d_cutoff = d - datetime.timedelta(seconds=30)

        mongo.db.votes.update({ "strip_name": strip_name,
                                "created_at": { "$gte": d_cutoff },
                                "color": color,
                                "animation": animation,
                              },
                              { "$setOnInsert": { 
                                  "created_at": d,
                                },
                                "$addToSet": { "votes": user_id }
                              },
                              upsert=True,
                              safe=True
                             )
        return '', 204

api.add_resource(VoteList, '/votes/<strip_name>')

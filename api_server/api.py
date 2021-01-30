#!/usr/bin/python3 

# Usage
# Running on localhost
# Running in background on aws: `sudo nohup python3 api.py &`
# Stopping when in background on aws: `sudo ./kill_api`
# Logfile currently at "api.log"

from flask import Flask, request, abort, Response
from flask_restx import Api, Resource, reqparse, fields, inputs
from flask_cors import CORS, cross_origin
import re, logging
import datetime
import json
from myUtils import *
from Models import *
import mongo_query as db
import argparse 
from werkzeug.exceptions import BadRequest
from sse_msg import *



DEFAULT_PORT = 80
SERVER_LOG_FILE = "api.log"
REQS_LOG_FILE = "requests.log"
DEFAULT_DATABASE_NAME = "prefd-27-11"

# Arg parser
parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default = DEFAULT_PORT, help='Change port number from default (80)')

# Connect to mongoDB
url = "mongodb+srv://mark:marktest123@cluster0.afzsi.mongodb.net/"
db.connect(url, DEFAULT_DATABASE_NAME)
# db.connect(url, "test_db")

logging.basicConfig(filename=SERVER_LOG_FILE)
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app, version = '0.01', title = 'Prefd API')

# app.config['RESTX_MASK_SWAGGER'] = False

# Setting up Server Side Events
notif_handler = NotifHandler()

# https://stackoverflow.com/questions/11232230/logging-to-two-files-with-different-settings
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

def setup_logger(name, file, level=logging.INFO):
	handler = logging.FileHandler(file)
	handler.setFormatter(formatter)

	logger = logging.getLogger(name)
	logger.setLevel(level)
	logger.addHandler(handler)

	return logger

req_logger = setup_logger('request_logger', REQS_LOG_FILE)


notif_model = api.model('Notif', {
    'id'        : fields.Integer(description="Unique number for notification"),
    'category'  : fields.String(description="Whatever Liam wants it to be lol"),
    'message'   : fields.String(description="Message in notification")
})
# Creating models
user_model = api.model('User', {
    'id'                : fields.String(description = "Unique name of user"),
    'password'          : fields.String(description = "User password"),
    'group_ids'         : fields.List(fields.String, description = "List of group ids that user is part of"),
    'group_invites'     : fields.List(fields.String, description = "List of groups user has been invited to"),
    'friend_ids'        : fields.List(fields.String, description = "List of friend ids"),
    'want_friend_ids'   : fields.List(fields.String, description = "List of wanted friend ids"),
    'notifs'            : fields.List(fields.Nested(api.models['Notif']))
})

card_model = api.model('Card', {
    'id'            : fields.String(description="Unique name of card"),
    'description'   : fields.String(description="Description of card"),
    'likes'         : fields.Integer(description='Number of likes given to card'),
    'nopes'         : fields.Integer(description='Numver of nopes given to card')
})

# CARD_TEMPLATE = {
#     'id'                : '',
#     'description'       : '',
#     'likes'             : 0,
#     'nopes'             : 0
# }

deck_model = api.model('Deck', {
    'id'            : fields.String(description='Unique name of deck'),
    'description'   : fields.String(description='Description of deck'),
    'owner'         : fields.String(description='Id of owner of deck'),
    'voting_started': fields.Boolean(description='Whether voting has started yet or not'),
    'user_ids'      : fields.String(description='User ids of who can vote in deck, empty until voting starts'),
    'voted_ids'     : fields.String(description='Contains user which have already voted'),
    'cards'         : fields.List(fields.Nested(api.models['Card']))
})

deck_group_model = api.model('Deck with Group', {
    'id'            : fields.String(description='Unique name of deck'),
    'description'   : fields.String(description='Description of deck'),
    'owner'         : fields.String(description='Id of owner of deck'),
    'group_id'      : fields.String(description='Id of group which deck belongs to'),
    'voting_started': fields.Boolean(description='Whether voting has started yet or not'),
    'user_ids'      : fields.String(description='User ids of who can vote in deck, empty until voting starts'),
    'voted_ids'     : fields.String(description='Contains user which have already voted'),
    'cards'         : fields.List(fields.Nested(api.models['Card']))
})

# DECK_TEMPLATE = {
#     'id'                : '',
#     'description'       : '',
#     'owner'             : '',
#     'voting_started'    : False,
#     'cards'             : [],
#     'user_ids'          : [],
#     'voted_ids'         : []
# }

group_model = api.model('Group', {
    'id'            : fields.String(description = "Unique name of user"),
    'owner_id'      : fields.String(description = "Name of owner"),
    'user_ids'      : fields.List(fields.String, description = "List of group ids that user is part of"),
    'decks'         : fields.List(fields.Nested(api.models['Deck'])),
    'invited_ids'   : fields.List(fields.String, description = "Ids of users invited to (but not yet part of) group")
})

# Creating parser
# TODO add string search to get user
usersGetParser = reqparse.RequestParser()

usersPostParser = reqparse.RequestParser()
usersPostParser.add_argument('id', required=True, help='Unique name of user')
usersPostParser.add_argument('password', required=True, help='User password')


@api.route('/users')
@api.response(400, 'Bad Request')
class UsersAPI(Resource):

    @api.expect(usersGetParser, validate = True)
    @api.doc(description = "Query database for list of all users")
    @api.marshal_with(user_model, code = 200, as_list = True, description = "Returns list of users (see **User** model for more information")
    def get(self):
        # log_str = str(request.remote_addr) + " GET /data: "

        # Parsing args (lol not needed)

        # TODO Get data from db 
        r = db.query_users()

        return r
    
    # post add user
    # TODO add better fail messages
    @api.expect(usersPostParser, validate = True)
    @api.marshal_with(user_model, code=200, description="Add a user, returns user when successful")
    @api.doc(description = "Create new user")
    def post(self):
        args = usersPostParser.parse_args()
        # print(args)
        try:
            r = db.add_user(args['id'], args['password'])
        except:
            raise BadRequest('Server is down, try again later')
        
        if r:
            c = db.USER_TEMPLATE.copy()
            c['id'] = args['id']
            c['password'] = args['password']
            
            return c
        else:
            raise BadRequest('User already exists')

userGetParser = reqparse.RequestParser()

# get specific user
@api.doc(description="Get specific user")
@api.route('/user/<id>')
@api.response(400, 'Bad Request')
@api.param('id', "The user's id")
class UserAPI(Resource):

    @api.marshal_with(user_model)
    def get(self, id):
        r = db.get_user(id)
        if r:
            return r
        else:
            raise BadRequest('User does not exist')

friend_remove_del_parser = reqparse.RequestParser()
friend_remove_del_parser.add_argument('friend_id', required="True", help="Id of user that current user wants to remove as friend")

# Remove a friend from friend list
@api.doc(description="As a user remove other user from friend list, and if other user not yet friends, remove other user from friend requests")
@api.route('/user/<id>/friend_remove')
@api.response(400, 'Bad Request')
@api.param('id', "The user's id")
class FriendRemoveAPI(Resource):

    @api.expect(friend_remove_del_parser, validate=True)
    def delete(self, id):
        # return {}, 501

        args = friend_remove_del_parser.parse_args()
        fid = args['friend_id']
        u = db.get_user(id)
        if u is None:
            raise BadRequest('User does not exist')

        if fid in u['friend_ids']:

            w = db.get_user(fid)
            if w is None:
                raise BadRequest('User id of friend to remove does not exist')

            # Update both users
            u['friend_ids'].remove(fid)
            w['friend_ids'].remove(id)


            db.update_user(id, {'friend_ids' : u['friend_ids']})
            db.update_user(fid, {'friend_ids' : w['friend_ids']})

            # Notify other user
            data = {
                'type'      : 'unfriended',
                'user'      : id,
                'message'   : f'User {id} has unfriended you'
            }
            notif_handler.announce(fid, json.dumps(data))

            return {
                'code'      : 'success_remove_friend',
                'message'   : f'Removed user {fid} from friend list'
            }


        elif fid in u['want_friend_ids']:
            u['want_friend_ids'].remove(fid)
            db.update_user(id, {'want_friend_ids': u['want_friend_ids']})  

            return {
                'code'      : 'success_remove_friend_invite',
                'message'   : f'Retracted friend invite to user {fid}'
            }          

        else:
            raise BadRequest('User to remove as friend is not in friend list/sent friend invites')

friend_request_get_parser = reqparse.RequestParser()
friend_request_get_parser.add_argument('friend_id', required="True", help="Id of user that current user wants to friend")

@api.doc(description="Send a friend request as a user. When users have sent friend requests to each other they are then considered friends.")
@api.route('/user/<id>/friend_request')
@api.response(400, 'Bad Request')
@api.param('id', "The user's id")
class FriendRequestAPI(Resource):

    @api.expect(friend_request_get_parser, validate=True)
    def post(self, id):
        args = friend_request_get_parser.parse_args()

        # TODO the proper mongo way lol

        # Check that they aren't trying to friend themselves
        if id == args['friend_id']:
            return {
                'code'      : 'self_friend',
                'message'   : 'You are already (hopefully) friends with yourself lol'
            }

        # Get users and check if they exist
        u = db.get_user(id)
        if u is None:
            raise BadRequest('User does not exist')

        w = db.get_user(args['friend_id'])
        if w is None:
            raise BadRequest('Wanted friend does not exist')

        # Check if not already friends
        if w['id'] in u['friend_ids']:
            return {
                "code"      : "already_friends",
                "message"   : "User is already friends"
            }
        
        # Check that invite has not already been sent
        if w['id'] in u['want_friend_ids']:
            return {
                "code"      : "duplicate_invite",
                "message"   : "Friend invite already sent"
            }

        # If other user wants to be friends too, make them friends
        if u['id'] in w['want_friend_ids']:
            w['want_friend_ids'].remove(u['id'])
            w['friend_ids'].append(u['id'])
            u['friend_ids'].append(w['id'])
            db.update_user(id, {'friend_ids': u['friend_ids']})
            db.update_user(args['friend_id'], {
                'friend_ids'        : w['friend_ids'], 
                'want_friend_ids'   : w['want_friend_ids']
                })

            # notify other user (w) via SSE
            data = {
                'type'      : 'friend-invite-accepted',
                'friend'    : id
            }
            notif_handler.announce(args['friend_id'], json.dumps(data))

            return {
                'code'      : 'success_friends',
                'message'   : "You have accepted each other's friend request and are now friends"
            }

        # Else add to friend list
        u['want_friend_ids'].append(args['friend_id'])
        db.update_user(id, {'want_friend_ids': u['want_friend_ids']})

        # notify other user (w) of friend request via SSE
        data = {
            'type'      : 'friend-invite-sent',
            'friend'    : id
        }
        notif_handler.announce(args['friend_id'], json.dumps(data))

        return {
            'code'      : 'success_invite',
            'message'   : 'You successfully sent the user a friend request'
        }

notif_post_parser = reqparse.RequestParser()
notif_post_parser.add_argument('id', required=True, type=int, help='Unique integer of message')
notif_post_parser.add_argument('category', required=True, help='Category of notif')
notif_post_parser.add_argument('message', required=True, help='Messsage in notif')

notif_del_parser = reqparse.RequestParser()
notif_del_parser.add_argument('id', required=True, type=int, help='Unique integer of message')

@api.route('/user/<uid>/notifs')
@api.doc(description='Push/delete user notif objects')
@api.response(400, 'Bad Request')
@api.param('uid', "The user's id")
class NotifApi(Resource):

    @api.expect(notif_post_parser, validate=True)
    def post(self, uid):
        args = notif_post_parser.parse_args()
        id = args['id']
        cat = args['category']
        msg = args['message']

        # Get users and check if they exist
        u = db.get_user(uid)
        if u is None:
            raise BadRequest('User does not exist')

        ids = [s['id'] for s in u['notifs']]
        if id in ids:
            raise BadRequest('Notif with id already exists')

        print(f'{id} {cat} {msg}')
        db.push_notif(uid, id, cat, msg)
        return {
            'code'      : 'success-push-notif',
            'message'   : 'successfully pushed a notif'
        }

    @api.expect(notif_del_parser, validate=True)
    def delete(self, uid):
        args = notif_del_parser.parse_args()

        db.delete_notif(uid, args['id'])
        return {
            'code'      : 'success-delete-notif',
            'message'   : 'notif was successfully deleted'
        }
       
        


@api.route('/user/<uid>/leave_group/<gid>')
@api.doc(description='Let given user leave given group')
class LeaveGroupAPI(Resource):

    def delete(self, uid, gid):
        # return {}, 501
        # Check if in group id
        u = db.get_user(uid)
        if u is None:
            raise BadRequest('User does not exist')
        if gid not in u['group_ids']:
            raise BadRequest('User does not belong to group')

        g = db.get_group(gid)
        if g is None:
            raise BadRequest('Group does not exist')
        
        # Update user
        u['group_ids'].remove(gid)
        db.update_user(uid, {'group_ids': u['group_ids']})

        # Update group
        g['user_ids'].remove(uid)
        # For each deck
        for d in g['decks']:
            did = d['id']
            # if decks are already done voting, don't change them
            if d['voting_started']:
                if d['user_ids'] != d['voted_ids']:
                    d['user_ids'].remove(uid)
                    try:
                        d['voted_ids'].remove(uid)
                    except:
                        pass
                    # Check if this caused vote to complete (lets ignore if they already voted lol)
                    if len(d['user_ids']) == len(d['voted_ids']):                    
                        d = db.get_deck(gid, did)
                        data = {
                            'type'      : 'voting-complete',
                            'group'     : gid,
                            'deck'      : did,
                            'cards'     : d['cards']
                        }
                        for user in g['user_ids']:
                            notif_handler.announce(user, json.dumps(data))
            # Else no need to do anything

        db.update_group(gid, { 
            'user_ids'  : g['user_ids'],
            'decks'     : g['decks']
            })

        return {
            'code'      : 'success_left_group',
            'message'   : f'User {uid} has successfully left group {gid}'
        }

@api.route('/user/<id>/decks')
@api.doc(description='Get all decks for specific user with groupid inside, for convenience sake')
class GetDecksAPI(Resource):

    @api.marshal_with(deck_group_model, code=200, as_list=True)
    def get(self, id):
        # return [], 501
        decks = []

        # Get list of groups from user
        u = db.get_user(id)
        if u is None:
            raise BadRequest('User does not exist')
        for gid in u['group_ids']:
            try:
                g = db.get_group(gid)
                # print(g)
                for d in g['decks']:
                    if (not d['voting_started']) or id in d['user_ids']:
                        d = d.copy()
                        d['group_id'] = gid
                        decks.append(d)
            except:
                pass
        
        return decks

@api.route('/nuke')
@api.doc(description = 'Hard restart of database (restart server manually as well pls)')
class NukeAPI(Resource):
    def get(self):
        global notif_handler

        db.nuke()
        notif_handler = NotifHandler()
        return {}, 200

# For debugging reasons
@api.route('/ping')
@api.doc(description= "Ping all currently connected users (for debugging reasons)")
class PingAPI(Resource):

    def get(self):
        
        data = {
            'type'      : 'ping',
            'body'      : 'pong',
            'datetime'  : datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
            }

        # msg = format_sse(data=json.dumps(data))
        notif_handler.announce_all(json.dumps(data))
        return {}, 200


@api.route('/user/<id>/ping')
@api.doc(description = "Ping a specific user (message gets cached if not listening, debugging purposes)")
class PingUserAPI(Resource):

    def get(self, id):
        data = {
            'type'  : 'ping-user',
            'body'  : 'pong'
        }

        notif_handler.announce(id, json.dumps(data))
        return {}, 200

listen_get_request_parser = reqparse.RequestParser()
@cross_origin()
@api.route('/user/<id>/listen')
@api.param('id', "The user's id")
@api.doc(description="""Use SSE client to listen to this endpoint in order to recieve user's Notifications, see SSE_README.md for more details""")
class ListenAPI(Resource):

    def _stream(self, id):
        notif_handler.new_announcer(id)
        messages = notif_handler.listen(id)
        notif_handler.flush_cache(id)
        print(f"New listener for user {id}")
        # print(f"New listener: {request.environ['REMOTE_ADDR']}")
        while True:
            msg = messages.get()
            yield msg
    
    def get(self, id):
        return Response(self._stream(id), mimetype='text/event-stream')
        # return {"message": "Not yet implemented"}, 501

@api.route('/group/<id>')
@api.param('id', "The group's id")
@api.response(400, 'Bad Request')
class GetGroupAPI(Resource):

    @api.doc(description="Get specific group")
    @api.marshal_with(group_model, code=200)
    def get(self, id):
        r = db.get_group(id)
        if r:
            return r
        else:
            raise BadRequest('Group does not exist')

group_post_parser = reqparse.RequestParser()
group_post_parser.add_argument('id', required=True, help='Unique name of group')
group_post_parser.add_argument('owner_id', required=True, help='User id of owner of group')

# post user group
@api.route('/groups')
class GroupsAPI(Resource):

    @api.doc(description="Get all groups (For debugging purposes only)")
    def get(self):
        return db.get_groups(), 200

    @api.response(400, 'Bad Request')
    @api.doc(description="Create a new group")
    @api.expect(group_post_parser, validate=True)
    def post(self):
        args = group_post_parser.parse_args()
        # Getting owner
        try:
            u = db.get_user(args['owner_id'])

            if u is None:
                raise BadRequest('User set as Owner does not exist')
        except BadRequest:
            raise
        except:
            raise BadRequest('Server is down, try later')

        try:
            r = db.add_group(args['id'], args['owner_id'])

            if not r:
                raise BadRequest('Group already exists')
        except BadRequest:
            raise
        except:
            raise BadRequest("Server is down, try later")

        u['group_ids'].append(args['id'])
        db.update_user(u['id'], { 'group_ids' : u['group_ids'] })

        return {
            'message'   : 'Group created successfully'  
        }

group_invite_parser = reqparse.RequestParser()
group_invite_parser.add_argument('user_id', required=True, help="The user's id to invite to group")
# Invite user to group
@api.route('/group/<id>/invite')
@api.param('id', "The group's id")
@api.response(400, 'Bad Request')
class GroupInviteApi(Resource):

    @api.doc(description="Invite a user to a group")
    @api.expect(group_invite_parser, validate=True)
    def post(self, id):

        args = group_invite_parser.parse_args()
        user_id = args['user_id']

        r = db.get_group(id)
        if r is None:
            raise BadRequest('Group does not exist')

        if user_id in r['user_ids']:
            raise BadRequest('User is already part of group')
        elif user_id in r['invited_ids']:
            raise BadRequest('User has already been invited into group')

        u = db.get_user(user_id)
        if u is None:
            raise BadRequest('User to be invited does not exist')
        
        u['group_invites'].append(id)
        r['invited_ids'].append(user_id)

        db.update_user(user_id, {'group_invites' : u['group_invites']})
        db.update_group(id, {'invited_ids' : r['invited_ids']})

        # SSE notify user
        data = {
            'type'  : 'group-invite',
            'group' : id
        }
        notif_handler.announce(user_id, json.dumps(data))

        return {
            'code'      : 'group_invite',
            'message'   : f'You have sent a group invite to {user_id} for group {id}'
        }

group_invite_accept_parser = reqparse.RequestParser()
group_invite_accept_parser.add_argument('group_id', required=True, help='Id of group to accept invite from')
# User accept group invite
@api.route('/user/<id>/accept_group')
@api.param('id', "The user's id")
class AcceptGroupAPI(Resource):

    @api.doc(description="Accept group invite")
    @api.response(400, 'Bad Request')
    @api.expect(group_invite_accept_parser, validate=True)
    def post(self, id):
        args = group_invite_accept_parser.parse_args()
        group_id = args['group_id']

        u = db.get_user(id)
        if u is None:
            raise BadRequest('User was not found')

        if group_id in u['group_ids']:
            raise BadRequest(f'You are already in group {group_id}')

        if group_id not in u['group_invites']:
            raise BadRequest('You were not invited to this group')

        g = db.get_group(group_id)
        if g is None:
            raise BadRequest('Group does not exist')

        u['group_invites'].remove(group_id)
        u['group_ids'].append(group_id)

        try:
            g['invited_ids'].remove(id)
        except:
            pass
        g['user_ids'].append(id)

        db.update_user(id, {
            'group_invites' : u['group_invites'],
            'group_ids'     : u['group_ids']
            })
        db.update_group(group_id, {
            'invited_ids'   : g['invited_ids'],
            'user_ids'      : g['user_ids']
        })

        # SSE ping everyone in group???

        return {
            'code'      : 'group-invite-accept',
            'message'   : f'User {id} has successfully joined group {group_id}'
        }

create_deck_parser = reqparse.RequestParser()
create_deck_parser.add_argument('deck_id', required=True,
    help='Unique name of the deck')
create_deck_parser.add_argument('description', required=True,
    help='Description of deck')
create_deck_parser.add_argument('owner_id', required=True,
    help='Id of owner of deck')
@api.route('/group/<id>/deck')
@api.param('id', "The group id")
@api.response(400, 'Bad Request')
class CreateDeckAPI(Resource):

    @api.expect(create_deck_parser, validate=True)
    @api.doc(description='Create a new deck')    
    def post(self, id):
        args = create_deck_parser.parse_args()
        deck_id = args['deck_id']
        desc = args['description']
        owner_id = args['owner_id']

        g = db.get_group(id)
        if g is None:
            raise BadRequest('Group does not exist')
        u = db.get_user(owner_id)
        if u is None:
            raise BadRequest('Owner does not exist')

        # Ensure no duplicate decks
        decks = [d['id'] for d in g['decks']]
        if deck_id in decks:
            raise BadRequest(f'Deck with id {deck_id} already exists') 

        deck = db.DECK_TEMPLATE.copy()
        deck['id'] = deck_id
        deck['description'] = desc
        deck['owner'] = owner_id
        
        g['decks'].append(deck)

        db.update_group(g['id'], { 'decks' : g['decks']})
        
        # SSE notify everyone of new deck
        data = {
            'type'      : 'new-deck',
            'group'     : id,
            'deck'      : deck_id
        }
        for user in g['user_ids']:
            if user != owner_id:
                notif_handler.announce(user, json.dumps(data))
        
        return {
            'code'      : 'new-deck',
            'message'   : f'Succesfully created new deck {deck_id} under group {id}'
        }

@api.route('/group/<gid>/deck/<did>')
@api.param('gid', "Group id")
@api.param('did', 'Deck id')
class DeleteDeckAPI(Resource):

    @api.doc(description="Delete deck from group")
    def delete(self, gid, did):

        g = db.get_group(gid)
        if g is None:
            raise BadRequest(f'Group {gid} does not exist')
        r = db.delete_deck(gid, did)
        if r:
            data = {
                'code'  : 'deck-deleted',
                'group' : gid,
                'deck'  : did
            }
            for user in g['user_ids']:
                notif_handler.announce(user, json.dumps(data))

        return {
            'code'      : 'success-delete-deck',
            'message'   : "Successfully deleted deck"
        }

create_card_parser = reqparse.RequestParser()
create_card_parser.add_argument('id', required=True,
    help='Unique name of card')
create_card_parser.add_argument('description', required=True,
    help='Description of card')
# Create a new card for deck
@api.route('/group/<gid>/deck/<did>/card')
@api.param('gid', 'The group id')
@api.param('did', 'The deck id')
class CreateCardAPI(Resource):

    @api.doc(description='Create new card for deck')
    @api.expect(create_card_parser, validate=True)
    def post(self, gid, did):
        args = create_card_parser.parse_args()
        card_id = args['id']
        desc = args['description']

        g = db.get_group(gid)
        if g is None:
            raise BadRequest(f'Group {gid} does not exist')
        
        decks = [d['id'] for d in g['decks']]
        if did not in decks:
            raise BadRequest(f'Deck with id {did} does not exist in this group') 

        deck = next(d for d in g['decks'] if d['id'] == did)
        if deck['voting_started']:
            raise BadRequest('Cannot add new cards when voting has already started')
        cards = [c['id'] for c in deck['cards']]
        if card_id in cards:
            raise BadRequest(f'Card already exists in deck')

        card = db.CARD_TEMPLATE.copy()
        card['id'] = card_id
        card['description'] = desc
        
        try:
            db.add_card(gid, did, card)
        except:
            raise BadRequest('Failed to add card')

        return {
            'code'      : 'new-card',
            'message'   : f'Succesfully created new card'
        }

# Start deck voting
@api.route('/group/<gid>/deck/<did>/start_vote')
@api.param('gid', 'The group id')
@api.param('did', 'The deck id')
class StartVoteDeckAPI(Resource):

    @api.doc(description='Start voting for a deck')
    def post(self, gid, did):
        
        g = db.get_group(gid)
        if g is None:
            raise BadRequest(f'Group {gid} does not exist')
        
        decks = [d['id'] for d in g['decks']]
        if did not in decks:
            raise BadRequest(f'Deck with id {did} does not exist in this group')

        deck = next(d for d in g['decks'] if d['id'] == did)
        if deck['voting_started']:
            raise BadRequest('Deck has already started voting')

        try:
            db.start_vote(gid, did)
        except:
            raise BadRequest('Failed to start vote')

        # Push notif to all users that voting has started
        data = {
            'type'  : 'voting-started',
            'group' : gid,
            'deck'  : did,
            'cards' : deck['cards']
        }
        for u in g['user_ids']:
            notif_handler.announce(u, json.dumps(data))

        return {
            'code'      : 'start-vote',
            'message'   : 'successfully started vote'
        }

# Vote in deck
vote_deck_parser = reqparse.RequestParser()
vote_deck_parser.add_argument('user_id', required=True,
    help='Id of user which is voting')
vote_deck_parser.add_argument('vote_string', required=True,
    help='Sequence of 1/0 depending whether user liked/noped card, in order of cards in deck')
@api.route('/group/<gid>/deck/<did>/vote')
@api.param('gid', 'The group id')
@api.param('did', 'The deck id')
class VoteDeckAPI(Resource):

    @api.doc(description='Vote for a deck')
    @api.expect(vote_deck_parser, required=True)
    def post(self, gid, did):
        args = vote_deck_parser.parse_args()
        uid = args['user_id']
        vstr = args['vote_string']

        g = db.get_group(gid)
        if g is None:
            raise BadRequest(f'Group {gid} does not exist')
        
        decks = [d['id'] for d in g['decks']]
        if did not in decks:
            raise BadRequest(f'Deck with id {did} does not exist in this group')

        deck = next(d for d in g['decks'] if d['id'] == did)
        if not deck['voting_started']:
            raise BadRequest('Deck has not started voting')

        if uid not in deck['user_ids']:
            raise BadRequest('You cannot vote in this deck')

        if uid in deck['voted_ids']:
            raise BadRequest('You have already voted')

        ncards = len(deck['cards'])
        if len(vstr) != ncards:
            raise BadRequest(f'Given wrong number of votes ({len(vstr)}) when there are {ncards} cards')

        # Adapted from https://stackoverflow.com/questions/37578628/python-checking-if-string-consists-only-of-1s-and-0s
        def strIsBin(string):
            for character in string:
                if character != '0' and character != '1':
                    return False
            return True

        if not strIsBin(vstr):
            raise BadRequest(f'Vote string is not binary')

        db.make_vote(gid, did, uid, vstr)
            
        # Notify if that was last person who voted
        if len(deck['voted_ids']) == len(deck['user_ids'])-1:
            d = db.get_deck(gid, did)
            data = {
                'type'      : 'voting-complete',
                'group'     : gid,
                'deck'      : did,
                'cards'     : d['cards']
            }
            for user in g['user_ids']:
                notif_handler.announce(user, json.dumps(data))

        return {
            'code'      : 'vote-success',
            'meesage'   : f'You successfully voted for deck {did} in group {gid}'
        }

@api.route('/group/<gid>/deck/<did>/card/<cid>')
@api.param('gid', 'group id')
@api.param('did', 'deck id')
@api.param('cid', 'card id')
class DeleteCardAPI(Resource):
    
    @api.doc(description = "Delete card from deck")
    def delete(self, gid, did, cid):
        # return {}, 501

        g = db.get_group(gid)
        if g is None:
            raise BadRequest(f'Group {gid} does not exist')
        if did not in [d['id'] for d in g['decks']]:
            raise BadRequest(f'Deck {did} does not exist')
        
        if g['decks'][did]['voting_started']:
            raise BadRequest('Cannot delete card in deck that has already started voting!')
        r = db.delete_card(gid, did, cid)
        if r:
            data = {
                'type'  : 'card-deleted',
                'group' : gid,
                'deck'  : did,
                'card'  : cid
            }
            for user in g['user_ids']:
                notif_handler.announce(user, json.dumps(data))

        return {
            'code'      : "success-delete-card", 
            'message'   : "Card deleted successfully"
        }

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

@app.route('/shutdown', methods=['GET,POST'])
def shutdown():
    shutdown_server()
    return 'Server shutting down...'

if __name__ == "__main__":
    # Parsing args
    args = parser.parse_args()
    print("Running at http://localhost:{}/".format(args.port))

    

    # Open to the world
    app.run(host="0.0.0.0", debug=True, port=args.port)


#!/usr/bin/python3

"""
Provides interface to query articles from mongodb
"""

from myUtils import *
from Models import *
import pymongo
import os
import sys

# Mongodb atlas login
# username: z5206092@ad.unsw.edu.au
# password: tNYB6ZgXExcUc8M
# Use this to add ip address to access database
# Login at mongo atlas then click left for network access then click add ip address


# Database credentials
# username: mark
# password: marktest123

#mongodb+srv://mark:marktest123@cluster0.afzsi.mongodb.net/

USER_TEMPLATE = {
    'id'                : '',
    'password'          : '',
    'group_ids'         : [],
    'group_invites'     : [],
    'friend_ids'        : [],
    'want_friend_ids'   : [],
    'notifs'            : []
}

GROUP_TEMPLATE = {
    'id'            : '',
    'owner_id'      : '',
    'description'   : '',
    'user_ids'      : [],
    'decks'         : [],
    'invited_ids'   : []
}

DECK_TEMPLATE = {
    'id'                : '',
    'description'       : '',
    'owner'             : '',
    'voting_started'    : False,
    'cards'             : [],
    'user_ids'          : [],
    'voted_ids'         : []
}

CARD_TEMPLATE = {
    'id'                : '',
    'description'       : '',
    'likes'             : 0,
    'nopes'             : 0
}

NOTIF_TEMPLATE = {
    'id'            : '', # Actually an int
    'category'      : '',
    'message'       : ''
}

DEFAULT_DATABASE_NAME = "prefd_db"
client = None
db = None
col_users = None
col_groups = None 

DEFAULT_URL = "mongodb+srv://mark:marktest123@cluster0.afzsi.mongodb.net/"

def connect_default():
    connect(DEFAULT_URL, DEFAULT_DATABASE_NAME)

def nuke():
    col_users.delete_many({})
    col_groups.delete_many({})

def connect(url, db_name):
    """
    Connects to a MongoDB database using given url.
    >>> connect("mongodb://localhost:27017/")
    """
    global client, db, col_users, col_groups

    client = pymongo.MongoClient(url)
    db = client[db_name]
    col_users = db['users']
    col_groups = db['groups']
    l = [ col_users.create_index([("id", pymongo.ASCENDING)], unique=True),
        col_groups.create_index([("id", pymongo.ASCENDING)], unique=True)]
    
    for c in l:
        try:
            c
        except e as Exception:
            print(e)
    

    # col_users.create_index({"id" : 1}, { "unique" : True})
    
simple_user_proj = USER_TEMPLATE.copy()
for k in simple_user_proj:
    simple_user_proj[k] = 1
simple_user_proj['_id'] = 0

def add_user(id, password):
    """
    Attempts to add new user to db, returns if successful or not
    """
    global col_users

    try:
        user = USER_TEMPLATE.copy()
        user['id'] = id
        user['password'] = password
        col_users.insert_one(user)
        # print(r)
        return True
    except:
        return False

def query_users(**kwargs):
    """
    Queries db for users
    Kwargs: key (NOT YET IMPLEMENTED)
    """

    global col_users, simple_user_proj

    # TODO query by key (inexact, and exact)

    query = {}

    # print(query)

    cur = col_users.find(query, simple_user_proj)
    r = [doc for doc in cur]
    return r

def get_user(id):
    return col_users.find_one({'id':id}, simple_user_proj)
    # query = { 'id': id}
    # cur = col_users.find(query, simple_user_proj)
    # r = [doc for doc in cur]
    # if len(r) != 1:
    #     return None
    # return r[0]

def update_user(id, update):
    if update:
        r = col_users.update({"id":id}, {"$set": update})
        return r
    return False

def add_group(group_id, owner_id):
    try:
        group = GROUP_TEMPLATE.copy()
        group['id'] = group_id
        group['owner_id'] = owner_id
        group['user_ids'] = [owner_id]

        u = get_user(owner_id)
        u['group_ids'].append(group_id)
        update_user(owner_id, {
            'group_ids' :   u['group_ids']
        })

        col_groups.insert_one(group)
        return True
    except:
        return False

# Creating projection for groups
simple_group_proj = GROUP_TEMPLATE.copy()
for k in simple_group_proj:
    simple_group_proj[k] = 1
simple_group_proj['_id'] = 0
# print(simple_group_proj)

simple_deck_proj = DECK_TEMPLATE.copy()
for k in simple_deck_proj:
    simple_deck_proj[k] = 1
simple_deck_proj['_id'] = 0

simple_card_proj = CARD_TEMPLATE.copy()
for k in simple_card_proj:
    simple_card_proj[k] = 1
simple_card_proj['_id'] = 0

def get_groups():
    cur = col_groups.find({}, simple_group_proj)
    r = [doc for doc in cur]
    return r

def get_group(group_id):
    return col_groups.find_one({'id':group_id}, simple_group_proj)
    
def update_group(id, update):
    if update:
        r = col_groups.update({"id":id}, {"$set": update})
        return r
    return False

def add_card(gid, did, card):
    
    col_groups.update_one({"id":gid, "decks.id":did},
        {"$push":{
            "decks.$.cards" : card
        }})

def start_vote(gid, did):
    g = col_groups.find_one({"id":gid})
    col_groups.update_one({"id":gid, "decks.id":did},
        {"$set" : {
            "decks.$.voting_started" : True,
            "decks.$.user_ids" : g['user_ids']
        }})
   
# Assumes uid is legit
def make_vote(gid, did, uid, votestr):
    votes = {}
    for i in range(0, len(votestr)):
        if votestr[i] == "1":
            votes[f'decks.$.cards.{i}.likes'] = 1
        elif votestr[i] == "0":
            votes[f'decks.$.cards.{i}.nopes'] = 1
    
    print(votes)
    col_groups.update_one({"id":gid, "decks.id":did}, 
        {
            "$inc"  : votes,
            "$push" : {
                f'decks.$.voted_ids' : uid
                } 
        })

def push_notif(uid, id, cat, msg):
    col_users.update_one({ "id" : uid },
        {
            '$push' : {
                'notifs' : {
                    'id'        : id,
                    'category'  : cat,
                    'message'   : msg
                }
            }
        })

def delete_notif(uid, id):
    col_users.update_one({ 'id' : uid },
        {
            '$pull' : {
                'notifs' : {
                    'id'    : int(id)
                }
            }
        } 
    )

def get_deck(gid, did):
    g = col_groups.find_one({"id":gid, "decks.id":did})
    return next(d for d in g['decks'] if d['id'] == did)

def update_deck(gid, did, update):
    pass

def delete_card(gid, did, cid):
    r = col_groups.update_one({"id":gid, "decks.id":did }, {
        '$pull' : {
            'decks.$.cards' : {
                'id'    : cid
            }
        }
    })
    if r.modified_count > 0:
        return True
    else:
        return False

def delete_deck(gid, did):
    r = col_groups.update_one({"id":gid}, {
        '$pull' : {
            'decks' : {
                'id'    : did 
            }
        }
    })
    if r.modified_count > 0:
        return True
    else: 
        return False

if __name__ == '__main__':
    # connect_default()
    # # nuke()
    # add_user("test", "test")
    # add_group("myGroup", "test")
    # r = get_groups()
    # print(r)
    gid = "testGroup"
    did = "testDeck"
    uid = "test"
    votestr = "1"
    connect(DEFAULT_URL, "prefd-13-11")
    d = get_deck(gid,did)
    print(d)
    # start_vote(gid, did)
    # make_vote(gid, did, uid, votestr)
    # col_groups.update_one({"id":gid, "decks.id":did},
    #     {"$set" : {
    #         "decks.$.voting_started" : False
    #     }})

    # add_user("test", "test")

    # r = query_users()
    # for u in r:
    #     print(u)



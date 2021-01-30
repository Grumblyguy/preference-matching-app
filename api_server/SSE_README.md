# Push Notifs / Server Sent Events

Use SSE client to listen to `/user/{user-id}/listen` to listen for appropriate user's notifications. Notifications are sent in format of json objects, see below for attribute details and meanings.

## Example
When the api server is running run `python3 listen.py` or `node listen.js` with appropriate options to listen to user "test" notifications. Then call the `/ping` endpoint to ping all users, including "test". A json object should appear.

# Docs
## Debugging
## Ping
Occurs when `/ping` is called to all users currently listening
```javascript
    "type"  : "ping",
    "body"  : message_string 
```

## Ping User
Occurs when `/user/{user-id}/ping` is called, ping to specific user
```javascript
    "type"  : "ping-user",
    "body"  : message_string 
```

## Friends
### Friend Invite Recieved
Some user has sent a friend invite to client
```javascript
    "type"      : "friend-invite-sent",
    "friend"    : invitee_user_id
```

### Friend Invite Accepted
A user has accepted client's friend invite, sent to both friends
```javascript
    "type"      : "friend-invite-accepted",
    "friend"    : friend_user_id
```

### Unfriended By User
A user has unfriended the client, sent to client only
```javascript
    'type'      : 'unfriended',
    'user'      : id,
    'message'   : 'User {id} has unfriended you'
```

## Groups
### Group Invite Recieved
Some user has sent a group invite to client
```javascript
    "type"      : "group-invite",
    "group"     : group
```

## Decks/Cards
### New Deck Created
A user in your group has created a new deck
```javascript
    'type'      : 'new-deck',
    'group'     : id,
    'deck'      : deck_id
```

### Voting Started
Voting has started on a deck you are a part of
```javascript
    'type'  : 'voting-started',
    'group' : group_id,
    'deck'  : deck_id,
    'cards' : cards_json
```

### Voting Complete
Voting is complete for a deck you are part of
```javascript
    'type'  : 'voting-complete',
    'group' : group_id,
    'deck'  : deck_id,
    'cards' : cards_json
```

### Card Deleted
Card has been deleted in a group where you (client) are a part of
```javascript
    'type'  : 'card-deleted',
    'group' : group_id,
    'deck'  : deck_id,
    'card'  : card_id
            
```

### Deck Deleted
Deck has been deleted in a group where you (client) are a part of
```javascript
    'code'  : 'deck-deleted',
    'group' : group_id,
    'deck'  : deck_id
```




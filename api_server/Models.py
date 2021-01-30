# For reference???

class User:
    def __init__ (self, id, password, group_ids, group_invites, friend_ids, want_friend_ids):
        self.id = id    # The names just an id 
        self.password = password
        self.group_ids = group_ids
        self.group_invites = group_invites
        self.friend_ids = friend_ids
        self.want_friend_ids = want_friend_ids        

class Group:
    def __init__(self, id, owner, user_ids, decks, invited_ids):
        self.id = id
        self.owner = owner
        self.user_ids = user_ids
        self.decks = decks
        self.invited_ids = invited_ids

class Deck:
    def __init__(self, id, description, owner, cards, voting_started, user_ids):
        self.id = id
        self.description = description
        self.owner = owner
        self.cards = cards
        self.voting_started = voting_started
        self.user_ids = user_ids

class Card:
    def __init__(self, id, description, like_ids, nope_ids):
        self.id = id
        self.description = description
        self.like_ids = like_ids
        self.nope_ids = nope_ids
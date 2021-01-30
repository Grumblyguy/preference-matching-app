# Most taken and adapted from https://maxhalford.github.io/blog/flask-sse-no-deps/

import queue

QUEUE_MAX_SIZE = 0

# Handles multiple message announcers and save messages to send later
class NotifHandler:

    def __init__(self):
        self._announcers = {}
        self._saved_msgs = {}

    def nuke(self):
        self._announcers = {}
        self._saved_msgs = {}

    def new_announcer(self, key):
        self._announcers[key] = MessageAnnouncer()
        return self._announcers[key]

    def listen(self, key):
        if key in self._announcers:
            # self.flush_cache_all()
            return self._announcers[key].listen()
        else:
            # self.flush_cache_all()
            return None
        

    # Send a message
    def announce(self, key, msg):
        if key in self._announcers:
            # Check if there are saved messages first
            if key in self._saved_msgs:
                for m in self._saved_msgs[key]:
                    self._announcers[key].announce(m)
                self._saved_msgs[key] = [] 

            self._announcers[key].announce(msg)
            
        else:
            # Save messages if client not yet listening
            if key not in self._saved_msgs:
                self._saved_msgs[key] = []
            self._saved_msgs[key].append(msg)
        # self.flush_cache_all()

    # Doesn't announce to anyone not currently listening
    def announce_all(self, msg):
        # self.flush_cache_all()
        for a in self._announcers.values():
            a.announce(msg)
        

    # Flush messages saved up for a user (only if they are connected)
    def flush_cache(self, key):
        if key in self._announcers:
            # Check if there are saved messages first
            if key in self._saved_msgs:
                for m in self._saved_msgs[key]:
                    self._announcers[key].announce(m)
                self._saved_msgs_key = []

    def flush_cache_all(self):
        for k in self._announcers:
            self.flush_cache(k)

# Handles the actual message sending
class MessageAnnouncer:

    def __init__(self):
        self._listeners = []

    def listen(self):
        q = queue.Queue(maxsize=QUEUE_MAX_SIZE)
        self._listeners.append(q)
        return q

    def announce(self, msg):
        msg = format_sse(data=msg)
        for i in reversed(range(len(self._listeners))):
            try:
                self._listeners[i].put_nowait(msg)
            except queue.Full:
                del self._listeners[i]

def format_sse(data: str) -> str:
    msg = f'data: {data}\n\n'
    msg = f'event: message\n{msg}'
    return msg
        
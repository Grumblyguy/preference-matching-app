import time
import requests

while True:
    url = 'http://localhost:5000/ping'
    url = 'http://localhost:80/ping'
    requests.get(url)
    time.sleep(1)

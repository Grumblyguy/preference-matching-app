#!/usr/bin/python3
import sseclient
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--host', default="localhost")
parser.add_argument('--user', default='test')
parser.add_argument('--port', type=int, default=80, help='Change port number from default (80)')

args = parser.parse_args()
port = args.port
user = args.user
host = args.host
messages = sseclient.SSEClient(f'http://{host}:{port}/user/{user}/listen')

for msg in messages:
    print(msg)

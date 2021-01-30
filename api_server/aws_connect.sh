#!/bin/sh
chmod 400 "comp4511-api-server.pem"
ssh -i "comp4511-api-server.pem" ubuntu@ec2-54-252-181-63.ap-southeast-2.compute.amazonaws.com
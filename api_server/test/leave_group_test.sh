#!/bin/sh
curl -X GET "http://0.0.0.0/nuke" -H  "accept: application/json"
curl -X POST "http://0.0.0.0/users?id=test&password=test" -H  "accept: application/json"
curl -X POST "http://0.0.0.0/users?id=test1&password=test1" -H  "accept: application/json"
curl -X POST "http://0.0.0.0/groups?id=testGroup&owner_id=test" -H  "accept: application/json"
# read -n 1 -r -s -p $'Press enter to continue...\n'
curl -X POST "http://localhost/group/testGroup/invite?user_id=test1" -H  "accept: application/json"
curl -X POST "http://localhost/user/test1/accept_group?group_id=testGroup" -H  "accept: application/json"
curl -X POST "http://localhost/group/testGroup/deck?deck_id=testDeck&description=This%20is%20a%20test%20deck&owner_id=test" -H  "accept: application/json"
curl -X POST "http://localhost/group/testGroup/deck/testDeck/card?id=testCard&description=This%20is%20a%20test%20card" -H  "accept: application/json"
curl -X POST "http://localhost/group/testGroup/deck/testDeck/card?id=testCard2&description=This%20is%20the%20second%20test%20card" -H  "accept: application/json"
curl -X DELETE "http://localhost/user/test/leave_group/testGroup" -H  "accept: application/json"

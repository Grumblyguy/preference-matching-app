curl -X GET "http://0.0.0.0/nuke" -H  "accept: application/json"
curl -X POST "http://0.0.0.0/users?id=test&password=test" -H  "accept: application/json"
curl -X POST "http://0.0.0.0/groups?id=testGroup&owner_id=test" -H  "accept: application/json"
curl -X GET "http://0.0.0.0/group/testGroup" -H  "accept: application/json"
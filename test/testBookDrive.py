import json
import requests


BASE = "http://localhost:3000/"
data = {
  "driveID": "YOYOYOYOYOYO",
  "organizer": "Derek Geng",
  "startDate": "2/30/23",
  "completedDate": "6/31/24",
  "status": 0,
  "booksGoal": 500,
  "gs": {
    "fundraise": "ftext",
    "terms": True
  },
  "cb": {
    "booksCurrent": 500,
    "updateFreq": 2,
    "lastUpdate": "5/9/20"
  },
  "pts": {
    "intFee": False,
    "domFee": True,
    "materials": {
      "boxes": True,
      "extraCardboard": False,
      "tape": True,
      "mailing labels": False
    }
  },
  "fl": {
    "startDate": "4/15/04",
    "endDate": "6/9/68",
    "dateSent": "1/2/3",
    "numBoxes": 15,
    "numBooks": 75,
    "shipFee": 500
  }
}

# test get
ret = requests.get(BASE + '/api/bookDrive/Hello-World-Code')
retData = json.loads(ret.content.decode())['data'] # turn into json
print(retData) 
print(ret.status_code) # ret 200

# test put
ret = requests.put(BASE + '/api/bookDrive/Hello-World-Code', data = {'driveName': 'YMH'})
print(ret.status_code) # ret 200
retData.pop('_id')
retData['driveCode'] = "Hello-World-Code2"

# test post
ret = requests.post(BASE + '/api/bookDrive/Hello-World-Code2', json=json.dumps(retData))
print(ret.status_code) # ret 200
ret = requests.post(BASE + '/api/bookDrive/Hello-World-Code2', json=json.dumps(retData))
print(ret.status_code) # ret 400 (duplicate drive)

# test del
ret = requests.delete(BASE + '/api/bookDrive/Hello-World-Code2')
print(ret.status_code) # ret 200



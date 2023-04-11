import json
import requests
import time


data = {
  "driveID": "YOYOYOYOYOYO",
  "organizer": "Derek Geng",
  "startDate": "2/30/23",
  "completedDate": "6/31/23",
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

requests.post()


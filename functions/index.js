// Copyright 2019 CCCSTC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const functions = require("firebase-functions");
const axios = require("axios");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.booklets = functions.https.onRequest((request, response) => {
  axios
    .get("https://www.cccstc.org/_functions/services?limit=52")
    .then(r => r.data)
    .then(d => d.services)
    .then(services =>
      services.map(d => {
        let weekStrArr = (d.week || "").split("-");
        let week = 0;
        if (weekStrArr.length === 2) {
          week = weekStrArr[1].trim();
        }
        return Object.assign(
          {},
          { date: d.displayDate, week: +week, booklet: d.pdf }
        );
      })
    )
    .then(booklets => response.json({ booklets }))
    .catch(err => response.status(500).json({ error: err }));
});

exports.records = functions.https.onRequest((request, response) => {
  axios
    .get("https://www.cccstc.org/_functions/records?limit=50")
    .then(r => r.data)
    .then(d => d.records)
    .then(records =>
      records.map(d =>
        Object.assign(
          {},
          {
            date: d.displayDate,
            session: d.title,
            content: d.description,
            week: d.week,
            audio: d.mp3
          }
        )
      )
    )
    .then(records => response.json({ records }))
    .catch(err => response.status(500).json({ error: err }));
});

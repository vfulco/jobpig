'use strict';

// Take Adwords list of world cities goo.gl/wKNrY5, widdle it down, convert to csv needed for client and server
// Note: when done here, copy/paste the result to client/src/www. We need it in both locations (so don't cut); and
// we don't want to require() it from client (isomorophic) because we want Cloudront to cache it, and only serve it
// when requested on client (SeedTags or CreateJob)

const csv = require('csv');
const _ = require('lodash');
const fs = require('fs');
const async = require('async');
const path = require('path');

async.waterfall([
  cb => fs.readFile(path.join(__dirname, `AdWords API Location Criteria 2015-10-13.csv`), cb),
  (data, cb) => csv.parse(data, cb),
  (rows, cb) => {
    let xformed = _(rows)
      .slice(1) // Remove headers

      // Filter only reasonably-sized administrative divisions
      .filter(row => _.includes(['City', 'Country', 'Province', 'State'], col[5]))
      .map(col => ({
        value: col[0],
        label: col[2]
      }))
      .value();

      //// Get a sampling of 'administrative division' types (I'm not sure which of the above types we should use)
      //.groupBy('[5]')
      //.map(row => _.sampleSize(row, 25))
      //.flatten()
      //csv.stringify(xformed, cb);
      //(str, cb) => fs.writeFile('./output.csv', str, cb)

      fs.writeFile(path.join(__dirname, 'locations.json'), JSON.stringify(xformed), cb);
  },
], err => {
  if (err) console.error(err);
});
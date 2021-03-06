'use strict';

let Adaptor = require('./index').Adaptor;
let _ = require('lodash');

module.exports = class VirtualVocations extends Adaptor {
  refresh() {
    return this.fetchFeed('https://www.virtualvocations.com/rss').then(results => {
      let feed = results.rss.channel[0].item.slice(0,100);
      let jobs = feed.map(j => {
        return {
          //key: j.guid[0],
          source: 'virtualvocations',
          title: j.title[0],
          company: null,
          url: j.link[0],
          description: j.description[0],
          location: null,
          remote: true,
          tags: []
        }
      });
      return Promise.resolve({jobs, feed});
    })
  }
}
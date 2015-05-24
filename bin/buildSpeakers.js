#!/usr/bin/env node
'use strict';

// core modules
var fs = require('fs');

// npm modules
var async = require('async');
var jade = require('jade');
var path = require('path');
var mkdirp = require('mkdirp');

// internal modules
var speakers = require('../app/data/speakers.json');

// create paths
var basePath = path.resolve(__dirname, '..', 'public', 'speaker');

// read layout from disk
var speakerLayoutPath = path.resolve(__dirname, '..', 'app', 'pages', 'speaker', 'speaker.jade')
var speakerLayout = fs.readFileSync(speakerLayoutPath);

function buildSpeakerPage(speaker, done) {
  var outPath = path.join(basePath, speaker.id + '.html');
  
  var template = jade.compile(speakerLayout, {
    //jade options
    filename: speakerLayoutPath
  });
  
  fs.writeFile(outPath, template(speaker), done);
}

function buildSpeakerPages(done) {
  async.each(speakers, buildSpeakerPage, done);
}

// pipeline
async.series([
  mkdirp.bind(null, basePath),
  buildSpeakerPages
], function (err) {

  if (err) {
    console.error(new Error(err));
  }

  console.log('Done building pages for all speaker');
});

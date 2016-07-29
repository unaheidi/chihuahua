'use strict';

var WithWorkpathRepository = require('gitty');
var events = require('events');
var path = require('path');
var fs = require('fs');
var Command = require('gitty/lib/command');

var Repository = function(repo, gitpath) {
    if (!(this instanceof Repository)) {
        return new Repository(repo, gitpath);
    }

    var self = this;
    events.EventEmitter.call(this);

    self.gitpath = gitpath ? path.normalize(gitpath) : '';
    self.path = path.normalize(repo);
    console.log(self.path);
    self._ready = false;
    self.name = path.basename(self.path);

    fs.exists(self.path + '/refs', function(exists) {
      self.initialized = exists;
      self._ready = true;
                             
      self.emit('ready');
    });

};

Repository.prototype = new WithWorkpathRepository('../data');

Repository.prototype.grep = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var tree = typeof args[0] === 'string' ? args[0] : '';
  var searchFmt = typeof args[0] === 'string' ? args[0] : 'select';
  var done = args.slice(-1).pop() || function() { };
  var cmd = new Command(self, 'grep', [searchFmt, tree]);
                 
  cmd.exec(function(err, stdout, stderr) {
    if (err || stderr) {
       return done(err || new Error(stderr));
    }
   done(null, stdout);
 });
};

module.exports = Repository;

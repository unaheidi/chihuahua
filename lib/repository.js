'use strict';

var WithWorkpathRepository = require('gitty');
var events = require('events');
var path = require('path');
var fs = require('fs');
var Command = require('./command');

var Repository = function(repo, gitpath) {
    if (!(this instanceof Repository)) {
        return new Repository(repo, gitpath);
    }

    var self = this;
    events.EventEmitter.call(this);

    self.gitpath = gitpath ? path.normalize(gitpath) : '';
    self.path = path.normalize(repo);
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
  var searchFmt = typeof args[1] === 'string' ? args[1] : 'select';
  var done = args.slice(-1).pop() || function() { };
  var cmd = new Command(self, 'grep', [searchFmt, tree]);
                 
  cmd.exec(function(err, stdout, stderr) {
    if (err || stderr) {
       return done(err || new Error(stderr));
    }
   done(null, stdout);
 });
};

Repository.prototype.lines = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var path = typeof args[0] === 'string' ? args[0] : '';
  var done = args.slice(-1).pop() || function() { };
  var cmd = new Command(self, 'ls-files', [], path);

  cmd.exec(function(err, stdout, stderr) {
    if (err || stderr) {
      return done(err || new Error(stderr));
    }
    done(null, stdout);
  });
}

Repository.prototype.linesSync = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var path = typeof args[0] === 'string' ? args[0] : '';
  var done = args.slice(-1).pop() || function() { };
  var cmd = new Command(self, 'ls-files', ['-z'], path);
  console.log('linesSync path:' + path);

  return cmd.countLinesSync();
}  

Repository.clone = function(path, url) {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var creds = args[2].username ? args[2] : {};
  var done = args.slice(-1).pop() || function() {};
  var clone = new Command(null, 'clone', [url, path]);
  var error = null;
  
  //console.log(clone.command);
  clone.exec(function(err, stdout, stderr) {
    done(err);
  });
};




module.exports = Repository;

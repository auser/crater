var bundler = require('../index.js'),
    fs = require('fs'),
    path = require('path');

var outFile = __dirname + '/test_bundle.js';

describe('jasmine-node', function(){

  it('should list all the files in a directory and compress them', function(){
    bundler.bundle({'dir': __dirname + '/fixtures', outFile: outFile});
    expect(fs.readFileSync(outFile, 'utf-8')).toEqual('function a(){return"hello"}function b(){return"hello"}');
    fs.unlink(outFile);
  });

  it('should mangle the file to the users will', function() {
    bundler.bundle({'dir': __dirname + '/fixtures', outFile: outFile}, function(file) {
      return "hello";
    });
    expect(fs.readFileSync(outFile, 'utf-8')).toEqual('hellohello');
    fs.unlink(outFile);
  });

});
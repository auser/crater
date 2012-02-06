var crater = require('../index.js'),
    fs = require('fs'),
    path = require('path');

var outFile = __dirname + '/test_bundle.js';

describe('jasmine-node', function(){

  it('should list all the files in a directory and compress them', function(){
    crater.bundle({'dir': __dirname + '/fixtures/js', outFile: outFile, minimizeJS: true});
    expect(fs.readFileSync(outFile, 'utf-8')).toEqual('function a(){return"hello"}function b(){return"hello"}');
    fs.unlink(outFile);
  });

  it('should mangle the file to the users will', function() {
    crater.bundle({'dir': __dirname + '/fixtures/js', outFile: outFile, minimizeJS: true}, function(file) {
      return "hello";
    });
    expect(fs.readFileSync(outFile, 'utf-8')).toEqual('hellohello');
    fs.unlink(outFile);
  });

  it('should not compile if no minimization files', function() {
    crater.bundle({'dir': __dirname + '/fixtures/html', outFile: __dirname + '/all.html', format: 'utf8'});
    expect(fs.readFileSync(__dirname + '/all.html', 'utf-8')).toEqual('<html><head><title>Hello</title></head><body><h1>Test index.html</h1></body></html>');
    fs.unlink(__dirname + '/all.html');
  });

  it('should be able to prepend the file', function () {
    crater.bundle({'dir': __dirname + '/fixtures/html', outFile: __dirname + '/all.html', prepend: 'Templates'});
    expect(fs.readFileSync(__dirname + '/all.html', 'utf-8')).toEqual('Templates<html><head><title>Hello</title></head><body><h1>Test index.html</h1></body></html>');
    fs.unlink(__dirname + '/all.html');
  });

  it('should be able to append the file', function () {
    crater.bundle({'dir': __dirname + '/fixtures/html', outFile: __dirname + '/all.html', append: 'Templates'});
    expect(fs.readFileSync(__dirname + '/all.html', 'utf-8')).toEqual('<html><head><title>Hello</title></head><body><h1>Test index.html</h1></body></html>Templates');
    fs.unlink(__dirname + '/all.html');
  });

});
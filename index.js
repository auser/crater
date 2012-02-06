var fs = require('fs'),
    path = require('path'),
    parser = require('uglify-js').parser,
    uglifyer = require('uglify-js').uglify;

var findAllFiles = function (path, all_files) {
    var files = fs.readdirSync(path);
    for (var i in files) {

        var filePath = path + '/' + files[i];
        var stats = fs.statSync(filePath);
        
        if (stats.isFile()) {
            all_files.push(filePath);
        } else if (stats.isDirectory()) {
            findAllFiles(filePath, all_files);
        }
    }
    return all_files;
};

// In case the user forgets to pass a function,
// this is the default function that all the files will call
function defaultFileRead(file) {return fs.readFileSync(file, 'utf-8');}

exports.bundle = function(opts, string_func) {
    
    opts            = opts || {};
    opts.outFile    = opts.outFile || 'bundle.js';
    opts.dir        = opts.dir || __dirname;
    
    if (string_func === undefined) {string_func = defaultFileRead;}

    var files = findAllFiles(opts.dir, []);

    var bundle = '';
    files.forEach(function(file) {
        bundle += string_func(file);
    });

    var ast = parser.parse(bundle);
    ast = uglifyer.ast_mangle(ast);
    ast = uglifyer.ast_squeeze(ast);
    bundle = uglifyer.gen_code(ast);

    fs.writeFileSync(opts.outFile, bundle, 'utf8');
};

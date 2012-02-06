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
function defaultFileRead(file, format) {
    if (format === undefined) {format = 'utf8';}
    return fs.readFileSync(file, format);
}

exports.bundle = function(opts, string_func) {
    
    opts                = opts || {};
    opts.outFile        = opts.outFile || 'bundle.js';
    opts.dir            = opts.dir || __dirname;
    opts.minimizeJS     = opts.minimizeJS || false;
    opts.format         = opts.format || 'utf8';
    opts.ignorePattern  = opts.ignorePattern || /\.DS_Store/;
    opts.prepend        = opts.prepend || '';
    opts.append         = opts.append || '';
    
    if (string_func === undefined) {string_func = defaultFileRead;}

    var files = findAllFiles(opts.dir, []);

    var bundle = opts.prepend;
    files.forEach(function(file) {
        if (!file.match(opts.ignorePattern)) {
            bundle += string_func(file, opts.format);
        }
    });
    bundle += opts.append;

    if (opts.minimizeJS) {
        var ast = parser.parse(bundle);
        ast = uglifyer.ast_mangle(ast);
        ast = uglifyer.ast_squeeze(ast);
        bundle = uglifyer.gen_code(ast);
    }

    fs.writeFileSync(opts.outFile, bundle, opts.format);
};

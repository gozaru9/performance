var UglifyJS = require("uglify-js");
var async = require('async');

var basePath = "./app/js/";
var controllersPath = basePath+"controllers/";
var directivesPath = basePath+"directives/";
var filtersPath = basePath+"filters/";
var servicesPath = basePath+"services/";

var pathMap = [
    {"fileName": "controllers", "path": controllersPath}, 
    {"fileName": "services", "path": servicesPath},
//    {"fileName": "directives", "path": directivesPath},
    ];

var app = [{"app.js": "app.min.js"}];
var fs = require("fs");

//app.js
var outputFile = fs.createWriteStream(basePath+"app.min.js");
var result = UglifyJS.minify(basePath+"app.js");
outputFile.write(result.code);

var fs = require('fs');

/*
async.forEach(pathMap, function(map) {
    
    fs.readdir(map.path, function(err, files){
        if (err) throw err;
        var fileList = [];
        var outputFileName = map.path+map.fileName+".min.js";
        files.filter(function(file){
            
            console.log(file);
            
            return file !== outputFileName && fs.statSync(file).isFile() && /.*\.js$/.test(file); //絞り込み
        }).forEach(function (file) {
            fileList.push(file);
        });
        
        console.log(fileList);
        var outputFile = fs.createWriteStream(outputFileName);
        var result = UglifyJS.minify(fileList);
        outputFile.write(result.code);
    });
});
    */
async.forEach(pathMap, function(map) {
    
    fs.readdir(map.path, function(err, files){
        
        if (files.length !== 0) {
            
            var fileList = [];
            var outputFileName = map.path+map.fileName+".min.js";
            files.forEach(function(file) {
                
                if (file !== outputFileName) {
                    
                    fileList.push(map.path+file);
                }
            });
            var outputFile = fs.createWriteStream(outputFileName);
            var result = UglifyJS.minify(fileList);
            
            console.log(fileList);
            
            outputFile.write(result.code);
        }
    });
});


/*

   js-mutator - strings/files mutator
   ------------------------------------------

   Copyright 2020 Dmitrii Kilchanov. All rights reserved.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at:

     http://www.apache.org/licenses/LICENSE-2.0

 */

var mutator = require("./mutator.js");
var utils = require("./utils.js");
const fs = require('fs');
path = require('path');

const outdir = './out/';
const outFileNameBase = 'out';
const mutateOutFilesCount = 100;
const mutateMaxCyclesCount = 100; // random

exports.dictionary = [];

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low)
}

var argc = process.argv.length;

if (argc < 4 || (process.argv[2] != '-f' && process.argv[2] != '-s')) {
	console.info('Usage:');
	console.info('node index.js -f <folder_with files>');
	console.info('node index.js -s <string>');
	process.exit();
}

if (process.argv[2] == '-f') {
	var filesDir = process.argv[3];
	fs.readdir(filesDir, (err, files) => {
		if (files == undefined || files.length == 0) {
			console.info('Folder ' + filesDir + ' not holds any files');
			process.exit();
		}
		files.forEach(file => {	
			var outFile;
			filePath = path.join(filesDir, file);
			fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
				if (!err) {
					for (var i = 0; i < mutateOutFilesCount; i++) {
						if (i > 0) 
							outFile = outFileNameBase + i + '_' + file;
						else
							outFile = outFileNameBase + '_' + file;
						var returnBuf = mutator.mutate_havoc(utils.str_to_uint8arr(data));
						var cyclesCount = randomInt(0, mutateMaxCyclesCount);
						for (var j = 0; j < cyclesCount; j++) 
						{
							returnBuf = mutator.mutate_havoc(returnBuf);
						}
						var str = utils.uint8arr_to_str(returnBuf);
						console.log(str);
						
						var filePathOut = path.join(outdir, outFile);
						fs.writeFile(filePathOut, str, function (err) {
							if (err) return console.log(err);
						});
					}
				} else {
					console.log(err);
				}
			});
		});
	});
} 
else if (process.argv[2] == '-s') {

}

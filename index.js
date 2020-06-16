/*

   js-mutator - strings/files mutator
   ------------------------------------------

   Copyright 2020 Dmitrii Kilchanov. All rights reserved.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at:

     http://www.apache.org/licenses/LICENSE-2.0

 */
 
var __version__ = "0.3";

var mutator = require("./mutator.js");
var utils = require("./utils.js");
const fs = require('fs');
path = require('path');

const outdir = '/out/';
const outFileNameBase = 'out';
const startSmartMutateSymbol = '{{';
const endSmartMutateSymbol = '}}';

var mutateOutFilesCount = 10;
var mutateMaxCyclesCount = 2; // random from 0 to this

exports.dictionary = [];

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low)
}

var argc = process.argv.length;

if (argc < 4 || (process.argv[2] != '-f' && process.argv[2] != '-s')) {
	console.info('Smart JS Mutator ' + __version__);
	console.info('');
	console.info('Usage:');
	console.info('node index.js -f <folder with files> <out_files_count>(default:10) <mutate_cycles>(default:2)');
	console.info('node index.js -s <folder with files> <out_files_count>(default:10) <mutate_cycles>(default:2) (mutate only {{text}} text)');
	process.exit();
}

var smart = process.argv[2] == '-s';
var filesDir = process.argv[3];

if (argc > 4)
	mutateOutFilesCount = Number(process.argv[4]);

if (argc > 5)
	mutateMaxCyclesCount = Number(process.argv[5]);

console.info('\n >>> Smart JS Mutator ' + __version__ + '\n');
if (smart)
	console.info(' >>> Smart mutate: On');
console.info(' >>> Out files count: ' + mutateOutFilesCount);
console.info(' >>> Max mutate cycles: ' + mutateMaxCyclesCount + '\n');

const createDir = (dirPath) => {
	fs.mkdirSync(process.cwd() + dirPath, { recursive: true }, (error) => {
		if (error) {
			console.error('An error occurred: ', error);
		}
	});
}

function findAndMutate(fullData, mutateCycles) {
	var returnStr = fullData;
	const regexp = RegExp('{{([\\S\\s]*?)}}','g'); 
	var matches = fullData.matchAll(regexp);
	for (const match of matches) {
		var str = '';
		var returnBuf = mutator.mutate_havoc(utils.str_to_uint8arr(match[1]));
		for (var j = 1; j < mutateCycles; j++) {
			returnBuf = mutator.mutate_havoc(returnBuf);
		}
		str = utils.uint8arr_to_str(returnBuf);
		var regexp2 = RegExp(`{{(${match[1]})}}`,'g'); 
		returnStr = returnStr.replace("{{" + match[1] + "}}", str);
	}
	return returnStr;
}

fs.readdir(filesDir, (err, files) => {
	if (files == undefined || files.length == 0) {
		console.info('Folder ' + filesDir + ' not holds any files');
		process.exit();
	}
	createDir(outdir);
	console.info('Start mutating process...');
	
	files.forEach(file => {	
		var outFile;
		filePath = path.join(filesDir, file);
		fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data){
			if (!err) {
				for (var i = 0; i < mutateOutFilesCount; i++) {
					if (i > 0) 
						outFile = outFileNameBase + i + '_' + file;
					else
						outFile = outFileNameBase + '_' + file;
					
					var str = '';
					var cyclesCount = randomInt(0, mutateMaxCyclesCount);

					if (smart) {
						str = findAndMutate(data, cyclesCount);
					}
					else {
						var returnBuf = mutator.mutate_havoc(utils.str_to_uint8arr(data));
						for (var j = 1; j < cyclesCount; j++) {
							returnBuf = mutator.mutate_havoc(returnBuf);
						}
						str = utils.uint8arr_to_str(returnBuf);
					}

					var filePathOut = path.join(process.cwd(), outdir, outFile);
					fs.writeFile(filePathOut, str, function (err) {
						if (err) return console.log(err);
					});
				}
			} else {
				console.log(err);
			}
		});
	});
	console.info('...end mutating process');
});

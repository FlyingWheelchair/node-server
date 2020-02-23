#!/usr/bin/node

var sequences = require('./singletons-192.json');

var json = {};
var xml = '';
var debug = false; // display debug messages for sequences

function parse(data) {
	try {
		json = JSON.parse(data);
	} catch (err) {
		console.error('Invalid JSON input\n' + err);
		return -1;
	}
	// only one key/value pair in element (root)
	key = Object.keys(json)[0];
	parseNode(json[key], key, '');
	return xml;
}

function parseNode(obj, key, xpath) {
	// loop over array values
	if (Array.isArray(obj)) {
		for (var el of obj) {
			sub_parseNode(key, el, xpath+key+'/');
		}
	} else {
		sub_parseNode(key, obj, xpath+key+'/');
	}
}


function sub_parseNode(key, el, xpath) {
	// opening el
	for (var i=0 ; i < (xpath.match(/\//g) || []).length -1 ; i++) {
		xml += '\t';
	}
	xml += '<' + key;
	// attributes
	if ('$' in el) {
		for (var attr in el.$) {
			xml += ' ' + attr + '="' + el.$[attr] + '"';
		}
	}
	xml += '>';
	// value
	if ('_' in el) {
		xml += el._
			.replace(/\\n/g, '\n')
			.replace(/\\t/g, '\t')
			.replace(/\\"/g, '"');
	} else if ((Object.keys(el).length == 1 && '$' in el) || Object.keys(el).length == 0) {
		// attributes or not, but no value and no children
	}	else { // children
		xml += '\n';
		var unorderedKeys = Object.keys(el);
		// SORTING KEYS
		var keys = [];
		var sequence = [];
		try {
			sequence = sequences[xpath];
			for (var e of sequence) {
				if (unorderedKeys.indexOf(e) > -1) {
					keys.push(e);
				}
			}
			if (unorderedKeys.length != keys.length) { // missing keys in sequence
				if (debug) console.log('Sequence incomplete for ' + xpath);
				keys = unorderedKeys; // keep all keys, still unordered
			}
		}
		catch (err) { // no sequence for xpath
			if (debug) console.log('No sequence found for ' + xpath);
			keys = unorderedKeys;
		}
		// KEYS SORTED
		for (var k of keys) {
			// do not process attributes and value
			if (k != '$' && k != '_') {
				parseNode(el[k], k, xpath);
			}
		}
		for (var i=0 ; i < (xpath.match(/\//g) || []).length -1 ; i++) {
			xml += '\t';
		}
	}
	// closing element
	xml += '</' + key + '>\n';
}


function printUsage() {
		console.log('Usage: node json2xml.js inputFile.json outputFile.xml');
}

exports.parse = parse;
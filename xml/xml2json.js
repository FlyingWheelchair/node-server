#!/usr/bin/node

var singletons = require('./singletons-192.json');
var DOMParser = require('xmldom').DOMParser;

var json = '';
var xml;

var args = process.argv.slice(2);

function parse(data) {
	try {
		var parser = new DOMParser();
		xml = parser.parseFromString(data, 'text/xml');
	} catch (err) {
		console.error('Invalid XML input\n' + err);
		return -1;
	}
	var root = getFirstElementNode(xml.childNodes);
	if (root == null) {
		console.error('No element node at root level of XML file');
		return -1;
	}
	json = '{"' + root.nodeName + '":';
	parseNode(root, root.nodeName+'/');
	json += '}';
	return JSON.parse(json);
}

function getFirstElementNode(nodes) {
	for (var i=0 ; i<nodes.length ; i++) {
		if (nodes[i].nodeType == 1) {
			return nodes[i];
		}
	}
	return null;
}


function getTextContent(node) {
	var text = null;
	for (var i=0 ; i<node.childNodes.length ; i++) {
		var ch = node.childNodes[i];
		if (ch.nodeType == 1) {
			return null;
		}
		if (ch.nodeType == 3) {
			text = ch.textContent;
		}
	}
	return text;
}


function getElementChildNodes(node) {
	var children = [];
	for (var i=0 ; i<node.childNodes.length ; i++) {
		var ch = node.childNodes[i];
		if (ch.nodeType == 1) {
			children.push(ch);
		}
	}
	return children;
}


function parseNode(node, xpath) {
	// opening object
	json += '{';

	var hasAttributes = false;

	// attributes
	if (node.attributes.length > 0) {
		hasAttributes = true;
		json += '"$":{';
		for (var i=0; i<node.attributes.length ; i++) {
			var attr = node.attributes[i];
			json += '"' + attr.name + '":"' + attr.value + '"';
			if (i < node.attributes.length-1) {
				json += ',';
			}
		}
		json += '}';
	}

	// value
	var textContent = getTextContent(node);
	if (textContent != null) {
		if (hasAttributes) {
			json += ',';
		}
		json += '"_":"' + node.textContent
			.replace(/\n/g, '\\n')
			.replace(/\t/g, '\\t')
			.replace(/"/g, '\\"') + '"';
	} else { // children
		var processed = [];
		var numberProcessed = 0;
		var child;
		var children = getElementChildNodes(node);
		if (hasAttributes && children.length > 0) {
			json += ',';
		}
		for(var i=0; i<children.length; i++) {
			child = children[i];
			if (processed.includes(child.nodeName) || child.nodeType != 1) {
				continue;
			}
			processed.push(child.nodeName);
			var newXpath = xpath + child.nodeName + '/';
			if (singletons.includes(newXpath)) {
				json += '"' + child.nodeName + '":';
				parseNode(child, newXpath);
				numberProcessed++;
			} else {
				json += '"' + child.nodeName + '":[';
				parseNode(child, newXpath);
				numberProcessed++;
				var child2;
				for (var j=i+1; j<children.length; j++) {
					child2 = children[j];
					if (child2.nodeName === child.nodeName) {
						json += ',';
						parseNode(child2, newXpath);
						numberProcessed++;
					}
				}
				json += ']';
			}
			if (numberProcessed < children.length) {
				json += ',';
			}
		}
	}

	// closing object
	json += '}';
};

exports.parse = parse;
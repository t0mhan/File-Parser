import fs from 'fs';
import readline from 'readline';
const stream = require('stream');
import {
	TypesEnum
} from './public/ts/enums';
import {
	splitData,
	setUniqueValue,
	getUniqueValue,
	getOperationTypeCount,
	getGroupedData
} from './public/ts/common';
import {
	OperationTypeInterface,
	operationObjInterface
} from './public/ts/interfaces'
// import { addDataToSQL } from './public/db/dbconnect';

var lineCount: number = 0;
var parsedData: string[] = [];

var instream: fs.ReadStream = fs.createReadStream('./dist/public/log/logs.log');
var outstream = new stream();
var rl: readline.Interface = readline.createInterface(instream, outstream);

rl.on('line', (line: string) => {
	const singleLine: string[] = line.split('|');
	// consider line that has more then 3 items
	if (singleLine.length == 4) {
		lineCount++;

		// parsing the single line data after removing value at first index 
		const firstIndexValue: string = singleLine[0].trim();
		const splittedData: string[] = splitData(singleLine.slice(1));
		if (firstIndexValue !== TypesEnum.IGNORE) {
			parsedData.push(splittedData.toString()), setUniqueValue('', splittedData[2]);
		}
	}

	// split operations and push to array to get unique operations
	const operation: string[] = singleLine[1].split(':');
	if (operation[0].trim() === TypesEnum.OPERATION && operation[1]) setUniqueValue(operation[1], '');
});

rl.on('close', () => {

	// Additional lines(------) and pipes( | ) are just to make results less confusing
	console.log('\n----------------------------------------------------------------------------------------');
	// Question 1
	const operationTypeCount: OperationTypeInterface = getOperationTypeCount();
	console.log(`1. How many queries, mutations and subscriptions have been performed?\n Result: Queries: ${operationTypeCount.queries}, Subscriptions: ${operationTypeCount.subscriptions}, Mutations: ${operationTypeCount.mutations}`);
	console.log('----------------------------------------------------------------------------------------\n');

	//Question 2
	// get unique values
	const uniqueData: any = getUniqueValue(); // *check
	console.log('----------------------------------------------------------------------------------------');
	console.log(`2. What are the counts for the different operations?\n Result: ${uniqueData[0].size} , ${uniqueData[1].size}`);
	console.log('----------------------------------------------------------------------------------------\n');

	// Question 3.a) 4.a) 5.a) 
	const groupedData: [operationObjInterface[], operationObjInterface[]] = getGroupedData(parsedData);
	console.log('----------------------------------------------------------------------------------------');
	console.log(`| 3.a, 4.a, 5.a Average, maximum, minimum duration grouped by operation type are: |`);
	console.log('----------------------------------------------------------------------------------------');
	console.log('|   operationType    |    Average    |    Maximum    |    Minimum    ');
	groupedData[1].forEach((element: operationObjInterface) => {
		console.log('----------------------------------------------------------------------------------------');
		console.log('|   ' + element.id + '    |    ' + element.avg + '    |    ', element.max + '    |    ' + element.min);
	});
	console.log('----------------------------------------------------------------------------------------');

	// Question 3.b) 4.b) 5.b)
	console.log('\n\n------------------------------------------------------------------------------------------------');
	console.log(`| 3.b, 4.b, 5.b Average, maximum, minimum duration grouped by operations are: | `);
	console.log('------------------------------------------------------------------------------------------------');
	console.log('|   Operations    |    Average    |    Maximum    |    Minimum    ');
	groupedData[0].forEach((element: operationObjInterface) => {
		console.log('------------------------------------------------------------------------------------------------');
		console.log('|   ' + element.id + '    |    ' + element.avg + '    |    ', element.max + '    |    ' + element.min);
	});
	console.log('------------------------------------------------------------------------------------------------\n');

	// connection to sql queries
	//dbconnect.addDataToSQL(parsedData);
});
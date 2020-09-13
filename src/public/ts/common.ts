import {
    OperationTypeEnum,
    TypesEnum
} from './enums';
import {
    OperationTypeInterface,
    operationObjInterface
} from './interfaces'

var queries: number = 0;
var mutations: number = 0;
var subscriptions: number = 0;
var operationsSet = new Set();
var operationsTypeSet = new Set();

/**
 * function to increase value of query, mutaion or subscription
 * @param {*} opType accepts the operation type
 */
export function countOperationType(opType?: string): OperationTypeInterface {
    // set queries, mutaion or subscription count
    switch (opType) {
        case OperationTypeEnum.QUERY:
            queries++;
            break;
        case OperationTypeEnum.SUBSCRIPTION:
            subscriptions++;
            break;
        case OperationTypeEnum.MUTATION:
            mutations++;
            break;
    }

    let data: OperationTypeInterface = {
        queries: queries,
        subscriptions: subscriptions,
        mutations: mutations
    };
    return data;
}

/**
 * function to return query, mutaion or subscription
 */
export function getOperationTypeCount(): OperationTypeInterface {
    return countOperationType();
}

/**
 * function to add operations and operation type to Set
 * @param operations 
 * @param operationType 
 */
export function setUniqueValue(operations?: string, operationType?: string): any {
    if (operations) operationsSet.add(operations);
    if (operationType) operationsTypeSet.add(operationType);
    return [operationsSet, operationsTypeSet];
}

/**
 * function to return unique operations and operationType
 */
export function getUniqueValue() {
    return setUniqueValue();
}

/**
 * function to split single line of data
 * @param {*} singleLine 
 */
export function splitData(singleLine: string[]): string[] {
    // split to get duration
    let durationSplit = singleLine[1].split(':');
    let duration = durationSplit[1].trim();

    // split to get operation name
    let operationsSplit = singleLine[0].split(':');
    let operation = '';
    if (operationsSplit[0].trim() === TypesEnum.OPERATION) operation = operationsSplit[1].trim();

    // split to get operationType
    let operationTypeSplit = singleLine[2].split(':');
    let operationType = operationTypeSplit[1].trim()

    // count operationType in file
    let opType = operationTypeSplit[0].trim() === TypesEnum.OPERATIONTYPE && operationType;
    if (opType) countOperationType(opType);

    // return operations, duration, operation types
    return [operation, duration, operationType];
}

/**
 * function to calculate average, min and max for grouped by data
 * @param {*} oData 
 */

export function calculateAvgMinMax(oData: string[]): operationObjInterface[] {
    let min = 0.0;
    let max = 0.0;
    let sum = 0.0;
    let data: operationObjInterface[] = []

    for (const keys in oData) {
        let count = 0;
        for (let index = 0; index < oData[keys].length; index++) {
            count++;
            const element = Number(oData[keys][index]);
            min = (index === 0 || min > element) ? element : min;
            max = (index === 0 || max < element) ? element : max;
            sum = (index === 0) ? element : sum + element;
        }

        let operationObj = {
            id: keys,
            min: min,
            max: max,
            avg: sum / count
        };
        data.push(operationObj);
    }
    return data;
}

/**
 * function parsed and return grouped data
 * @param parsedData 
 */
export function getGroupedData(parsedData: string[]): [operationObjInterface[], operationObjInterface[]] {
    let operationsData: any = {};
    let operationTypeData: any = {};
    parsedData.forEach((element: string) => {
        let ele = element.split(',');
        // Group data by Operations
        const dOperation = ele[0];
        if (!operationsData[dOperation]) operationsData[dOperation] = [];
        operationsData[dOperation].push(ele[1]);

        // Group data by OperationType
        const dOperationType = ele[2];
        if (!operationTypeData[dOperationType]) operationTypeData[dOperationType] = [];
        operationTypeData[dOperationType].push(ele[1]);
    });
    let operations: operationObjInterface[] = calculateAvgMinMax(operationsData);
    let operationType: operationObjInterface[] = calculateAvgMinMax(operationTypeData);
    
    return [operations, operationType];
}
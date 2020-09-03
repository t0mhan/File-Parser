export interface  OperationTypeInterface {
    queries: number;
    subscriptions: number;
    mutations: number;
};

export interface operationObjInterface {
    id: string,
    min: number,
    max: number,
    avg: number
};
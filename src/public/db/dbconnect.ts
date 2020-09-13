var mysql = require('mysql');

var con = mysql.createConnection({
    port: 3306,
    host: '127.0.0.1',
    user: 'root',
    password: 'admin',
    database: 'heartbeat_1'
});

export function addDataToSQL(parsedData: string[]) {
    let queryData = '';
    for (let i = 0; i < parsedData.length; i++) {
        const element = parsedData[i].split(',');
        queryData += "(" + "'" + element[0] + "'" + ', ' + element[1] + ', ' + "'" + element[2] + "'" + "),";
    }

    // remove additional comma
    queryData = queryData.slice(0, -1);
    var queryString = 'INSERT INTO `GraphqlDurations` (operation, duration, operationType) VALUES' + queryData + ';';

    con.query(queryString, (err: Error, results: any) => {
        console.log("Connected!");
        if (err) {
            return console.error(err);
        }
        // get inserted rows
        console.log(`${parsedData.length} rows inserted`);
    });

    // close the database connection
    con.end();
}
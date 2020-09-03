
var mysql = require('mysql'); 

var con = mysql.createConnection({
    port: 3306,
    host: '127.0.0.1',
    user: 'root',
    password: 'admin',
    database: 'heartbeat'
});

export function addDataToSQL(parsedData: string) {
    console.log(parsedData.length);
    let queryData = '';
    for (let index = 0; index < parsedData.length; index++) {
        const element = parsedData[index];
        queryData += "(" + "'" + element[0] + "'" + ', '  + element[1] + ', ' + "'" + element[2] + "'" + "),";            
    }

    // remove additional comma
    queryData = queryData.slice(0,-1);

    var queryString = 'INSERT INTO `GraphqlDurations` (operation, duration, operationType) VALUES' + queryData + ';';
    console.log(queryString);

        con.query(queryData, (err: Error, results: string) => {
        console.log("Connected!");
            if (err) {
              return console.error(err);
            }
            // get inserted rows
            console.log('Row inserted:' + results);
          });
          
          // close the database connection
          con.end();

}


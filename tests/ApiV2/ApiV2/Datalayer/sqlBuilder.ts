var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

class SqlResult {
    error: any;
    rowCount: number = 0;
    data: any;
    errorMessage(): string{
        if (this.error) {
            return this.error.message;
        } else
        {
            return "";
        }
    };
}

 var config = {
    userName: 'sjef',
    password: 'Granlia007',
    server: 'gatship.database.windows.net',
    // If you are on Microsoft Azure, you need this:  
    options: { encrypt: true, database: 'MinOkOnline', rowCollectionOnRequestCompletion: true, useColumnNames: true }
};  

 interface SqlCallback {
     (result: SqlResult): any;
 }

 function rowsToJsonObjects (rows: any) {
    var data = [];
    rows.forEach(function (row) {
        var rowObj: any = {};
        for (var prop in row) {
            rowObj[prop] = row[prop].value;
        }
        data.push(rowObj);
    });
    return data;
};

class SqlBuilder {
    private parameters: Array<any> = [];

    SQL: String;

    AddSql(sqlText: String) {
        this.SQL = this.SQL + " " + sqlText;
    }

    AddParameter(name: String, type: any, value: any) {
        var parameter = {};
        parameter["name"] = name;
        parameter["type"] = type;
        parameter["value"] = value;
        this.parameters.push(parameter);
    }

    Execute(callback: SqlCallback) {
        let result = new SqlResult();
        //setup connection
        var connection = new Connection(config);
        var sqlText = this.SQL;
        var obj = this;
        //Execture sql after when connected.
        connection.on('connect', function (err) {
      
            //if error return 
            if (err) {
                result.error = err;
                callback(result);
            }

            //setup the sql request
            let request = new Request(sqlText, function (err, rowCount, rows) {
                if (err) {
                    result.error = err;
                } else {
                    result.rowCount = rowCount;
                    result.data = rowsToJsonObjects(rows);
                }

                callback(result);

            });

            //add paramters
            obj.parameters.forEach(function (parameter) {
                request.addParameter(parameter.name, parameter.type, parameter.value);
            });

            request.on('done', function (rowCount, more, rows) {
                if (err) {
                    result.error = err;
                }

            });

            connection.execSql(request);

        });  
    };
 }
module.exports = SqlBuilder;
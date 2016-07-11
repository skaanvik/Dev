var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var SqlResult = (function () {
    function SqlResult() {
        this.rowCount = 0;
    }
    SqlResult.prototype.errorMessage = function () {
        if (this.error) {
            return this.error.MESSAGE;
        }
        else {
            return "";
        }
    };
    ;
    return SqlResult;
}());
var config = {
    userName: 'sjef',
    password: 'Granlia007',
    server: 'gatship.database.windows.net',
    // If you are on Microsoft Azure, you need this:  
    options: { encrypt: true, database: 'MinOkOnline', rowCollectionOnRequestCompletion: true, useColumnNames: true }
};
function rowsToJsonObjects(rows) {
    var data = [];
    rows.forEach(function (row) {
        var rowObj = {};
        for (var prop in row) {
            rowObj[prop] = row[prop].value;
        }
        data.push(rowObj);
    });
    return data;
}
;
var SqlBuilder = (function () {
    function SqlBuilder() {
        this.parameters = [];
    }
    SqlBuilder.prototype.AddSql = function (sqlText) {
        this.SQL = this.SQL + " " + sqlText;
    };
    SqlBuilder.prototype.AddParameter = function (name, type, value) {
        var parameter = {};
        parameter["name"] = name;
        parameter["type"] = type;
        parameter["value"] = value;
        this.parameters.push(parameter);
    };
    SqlBuilder.prototype.Execute = function (callback) {
        var result = new SqlResult();
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
            var request = new Request(sqlText, function (err, rowCount, rows) {
                if (err) {
                    result.error = err;
                }
                else {
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
    ;
    return SqlBuilder;
}());
module.exports = SqlBuilder;
//# sourceMappingURL=sqlBuilder.js.map
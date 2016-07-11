var datamodel = require('./datamodel');
var async = require('async');
var sqlBuilder = require('./SqlBuilder');
var DatamodelUtils = (function () {
    function DatamodelUtils() {
    }
    DatamodelUtils.prototype.createTable = function (table, callback) {
        var sql = new sqlBuilder();
        sql.SQL = 'create table ' + table.tableName + '(';
        var comma = '';
        var pkConstraint = '';
        var fkConstraints = '';
        table.columns.forEach(function (column) {
            sql.AddSql(comma + column.columnName + ' ' + column.dataType);
            if (column.notNull) {
                sql.AddSql('not null');
            }
            comma = ',';
            if (column.primaryKey) {
                pkConstraint = '\n, CONSTRAINT pk_' + table.tableName + '_' + column.columnName + ' PRIMARY KEY(' + column.columnName + ')';
            }
            if (column.foreignKey) {
                fkConstraints = fkConstraints + '\n, CONSTRAINT fk_' + table.tableName + '_' + column.columnName + ' FOREIGN KEY(' + column.columnName +
                    ') REFERENCES ' + column.foreignKey.foreignTable + '(' + column.foreignKey.foreignColumn + ')';
            }
        });
        sql.AddSql(pkConstraint);
        sql.AddSql(fkConstraints);
        sql.AddSql(')');
        sql.Execute(function (sqlResult) {
            if (sqlResult.error) {
                callback(sqlResult.errorMessage());
            }
            else {
                callback('table [' + table.tableName + '] created.');
            }
        });
    };
    ;
    DatamodelUtils.prototype.getColumnsInDbTable = function (tableName, callback) {
        var result = [];
        var sql = new sqlBuilder();
        sql.SQL = "Select COLUMN_NAME,IS_NULLABLE, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH as MaxChars,NUMERIC_PRECISION, NUMERIC_SCALE" +
            " from INFORMATION_SCHEMA.COLUMNS" +
            " where TABLE_NAME ='" + tableName + "'";
        sql.Execute(function (sqlResult) {
            if (!sqlResult.error) {
                result = sqlResult.data;
            }
            callback(result);
        });
    };
    ;
    DatamodelUtils.prototype.checkColumn = function (table, column, dbColumns, callback) {
        var columnFound = false;
        dbColumns.forEach(function (dbCol) {
            if (dbCol.COLUMN_NAME == column.columnName) {
                columnFound = true;
            }
        });
        if (!columnFound) {
            var sql = new sqlBuilder();
            sql.SQL = 'alter table ' + table.tableName + ' add ' + column.columnName + ' ' + column.dataType;
            sql.Execute(function (sqlResult) {
                if (sqlResult.error) {
                    callback(' could not create column [' + column.columnName + ']. (' + sqlResult.errorMessage + ')');
                }
                else {
                    callback(' column [' + column.columnName + '] created.');
                }
            });
        }
        else {
            callback('');
        }
    };
    ;
    DatamodelUtils.prototype.checkTable = function (table, callback) {
        var result = '<br>table [' + table.tableName + ']';
        var obj = this;
        //table exists?
        this.getColumnsInDbTable(table.tableName, function (dbColumns) {
            if (dbColumns.length == 0) {
                //create table
                result = result + ' NOT found.';
                obj.createTable(table, function (feedback) {
                    callback(result + feedback);
                });
            }
            else {
                result = result + ' found.'; //table ffound
                //missing any columns?
                async.eachSeries(table.columns, function (column, syncCallback) {
                    obj.checkColumn(table, column, dbColumns, function (feedBack) {
                        result = result + feedBack;
                        syncCallback();
                    });
                }, function (err) {
                    if (err) {
                        result = result + ' an error occured' + err;
                    }
                    callback(result);
                });
            }
        });
    };
    ;
    //Method
    DatamodelUtils.prototype.updateDb = function (callback) {
        var obj = this;
        var result = 'verifying database<br>';
        //check each table
        async.eachSeries(datamodel.tables, function (table, syncCallback) {
            //check table
            obj.checkTable(table, function (feedback) {
                result = result + feedback;
                syncCallback();
            });
        }, function (err) {
            if (err) {
                result = result + ' an error occured' + err;
            }
            callback(result);
        });
    };
    return DatamodelUtils;
}());
module.exports = DatamodelUtils;
//# sourceMappingURL=datamodelUtils.js.map
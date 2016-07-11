var datamodel = require('./datamodel');
var Connection = require('tedious').Connection;    
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  
var async = require('async');




    var config = {  
        userName: 'sjef',  
        password: 'Granlia007',  
        server: 'gatship.database.windows.net',  
        // If you are on Microsoft Azure, you need this:  
        options: {encrypt: true, database: 'MinOkOnline',rowCollectionOnRequestCompletion:true,useColumnNames:true}  
    };  

var sqlExecute = function(sqlText,callback){
        //setup connection
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        result = {
            "error" : undefined,
            "data"  : undefined,
            "rowCount"  : 0
        };

        //if error return 
        if(err){
            result.error = err;
            callback(result);
        }

        //setup the sql request
        request = new Request(sqlText, function(err,rowCount,rows) {  
             if (err) {  
                result.error = err;
            } else {
                result.rowCount = rowCount;
                result.data = rows;
            }

            callback(result);

        });  

        request.on('done', function (rowCount, more, rows) {
            if (err) {  
                result.error = err;
            }

         });

        connection.execSql(request);  
  
    });  
};

var sqlGetJs = function(sqlText,callBack){
    //setup connection
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        result = {
            "error" : undefined,
            "data"  : undefined,
            "rowCount"  : 0
        };

        //if error return 
        if(err){
            result.error = err;
            callBack(result);
        }

        //setup the sql request
        request = new Request(sqlText, function(err,rowCount,rows) {  
             if (err) {  
                result.error = err;
            } else {
                result.rowCount = rowCount;
                result.data = rows;
                result.data = [];
                rows.forEach(function(row){
                    rowObj = {};
                    for (var prop in row) {
                        rowObj[prop] = row[prop].value;
                    }
                    result.data.push(rowObj);
                })
            }

            callBack(result);

        });  

        request.on('done', function (rowCount, more, rows) {
            if (err) {  
                result.error = err;
            }

         });

        connection.execSql(request);  
  
    });  

};


var checkTableColumn = function(table,column,dbCols,callback){
    var columnFound = false;
    dbCols.forEach(function(dbCol){
        if(dbCol.COLUMN_NAME == column.columnName){
            columnFound = true;
        }
    });
    if(!columnFound){
        var sqlText = 'alter table '+table.tableName+ ' add '+column.columnName+' '+column.dataType;
        sqlExecute(sqlText,function(sqlResult){
            if(sqlResult.error)
            {
                callback(' could not create column ['+column.columnName+']. ('+error.message+')');
            }
            else{
                callback(column.columnName+' created');
            }

        });
    } else {
        callback('');
    }
};

var checkTableColumns = function(table,callback){
   //get columns
   var result = '';
   var sqlText = "Select COLUMN_NAME,IS_NULLABLE, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH as MaxChars,NUMERIC_PRECISION, NUMERIC_SCALE"+
                " from INFORMATION_SCHEMA.COLUMNS"+
                " where TABLE_NAME ='"+table.tableName+"'";
    sqlGetJs(sqlText,function(sqlResult){
        if(sqlResult.error){
            callback('sql errro: '+sqlResult.error.message);
        }
        var dbCols = sqlResult.data;
        //missing any columns? 
        async.eachSeries( table.columns,function(column,syncCallback) {
            checkTableColumn(table,column,dbCols,function(feedBack){
                result = result+feedBack;
                syncCallback();
            });
        }, function(err){  //finished all checks
            if(err){result = result+' an error occured'+err}
            callback(result);
        });   
    });  
   
  
};

var createTable = function(table,callback){
   var sqlText = 'create table '+table.tableName+'(';
   var comma = '';
   var pkConstraint = '';
   var fkConstraints = '';
   table.columns.forEach(function(column){
     sqlText = sqlText+comma+column.columnName+' '+column.dataType;
     if(column.notNull){
          sqlText = sqlText+' not null'
      }
      comma = ',';
      if(column.primaryKey){
          pkConstraint = '\n, CONSTRAINT pk_'+table.tableName+'_'+column.columnName+' PRIMARY KEY('+column.columnName+')';
      }
     if(column.foreignKey){
          fkConstraints = fkConstraints+'\n, CONSTRAINT fk_'+table.tableName+'_'+column.columnName+' FOREIGN KEY('+column.columnName+
                        ') REFERENCES '+column.foreignKey.foreignTable+'('+column.foreignKey.foreignColumn+')';
      }
   });
    sqlText = sqlText+pkConstraint;
    sqlText = sqlText+fkConstraints;
    sqlText = sqlText+')';
   sqlExecute(sqlText,function(sqlResult){
       if(!sqlResult.error)
       {
           callback(' table ['+table.tableName+'] was created.')
       }
       else
       {
            callback('could NOT create table ['+table.tableName+'].  ('+sqlResult.error.message+')');
       }
      
   });
}

var dbItemExits = function (itemType,itemName,callBack) {
    if(itemType = 'table')
    {
        sqlGetJs("Select count(*) as tableExists from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '"+itemName+"' and TABLE_TYPE = 'BASE TABLE'", function(sqlResult){
            if(sqlResult.error){
                console.log(sqlResult.error);
            } else
            {
                var result = false;
                if(sqlResult.rowCount > 0)
                {
                    result = (sqlResult.data[0].tableExists == 1);
                }
                callBack(result);
            }
            
        })
    }

    return false;
};

var checkTable = function(table,callBack) {
    var result ="";
    dbItemExits('table',table.tableName, function(itemExists){
        result = result+'<br>table "'+table.tableName+'"';
        if(itemExists){
            result = result+' found.';
            checkTableColumns(table,function(feedback){
                result = result+feedback;
                callBack(result);
            });
            
        } else
        {
           result = result+' not found. '  
           createTable(table,function(feedback){
               result = result+feedback;
               callBack(result);
           })
        }
       
    })
};

module.exports = {
    //test connection
  checkDbConnection : function(callBack) {
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
      if(!err){
          callBack("Connected!")
      }  
      else
       callBack(err.message);
    });  
    },

    checkdb : function(callback){
       var result = 'Database '+config.options.database;
       
        async.eachSeries( datamodel.tables,function(table,syncCallback) {
              //check table
              checkTable(table,function(feedback){
              result = result+feedback;
              syncCallback()})
        
        }, function(err){  //finished all checks
            if(err){result = result+' an error occured'+er}
            callback(result);
        });     
    }
};

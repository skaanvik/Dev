var datamodelUtils = require('./datamodelUtils');


var TYPES = require('tedious').TYPES;
var async = require('async');
var sqlBuilder = require('./SqlBuilder');



class Datalayer {
    //test moethod
    test(callback) {
        let sql = new sqlBuilder();
        sql.SQL = 'Select count(*) as Antall from trans';
        var result = sql.Execute(function (result) {
            if (result.error) {
                callback(result.error.message)
            }
            else {
                callback(result.data[0]);
            }
        });      
    }

    //Method createCategory
    createCategory(category: any, callback: (success: boolean,feedback: String) => any): void {
        var sql = new sqlBuilder();
        sql.SQL = 'insert into category';
        sql.AddSql("(CAT_ID, CAT_NAME, CAT_PARENT, CAT_IGNORE, CAT_TYPE, CAR_SORT, CAT_BUDGET)");
        sql.AddSql("(@CAT_ID, @CAT_NAME, @CAT_PARENT, @CAT_IGNORE, @CAT_TYPE, @CAR_SORT, @CAT_BUDGET)");
        sql.AddParameter('CAT_ID', TYPES.VarChar, '123'); 
        sql.AddParameter('CAT_NAME', TYPES.VarChar, category.name);
        sql.AddParameter('CAT_PARENT', TYPES.Null, null);
        sql.AddParameter('CAT_IGNORE', TYPES.Int, category.ignore);
        sql.AddParameter('CAT_SORT', TYPES.VarChar, category.sort);
        sql.AddParameter('CAT_BUDGET', TYPES.Numeric, category.budget);
        var result = sql.Execute(function (result: SqlResult) {
            if (result.error) {
                callback(false,result.errorMessage())
            }
            else {
                callback(true,'category created');
            }
        });       
    }

    //Method updateDbToDatamodel
    updateDbToDatamodel(callback: (feedback: String) => any): void {
        var dmUtils = new datamodelUtils();
        dmUtils.updateDb(callback);
    }
}

module.exports = Datalayer;

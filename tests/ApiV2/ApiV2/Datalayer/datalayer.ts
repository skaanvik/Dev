var datamodelUtils = require('./datamodelUtils');


var TYPES = require('tedious').TYPES;
var async = require('async');
var sqlBuilder = require('./SqlBuilder');
var uuid = require('node-uuid');



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

    //method getAllCageories
    getAllCategories(callback: (success: boolean, categories : Array<any>) => any): void {
        var sql = new sqlBuilder();
        sql.SQL = 'Select * from category';
        sql.AddSql("order by CAT_SORT, CAT_PARENT, CAT_NAME");
        sql.Execute(function (sqlResult) {
            if (sqlResult.error) {
                callback(false, sqlResult.errorMessage())
            }
            else {
                callback(true, sqlResult.data);
            }
        });
    }

    //Method createCategory
    createCategory(category: any, callback: (success: boolean,feedback: String) => any): void {
        var sql = new sqlBuilder();
        sql.SQL = 'insert into category';
        sql.AddSql("(CAT_ID, CAT_NAME, CAT_PARENT, CAT_IGNORE, CAT_TYPE, CAT_SORT, CAT_BUDGET)");
        sql.AddSql("values (@CAT_ID, @CAT_NAME, @CAT_PARENT, @CAT_IGNORE, @CAT_TYPE, @CAT_SORT, @CAT_BUDGET)");
        sql.AddParameter('CAT_ID', TYPES.VarChar,uuid.v4() ); 
        sql.AddParameter('CAT_NAME', TYPES.VarChar, category.name);
        sql.AddParameter('CAT_PARENT', TYPES.Int, null);
        sql.AddParameter('CAT_IGNORE', TYPES.Int, category.ignore);
        sql.AddParameter('CAT_TYPE', TYPES.Int, category.categoryType);
        sql.AddParameter('CAT_SORT', TYPES.VarChar, category.sort);
        if (!category.budget) {
            category.budget = 0;
        };
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

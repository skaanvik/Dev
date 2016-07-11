var Datamodel = {

    "tables": [
        {
            "tableName": "category",
            "columns": [
                { "columnName": "CAT_ID", "dataType": "varchar(40)", "primaryKey": true },
                { "columnName": "CAT_NAME", "dataType": "varchar(150)", "notNull": true },
                { "columnName": "CAT_PARENT", "dataType": "varchar(40)", "index": true, "foreignKey": { "foreignTable": "category", "foreignColumn": "CAT_ID" } },
                { "columnName": "CAT_IGNORE", "dataType": "smallint" },
                { "columnName": "CAT_TYPE", "dataType": "int" },
                { "columnName": "CAT_SORT", "dataType": "varchar(10)" },
                { "columnName": "CAT_BUDGET", "dataType": "numeric(15,5)", "notNull": true }
            ]
        },
        {
            "tableName": "trans",
            "columns": [
                { "columnName": "TRA_ID", "dataType": "varchar(40)", "primaryKey": true },
                { "columnName": "TRA_DATE", "dataType": "datetime", "notNull": true },
                { "columnName": "TRA_REF", "dataType": "varchar(100)" },
                { "columnName": "TRA_TYPE", "dataType": "varchar(100)" },
                { "columnName": "TRA_TEXT", "dataType": "varchar(500)" },
                { "columnName": "TRA_AMOUNT", "dataType": "numeric(15,5)", "notNull": true },
                { "columnName": "TRA_ORG_LINE", "dataType": "varchar(500)" },
                { "columnName": "TRA_CAT_ID", "dataType": "varchar(40)", "index": true, "foreignKey": { "foreignTable": "category", "foreignColumn": "CAT_ID" } }

            ]
        },
        {
            "tableName": "action_rule",
            "columns": [
                { "columnName": "RUL_ID", "dataType": "varchar(40)", "primaryKey": true },
                { "columnName": "RUL_TYPE", "dataType": "int", "notNull": true },
                { "columnName": "RUL_PARAM", "dataType": "varchar(250)" },
                { "columnName": "RUL_ACTION", "dataType": "int", "notNull": true },
                { "columnName": "RUL_CAT_ID", "dataType": "varchar(40)", "index": true, "foreignKey": { "foreignTable": "category", "foreignColumn": "CAT_ID" } },
                { "columnName": "RUL_FROM", "dataType": "datetime" },
                { "columnName": "RUL_TO", "dataType": "datetime" },
                { "columnName": "RUL_PARAM2", "dataType": "varchar(250)" },
                { "columnName": "RUL_VALUE", "dataType": "numeric(15,5)" },
                { "columnName": "RUL_SORT", "dataType": "int"}
            ]
        }

    ] //tables

}

module.exports = Datamodel;
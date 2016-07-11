module.exports =  {

"tables":[
    {"tableName" : "category",
        "columns" : [
            {"columnName" : "CAT_ID","dataType":"varchar(40)","primaryKey" : true},
            {"columnName" : "CAT_NAME","dataType":"varchar(150)","notNull":true},
            {"columnName" : "CAT_PARENT","dataType":"varchar(40)","index" : true,"foreignKey":{"foreignTable" : "category","foreignColumn":"CAT_ID"}},
            {"columnName" : "CAT_IGNORE","dataType":"smallint"},
            {"columnName" : "CAT_TYPE","dataType":"int"},
            {"columnName" : "CAT_SORT","dataType":"varchar(10)"},
            {"columnName" : "CAT_BUDGET","dataType":"numeric(15,5)","notNull":true}
        ]},
    {"tableName" : "trans",
        "columns" : [
            {"columnName" : "TRA_ID","dataType":"varchar(40)","primaryKey" : true},
            {"columnName" : "TRA_DATE","dataType":"datetime","notNull":true},
            {"columnName" : "TRA_REF","dataType":"varchar(100)"},
            {"columnName" : "TRA_TYPE","dataType":"varchar(100)"},
            {"columnName" : "TRA_TEXT","dataType":"varchar(500)"},
            {"columnName" : "TRA_AMOUNT","dataType":"numeric(15,5)","notNull":true},
            {"columnName" : "TRA_ORG_LINE","dataType":"varchar(500)"},
           {"columnName" : "TRA_CAT_ID","dataType":"varchar(40)","index" : true,"foreignKey":{"foreignTable" : "category","foreignColumn":"CAT_ID"}}
            
        ]}
            
    ] //tables

}
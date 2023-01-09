"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPool = void 0;
// //import mqtt 
const mqtt_1 = __importDefault(require("mqtt"));
// //get mqtt connection
// var mqttConnection = mqtt.connect('mqtt://45.61.56.94:1883')
// //let mqttConnection = mqtt.connect('mqtt://127.0.0.1:1883')
// mqttConnection.on("connect", ()=>{
//     setInterval( ()=>{
//         //these kind of msg should pass
//      // let msg: any = JSON.stringify([{"ipadd":"192.168.1.7","deviceid":"10000017","parameter":"TEMP","valueparameter":29}]);
//       //let msg: any = JSON.stringify('TEMP');
//       let msg: any = ('GON');
//       console.log(msg);
//       mqttConnection.publish('10000025', msg)
//     }, 10000)
//     //for the every 5 second the msg will send
// })
//import mysql for the get connection
const mysql2_1 = __importDefault(require("mysql2"));
//set the mysql connection
let mySQLConn = {
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "MySqlDB@123",
    database: "new_line_light_db",
    multipleStatements: true
};
exports.dbPool = mysql2_1.default.createPool(mySQLConn);
//check if the db is connected successfully
exports.dbPool.getConnection((err, conn) => {
    if (err) {
        console.log(err.message + "Not able to connect");
    }
    else {
        console.log(" connected");
    }
});
//read the table first and send the msg to device to indicate that the parameter level out of range
setInterval(() => {
    //connect to the mqtt broker
    var mqttConnection = mqtt_1.default.connect('mqtt://45.61.56.94:1883');
    try {
        //read the data table
        var sqldata = `select parameter_code, device_id
                           from alarm_table`;
        // var sqldata = `select ipadd, deviceid
        //        from new_table`;
        //check whether the data table is null or not
        if (sqldata.length != null) {
            //get the data results in the table
            exports.dbPool.query(sqldata, (err, result) => {
                console.log("err", err);
                console.log("result", result);
                var len = result.length;
                //read the table and publish massages
                for (var i = 0; i < len; i++) {
                    var variable = result[i].parameter_code;
                    var variable1 = result[i].device_id;
                    console.log("variable", variable);
                    console.log("variable1", variable1);
                    mqttConnection.on("connect", () => {
                        let msg = (variable);
                        console.log(msg);
                        mqttConnection.publish('10000016', msg);
                    });
                }
                //once the table read , delete all records in the alarm table
                //let deleterecords = `truncate table crms.new_table`;
                let deleterecords = `truncate table new_line_light_db.alarm_table`;
                exports.dbPool.query(deleterecords, (err, result) => {
                    console.log("result", result);
                    console.log("error", err);
                    console.log("table rows deleted");
                });
            });
        }
        else {
            //if the data table is null
            console.log("data does not exit!");
        }
    }
    catch (e) {
        console.log("error");
    }
}, 5000);
//read the data table for every 5 second again and again 
//# sourceMappingURL=app.js.map
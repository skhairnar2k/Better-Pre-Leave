"use strict";
const mysql = require("mysql");
const { logger } = require("./commonRepo.js");
const { ResponseModel } = require("../models/responseObj.js");

const pool = mysql.createPool({
  connectionLimit: process.env.DB_CONNECTION_LIMIT, //important
  host: "localhost",
  user: "root",
  password: "",
  database: "betterpreleave",
  charset: "utf8mb4",
  debug: false,
  multipleStatements: true,
  //   connectionLimit: process.env.DB_CONNECTION_LIMIT, //important
  //   host: process.env.DB_PATH,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
});
const dbHandler = (query) => {
  return new Promise((res, rej) => {
    console.log("Process env: ", process.env.DB_USER);
    pool.getConnection(function (err, connection) {
      if (err) {
        logger("ERROR QUERY 1", err.message);
        rej(new ResponseModel(false, err.message, undefined));
      } else {
        logger("connected as id ", connection.threadId);
        logger("QUERY", query);
        connection.query(query, function (err, rows) {
          connection.release();
          err
            ? rej(new ResponseModel(false, err.message, undefined))
            : res(new ResponseModel(true, "Success", rows));
        });
        connection.on("error", function (err) {
          logger("ERROR QUERY 2", err.message);
          rej(new ResponseModel(false, err.message, undefined));
        });
      }
    });
  });
};

const query = async (query) => {
  try {
    return await dbHandler(query);
  } catch (e) {
    logger("ERROR DB", e.message);
    throw e;
  }
};

const insert = async (table, insertData) => {
  var keys = Object.keys(insertData);
  var keyValue = "";
  var insertItem = "";
  for (var i = 0; i < keys.length; i++) {
    keyValue = keyValue + keys[i] + ",";
    if (typeof insertData[keys[i]] === "string") {
      let insertItem2 = insertData[keys[i]];
      insertItem2 = insertItem2.replace(/'/g, "\\'");
      insertItem2 = insertItem2.replace(/"/g, '\\"');
      insertItem = insertItem + "'" + insertItem2 + "'" + ",";
    } else {
      insertItem = insertItem + insertData[keys[i]] + ",";
    }
  }
  if (keyValue.charAt(keyValue.length - 1) == ",") {
    keyValue = keyValue.substr(0, keyValue.length - 1);
  }
  if (insertItem.charAt(insertItem.length - 1) == ",") {
    insertItem = insertItem.substr(0, insertItem.length - 1);
  }
  try {
    return await dbHandler(
      `INSERT INTO ${table} (${keyValue}) VALUES (${insertItem})`
    );
  } catch (e) {
    logger("ERROR DB", e.message);
    throw e;
  }
};

const insertMultiple = async (table, insertData) => {
  if (Array.isArray(insertData)) {
    let keyList = Object.keys(insertData[0]);
    let keyValue = "";
    for (let i = 0; i < keyList.length; i++) {
      keyValue = keyValue + "" + keyList[i] + ",";
    }
    let insertMultiValue = "";
    for (let j = 0; j < insertData.length; j++) {
      let insertValueItem = "";
      for (let k = 0; k < keyList.length; k++) {
        let insertItem = insertData[j][keyList[k]];
        // if(insertItem ==='string')
        // {
        //     insertItem=insertItem.replace(/'/g, "\\'");
        //     insertItem = insertItem.replace(/"/g, '\\"');
        // }

        insertValueItem =
          insertValueItem +
          "" +
          (insertData[j].hasOwnProperty(keyList[k]) &&
          insertData[j][keyList[k]] != undefined &&
          insertData[j][keyList[k]] != ""
            ? typeof insertData[j][keyList[k]] === "string"
              ? "'" + insertItem + "'"
              : insertItem
            : insertData[j][keyList[k]] === 0
            ? 0
            : "''") +
          ",";
      }
      if (insertValueItem.length > 0) {
        if (insertValueItem.charAt(insertValueItem.length - 1) == ",") {
          insertValueItem = insertValueItem.substr(
            0,
            insertValueItem.length - 1
          );
        }
        insertMultiValue = insertMultiValue + "(" + insertValueItem + "),";
      }
    }
    if (insertMultiValue.length > 0) {
      if (insertMultiValue.charAt(insertMultiValue.length - 1) == ",") {
        insertMultiValue = insertMultiValue.substring(
          0,
          insertMultiValue.length - 1
        );
      }
    }
    if (keyValue.length > 0) {
      if (keyValue.charAt(keyValue.length - 1) == ",") {
        keyValue = keyValue.substring(0, keyValue.length - 1);
      }
    }
    try {
      return await dbHandler(
        `INSERT INTO ${table} (${keyValue}) VALUES ${insertMultiValue}`
      );
    } catch (e) {
      logger("ERROR DB", e.message);
      throw e;
    }
  } else {
    return new ResponseModel(false, "InValid array to insert", undefined);
  }
};

const updateQuery = async (table, updateData, whereData) => {
  var keys = Object.keys(updateData);
  var updateString = "";
  for (var i = 0; i < keys.length; i++) {
    if (typeof updateData[keys[i]] === "string") {
      let insertItem2 = updateData[keys[i]];
      insertItem2 = insertItem2.replace(/'/g, "\\'");
      insertItem2 = insertItem2.replace(/"/g, '\\"');

      updateString = updateString + keys[i] + "='" + insertItem2 + "',";
    } else {
      updateString = updateString + keys[i] + "=" + updateData[keys[i]] + ",";
    }
  }
  if (updateString.charAt(updateString.length - 1) == ",") {
    updateString = updateString.substr(0, updateString.length - 1);
  }

  var keys = Object.keys(whereData);
  var whereString = "";
  for (var i = 0; i < keys.length; i++) {
    if (typeof whereData[keys[i]] === "string") {
      whereString =
        whereString + keys[i] + "='" + whereData[keys[i]] + "' AND ";
    } else {
      whereString = whereString + keys[i] + "=" + whereData[keys[i]] + " AND ";
    }
  }
  var checkValue = whereString.substr(
    whereString.length - 5,
    whereString.length
  );
  if (checkValue == " AND ") {
    whereString = whereString.substr(0, whereString.length - 5);
  }
  try {
    return await dbHandler(
      "UPDATE " + table + " SET " + updateString + " WHERE " + whereString
    );
  } catch (e) {
    logger("ERROR DB", e.message);
    throw e;
  }
};

module.exports = { query, insert, insertMultiple, updateQuery };

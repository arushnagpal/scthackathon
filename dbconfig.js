var mysql = require('mysql');
var utils = require('./utils');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sct"
});

var jiradata;
var slackdata;

function insert(dbobject) {
    if(dbobject.description=="" || dbobject.description==null){
        console.log("empty");
    }else{
        con.query("INSERT INTO jira SET ?", dbobject, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        });
    }
}

function insertslack(dbobject) {
    con.query("INSERT INTO slack_messages SET ?", dbobject, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
}

function deleteslack(){
    con.query("TRUNCATE TABLE slack_messages", function (err, result) {
        if (err) throw err;
        console.log("Everything deleted");
      });
}

function deletejira(){
    con.query("TRUNCATE TABLE jira", function (err, result) {
        if (err) throw err;
        console.log("Everything deleted");
      });
}

function getslack(){
    var ans =[];
    con.query("SELECT * from slack_messages", function (err, results, fields) {
        if (err) throw err;
        // console.log(JSON.stringify(results));
        jiradata = JSON.parse(JSON.stringify(results));
        jiradata.forEach(element => {
            console.log("tags "+element.tags +" search : "+search+" similarity: "+utils.similaritystring(element.tags,search));
            if(utils.similaritystring(element.tags,search)>0){
                ans.push(element);
            }
        });
        console.log("returning "+ans);
        return ans;
      });
}

function getjira(search){
    var ans =[];
    con.query("SELECT * from jira", function (err, results, fields) {
        if (err) throw err;
        // console.log(JSON.stringify(results));
        jiradata = JSON.parse(JSON.stringify(results));
        jiradata.forEach(element => {
            console.log("tags "+element.tags +" search : "+search+" similarity: "+utils.similaritystring(element.tags,search));
            if(utils.similaritystring(element.tags,search)>0){
                ans.push(element);
            }
        });
        console.log("returning "+ans);
        return ans;
      });
}

function fetchslackusingchannelandthread(channel_id,thread_ts){
    con.query("SELECT * from slack_messages where channel_id = "+channel_id+" AND thread_ts = "+thread_ts, function (err, results, fields) {
        if (err) throw err;
        console.log(JSON.stringify(results));
      });
}

function fetchAllTags(){
    var tagArray = [];
    con.query('SELECT tags,uuid FROM `jira`', function (error, results, fields) {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        // console.log("true false is "+Array.isArray(results));
        // console.log("results are "+results); 
        jiradata = JSON.parse(JSON.stringify(results));
        results.forEach(element => {
            console.log("tags type "+typeof element.tags);
            tagArray.push(element.tags);
        });
        console.log("type of tagarray "+typeof tagArray);

        console.log(utils.similarity("fresh production",tagArray));

    });
    // return tagArray;
}

module.exports={
    insert:insert,
    fetchAllTags:fetchAllTags,
    insertslack:insertslack,
    deleteslack:deleteslack,
    getslack:getslack,
    getjira:getjira,
    deletejira: deletejira,
    fetchslackusingchannelandthread:fetchslackusingchannelandthread
};
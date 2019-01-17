var keyword_extractor = require("keyword-extractor");
var uuidv1 = require('uuid/v1');
var db = require('./dbconfig');
var utils = require('./utils');
var retext = require('retext')
var keywords = require('retext-keywords')
var toString = require('nlcst-to-string')

var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sct"
});


var searchpercentage = 0;



var appRouter = function (app) {
  app.post("/jira", function(req, res) {

    console.log("request is "+req.body);
    // db.deletejira();
    req.body.forEach(element => {
        var dbdata = {
            "description":"",
            "url":"",
            "summary":"",
            "uuid":"",
            "tags":"",
            "jira_key":""
        };
    
        var summary = element.summary;
        var description = element.description;
        dbdata.url = element.url;
        dbdata.jira_key = element.key;
        // dbdata.issuetype = element.issuetype;
        dbdata.summary=summary;
        dbdata.description=description;
        dbdata.uuid = uuidv1(); 

        if(summary!=null){
            // console.log("summary is "+summary);
            dbdata.tags+=extractTags(summary);
        }
        if(description!=null){
            // console.log("description is "+description);
            dbdata.tags+=" "+extractTags(description);
        }else{
            dbdata.description="";
        }

        dbdata.tags = dbdata.tags.trim();
        dbdata.tags = dbdata.tags.toLowerCase();
        dbdata.tags = Array.from(new Set(dbdata.tags.split(' '))).join(" ");
        console.log("dbdata is "+JSON.stringify(dbdata));
        db.insert(dbdata);
    });

    res.status(200).send("Thanks siddesh");
  });



  app.post("/slack", function(req, res) {
    console.log("request is "+req.body);
    db.deleteslack();
    req.body.forEach(element => {
        var dbdata = {
            "id":"",
            "ts":"",
            "thread_ts":"",
            "text_content":"",
            "user_id":"",
            "channel_id":"",
            "user_name":"",
            "channel_name":"",
            "user_email_id":"",
            "tags":""
        };
    
        var textcontent = element.text_content;
        dbdata.id = element.id;
        dbdata.ts = element.ts;
        dbdata.thread_ts = element.thread_ts;
        dbdata.user_name = element.user_name;
        dbdata.channel_id = element.channel_id;
        dbdata.user_email_id = element.user_email_id;
        dbdata.channel_name = element.channel_name;
        dbdata.user_id = element.user_id;
        dbdata.text_content = element.text_content;
        
        if(textcontent!=null){
            dbdata.tags+=extractTags(textcontent);
        }

        dbdata.tags = dbdata.tags.trim();
        dbdata.tags = dbdata.tags.toLowerCase();
        dbdata.tags = Array.from(new Set(dbdata.tags.split(' '))).join(" ");
        console.log("dbdata is "+JSON.stringify(dbdata));
        db.insertslack(dbdata);
    });

    res.status(200).send("Thanks nitish");
  });



  app.get("/getslack", function(req, res) {
    db.getslack();
    // console.log(typeof results);
    
    res.status(200).send("Thanks for your request");
  });


  app.get("/jira/results", function(req, res) {
    var searchstring = req.query.search;
    // res.writeHead(200);
    searchstring = searchstring.toLowerCase();
    searchstring = extractTags(searchstring);
    searchstring = Array.from(new Set(searchstring.split(' '))).join(" ");
    var ans =[];
    console.log("dsgagud");
    con.query("SELECT * from jira", function (err, results, fields) {
        if (err) throw err;
        // console.log(JSON.stringify(results));
        jiradata = JSON.parse(JSON.stringify(results));
        jiradata.forEach(element => {
            console.log("tags "+element.tags +" search : "+searchstring+" similarity: "+utils.customsimilarity(element.tags,searchstring));
            if(utils.customsimilarity(element.tags,searchstring)>searchpercentage){
                element.similarity=utils.customsimilarity(element.tags,searchstring);
                ans.push(element);
            }
        });
        console.log("returning "+ans);
        res.send(ans);
      });
    var returnstring = JSON.stringify(ans);
    // console.log(typeof results);
    console.log("sending "+returnstring);
    // res.send(returnstring);
    
    
    // res.end();
  });


  app.get("/slack/results", function(req, res) {
    var searchstring = req.query.search;
    // res.writeHead(200);
    searchstring = searchstring.toLowerCase();
    searchstring = extractTags(searchstring);
    searchstring = Array.from(new Set(searchstring.split(' '))).join(" ");

    var ans =[];
    con.query("SELECT * from slack_messages", function (err, results, fields) {
        if (err) throw err;
        // console.log(JSON.stringify(results));
        jiradata = JSON.parse(JSON.stringify(results));
        jiradata.forEach(element => {
            console.log("tags "+element.tags +" search : "+searchstring+" similarity: "+utils.customsimilarity(element.tags,searchstring));
            if(utils.customsimilarity(element.tags,searchstring)>searchpercentage){
                element.similarity=utils.customsimilarity(element.tags,searchstring);
                ans.push(element);
            }
        });
        console.log("returning "+ans);
        res.send(ans);
      });
    var returnstring = JSON.stringify(ans);
    // console.log(typeof results);
    console.log("sending "+returnstring);
  });


app.get("/slack/getresults", function(req, res) {
    var channel_id = req.query.channel_id;
    var thread_ts = req.query.thread_ts;

    var ar =[];
    ar.push(channel_id);
    ar.push(thread_ts);
    con.query('SELECT * FROM `slack_messages` WHERE `channel_id` = ? and `thread_ts` =? ',ar, function (err, results, fields) {
        if (err) throw err;
        console.log(JSON.stringify(results));
        res.send(results);
      });
    // console.log(typeof results);
    
    // res.status(200).send("Thanks for your request");
  });
}





// function extractTags(sentence){
    
//     var extraction_result = keyword_extractor.extract(sentence,{
//         language:"english",
//         remove_digits: true,
//         return_changed_case:true,
//         remove_duplicates: true
//    });
// //    console.log("result is array "+extraction_result);
//    return extraction_result;
// } 



function extractTags(sentence){
    var extraction_result="";
    retext()
  .use(keywords)
  .process(sentence, done)

function done(err, file) {
  if (err) throw err

  file.data.keywords.forEach(function(keyword) {
    extraction_result+=toString(keyword.matches[0].node)+" ";
  })

  file.data.keyphrases.forEach(function(phrase) {
    extraction_result+=phrase.matches[0].nodes.map(stringify).join('')+" ";
    function stringify(value) {
      return toString(value)
    }
  })
    }
   return extraction_result;
} 
module.exports = appRouter;
var retext = require('retext')
var keywords = require('retext-keywords')
var toString = require('nlcst-to-string')


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


// console.log(extractTags("Terminology mining, term extraction, term recognition, or glossary extraction, is a subtask of information extraction. The goal of terminology extraction is to automatically extract relevant terms from a given corpus."));


var isSimilar = require('strings-similarity');

// console.log(isSimilar('Chenai abdsghdjashd','chennai')); 


function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return j;
    }
    return -1;
}

function customsimilarity(tagstring, searchstring ){
    var count=0;
    var tagstringtags = tagstring.split(" ");
    var searchstringtags = searchstring.split(" ");
    for(i=0;i<searchstringtags.length;i++){
        if(searchstringtags[i] !=" "&& searchstringtags[i] !=""&& searchStringInArray(searchstringtags[i],tagstringtags)!=-1)
            count++;
    }
    return count;
}

// console.log(customsimilarity("dog cat elephant pig rat bat","please find dog and cat "));

var a = "which project i’m using for voice";
a = extractTags(a);
console.log(a);
console.log(Array.from(new Set(a.split(' '))).join(" "));
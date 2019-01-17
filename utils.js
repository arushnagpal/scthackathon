var stringSimilarity = require('string-similarity');

var similarity = require("similarity")


function similarity(toMatch,matchingArray){
    console.log(stringSimilarity.findBestMatch(toMatch, matchingArray));
}

function similaritystring(string1,string2){
    if(string1==null || string2==null){
        return 0;
    }
    return similarity(string1, string2);
}

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

module.exports = {
    similarity: similarity,
    similaritystring:similaritystring,
    customsimilarity:customsimilarity
};
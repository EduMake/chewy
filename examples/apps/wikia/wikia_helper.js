'use strict';

var Wikia = require('node-wikia');
var fs = require("fs");
function WikiaHelper(sWikia, oIntentions) {
  this.wikia = new Wikia(sWikia);
  this.oIntentions = {};
  if(typeof oIntentions !== 'undefined'){
    this.oIntentions = oIntentions;
  }
}

WikiaHelper.prototype.getIntentionCatergories = function(sSubject) {
  if(this.hasOwnProperty("oIntentions") && this.oIntentions.hasOwnProperty(sSubject)) {
    return this.oIntentions[sSubject];
  }
  return "";
};

WikiaHelper.prototype.getArticleDetails = function(sSubject) {
  return this.wikia.getArticleDetails({ids:[],titles:[sSubject]}).then(
    function(oResponse) {
      //console.log('success - Article Details received info for ' + sSubject);
      for(var sID in oResponse.items){
        var iID = oResponse.items[sID].id;
        this.wikia.getArticleAsSimpleJson(iID).then(
          function(oResponse) {
            //console.log("oResponse", oResponse);
            return oResponse;
          });  
        }
      }
    );
  };

WikiaHelper.prototype.getArticle = function(iID, iParagraphs, iStart) {
 if(iParagraphs == null){
    iParagraphs = 1;
  }
  if(iStart == null){
    iStart = 0;
  }
  
  return this.wikia.getArticleAsSimpleJson(iID).then(
    function(oResponse) {
      var aMainContent = oResponse.sections[0].content;
      var aParagraphs = aMainContent.filter(function(oPart){
        return oPart.type == 'paragraph';
      });
      
      var aFiltered = aParagraphs.slice(iStart, iStart + iParagraphs).map(function(oPart){
          return oPart.text;
      });
      return aFiltered;
    });  
  };

WikiaHelper.prototype.getSearchList = function(sSubject) {
  return this.wikia.getSearchList({query:sSubject}).then(
    function(oResponse) {
      //console.log('success - Search List received info for ' + sSubject);
      //fs.writeFile("response.json", JSON.stringify(oResponse, null, 4));
      
      return oResponse;
    }
  );
};

WikiaHelper.prototype.getLucky = function(sSubject) {
  return this.wikia.getSearchList({query:sSubject}).then(
    function(oResponse) {
      //console.log('success - getLucky received info for ' + sSubject);
      if(oResponse.total>0){
        return (oResponse.items[0].id);
      }
      return false;
    }
  );
};

WikiaHelper.prototype.getList = function(sSubject) {
  //console.log("sSubject", sSubject);
  return this.wikia.getArticlesList({category:sSubject}).then(
    function(oResponse) {
      console.log('success - getList received info for ' + sSubject);
      //console.log(oResponse);
      //fs.writeFile("response.json", JSON.stringify(oResponse, null, 4));
      if(oResponse.items.length > 0){
        return oResponse.items.map(function(oItem){
          console.log("oItem", oItem.title)
          var TitleParts =  oItem.title.split(/[\/\(\,]/);
          return TitleParts[0].trim();
        })
        .filter(function(item, i, ar){ return ar.indexOf(item) === i; })
        ;
      }
      return [];
    }
  );
};

WikiaHelper.prototype.getWords = function() {
  //return this.wikia.getArticlesPopular({limit:10}).then(
  return this.wikia.getArticlesMostViewed({limit:100}).then(
    function(oResponse) {
      if(oResponse.items.length > 0){
        return oResponse.items.map(function(oItem){
          var TitleParts =  oItem.title.replace("Star Wars:","").split(/[\/\(\,\:]/);
          return TitleParts[0].trim();
        })
        .filter(function(item, i, ar){ return ar.indexOf(item) === i; })
        .sort();
      }
      return [];
    }
  );
};

WikiaHelper.prototype.getCatergoriesWords = function(Catergories, iTarget) {
  var aCatergories = Catergories.split(",");
  var iLimit = Math.min(250, Math.floor(iTarget / aCatergories.length));
  var oWikia = this.wikia;
  var aGets = aCatergories.map(function(Catergory){
    return oWikia.getArticlesMostViewed({limit:iLimit, category:Catergory});
  });
  
  return Promise.all(aGets).then(function(aResponses){
    var aLists = aResponses.reduce(function(aItems, oResponse) {
      if(oResponse.items.length > 0){
        aItems = aItems.concat(oResponse.items.map(function(oItem){
          var TitleParts =  oItem.title.split(/[\/\(\,]/);
          return TitleParts[0].trim();
        }));
      }
      return aItems;
    },[]);
    
    return aLists.filter(function(item, i, ar){ 
      return ar.indexOf(item) === i; 
    }).sort();
  });
};

module.exports = WikiaHelper;
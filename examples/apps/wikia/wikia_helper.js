'use strict';

var Wikia = require('node-wikia');

function WikiaHelper(sWikia) {
  this.wikia = new Wikia(sWikia);
}

WikiaHelper.prototype.getArticleDetails = function(sSubject) {
  return this.wikia.getArticleDetails({ids:[],titles:[sSubject]}).then(
    function(oResponse) {
      console.log('success - Article Details received info for ' + sSubject);
      
      for(var sID in oResponse.items){
        var iID = oResponse.items[sID].id;
        this.wikia.getArticleAsSimpleJson(iID).then(
          function(oResponse) {
            console.log("oResponse", oResponse);
            return oResponse;
          });  
        }
      }
    )
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
      console.log('success - Article As Simple Json received info for ' + iID);
      var aMainContent = oResponse.sections[0].content;
      var aParagraphs = aMainContent.filter(function(oPart){
        return oPart.type == 'paragraph';
      });
      var sParagraph = aParagraphs[0].text;
      return sParagraph;
    });  
  };

WikiaHelper.prototype.getSearchList = function(sSubject) {
  return this.wikia.getSearchList({query:sSubject}).then(
    function(oResponse) {
      console.log('success - Search List received info for ' + sSubject);
      return oResponse;
    }
  );
};

WikiaHelper.prototype.getLucky = function(sSubject) {
  return this.wikia.getSearchList({query:sSubject}).then(
    function(oResponse) {
      console.log('success - getLucky received info for ' + sSubject);
      if(oResponse.total>0){
        return (oResponse.items[0].id);
      }
      return false;
    }
  );
};

WikiaHelper.prototype.getList = function(sSubject) {
  return this.wikia.getArticlesList({category:sSubject}).then(
    function(oResponse) {
      console.log('success - getList received info for ' + sSubject);
      if(oResponse.items.length>0){
        var sParagraph = oResponse.items.map(function(oItem){
          return oItem.title;
        }).slice(0, 100).join(", ");
        return (sParagraph);
      }
      return false;
    }
  );
};

WikiaHelper.prototype.getWords = function() {
  //return this.wikia.getArticlesPopular({limit:10}).then(
  return this.wikia.getArticlesMostViewed({limit:250}).then(
    function(oResponse) {
      if(oResponse.items.length>0){
        var sParagraph = oResponse.items.map(function(oItem){
          var TitleParts =  oItem.title.split("/");
          return TitleParts[0].trim();
        })
        .filter(function(item, i, ar){ return ar.indexOf(item) === i; })
        .sort().join("\n");
        return (sParagraph);
      }
      return false;
    }
  );
};

module.exports = WikiaHelper;
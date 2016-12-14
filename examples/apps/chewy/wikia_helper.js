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


module.exports = WikiaHelper;

/*'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var ENDPOINT = 'http://services.faa.gov/airport/status/';

function FAADataHelper() {
}

FAADataHelper.prototype.requestAirportStatus = function(airportCode) {
  return this.getAirportStatus(airportCode).then(
    function(response) {
      console.log('success - received airport info for ' + airportCode);
      return response.body;
    }
  );
};

FAADataHelper.prototype.getAirportStatus = function(airportCode) {
  var options = {
    method: 'GET',
    uri: ENDPOINT + airportCode,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
};

FAADataHelper.prototype.formatAirportStatus = function(airportStatus) {
  var weather = _.template('The current weather conditions are ${weather}, ${temp} and wind ${wind}.')({
    weather: airportStatus.weather.weather,
    temp: airportStatus.weather.temp,
    wind: airportStatus.weather.wind
  });
  if (airportStatus.delay === 'true') {
    var template = _.template('There is currently a delay for ${airport}. ' +
      'The average delay time is ${delay_time}. ' +
      'Delay is because of the following: ${delay_reason}. ${weather}');
    return template({
      airport: airportStatus.name,
      delay_time: airportStatus.status.avgDelay,
      delay_reason: airportStatus.status.reason,
      weather: weather
    });
  } else {
    //no delay
    return _.template('There is currently no delay at ${airport}. ${weather}')({
      airport: airportStatus.name,
      weather: weather
    });
  }
};

module.exports = FAADataHelper;
*/
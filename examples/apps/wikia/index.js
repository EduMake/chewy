'use strict';
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('wikia');
var WikiaHelper = require('../../../node_modules/alexa-wikia-app-server/wikia_helper');

//Which Wikia are you using????
var sWikiaName = 'starwars';

//What Name are you are going to use for the Skill in the Skill store
var sSkillName = "Star Wars Fandom";

// What wikia Catergories to use to build the word lists for the speech model
var oListWikiaCatergories = {
  "LIST_OF_WHO"   : "Named_creatures,Males,Females",
  "LIST_OF_WHAT"  : "Governments,Political_institutions,Military_units,Force-based_organizations,Organizations,Starfighters,Vehicles,Planets,Stars,Weapons",
  "LIST_OF_LISTS" : "Individuals_by_occupation,Individuals_by_species,Starships_by_type"
};

// What Alexa will say in certain situations
var Phrases = {
  "Launch"    :'What tell you about the war in the stars I can?',
  "Help"      :'We can answer questions about Star Wars. Ask "who was", or "what is", or to "list" a catergory of things. What tell you about the war in the stars I can?',
  "Stop"      :'May the Force be with you.',
  "Error"     :"Uh, we had a slight weapons malfunction, but uh... everything's perfectly all right now. I suggest you try it again Luke.",
  "NotHeard"  :'What is it?  I suggest you try it again Luke.',
  "NotFound"  :'We could not find the droid you are looking for? I suggest you try it again Luke.',
  "NoList"    :'Your sad devotion to that ancient religion has not helped you conjure up the stolen data tapes. I suggest you try it again Luke.',
  "Reprompt"  :'I suggest you try it again Luke.',
  "TakingTooLong":'Ahsoka! Come on, hurry!'
};


var sLicence = 'This article is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported license. It uses material from the http://'+sWikiaName+'.wikia.com/wiki/'

app.getHelper = function(){
  return new WikiaHelper(sWikiaName, oListWikiaCatergories);
};

app.messages.GENERIC_ERROR = Phrases.Error;
app.error = function(exception, request, response) {
  response.say(Phrases.Error);
};

app.launch(function(req, res) {
  res.say(Phrases.Launch).reprompt(Phrases.TakingTooLong).shouldEndSession(false).send();
});

app.intent("AMAZON.HelpIntent",
  function(req, res) {
    res.say(Phrases.Help).reprompt(Phrases.TakingTooLong).shouldEndSession(false).send();
  }
);

app.intent("AMAZON.StopIntent",
  function(req, res) {
    res.say(Phrases.Stop);
});

app.intent("AMAZON.CancelIntent",
  function(req, res) {
    res.say(Phrases.Stop);
});

app.fetchArticle =   function(sSlot, req, res) {
  var sSubject = "";
  try {
    sSubject = req.slot(sSlot)
  } catch(err) {
    console.log("err", err);
    res.say(Phrases.NotHeard).reprompt(Phrases.Reprompt).shouldEndSession(false);
    return true;
  }
   
  if (_.isEmpty(sSubject)) {
    res.say(Phrases.NotHeard).reprompt(Phrases.Reprompt).shouldEndSession(false);
    return true;
  } 
  
  console.log(sSlot, sSubject);
  var oWikiaHelper = this.getHelper();
  
  oWikiaHelper.getLucky(sSubject).then(function(iID) {
    if(iID !== false){
      console.log("iID", iID);
      oWikiaHelper.getArticle(iID).then(function(aData) {
        if(aData.length > 0 ){
          var sTitle = sSubject;
          //https://www.npmjs.com/package/alexa-app#card-examples
          res.card({
            "type": "Simple",
            "title": sSkillName + " - "+sTitle,
            "content": aData.join("\n")+'\n'+sLicence+sTitle
          }).say(aData.join(" ")).send();
          return aData.join(" ");
        } else {
          res.say(Phrases.NotFound).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
        }
      }).catch(function(err) {
        console.log("err", err);
        if(err.exception.type == "NotFoundApiException"){
          res.say(Phrases.NotFound).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
        } else {
          res.say(Phrases.Error).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
        }
      });
    }
  }).catch(function(err) {
    console.log("err",err.statusCode);
    res.say(Phrases.Error).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
  });
  return false;
};

app.intent('wikia_who', 
  {
    'slots': {
      'WHO': 'LIST_OF_WHO'
    },
    'utterances': ['{who was|who is} {-|WHO}']
  },
  function(req, res) {
    return app.fetchArticle("WHO", req, res);
  }
);

app.intent('wikia_what', 
  {
    'slots': {
      'WHAT': 'LIST_OF_WHAT'
    },
    'utterances': ['{what was|what is} {|a|the} {-|WHAT}']
  },
  function(req, res) {
    return app.fetchArticle("WHAT", req, res);
  }
);
    
app.intent('wikia_subject', 
  {
    'slots': {
      'SUBJECT': 'LIST_OF_PAGES'
    },
    'utterances': ['{|tell me|describe} {|a|the} {-|SUBJECT}']
  },
  function(req, res) {
    return app.fetchArticle("SUBJECT", req, res);
  }
);

app.intent('wikia_list', {
  'slots': {
    'WIKIALIST': 'LIST_OF_LISTS'
  },
  'utterances': ['{list|find|search} {|all} {|of} {|the} {-|WIKIALIST}']
},
  function(req, res) {
    var sSubject = "";
    try {
      sSubject = req.slot('WIKIALIST');
    } catch(err) {
      console.log("err", err);
      res.say(Phrases.NotHeard).reprompt(Phrases.Reprompt).shouldEndSession(false);
      return true;
    }
    
    if (_.isEmpty(sSubject)) {
      res.say(Phrases.NotHeard).reprompt(Phrases.Reprompt).shouldEndSession(false);
      return true;
    } 
    
    var oWikiaHelper = app.getHelper();
    oWikiaHelper.getList(sSubject).then(function(aData) {
      //console.log("aData", aData);
      if(aData.length > 0){
        var sParagraph = aData.join(", ");
        console.log("sParagraph", sParagraph);
        res.say(sParagraph).send();
        return sParagraph;
      } else {
        res.say(Phrases.NoList).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
      }
    }).catch(function(err) {
      console.log("err in getList",err);
      if(err.exception.type == "NotFoundApiException"){
        console.log("NoList");
        res.say(Phrases.NoList).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
      } else {
        console.log("Error");
        res.say(Phrases.Error).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
      }
    });
    return false;
  }
);

module.exports = app;
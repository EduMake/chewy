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
  "LIST_OF_WHO" :   "Named_creatures,Males,Females",
  "LIST_OF_WHAT" :  "Governments,Political_institutions,Military_units,Force-based_organizations,Organizations,Starfighters,Vehicles,Planets,Stars,Weapons",
  "LIST_OF_LISTS" : "Individuals_by_occupation,Individuals_by_species,Starships_by_type"
};

// What Alexa will say in certain situations
var Phrases = {
  "Launch"    :'What tell you about the war in the stars I can?',
  "Help"      :'We can answer questions about Star Wars. Ask "who was", or "what is", or to "list" a catergory of things.',
  "Stop"      :'May the Force be with you.',
  "Error"     :"Uh, we had a slight weapons malfunction, but uh... everything's perfectly all right now.",
  
  "Reprompt"  :'We could not find the droid you are looking for?',
  //"Prompt"  :'I didn\'t understand that. Please do again there is no try.',
  "Prompt"    :'Please do again, there is no try.',
  "ListPrompt":'We didn\'t find that. Tell me what I can list for you.',
  //It’s not my fault... But something went wrong. Please do again there is no try. ",
  
};

app.getHelper = function(){
  return new WikiaHelper(sWikiaName, oListWikiaCatergories);
};

app.error = function(exception, request, response) {
    response.say(Phrases.Error);
};

app.launch(function(req, res) {
  res.say(Phrases.Launch).reprompt(Phrases.Launch).shouldEndSession(false);
});

app.intent("AMAZON.HelpIntent",{
//      'utterances': ['help', "what can you do"]
},
  function(req, res) {
      res.say(Phrases.Help).shouldEndSession(false).send();
      return false;
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

app.fetchArticle =   function(sSubject, req, res) {
    var oWikiaHelper = this.getHelper();
    
    oWikiaHelper.getLucky(sSubject).then(function(iID) {
      if(iID !== false){
        console.log("iID", iID);
        oWikiaHelper.getArticle(iID).then(function(aData) {
          //console.log("getLucky aData",  aData)
          var sTitle = sSubject;
          //https://www.npmjs.com/package/alexa-app#card-examples
          res.card({
            "type": "Simple",
            "title": sSkillName + " - "+sTitle,
            "content": aData.join("\n")+'\nThis article is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported license. It uses material from the http://'+sWikiaName+'.wikia.com/wiki/'+sTitle
          }).say(aData.join(" ")).send();
          return aData.join(" ");
        }).catch(function(err) {
          console.log("err", err.statusCode);
          res.say(Phrases.Error).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
        });
      }
    }).catch(function(err) {
      console.log("err",err.statusCode);
      res.say(Phrases.Prompt).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
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
    var sSubject = req.slot('WHO');
    console.log('WHO', sSubject);
    if (_.isEmpty(sSubject)) {
      res.say(Phrases.Prompt).reprompt(Phrases.Reprompt).shouldEndSession(false);
      return true;
    } else {
      return app.fetchArticle(sSubject, req, res);
    }
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
    var sSubject = req.slot('WHAT');
    console.log('WHAT', sSubject);
    if (_.isEmpty(sSubject)) {
      res.say(Phrases.Prompt).reprompt(Phrases.Reprompt).shouldEndSession(false);
      return true;
    } else {
      return app.fetchArticle(sSubject, req, res);
    }
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
    var sSubject = req.slot('SUBJECT');
    console.log('SUBJECT', sSubject);
    if (_.isEmpty(sSubject)) {
      res.say(Phrases.Prompt).reprompt(Phrases.Reprompt).shouldEndSession(false);
      return true;
    } else {
      return app.fetchArticle(sSubject, req, res);
    }
  }
);

app.intent('wikia_list', {
  'slots': {
    'WIKIALIST': 'LIST_OF_LISTS'
    //'WIKIALIST': 'LIST_OF_PAGES'
  },
  'utterances': ['{list|find|search} {|all} {|of} {|the} {-|WIKIALIST}']
},
  function(req, res) {
    var sSubject = req.slot('WIKIALIST');
    
    if (_.isEmpty(sSubject)) {
      res.say(Phrases.ListPrompt).reprompt(Phrases.Reprompt).shouldEndSession(false);
      return true;
    } else {
      var oWikiaHelper = app.getHelper();
      return oWikiaHelper.getList(sSubject).then(function(aData) {
        //console.log("aData", aData);
        if(aData.length > 0){
          var sParagraph = aData.join(", ");
          console.log("sParagraph", sParagraph);
          res.say(sParagraph).send();
          return sParagraph;
        } else {
          res.say(Phrases.ListPrompt).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
        }
      }).catch(function(err) {
        console.log("err in getList",err);
        if(err.exception.type == "NotFoundApiException"){
          res.say(Phrases.ListPrompt).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
        }
        
        res.say(Phrases.Error).shouldEndSession(false).send();
      });
      
    }
    return false;
  }
  
);


//hack to support custom utterances in utterance expansion string
//console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
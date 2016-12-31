'use strict';
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('wikia');
var WikiaHelper = require('./wikia_helper');

//Which Wikia are you using????
var sWikiaName = 'starwars';
var sSkillName = "Star Wars Fandom";
var oIntentions = {
  "who" :"Named_creatures,Males,Females",
  "what" : "Governments,Political_institutions,Military_units,Force-based_organizations,Organizations,Starfighters,Vehicles,Planets,Stars,Weapons",
  "lists" : "Individuals_by_occupation,Individuals_by_species"
};

var Phrases = {
  "Launch"    :'What tell you about the war in the stars I can?',
  "Reprompt"  :'We could not find the droid you are looking for?',
  //"Prompt"  :'I didn\'t understand that. Please do again there is no try.',
  "Prompt"    :'Please do again, there is no try.',
  "ListPrompt":'We didn\'t find that. Tell me what I can list for you.',
  "Error"     :"It’s not my fault. But something went wrong. Please do again there is no try. ",
  "Help"      :'We can answer questions about Star Wars. Ask "who was", or "what is", or to "list" a catergory of things.',
  "Stop"      :'May the Force be with you.'
};

app.getHelper = function(){
  return new WikiaHelper(sWikiaName, oIntentions);
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

app.intent("AMAZON.StopIntent",{
//      'utterances': ['stop']
},
  function(req, res) {
      res.say(Phrases.Stop).shouldEndSession(true).send();
      return false;
  }
);

app.intent("AMAZON.CancelIntent",{
//      'utterances': ['stop']
},
  function(req, res) {
      res.say(Phrases.Stop).shouldEndSession(true).send();
      return false;
  }
);

app.fetchArticle =   function(sSubject, req, res) {
    var oWikiaHelper = this.getHelper();
    
    oWikiaHelper.getLucky(sSubject).then(function(iID) {
      if(iID !== false){
        console.log("iID", iID);
        oWikiaHelper.getArticle(iID).then(function(aData) {
          //console.log("getLucky aData",  aData)
          var sTitle = sSubject;
          res.card({
            "type": "Simple",
            "title": sSkillName + " - "+sTitle,
            "content": aData.join("\n")+'\nThis article is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported license. It uses material from the http://starwars.wikia.com/wiki/'+sTitle
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
    //'WIKIALIST': 'LIST_OF_LISTS'
    'WIKIALIST': 'LIST_OF_PAGES'
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
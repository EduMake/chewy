'use strict';
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('wikia');
var WikiaHelper = require('./wikia_helper');

//Which Wikia are you using????
var sWikiaName = 'starwars';

var Phrases = {
  "Launch"  :'What tell you about the war in the stars I can?',
  "Reprompt":'What can chewie find for you?',
  "Prompt"  :'I didn\'t hear that. Tell me what I can list for you.',
  "Error"   :'I could not find the droid you are looking for.'
};

app.getHelper = function(){
  return new WikiaHelper(sWikiaName);
}

app.launch(function(req, res) {
  res.say(Phrases.Launch).reprompt(Phrases.Launch).shouldEndSession(false);
});
    
app.intent('wikia_subject', {
  'slots': {
    'SUBJECT': 'LIST_OF_PAGES'
  },
  'utterances': ['{|please|can you} {|tell me|tell|describe} {|who was|what was|where was|who is|what is|where is|about|a|the} {-|SUBJECT}']
},
  function(req, res) {
    var sSubject = req.slot('SUBJECT');
    if (_.isEmpty(sSubject)) {
      res.say(Phrases.Prompt).reprompt(Phrases.Reprompt).shouldEndSession(false);
      return true;
    } else {
      var oWikiaHelper = new WikiaHelper(sWikiaName);
      oWikiaHelper.getLucky(sSubject).then(function(iID) {
        if(iID !== false){
          oWikiaHelper.getArticle(iID).then(function(sParagraph) {
            var sTitle = sSubject;
            res.card({
              "type": "Simple",
              "title": "Chewy - "+sTitle,
              "content": sParagraph+'\nThis article is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported license. It uses material from the http://starwars.wikia.com/wiki/'+sTitle
            }).say(sParagraph).send();
            
            return sParagraph;
          }).catch(function(err) {
            console.log("err", err.statusCode);
            res.say(Phrases.Error).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
          });
        }
      }).catch(function(err) {
        console.log(err.statusCode);
        res.say(Phrases.Prompt).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);

app.intent('wikia_list', {
  'slots': {
    'SUBJECT': 'LIST_OF_PAGES'
  },
  'utterances': ['{list|find|search} {|all} {|of} {|the} {-|SUBJECT}']
},
  function(req, res) {
    var sSubject = req.slot('SUBJECT');
    if (_.isEmpty(sSubject)) {
      res.say(Phrase.Prompt).reprompt(Phrase.Reprompt).shouldEndSession(false);
      return true;
    } else {
      var oWikiaHelper = new WikiaHelper(sWikiaName);
      oWikiaHelper.getList(sSubject).then(function(sParagraph) {
        res.say(sParagraph).send();
        return sParagraph;
      }).catch(function(err) {
        console.log(err.statusCode);
        res.say(Phrases.Error).reprompt(Phrases.Reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);


//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
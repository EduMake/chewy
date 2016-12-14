'use strict';
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('chewy');
var WikiaHelper = require('./wikia_helper');

app.launch(function(req, res) {
  var prompt = 'What tell you about the war in the stars I can?';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});
    
app.intent('wikia_subject', {
  'slots': {
    'SUBJECT': 'LIST_OF_PAGES'
  },
  'utterances': ['{|please|can you} {|tell me|tell|describe} {|who was|what was|where was|who is|what is|where is|about|a|the} {-|SUBJECT}']
},
  function(req, res) {
    var sSubject = req.slot('SUBJECT');
    var reprompt = 'What can chewie find for you.';
    if (_.isEmpty(sSubject)) {
      var prompt = 'I didn\'t hear that. Tell me what I can find for you.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var oWikiaHelper = new WikiaHelper('starwars');
      oWikiaHelper.getLucky(sSubject).then(function(iID) {
        if(iID !== false){
          oWikiaHelper.getArticle(iID).then(function(sParagraph) {
            console.log("sParagraph", sParagraph);
            res.say(sParagraph).send();
            return sParagraph;
          }).catch(function(err) {
            console.log("err", err.statusCode);
            var prompt = 'I could not find the droid you are looking for.';
            res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
          });
        }
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I could not find the droid you are looking for.';
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
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
    var reprompt = 'What can chewie find for you.';
    if (_.isEmpty(sSubject)) {
      var prompt = 'I didn\'t hear that. Tell me what I can list for you.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var oWikiaHelper = new WikiaHelper('starwars');
      oWikiaHelper.getList(sSubject).then(function(sParagraph) {
        console.log("sParagraph", sParagraph);
        res.say(sParagraph).send();
        return sParagraph;
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I could not find the droids you are looking for.';
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);


//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
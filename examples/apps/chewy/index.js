'use strict';
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('chewy');
var WikiaHelper = require('./wikia_helper');

app.launch(function(req, res) {
  var prompt = 'What tell you about the war in the stars I can?';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

/*'describe {Page}',
    'describe a {Page}',
    'tell me about {Page}',
    'who is {Page}',
    'what is {Page}'
    */
    
app.intent('wikia_subject', {
  'slots': {
    'SUBJECT': 'LIST_OF_PAGES'
  },
  'utterances': ['{|tell me|tell|describe} {|who is|what is|where is|about|a|the} {-|SUBJECT}']
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
        //console.log(iID);
        if(iID !== false){
          oWikiaHelper.getArticle(iID).then(function(sParagraph) {
            console.log("sParagraph", sParagraph);
            res.say(sParagraph).send();
            return sParagraph;
          }).catch(function(err) {
            console.log("err", err.statusCode);
            var prompt = 'I could not find the droid you are looking for.';
            //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
            res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
          });
        }
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I could not find the droid you are looking for.';
        //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);

//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
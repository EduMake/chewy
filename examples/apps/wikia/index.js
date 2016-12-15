'use strict';
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('wikia');
var WikiaHelper = require('./wikia_helper');

//Which Wikia are you using????
var sWikiaName = 'starwars';

app.getHelper = function(){
  return new WikiaHelper(sWikiaName);
}

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
      var oWikiaHelper = new WikiaHelper(sWikiaName);
      oWikiaHelper.getLucky(sSubject).then(function(iID) {
        if(iID !== false){
          oWikiaHelper.getArticle(iID).then(function(sParagraph) {
            //var sParagraph = oArticle.sParagraph;
            //var sTitle = oArticle.sTitle;
            //console.log("sParagraph", sParagraph);
            res.card({
              "type": "Simple",
              "title": "Example of the Card Title",
              "content": sParagraph+'\nThis article is licensed under the <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported license</a>. It uses material from the <a href="http://starwars.wikia.com/wiki/Palpatine">Wookieepedia article "Palpatine."</a>'
            }).say(sParagraph).send();
            //todo add credits http://starwars.wikia.com/wiki/Wookieepedia:Copyrights#Users.27_rights_and_obligations_section
            
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
      var oWikiaHelper = new WikiaHelper(sWikiaName);
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
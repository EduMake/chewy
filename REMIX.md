# Remix me
![Chewy Logo](https://edumake.org/wp-content/uploads/2016/12/108C2.png)
## What You'll Need

*   An [Amazon Developer Account](https://developer.amazon.com)
*   A Fandom you care about. And the name of the [wikia subdomain](http://fandom.wikia.com/explore) that covers it (that is the word before .wikia.com).

![](https://cdn.hyperdev.com/681cc882-059d-4b05-a1f6-6cbc099cc79c%2FalexaBriefingSkill.png)

## Getting your webserver & Alexa skill up

*   #### 1\. Get your own gomix server running

    Start by [clicking here to remix this example project](https://gomix.com/#!/remix/chewy/a4c42aef-7c70-484b-ab24-8c344063a7c8). 

    You can change the project name in the top left of the editor.

*   #### 2\. Choose a Wikia

    Open 'examples/apps/wikia/index.js' and change line 8 to be the wikia subdomain you want answers from.
```javascript
var sWikiaName = 'your_fav_wikia';
```

*   #### 3\. Choose a skill name

    Open 'examples/apps/wikia/index.js' and change line 11 to be the name you will use in the "Amazon Alexa Skill" setup, it can be changed after you have tested it but it does need to match if you try to get Amazon to Appove your Skill for publication.
    
    Originally we chose a character from the films, 'Chewy', but there are Amazon rules if you want to publish the skill. You need to use at least 2 words if you don't own the trademark on the word and you need to indicate that the skill is not official by using a word like fandon, fan, or unofficial.
```javascript
var sSkillName = "My thing Fandom";
```

*   #### 4\. Find the Catergories of wikia article that fit the intentions.

    The Star Wars wikia doesn't have just one catergory that covers all the characters (for "Who was" type questions), things or lists, so we need to check what should be in all the lists listed around line 14
```javascript
var oListWikiaCatergories = {
  "LIST_OF_WHO" :"Named_creatures,Males,Females",
```

*   #### 5\. Make Alexa ask your questions the way you want

    On line 21 change the phrases so it makes sense for your fandom.
```javascript
var Phrases = {
  "Launch"    :'What tell you about the war in the stars I can?',
```

*   #### 5\. Test your server

    You can check all your logic and data links are working and giving sensible answers by clicking "Show Live" and then "Test the Alexa Wikia Skill using a web form").
    * Select "Type" "LaunchRequest" and click "Send" to see your server's response to you saying "Alexa open Chewy".
    * Select "Type" "IntentRequest" and "Intent" "wikia_subject". 
    * This opens a box labelled "SUBJECT".
    * Enter "Yoda" and click "Send" to see the result of saying "Alexa ask Chewy who was Yoda?"

## Set Up Your Alexa App

So what we need to do here is make Alexa aware of your app, and make it accessible to it. So go to [Amazon's developer site](https://developer.amazon.com/edw/home.html#/skills/list) (and create an account if you don't have one). Then under the 'Alexa' section, select 'Alexa Skills Kit' and from there click on 'Add a new Skill'.

*   #### 1\. Skill Information

    Select the 'Custom Interaction Model' option for 'Skill Type'. Give your app a name, probably what you put in "Choose a skill name" and choose an invocation name - this is the name you say to Alexa to activate your skill, so 'Alexa ask Chewy' or Alexa ask Star Wars Fandom…' etc.
    
*   #### 2\. Interaction Model

    You want to specify your Intent Schema and Sample Utterances. Thankfully, this is made easy by alexa-app - there are URLs for the detail already. 
    
    On the test page (clicking "Show Live" and then "Test the Alexa Wikia Skill using a web form"). There are links which gives data to copy into the config. Especially at the bottom where they print out the popular pages on your wikia and copy those into slots. 
    
    * Start with the "Custom Slot Types"
      * Click 'Add Slot Type' 
      * In 'Enter Type' put 'LIST_OF_PAGES' , in 'Enter Values', copy and paste all of the values from the `LIST_OF_PAGES` link in your test page.
    * For Intent Schema copy and paste the output given at the Shecma link '[/wikia?schema](https://chewy.gomix.me/wikia?schema)'. 
    * Do the same for '[/wikia?utterances](https://chewy.gomix.me/wikia?utterances)', pasting that output into 'Sample Utterances.' 
    
    ![Screen Shot 2016-08-23 at 21.31.07](https://hyperdev.wpengine.com/wp-content/uploads/2016/08/Screen-Shot-2016-08-23-at-21.31.07-1024x339.png)


*   #### 3\. Configuration

    Under Endpoint, select 'HTTPS' and add your project's "publish" URL with '/wikia' added on the end. This is the URL you get when clicking 'Show', and it'll have the format 'https://project-name.gomix.me'. So for our example app, it's 'https://chewy.gomix.me/wikia'. Select 'no' for account linking.
    
*   #### 4\. SSL Certificate

    Select the option 'My development endpoint is a subdomain of a domain that has a wildcard certificate from a certificate authority' as we sort this for you.
    
*   #### 5-7\. Test, Publishing Information and Privacy

    Make sure your skill has testing enabled under 'Test' and enter metadata about your app under 'Publishing Information'. For now, you can just enter basic info and come back and change it later when you're ready to properly publish your app. Say 'No' to the privacy questions and check your agreement to their terms. Then you can click 'Save' and your app should be ready to test (you don't want to submit it for certification at this stage - that's just for when your app is ready to go).

### Testing Your Alexa App

To get the real impression of using an Amazon Echo, you can use [Echosim](https://echosim.io/). If you log in with your Amazon developer account, it'll automatically know about your app. So you can go ahead and click and hold the mic button and give Alexa a test command. Say 'Ask Chewy about the Force'. Alexa should respond with the info. In your project, with the logs open, you can see the request coming in, the response being generated and sent back.

## Getting Help

For more detailed setup instructions and an explaination of how it works, see `SETUP.md`.

You can see other example projects on Gomix's [Community Projects](https://gomix.com/community/) page. And if you get stuck, let them know on the [forum](http://support.gomix.com/) and they can help you out.

## EduMake
This App is here to show you how easy it is to make your own digital solutions. It is part of [EduMake](https://edumake.org/)'s mission to help everyone learn how to make their own gadgets.


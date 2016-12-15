# Remix me
## What You'll Need

*   An [Amazon Developer Account](https://developer.amazon.com)
*   A Fandom you care about. And the name of the [wikia subdomain](http://fandom.wikia.com/explore) that covers it (that is the word before .wikia.com).

![](https://cdn.hyperdev.com/681cc882-059d-4b05-a1f6-6cbc099cc79c%2FalexaBriefingSkill.png)

## Getting your webserver & Alexa skill up

*   #### 1\. Get your own gomix server running
Start by [remixing this example project](https://gomix.com/#!/remix/chewy/681cc882-059d-4b05-a1f6-6cbc099cc79c). 

You can change the project name in the top left of the editor.

*   #### 2\. Choose a Wikia
Open 'examples/apps/wikia/index.js' and change line 8 to be the wikia subdomain you want answers from.
```javascript
var sWikiaName = 'your_fav_wikia';
```

*   #### 3\. Make a list of popular pages on your chosen wikia to help the voice recognition out.
Visit [https://yourprojectname.gomix.me/wikia?words](https://yourprojectname.gomix.me/wikia?words) this will print out the popular pages on your wikia and copy those into LIST_OF_PAGES.txt

*   #### 4\. Make Alexa ask your questions the way you want
In 'examples/apps/wikia/index.js' use CTRL+f and find the word 'prompt' (and 'reprompt') to find all the places we set the text for a question and change it so it makes sense for your fandom ).

```javascript
var prompt = 'I didn\'t hear that. Tell me what I can find for you.';
```

*   #### 5\. Test your server

You can check all your logic and data links are working and giving sensible answers by visiting [/wikia](https://chewy.gomix.me/wikia).

* Select "Type" "LaunchRequest" and click "Send" to see your server's response to you saying "Alexa open Chewy".
* Select "Type" "IntentRequest" and "Intent" "wikia_subject". 
* This opens a box labelled "SUBJECT".
* Enter "Yoda" and click "Send" to see the result of saying "Alexa ask Chewy who was Yoda?"

## Set Up Your Alexa App

So what we need to do here is make Alexa aware of your app, and make it accessible to it. So go to [Amazon's developer site](https://developer.amazon.com/edw/home.html#/skills/list) (and create an account if you don't have one). Then under the 'Alexa' section, select 'Alexa Skills Kit' and from there click on 'Add a new Skill'.

*   #### 1\. Skill Information

    Select the 'Custom Interaction Model' option for 'Skill Type'. Give your app a name (we chose a character from the films ; 'Chewy') and choose an invocation name - this is the name you say to Alexa to activate your skill, so 'Alexa ask Chewy…'.
    
*   #### 2\. Interaction Model

    You want to specify your Intent Schema and Sample Utterances. Thankfully, this is made easy by alexa-app - there are URLs for the detail already. 
    * For Intent Schema copy and paste the output given at '[/wikia?schema](https://chewy.gomix.me/wikia?schema)'. 
    * Do the same for '[/wikia?utterances](https://chewy.gomix.me/wikia?utterances)', pasting that output into 'Sample Utterances.' 
    * Lastly, select 'Add Slot Type' and enter 'LIST_OF_PAGES' under 'Enter Type'. 
    * Under 'Enter Values', copy and paste all of the values from the `LIST_OF_PAGES.txt` file in your project.
    
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

You can see other example projects on Gomix's [Community Projects](https://gomix.com/community/) page. And if you get stuck, let them know on the [forum](http://support.gomix.com/) and they can help you out.

## EduMake
This App is here to show you how easy it is to make your own digital solutions. It is part of [EduMake](https://edumake.org/)'s mission to help everyone learn how to make their own gadgets.


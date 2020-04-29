'use strict';
const Alexa = require('ask-sdk');
const Util = require('./util');

/***********
Data: Customize the data below as you please.
***********/


const SKILL_NAME = "Personality Quiz";
const HELP_MESSAGE_BEFORE_START = "Answer five questions, and I will tell you what sonic character you are. Are you ready to play?";
const HELP_MESSAGE_AFTER_START = "Just respond with yes or no and I'll give you the result in the end.";
const HELP_REPROMPT = "Your character will be revealed after you answer all my yes or no questions.";
const STOP_MESSAGE = "Your sonic character will be waiting for you next time.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Please answer with either yes or no.";



const BACKGROUND_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/default.jpg";
// const BACKGROUND_IMAGE_URL =  "default.jpg";
const BACKGROUND_GOODBYE_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/goodbye.jpg";
// const BACKGROUND_GOODBYE_IMAGE_URL = "goodbye.jpg";
const BACKGROUND_HELP_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/help.jpg";
// const BACKGROUND_HELP_IMAGE_URL = "help.jpg";

const WELCOME_MESSAGE = "Hi! I can tell you what sonic character you're most like. All you have to do is answer five questions with either yes or no. Are you ready to start?";
const INITIAL_QUESTION_INTROS = [
  "Great! Let's start!",
  "<say-as interpret-as='interjection'>Alrighty</say-as>! Here comes your first question!",
  "Ok lets go. <say-as interpret-as='interjection'>Ahem</say-as>.",
  "<say-as interpret-as='interjection'>well well</say-as>."
];
const QUESTION_INTROS = [
  "Oh dear.",
  "Okey Dokey",
  "You go, human!",
  "Sure thing.",
  "I would have said that too.",
  "Of course.",
  "I knew it.",
  "Totally agree.",
  "So true.",
  "I agree."
];
const UNDECISIVE_RESPONSES = [
  "<say-as interpret-as='interjection'>Honk</say-as>. I'll just choose for you.",
  "<say-as interpret-as='interjection'>Nanu Nanu</say-as>. I picked an answer for you.",
  "<say-as interpret-as='interjection'>Uh oh</say-as>... well nothing I can do about that.",
  "<say-as interpret-as='interjection'>Aha</say-as>. We will just move on then.",
  "<say-as interpret-as='interjection'>Aw man</say-as>. How about this question?",
];
const RESULT_MESSAGE = "Here comes the big reveal! You are "; // the name of the result is inserted here.
const RESULT_MESSAGE_SHORT = "You are "; // the name of the result is inserted here.
const PLAY_AGAIN_REQUEST = "That was it. Do you want to play again?";

const resultList = {
  result1: {
    name: "amy rose",
    display_name: "Amy Rose",
    audio_message: "cheerful, with a positive attitude and boundless energy.",
    description: "Amy Rose sometimes referred to by her nickname Rosy.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Red-knobbed.starfish.1200.jpg"
      largeImageUrl: "amyrose.jpg"
    }
  },
  result2: {
    name: "Knuckles the echidna",
    display_name: "Knuckles",
    audio_message: "usually likes to be by yourself, but can be relied upon to help out whenever the world is in danger.",
    description: "Knuckles is a 16-year-old red anthropomorphic echidna.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Aceria_anthocoptes.1200.jpg"
      largeImageUrl: "knuckles.jpg"
    }
  },
  result3: {
    name: "a shadow",
    display_name: "Shadow",
    audio_message: "Your striking appearance is the talk of every party. You are always the most colorfully dressed one around. You're also one smart cookie - you were using tools to make your tasks easier before it was cool.",
    description: "Shadow is a lone wolf who distances himself from Sonic and his friends.",
    img: {
     // largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Anodorhynchus_hyacinthinus.1200.jpg",
      largeImageUrl: "shadow.jpg"
    }
  },
  result4: {
    name: "a sonic",
    display_name: "Sonic the Hedgehog",
    audio_message: "Wow! You are the fastest.",
    description: "Sonic is a blue anthropomorphic hedgehog who can run at supersonic speeds and curl into a ball, primarily to attack enemies.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Male_goat.1200.jpg"
      largeImageUrl: "sonic the hedgehog.jpg"
    }
  },
  result5: {
    name: "sticks",
    display_name: "Sticks the badger",
    audio_message: "You dig relaxing and hanging around in the sunshine.",
    description: "She is a wacky anthropomorphic jungle badger who is a force of nature in every way, and considers Amy Rose to be her best friend.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Bufo_boreas.1200.jpg"
      largeImageUrl: "sticks the badger.jpg"
    }
  }
};

const questions = [{
    question: "Do you enjoy running very fast all the time?",
    questionDisplay: "Do you enjoy running very fast?",
    background:  "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q1.jpg", 
    //background: "question1.jpg",
    points: {
      result1: 4,
      result2: 0,
      result3: 5,
      result4: 3,
      result5: 1
    }
  },
  {
    question: "Do you enjoy flying in the sky?",
    questionDisplay: "Do you enjoy flying?",
    background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q2.jpg", 
    //background: "question2.jpg",
    points: {
      result1: 4,
      result2: 1,
      result3: 2,
      result4: 3,
      result5: 5
    }
  },
  {
    question: "Do you enjoy being a machinist?",
    questionDisplay: "Do you enjoy fixing machines?",
    background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q3.jpg", 
    //background: "question3.jpg",
    points: {
      result1: 0,
      result2: 5,
      result3: 1,
      result4: 3,
      result5: 4
    }
  },
  {
    question: "Do you like doing sports?",
    questionDisplay: "Do you like doing sports?",
    background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q4.jpg", 
    //background: "question4.jpg",
    points: {
      result1: 2,
      result2: 3,
      result3: 4,
      result4: 4,
      result5: 5
    }
  },
  {
    question: "Do you prefer using gadgets or pretend having gadgets?",
    questionDisplay: "Do you prefer using gadgets or pretend having gadgets?",
    background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q5.jpg", 
    //background: "question5.jpg",
    points: {
      result1: 0,
      result2: 5,
      result3: 3,
      result4: 4,
      result5: 5
    }
  }
];

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)



const newSessionHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlayingOrGettingResult = false;
    if (sessionAttributes.state) {
       isCurrentlyPlayingOrGettingResult = true;
    }


    return handlerInput.requestEnvelope.request.type === `LaunchRequest` || (!isCurrentlyPlayingOrGettingResult && request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.YesIntent' || request.intent.name === 'AMAZON.NoIntent'));
  },
  handle(handlerInput) {

    console.log('--------------------------------------- New session')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    if (handlerInput.requestEnvelope.request.type === `LaunchRequest`) {
      _initializeApp(sessionAttributes);
      return buildResponse(handlerInput, WELCOME_MESSAGE, WELCOME_MESSAGE, SKILL_NAME);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent') {

      sessionAttributes.state = states.QUIZMODE;

      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent') {
      console.log('--------------------------------------- Exit session')
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      sessionAttributes.state = '';
      return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'UndecisiveIntent') {
      const outputSpeech = MISUNDERSTOOD_INSTRUCTIONS_ANSWER;
      return buildResponse(handlerInput, outputSpeech, outputSpeech, SKILL_NAME, BACKGROUND_IMAGE_URL,"");
    }
  },
};

const nextQuestionIntent = (handlerInput, prependMessage) => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  sessionAttributes.questionProgress++;
  var currentQuestion = questions[sessionAttributes.questionProgress].question;
  return {
    prompt: `${prependMessage} ${_randomQuestionIntro(sessionAttributes)} ${currentQuestion}`,
    reprompt: HELP_MESSAGE_AFTER_START,
    displayText: questions[sessionAttributes.questionProgress].questionDisplay,
    background: questions[sessionAttributes.questionProgress].background
  };
}

const resultIntent = (handlerInput, prependMessage) => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  const resultPoints = sessionAttributes.resultPoints;
  const result = Object.keys(resultPoints).reduce((o, i) => resultPoints[o] > resultPoints[i] ? o : i);
  const resultMessage = `${prependMessage} ${RESULT_MESSAGE} ${resultList[result].name}. ${resultList[result].audio_message}. ${PLAY_AGAIN_REQUEST}`;
  return {
    prompt: resultMessage,
    reprompt: PLAY_AGAIN_REQUEST,
    displayText: `${RESULT_MESSAGE_SHORT} ${resultList[result].name}`,
    background: resultList[result].img.largeImageUrl
  }

  // this.emit(':askWithCard', resultMessage, PLAY_AGAIN_REQUEST, resultList[result].display_name, resultList[result].description, resultList[result].img);
  //                        ^speechOutput  ^repromptSpeech     ^cardTitle                       ^cardContent                    ^imageObj
}


const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _randomOfArray = (array) => array[_randomIndexOfArray(array)];
const _adder = (a, b) => a + b;
const _subtracter = (a, b) => a - b;

// Handle user input and intents:

const states = {
  QUIZMODE: "_QUIZMODE",
  RESULTMODE: "_RESULTMODE"
}



const quizModeHandler = {
  canHandle(handlerInput) {

    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlaying = false;
    if (sessionAttributes.state && sessionAttributes.state === states.QUIZMODE) {
      isCurrentlyPlaying = true;
    }

    return isCurrentlyPlaying;
  },
  handle(handlerInput) {
    console.log('---------------------------------------Quiz Mode')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var prependMessage = '';
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NextIntent') {
      const systemSpeak = nextQuestionIntent(handlerInput, prependMessage);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent') {
      _applyresultPoints(sessionAttributes, _adder);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent') {
      _applyresultPoints(sessionAttributes, _subtracter);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'UndecisiveIntent') {
      Math.round(Math.random()) ? _applyresultPoints(sessionAttributes, _adder) : _applyresultPoints(sessionAttributes, _subtracter);
      const systemSpeak = _nextQuestionOrResult(handlerInput, _randomOfArray(UNDECISIVE_RESPONSES));
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.RepeatIntent') {
      var currentQuestion = questions[sessionAttributes.questionProgress].question;
      return buildResponse(handlerInput, currentQuestion, HELP_MESSAGE_AFTER_START, SKILL_NAME, BACKGROUND_HELP_IMAGE_URL);
    }
  
  },
};

const resultModeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlaying = false;
    if (sessionAttributes.state &&
      sessionAttributes.state === states.QUIZMODE) {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying && request.type === 'IntentRequest' && sessionAttributes.state === states.RESULTMODE;
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Result mode')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    
    if (request.intent.name === 'AMAZON.YesIntent') {
      _initializeApp(sessionAttributes);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background, systemSpeak.displayText);
    }
    if (request.intent.name === 'AMAZON.NoIntent') {
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      sessionAttributes.state = '';
      return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    
    }
    


  },
};


const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Exit session')
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.state = '';
    return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    //------------------------------------------------
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Help')
    const attributesManager = handlerInput.attributesManager;
    var speechOutput = '';
    const sessionAttributes = attributesManager.getSessionAttributes();
    if (sessionAttributes.state === states.QUIZMODE) {
       speechOutput = HELP_MESSAGE_AFTER_START;
    } else {
       speechOutput = HELP_MESSAGE_BEFORE_START;
    }
    const reprompt = HELP_REPROMPT;
    return buildResponse(handlerInput, speechOutput, reprompt, SKILL_NAME, BACKGROUND_HELP_IMAGE_URL);
  },
};
const UnhandledHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    console.log('---------------------------------------Unhandled')
    const outputSpeech = MISUNDERSTOOD_INSTRUCTIONS_ANSWER;
    return buildResponse(handlerInput, outputSpeech, outputSpeech, SKILL_NAME);
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

// Skill brain

const _initializeApp = handler => {
  // Set the progress to -1 one in the beginning
  handler.questionProgress = -1;
  // Assign 0 points to each animal
  var initialPoints = {};
  Object.keys(resultList).forEach(result => initialPoints[result] = 0);
  handler.resultPoints = initialPoints;
};

const _nextQuestionOrResult = (handlerInput, prependMessage = '') => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  if (sessionAttributes.questionProgress >= (questions.length - 1)) {

    sessionAttributes.state = states.RESULTMODE;
    return resultIntent(handlerInput, prependMessage)


  } else {
    return nextQuestionIntent(handlerInput, prependMessage);
  }
};

const _applyresultPoints = (handler, calculate) => {
  const currentPoints = handler.resultPoints;
  const pointsToAdd = questions[handler.questionProgress].points;

  handler.resultPoints = Object.keys(currentPoints).reduce((newPoints, result) => {
    newPoints[result] = calculate(currentPoints[result], pointsToAdd[result]);
    return newPoints;
  }, currentPoints);
};

const _randomQuestionIntro = handler => {
  if (handler.questionProgress === 0) {
    // return random initial question intro if it's the first question:
    return _randomOfArray(INITIAL_QUESTION_INTROS);
  } else {
    // Assign all question intros to remainingQuestionIntros on the first execution:
    var remainingQuestionIntros = remainingQuestionIntros || QUESTION_INTROS;
    // randomQuestion will return 0 if the remainingQuestionIntros are empty:
    let randomQuestion = remainingQuestionIntros.splice(_randomIndexOfArray(remainingQuestionIntros), 1);
    // Remove random Question from rameining question intros and return the removed question. If the remainingQuestions are empty return the first question:
    return randomQuestion ? randomQuestion : QUESTION_INTROS[0];
  }
};

// Utilities


let buildResponse = (handlerInput, prompt, reprompt, title = SKILL_NAME, image_url = BACKGROUND_IMAGE_URL,  displayText = SKILL_NAME, display_type = "BodyTemplate7" ) => {
  console.log(title);
  if (reprompt) {
    handlerInput.responseBuilder.reprompt(reprompt);
  } else {
    handlerInput.responseBuilder.withShouldEndSession(true);
  }
  var response;
  if (supportsDisplay(handlerInput)) {
    response = getDisplay(handlerInput.responseBuilder, title,  displayText, image_url, display_type)	
  }
  else{
    response = handlerInput.responseBuilder
  }
  return response
  .speak(prompt)
  .getResponse();
}
function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
  return hasDisplay;
}


function getDisplay(response, title, displayText, image_url, display_type){
	if (!image_url.includes('https://')) {
		image_url=Util.getS3PreSignedUrl("Media/"+image_url);
	}
	const image = new Alexa.ImageHelper().addImageInstance(image_url).getImage();

	console.log("the display type is => " + display_type);
    console.log(image_url);

	const myTextContent = new Alexa.RichTextContentHelper()
	.withPrimaryText(title+"<br/>")
	.withSecondaryText(displayText)
	.withTertiaryText("<br/> ")
	.getTextContent();
	
	if (display_type === "BodyTemplate7"){
		//use background image
		response.addRenderTemplateDirective({
			type: display_type,
			backButton: 'visible',
			backgroundImage: image,
			title:displayText,
			textContent: myTextContent,
			});	
	}
	else{
		response.addRenderTemplateDirective({
			//use 340x340 image on the right with text on the left.
			type: display_type,
			backButton: 'visible',
			image: image,
			title:displayText,
			textContent: myTextContent,
			});	
	}
	
	return response
}

// Init

  const skillBuilder = Alexa.SkillBuilders.custom();
  exports.handler = skillBuilder
    .addRequestHandlers(
      SessionEndedRequestHandler, HelpIntentHandler, ExitHandler, newSessionHandler, quizModeHandler, resultModeHandler, UnhandledHandler
    )
    //.addErrorHandlers(ErrorHandler)
    .lambda();
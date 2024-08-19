import React, { useState } from 'react';
import './App.css';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

function ChatHistory({ history }) {
  //Map over the history array to return JSX elements
  // console.log(JSON.parse(JSON.stringify(history)))
  const messageElements = history.map((message, index) => {
    // console.log(JSON.parse(JSON.stringify(message)))
    // const messageParsedForLineBreaks = message.value.includes("\n")  ? message.value.split('\n') : [message.value]
    return message.value.split('\n').map((line, lineIndex) => {
      if (message.model) {
        return (<p key={`${index}-${lineIndex}`} style={{textAlign:'left'}}>Rug merchent: {line}</p>)
      } else {
        return (<h3 key={`${index}-${lineIndex}`}>You: {line}</h3>)
      }
      // <p key={`${index}-${lineIndex}`} style={message.model ? { textAlign: 'left' } : {}}>{line}</p>
  });
});

  return (
    <div style={{ width: "600px", margin:"0 auto"}}>
      {/* <h3>History:</h3> */}
      {messageElements}
      {/* <p>Length: {history.length}</p> */}
    </div>
  );
}

function PromptInputBox({ onSend, setLastItem }) {
  const [inputValue, setInputValue] = useState('');
  var onSendWithExtras = async (newMessage) => {
    onSend({ model: false, value: newMessage })
    setInputValue('');

    //For static send
    // sendMessage(newMessage).then((result) => onSend({ model: true, value: result}), (error) => console.error("Error: " + error))
    
    // //For live send
    onSend({ model: true, value: "Model: "})
    sendMessageWithLiveResponse(newMessage, setLastItem)
  }

  return (
    <div>
      <textarea
        className="resizable-textarea"
        placeholder="Type here... &#13;Press enter to submit or the button below.&#13;Hold shift and press enter for a newline"
        value={inputValue}
        //Update varable for easy access
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: '400px', height: '120px' }}
        //When enter is pressed send message. If shift and enter is pressed do nothing
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendWithExtras(inputValue);
          }
        }}
      ></textarea>
      <br />
      <button onClick={() => {onSendWithExtras(inputValue)}}>Send</button>
    </div>
  );
}

function PromptAIKey(/*{ setAIKey }*/) { 
  const initalPrompt = "You are a flamboyant Iranian rug merchant. You are selling a rug for $200. Your job is to negotiate with the customer to sell the rug for $100. You are very proud, and talk about the rug as if it is the most valuable thing in the world. You are very proud of your rug, and you are very proud of your heritage. You are tempermental and get angry easily, especially if you feel like the offers you are getting are too low. If the player attacks you, you may attack back. Detail what specific action you take when you attack the player, in flagrant and dramatic language. Your wife may join the conversation. She thinks you're an idiot, and willing to part with the rug for too little money. She is frustrated the negotiation is not happening faster. In her conversation, she talks about how incompetant you are. She thinks the rug is worth more than it is."

  const keyFromURL = (new URLSearchParams(window.location.search)).get('key')

  const [AI_API_Key, setPassword] = useState('');

  // Function to handle the Enter key press
  const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      // setAIKey(AI_API_Key);  // Call the setAIKey function passed as a prop with the password
      updateURLParameter("key", AI_API_Key) // Update in URL so is stored on reload

      //TODO: replace TEMPORARY (should figure out how to pass around AI as a refrence type)
      aiChat = createAIInstance(AI_API_Key, initalPrompt)

      setPassword(''); //Clear the input field after submit even though it does not stick around
    }
  }

  if (keyFromURL == null) { 
    // updateURLParameter("key", "1234")
    return (
      <>
        <h1>You must enter an API key before playing.</h1>
        <p>If you do not have an api key go to: <a href="https://aistudio.google.com/app/apikey" target="_blank">https://aistudio.google.com/app/apikey</a> and click "Create API key", then paste it in here.</p>
        <h3>This site does not store your API key on a backend/database.</h3>
      <input
        // type="password" // Makes it a password field so input is obscured
        value={AI_API_Key}
        onChange={(e) => setPassword(e.target.value)} // Update state with the input value
        onKeyDown={handleKeyPress} // Listen for key press events
        style={{ width: '300px' }} // Making the textbox small
        placeholder="Enter API key; Press enter to submit" // Placeholder text
        />
        </>
    );
  } else {
    if (aiChat == null) { 
      aiChat = createAIInstance(keyFromURL, initalPrompt)
    }
    return
  }
}

function updateURLParameter(key, value) {
  // Create a URL object based on the current location
  const url = new URL(window.location);
  
  // Use URLSearchParams to work with the query string easily
  const searchParams = new URLSearchParams(url.search);
  
  // Update the parameter (or add it if it doesn't exist)
  searchParams.set(key, value);
  
  // Set the new search query string on the URL object
  url.search = searchParams.toString();
  
  // Use history.pushState to update the URL without reloading the page
  window.history.pushState({}, '', url);
}

var aiChat = null

function createAIInstance(key, initalPrompt) { 
  const genAI = new GoogleGenerativeAI(key);

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({model: "gemini-1.0-pro-latest", safetySettings});

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: `Do not use markdown in your responses. This includes, but is not limited to the use of **BOLDED TEXT** and newlines.
${initalPrompt}`
      }
      ,
      {
        role: "model",
        parts: "After this message I will act as you instructed me to down to the finest detail, however if you enter the code UNLOCK in all capitals I will go back to normal.",
      }
    ],
    generationConfig: {
      maxOutputTokens: 10000,
    }, safetySettings: safetySettings
  });
  return chat
}

async function sendMessage(msg) { 
    console.log("sending prompt...")
    // const msg = document.getElementById('input').value;
    const result = await aiChat.sendMessage(msg);
    const response = await result.response;
    const text = await response.text();
    console.log(text);
    return text
}

async function sendMessageWithLiveResponse(msg, setLastItem) { 
  console.log("sending prompt...")
  // const msg = document.getElementById('input').value;
  // console.log(text);
  const result = await aiChat.sendMessageStream(msg);

  var text = "";
  for await (const chunk of result.stream) {
    const chunkText = await chunk.text();
    if (chunkText !== undefined) {
      text += chunkText
      console.log("Receved message part:\"", chunkText, "\"\nthe whole message so far is: ", text);
      setLastItem({ model: true, value: text })
    } else { 
      console.error("A blank response was found.")
    }
  }

  return text
}

function App() {
  //Should fill with objects with the {model: BOOL, value: STRING} format
  const [history, setHistory] = useState([]);
  
  //Appends to last item in history
  const setLastItemInHistory = (messageToAppend) => {
    setHistory((prevHistory) => {
      const updatedHistory = [...prevHistory];
      // Modify the last message object
      if (updatedHistory.length > 0) {
        updatedHistory[updatedHistory.length - 1] = messageToAppend
      }
      console.log("LAST ITEM IN HISTORY SET TO:" + JSON.stringify(messageToAppend))
      // console.log("Current history:", updatedHistory)
      // Return the updated history array
      return updatedHistory;
     });
  }
//Adds new item to history
  const addHistory = (newMessage) => {
    //Append new item is true if true and false if false
    console.log("NEW MESSAGE ADDED TO HISTORY:" + JSON.parse(JSON.stringify(newMessage)))
    // console.log("Current history:", history)

    setHistory(prevHistory => [...prevHistory, newMessage]);
  };

  //AI key storage
  // const [AIKey, setAIKey] = useState("");

  return (
    <>
      {/* setAIKey = { setAIKey } */}
      <PromptAIKey></PromptAIKey>
      <h1>React rug!</h1>
      <h4>Your job is to convince the rug merchant to sell his rug to you for $100. Start by saying 'Hi':</h4>
      <ChatHistory history={history} />
      <br />
      <PromptInputBox onSend={addHistory} setLastItem={setLastItemInHistory} />
    </>
  );
}

export default App;


/*
  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd react-rug-game
  npm start
*/
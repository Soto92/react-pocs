import React, { useState } from "react";
import { getAnswer } from "./utils/openai";
import openaiIcon from "./img/openai.jpg";
import "./App.css";

const baloonClient = {
  backgroundColor: "#E7FFDB",
  padding: 10,
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  borderBottomLeftRadius: 14,
  marginLeft: 20,
  marginRight: 4,
};

const ballonOutServer = {
  backgroundColor: "#FFFFFF",
  padding: 10,
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  borderBottomRightRadius: 14,
  marginLeft: 4,
  marginRight: 20,
};

function App() {
  const [question, setQuestion] = useState("");
  const [allMessages, setAllMessages] = useState([
    { isAI: false, message: "" },
  ]);

  const fetchOpenAI = async () => {
    const messageInput = { isAI: false, message: question };
    setAllMessages((oldValue) => [...oldValue, messageInput]);

    const answerFromOpenAI = await getAnswer(question);
    const messageOutput = { isAI: true, message: answerFromOpenAI };
    setQuestion("");
    setAllMessages((oldValue) => [...oldValue, messageOutput]);
  };

  return (
    <div className="App">
      <div className="Container">
        <header>
          <img
            style={{ width: 44, height: 44, borderRadius: 80, margin: 14 }}
            src={openaiIcon}
            alt="openai-icon"
          />
          <h1>My Chat GPT App</h1>
        </header>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
            overflowY: "scroll",
          }}
        >
          {allMessages.map((item) => {
            if (item.message) {
              return (
                <p style={item.isAI ? ballonOutServer : baloonClient}>
                  {item?.message}
                </p>
              );
            }
            return null;
          })}
        </div>

        <div className="Send-message">
          <textarea
            style={{ width: "80%" }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={() => fetchOpenAI()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;

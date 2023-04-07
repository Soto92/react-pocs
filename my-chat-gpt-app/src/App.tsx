import React, { useState } from "react";
import { getAnswer } from "./utils/openai";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | undefined>("");

  const fetchOpenAI = async () => {
    const answerFromOpenAI = await getAnswer(question);
    setAnswer(answerFromOpenAI);
  };

  return (
    <div className="App">
      <div
        style={{
          width: "500px",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          padding: "20px",
          margin: "20px",
          justifyContent: "space-between",
        }}
      >
        <input value={question} onChange={(e) => setQuestion(e.target.value)} />
        <button onClick={() => fetchOpenAI()}>Search</button>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default App;

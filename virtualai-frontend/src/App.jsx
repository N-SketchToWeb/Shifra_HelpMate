import React, { useContext } from "react";
import "./App.css";
import { FaMicrophone } from "react-icons/fa";
import { dataContext } from "./Context/UserContext";

const App = () => {
  const {
    speaking,
    userPrompt,
    aiResponse,
    startListening,      // ✅ from context
    resetConversation,   // ✅ from context
  } = useContext(dataContext);

  const handleClick = () => {
    resetConversation(); // clear old messages
    startListening();    // start mic safely
  };

  return (
    <div className="main">
      {/* AI Avatar */}
      <img src="/assets/ai.png" alt="AI Avatar" id="shifra" />
      <span>I'm Shifra, Your Advanced Virtual HelpMate!</span>

      {!speaking ? (
        <button onClick={handleClick}>
          Click here <FaMicrophone />
        </button>
      ) : (
        <div className="response">
          {/* Animation */}
          {!aiResponse ? (
            <img src="/assets/speak.gif" alt="Listening..." id="spk" />
          ) : (
            <img src="/assets/aiVoice.gif" alt="AI Speaking" id="aigif" />
          )}

          {/* User Prompt */}
          {userPrompt && (
            <p className="user-prompt">
              <strong>You:</strong> {userPrompt}
            </p>
          )}

          {/* AI Response */}
          {aiResponse && (
            <p className="ai-response">
              <strong>Shifra:</strong> {aiResponse}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
import { createContext, useEffect, useRef, useState } from "react";
import run from "../gemini";

export const dataContext = createContext();

function UserContext({ children }) {
  const recognitionRef = useRef(null);

  const [speaking, setSpeaking] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  //  Speech Recognition (Chrome)
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const rec = new window.webkitSpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => setSpeaking(true);

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setUserPrompt(transcript);
      handleCommand(transcript.toLowerCase());
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech") {
        setSpeaking(false);
        return;
      }
      console.error("Speech recognition error:", e.error);
      setSpeaking(false);
    };

    rec.onend = () => setSpeaking(false);

    recognitionRef.current = rec;
  }, []);

  //  Text-to-Speech
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  //  Open URL helper
  function openUrl(url, message) {
    window.open(url, "_blank", "noopener,noreferrer");
    setAiResponse(message);
    speak(message);
  }

  //  Gemini fallback
  async function getAiResponse(prompt) {
    try {
      const text = await run(prompt);
      setAiResponse(text);
      speak(text);
    } catch {
      const msg = "Sorry, something went wrong!";
      setAiResponse(msg);
      speak(msg);
    }
  }

  //  Command handler
  function handleCommand(command) {
    // 👤 Creator
    if (/\bwho (are|built|made) you\b/i.test(command)) {
      const msg = "I was built by Nandita Nilajagi.";
      setAiResponse(msg);
      speak(msg);
      return;
    }

    // Date
    if (command.includes("date")) {
      const date = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setAiResponse(date);
      speak(date);
      return;
    }

    //  Time
    if (command.includes("time")) {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setAiResponse(time);
      speak(time);
      return;
    }

    //  OPEN WEBSITE COMMANDS
    const sites = [
      { keywords: ["open", "youtube"], url: "https://www.youtube.com", msg: "Opening YouTube" },
      { keywords: ["open", "google"], url: "https://www.google.com", msg: "Opening Google" },
      { keywords: ["open", "gmail"], url: "https://mail.google.com", msg: "Opening Gmail" },
      { keywords: ["open", "whatsapp"], url: "https://www.whatsapp.com", msg: "Opening WhatsApp" },
      { keywords: ["open", "instagram"], url: "https://www.instagram.com", msg: "Opening Instagram" },
      { keywords: ["open", "linkedin"], url: "https://www.linkedin.com", msg: "Opening LinkedIn" },
    ];

    for (let site of sites) {
      if (site.keywords.every((k) => command.includes(k))) {
        return openUrl(site.url, site.msg);
      }
    }

    //  Fallback → Gemini
    getAiResponse(command);
  }

  //  Reset
  function resetConversation() {
    setUserPrompt("");
    setAiResponse("");
    setSpeaking(false);
    window.speechSynthesis.cancel();
  }

  //  Start listening
  function startListening() {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported");
      return;
    }
    resetConversation();
    recognitionRef.current.start();
  }

  return (
    <dataContext.Provider
      value={{
        speaking,
        userPrompt,
        aiResponse,
        startListening,
        resetConversation,
      }}
    >
      {children}
    </dataContext.Provider>
  );
}

export default UserContext;
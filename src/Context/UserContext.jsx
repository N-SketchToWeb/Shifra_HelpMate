import React, { createContext, useState } from 'react'
import run from '../gemini';
export const dataContext = createContext()

function UserContext({children}) {
    let [speaking, setSpeaking]= useState(false)
    let [prompt, setPrompt]=useState("listening...")
    let [response,setResponse] = useState(false)

    function speak(text){
        let text_speak = new SpeechSynthesisUtterance(text)
        text_speak.volume=1;
        text_speak.rate=1;
        text_speak.pitch=1;
        text_speak.lang="en-GB"
        window.speechSynthesis.speak(text_speak)
    }

    async function aiResponse(prompt) {
        let text = await run(prompt)
        let isAboutCreator = /\bwho (are you|built you|made you)\b/i.test(prompt);
        let newText = text.split(/[*\/]+/).map(part => part.trim()).filter(Boolean).join(" ");

        // Only replace "Google" if it's about creator
        if (isAboutCreator) {
        newText = newText.replace(/\b[Gg]oogle\b/g, "Nandita Nilajagi");
        }

        setPrompt(newText)
        speak(newText)
        setResponse(true)
        setTimeout(() => {
            setSpeaking(false)
        }, 5000);
        
    }

    //Speech Recognition
    let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    let recognition = new speechRecognition()
    recognition.onresult=(e)=>{
        let currentIndex=e.resultIndex
        let transcript=e.results[currentIndex][0].transcript
        setPrompt(transcript)
        takeCommand(transcript.toLowerCase())
    }

    //Take command to open or visit (Eg: Youtube,google,etc.)
    function takeCommand(command) {
        if(command.includes("open") && command.includes("youtube")){
            window.open("https://www.youtube.com/","_blank")
            speak("opening youtube")
            setResponse(true)
            setPrompt("Opening Youtube...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000);
        }else if(command.includes("open") && command.includes("google")){
            window.open("https://www.google.com/","_blank")
            speak("opening Google")
            setResponse(true)
            setPrompt("Opening Google...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000);
        }else if(command.includes("open") && command.includes("gmail")){
            window.open("https://www.gmail.com/","_blank")
            speak("opening gmail")
            setResponse(true)
            setPrompt("Opening gmail...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000);
        }else if(command.includes("open") && command.includes("whatsapp")){
            window.open("https://www.whatsapp.com/","_blank")
            speak("opening whatsapp")
            setResponse(true)
            setPrompt("Opening whatsapp...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000);
        }else if(command.includes("open") && command.includes("instagram")){
            window.open("https://www.instagram.com/","_blank")
            speak("opening Instagram")
            setResponse(true)
            setPrompt("Opening Instagram...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000);
        }else if(command.includes("open") && command.includes("linkedin")){
            window.open("https://in.linkedin.com/","_blank")
            speak("opening linkedIn")
            setResponse(true)
            setPrompt("Opening linkedIn...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000);
        }else if(command.includes("time")){
            let time = new Date().toLocaleString(undefined,{hour:"numeric",minute:"numeric"})
            speak(time)
            setResponse(true)
            setPrompt(time)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000);
        }else if(command.includes("date")){
            let date = new Date().toLocaleString(undefined,{day:"numeric",month:"short"})
            speak(date)
            setResponse(true)
            setPrompt(date)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000);
        }
        else{
            aiResponse(command)
        }
    }

    let value={
        recognition,
        speaking, 
        setSpeaking,
        prompt,
        setPrompt,
        response,
        setResponse
    }

  return (
    <div>
        <dataContext.Provider value={value}> 
        {children}
        </dataContext.Provider>
    </div>
  )
}

export default UserContext
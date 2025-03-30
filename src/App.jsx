import React, { useContext } from 'react'
import "./App.css"
import va from "./assets/ai.png"
import spk from "./assets/speak.gif"
import aigif from "./assets/aiVoice.gif"
import { FaMicrophoneLines } from "react-icons/fa6";
import { dataContext } from './Context/UserContext';

const App = () => {
  let {recognition, speaking, setSpeaking, prompt, response, setResponse, setPrompt} = useContext(dataContext)

 
  return (
    <div className='main'>
      <img src={va} alt="" id="shifra"/>
      <span>I'm Shifra, Your Advanced Virtual HelpMate!</span>
      {!speaking? 
      <button onClick={()=>{
        setPrompt("listening...")
        setSpeaking(true)
        setResponse(false)
        recognition.start()
      }}>Click here <FaMicrophoneLines /></button>
      : 
      <div className='response'>
        {!response? <img src={spk} alt="" id="spk"/> 
         : <img src={aigif} alt="" id="aigif"/>
        }
        <p>{prompt}</p>
      </div>
    
    }
      
    </div>

  )
}

export default App
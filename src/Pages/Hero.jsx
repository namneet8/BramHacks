import { m, LazyMotion, domAnimation } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useRef } from "react";
import HeroText from "../Components/hero/HeroText";
import HeroParticles from "../Components/hero/particles/HeroParticles";
import SamplePrompts from "../Components/hero/SamplePrompts";
import ChatInput from "../Components/hero/ChatInput";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
console.log("API key",import.meta.env.VITE_GEMINI_API_KEY);
const Hero = () => {
  
  const [input, setInput] = useState("");

  const handleSubmit = async() => {
    if (input.trim()) {
      console.log("Submitted:", input);
      
      const fullPrompt = `
        You are a JSON extractor. 
From the user's message, extract the location name and give its latitude and longitude.
Return only JSON in this format:
{
  "location": "<city or place>",
  "latitude": <number>,
  "longitude": <number>
}

User message: "${input}"`;
      setInput("");
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
      console.log("text",cleanText);
      const data = JSON.parse(cleanText);
      console.log(data);
      const botMsg = { role: "user", content: input };
      localStorage.setItem("chatHistory", JSON.stringify(botMsg));
    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { role: "assistant", content: "⚠️ Error fetching Gemini response." }]);
    } finally {
      //go to next page
    }
  }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    setTimeout(() => {
      if (prompt.trim()) {
        console.log("Submitted:", prompt);
        setInput("");
      }
    }, 300);
  };

  return (
    <div id="hero" className="w-full bg-black flex justify-center overflow-hidden-web relative">
      <LazyMotion features={domAnimation} strict>
        <m.div
          id="hero"
          className="relative w-full flex flex-col justify-center items-center h-screen min-h-[500px] px-4"
        >
          <HeroText />
          <HeroParticles />
          
          <SamplePrompts onPromptClick={handlePromptClick} />
          
          <ChatInput 
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
          />
        </m.div>
      </LazyMotion>
    </div>
  );
};

export default Hero;
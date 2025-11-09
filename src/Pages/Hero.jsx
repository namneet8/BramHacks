import { m, LazyMotion, domAnimation } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Add this import for navigation
import HeroText from "../Components/hero/HeroText";
import HeroParticles from "../Components/hero/particles/HeroParticles";
import SamplePrompts from "../Components/hero/SamplePrompts";
import ChatInput from "../Components/hero/ChatInput";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
console.log("API key", import.meta.env.VITE_GEMINI_API_KEY);

const Hero = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate(); // Add this for navigation

  const handleSubmit = async () => {
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
        console.log("text", cleanText);
        const data = JSON.parse(cleanText);
        console.log(data);

        // Save user's first prompt as chat history (array for future appends)
        localStorage.setItem("initialLocation", JSON.stringify({
          name: data.location,
          lat: data.latitude,
          lng: data.longitude
        }));
        const initialHistory = [{ role: "user", content: input }];
        localStorage.setItem("chatHistory", JSON.stringify(initialHistory));
        
        // Save extracted location for MainPage to load into map
        

      } catch (err) {
        console.error(err);
        // Optionally handle error in chat history if needed
      } finally {
        // Navigate to main page
        navigate("/main"); // Adjust the route path if your MainPage route is different (e.g., "/")
      }
    }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    setTimeout(() => {
      handleSubmit(); // Trigger submit after setting input
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
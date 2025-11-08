import { m, LazyMotion, domAnimation } from "framer-motion";
import { useState, useRef } from "react";
import HeroText from "../Components/hero/HeroText";
import HeroParticles from "../Components/hero/particles/HeroParticles";
import SamplePrompts from "../Components/hero/SamplePrompts";
import ChatInput from "../Components/hero/ChatInput";

const Hero = () => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) {
      console.log("Submitted:", input);
      // Handle your submission logic here
      setInput("");
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
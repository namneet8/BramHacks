import React from "react";

const Loader = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center relative">
      <span
        style={{ fontFamily: "SuperMario" }}
        className="absolute text-pink-200 text-xl"
      >
        Loading
      </span>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;

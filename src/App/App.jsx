// src/App.jsx
import NavBar from "../Components/nav/NavBar";
import Hero from "../Pages/Hero";
import MainPage from "../Pages/Main";
import { Routes, Route } from "react-router-dom";  // Only Routes & Route

function App() {
  return (
    <>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="*" element={<Hero />} />
      </Routes>
    </>
  );
}

export default App;
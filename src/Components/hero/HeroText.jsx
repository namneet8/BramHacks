import { m, LazyMotion, domAnimation, useMotionValue, useTransform } from "framer-motion";

const HeroText = () => {
  const firstName = "Unveil Earth's Aura - ";
  const lastName = "AI Satellite Insights";

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width * 150 - 75);
    y.set((e.clientY - rect.top) / rect.height * 150 - 75);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="noselect w-fit h-fit text-yellow-100 absolute z-10 flex flex-col justify-center items-center md:top-[20%] sm:top-[10%] top-[10%]"
      id="repulse-div"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1400px" }}
    >
      <LazyMotion features={domAnimation} strict>
        <m.h1
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, type: "spring", stiffness: 120 }}
          className="text-center flex flex-col justify-center items-center text-3xl sm:text-4xl cursor-default select-none"
          style={{
            fontFamily: "SuperMario",
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 0 2px rgba(255, 215, 130, 0.14))"
          }}
        >
          {/* Main Title */}
          <m.div style={{ display: "flex", rotateX, rotateY, transformStyle: "preserve-3d" }}>
            {"Aura Lens".split("").map((char, index) => (
              <m.span
                key={index}
                initial={{ y: -70, opacity: 0, rotateX: -90 }}
                whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                whileHover={{
                  scale: 1.14,
                  color: "#fedb75",
                  textShadow: "0 0 6px rgba(255, 209, 96, 0.55)"
                }}
                transition={{ duration: 0.45, type: "spring", delay: index * 0.075, stiffness: 170 }}
                style={{
                  fontSize: "1.27em",
                  marginRight: char === " " ? "0.3em" : "0",
                  background: "linear-gradient(180deg, #fff7c7 0%, #fddc6c 40%, #fbbf24 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  transform: "translateZ(42px)",
                  textShadow: "0 0 4px rgba(251, 146, 60, 0.24)"
                }}
              >
                {char === " " ? "\u00A0" : char}
              </m.span>
            ))}
          </m.div>

          {/* Subtitle */}
          <div style={{ display: "flex", gap: "0.3em", marginTop: "0.45em", fontFamily: "Inter, Poppins, sans-serif" }}>
            {[firstName, lastName].map((word, i) => (
              <m.div
                key={i}
                initial={{ x: i === 0 ? -60 : 60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.65, type: "spring", delay: 0.35 + i * 0.08, stiffness: 85 }}
              >
                {word.split("").map((char, index) => (
                  <m.span
                    key={index}
                    whileHover={{ scale: 1.09, color: "#e9f6ff" }}
                    style={{
                      fontSize: "0.62em",
                      marginRight: char === " " ? "0.2em" : "0",
                      color: "#FFFFFF",
                      fontWeight: 600
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </m.span>
                ))}
              </m.div>
            ))}
          </div>
        </m.h1>
      </LazyMotion>
    </div>
  );
};

export default HeroText;

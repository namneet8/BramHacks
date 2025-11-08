import { m, LazyMotion, domAnimation, useMotionValue, useTransform } from "framer-motion";

const HeroText = () => {
  const firstName = "Satellite Intelligence";
  const lastName = "For Everyone";

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;

    x.set((xPos / rect.width - 0.5) * 200);
    y.set((yPos / rect.height - 0.5) * 200);
  };

  return (
    <div
      className="noselect w-fit h-fit text-yellow-200 absolute z-10 flex flex-col justify-center items-center rounded-[50%] md:top-[30%] sm:top-[20%] top-[20%]"
      id="repulse-div"
      onMouseMove={handleMouseMove}
      style={{ perspective: "600px" }}
    >
      <LazyMotion features={domAnimation} strict>
        <m.h1
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center flex justify-center items-center flex-col opacity-100 text-3xl sm:text-5xl cursor-default"
          style={{ fontFamily: "SuperMario", transformStyle: "preserve-3d" }}
        >
          <m.div style={{ display: "flex" }}>
            {"TerraVista AI".split("").map((char, index) => (
              <m.span
                key={index}
                initial={{ y: -100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  delay: index * 0.15,
                }}
                style={{ 
                  fontSize: "1.5em",
                  textShadow: "0 0 10px rgba(244, 114, 182, 0.5), 0 0 20px rgba(244, 114, 182, 0.3)",
                  marginRight: char === " " ? "0.3em" : "0"
                }}
              >
                {char === " " ? "\u00A0" : char}
              </m.span>
            ))}
          </m.div>
          <div style={{ display: "flex", gap: "0.3em" }}>
            <m.div
              initial={{ x: -100 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.7, type: "spring", delay: 0.3 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {firstName.split("").map((char, index) => (
                <m.span
                  key={index}
                  className="text-yellow-300 bounce"
                  style={{ 
                    fontSize: "0.6em",
                    marginRight: char === " " ? "0.2em" : "0"
                  }}
                  animate={{
                    y: [0, -2, 0, 2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: index * 0.2,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </m.span>
              ))}
            </m.div>
            <m.div
              initial={{ x: 100 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.7, type: "spring", delay: 0.4 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {lastName.split("").map((char, index) => (
                <m.span
                  key={index}
                  className="text-yellow-300 bounce"
                  style={{ 
                    fontSize: "0.6em",
                    marginRight: char === " " ? "0.2em" : "0"
                  }}
                  animate={{
                    y: [0, -2, 0, 2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: index * 0.2,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </m.span>
              ))}
            </m.div>
          </div>
        </m.h1>
      </LazyMotion>
    </div>
  );
};

export default HeroText;
import React, { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

const LoadingBox: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const fetchAnimationData = async () => {
      try {
        const response = await fetch(
          "https://assets7.lottiefiles.com/packages/lf20_uqs1ib9v.json"
        );
        const animationData = await response.json();

        if (containerRef.current) {
          animationRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData,
          });
        }
      } catch (error) {
        console.error("Failed to fetch animation data:", error);
      }
    };

    fetchAnimationData();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default LoadingBox;

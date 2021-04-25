import { useState, useEffect } from "react"

export const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const keyDownHandler = ({ key }) => {
    console.log(key,"herer")
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const keyUpHandler = ({ key }) => {
    console.log(key,"up")
    if (key === targetKey) {
      setKeyPressed(false);
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  });

  return keyPressed;
}
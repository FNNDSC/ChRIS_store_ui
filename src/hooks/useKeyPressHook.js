import { useState, useEffect } from "react"

export const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const keyDownHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const keyUpHandler = ({ key }) => {
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

export default useKeyPress;

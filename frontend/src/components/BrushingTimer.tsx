import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
 import confetti from 'canvas-confetti';


function BrushingTimer() {
  const [timer, _setTimer] = useState(2);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [_progressDone, setProgressDone] = useState(false);
  const [progress, setProgress] = useState(0); //börjar på 0 %

  // let timeInMilliseconds = timer * 60 * 1000;
  let timeInSeconds = timer * 60;
  let seconds = timeInSeconds - timer * 60;

  useEffect(() => {
    let brushingTimer: number;
    if (isActive && timeLeft > 0) {
      brushingTimer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1); //kollar på tiden i procent och minskar med en.
        setProgress((prev) => {
          const newProgress = prev + ( 100 / (timer * 60 ));
          return newProgress < 0 ? 0 : newProgress
        }) //gör en ny progress baserat på tidigare tid(prevTime är värdet av tiden i procent och representerar hur många procent som är kvar i progressbaren) + timer(som börjar på två minuter * 60 (konverterar detta till sekunder (vill konvertera till millisecunder)))
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setProgressDone(true);
    }
    return () => clearTimeout(brushingTimer);
  }, [timeLeft, isActive]);

  let minutes = Math.floor(timeLeft / 60);
  seconds = timeLeft - minutes * 60;

  if (seconds < 10) {
    seconds = 0 + seconds;
  }
  function handleButtonClick() {
    setIsActive(true);
    setTimeLeft(timeInSeconds);
    setProgressDone(false);
    confetti
  }

  return (
    <>
      isActive Brushing Timer
      <div>
        <button onClick={handleButtonClick}>Start brushing-timer</button>
        {minutes} : {seconds}
      </div>
      <ProgressBar
        progress={progress}
      ></ProgressBar>
    </>
  );
}
export default BrushingTimer;

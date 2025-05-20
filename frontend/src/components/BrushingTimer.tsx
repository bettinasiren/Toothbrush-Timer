import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";

interface BrushingSessionType {
  user_id: number;
}

function BrushingTimer(props: BrushingSessionType) {
  const [_brushingSession, _setBrushingSession] = useState<
    BrushingSessionType[]
  >([]);
  const [timer, _setTimer] = useState(0.1);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0.1);
  const [progressDone, setProgressDone] = useState(false);
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
          const newProgress = prev + 100 / (timer * 60);

          return newProgress < 0 ? 0 : newProgress;
        }); //gör en ny progress baserat på tidigare tid(prevTime är värdet av tiden i procent och representerar hur många procent som är kvar i progressbaren) + timer(som börjar på två minuter * 60 (konverterar detta till sekunder (vill konvertera till millisecunder)))
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setProgressDone(true);
      confetti();
      setProgress(0);
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
  }

  async function handleBrushingSession() {
    await fetch(`http://localhost:3000/brushing/`, {
      method: "PUT",
      body: JSON.stringify({
        user_id: 1,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  }

  return (
    <>
      {" "}
      {!isActive && (
        <button onClick={handleButtonClick}>Start brushing-timer</button>
      )}
      {isActive && (
        <>
          <div>
            {minutes} : {seconds}
          </div>
          <ProgressBar progress={progress}></ProgressBar>
        </>
      )}
      {!isActive && progressDone && (
        <>
          <div> Du klarade det!</div>
          <button onClick={handleBrushingSession}>
            {" "}
            <Link to={"/home"}> Gå till main</Link>
          </button>
        </>
      )}
    </>
  );
}
export default BrushingTimer;

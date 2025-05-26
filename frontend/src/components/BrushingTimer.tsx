import { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { StarWarsMusic } from "../assets/music";

// interface BrushingSessionType {
//   user_id: number;
// }

function BrushingTimer() {
  const { userId } = useAuth();
  const [timer, _setTimer] = useState(0.1);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0.1);
  const [progressDone, setProgressDone] = useState(false);
  const [progress, setProgress] = useState(0); //börjar på 0 %
  // const [earnedMedalMessage, setEarnedMedalMessage] = useState(true)
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // let timeInMilliseconds = timer * 60 * 1000;
  let timeInSeconds = timer * 60;
  let seconds = timeInSeconds - timer * 60;



  useEffect(() => {
    let brushingTimer: string | number | NodeJS.Timeout | undefined;
    if (isActive && timeLeft > 0 && isPlaying) {
      brushingTimer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1); //kollar på tiden i procent och minskar med en.
        setProgress((prev) => {
          const newProgress = prev + 100 / (timer * 60);

          return newProgress < 0 ? 0 : newProgress;
        }); //gör en ny progress baserat på tidigare tid(prevTime är värdet av tiden i procent och representerar hur många procent som är kvar i progressbaren) + timer(som börjar på två minuter * 60 (konverterar detta till sekunder (vill konvertera till millisecunder)))
        setIsPlaying(true);

      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setProgressDone(true);
      confetti();
      setProgress(0);
      handleBrushingSession();
    }

    return () => clearTimeout(brushingTimer);
  }, [timeLeft, isActive, isPlaying]);

  let minutes = Math.floor(timeLeft / 60);
  seconds = timeLeft - minutes * 60;

  if (seconds < 10) {
    seconds = 0 + seconds;
  }

  //fuktion som kollar om musiken spelar eller inte (funkar)
  // function togglePlay(){
  //   if(isPlaying){
  //     audioRef.current.pause()
  //   } else {
  //     audioRef.current.play()
  //   }
  //   setIsPlaying(!isPlaying)
  // }

  function handleButtonClick() {
    setIsActive(true);
    setTimeLeft(timeInSeconds);
    setProgressDone(false);
    // togglePlay()
  }

  async function handleBrushingSession() {
    await fetch(`http://localhost:3000/brushing/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <>
    <audio ref={audioRef} src={StarWarsMusic} />
      {" "}
      {!isActive && !progressDone && (
        <>
          <p>Är du redo? Klicka på knappen för att starta timer</p>
          <button onClick={handleButtonClick}>Start brushing-timer</button>
        </>
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
          <button>
            {" "}
            <Link to={"/home"}> Gå till main</Link>
          </button>
        </>
      )}
      {/* {earnedMedalMessage && progressDone && !isActive && (
        <div>du har {earnedMedals} medaljer</div>
      )} */}
    </>
  );
}
export default BrushingTimer;

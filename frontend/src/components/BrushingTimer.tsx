import { useEffect, useRef, useState } from "react";
import { Container, Button} from "react-bootstrap";
import { useAuth } from "../context/UserContext";
import { StarWarsMusic } from "../assets/music";
import BrushingInfoText from "./BrushingInfoText";
import DancingAvatar from "./DancingAvatar";
import ProgressBar from "./ProgressBar";
import confetti from "canvas-confetti";


function BrushingTimer() {
  const { userId } = useAuth();
  const [timerInMinutes, _setTimerInMinutes] = useState(0.1);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0.1);
  const [progressDone, setProgressDone] = useState(false);
  const [progress, setProgress] = useState(0); //börjar på 0 %
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  let timeInSeconds = timerInMinutes * 60;
  let seconds = 0;

  useEffect(() => {
    let brushingTimer: string | number | NodeJS.Timeout | undefined;
    if (isActive && timeLeft > 0 && isPlaying) {
      brushingTimer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1); //kollar på tiden i procent och minskar med en.
        setProgress((prev) => {
          const newProgress = prev + 100 / (timerInMinutes * 60);
          console.log(newProgress);
          return newProgress < 0 ? 0 : newProgress;
        });
        setIsPlaying(true);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setProgress(100);

      setTimeout(() => {
        setIsActive(false);
        setProgressDone(true);
        confetti();
        setProgress(0);
        handleBrushingSession();
      }, 1000);
    }

    return () => clearTimeout(brushingTimer);
  }, [timeLeft, isActive, isPlaying]);

  let minutes = Math.floor(timeLeft / 60);
  seconds = timeLeft - minutes * 60;

  //fuktion som kollar om musiken spelar eller inte (funkar)
  function togglePlay() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      console.error("audioRef.current is null");
    }
  }

  function handleStartBrushing() {
    setIsActive(true);
    setTimeLeft(timeInSeconds);
    setProgressDone(false);
    togglePlay();
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
      <audio ref={audioRef} src={StarWarsMusic} />{" "}
      {!isActive && !progressDone && (
        <Container className="p-3 mb-2 mt-2 bg-dark transparent text-white">
          <BrushingInfoText />
          <Button onClick={handleStartBrushing}>Börja borsta!</Button>
        </Container>
      )}
      {isActive && (
        <>
          <div>
            <h2>
              {" "}
              {minutes} : {seconds < 10 ? "0" + seconds : seconds}{" "}
            </h2>
          </div>
          <ProgressBar progress={progress}></ProgressBar>
          <DancingAvatar></DancingAvatar>
        </>
      )}
      {!isActive && progressDone && (
        <Container className="p-3 mb-2 mt-2 ">
          <h2> Snyggt borstat!</h2>
        </Container>
      )}
    </>
  );
}
export default BrushingTimer;

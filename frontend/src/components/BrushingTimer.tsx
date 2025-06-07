import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthUser";
import { StarWarsMusic } from "../assets/music";
import BrushingInfoText from "./BrushingInfoText";
import DancingAvatar from "./DancingAvatar";
import ProgressBar from "./ProgressBar";
import confetti from "canvas-confetti";

function BrushingTimer() {
  const { userId } = useAuth();
  const [timerInMinutes] = useState(2);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0.1);
  const [progressDone, setProgressDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleBrushingSession = useCallback(async () => {
    await fetch(`/brushing/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }, [userId]);

  const timeInSeconds = timerInMinutes * 60;
  let seconds = 0;

  useEffect(() => {
    let brushingTimer: string | number | NodeJS.Timeout | undefined;
    if (isActive && timeLeft > 0 && isPlaying) {
      brushingTimer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        setProgress((prev) => {
          const newProgress = prev + 100 / (timerInMinutes * 60);
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
  }, [timeLeft, isActive, isPlaying, timerInMinutes, handleBrushingSession]);

  const minutes = Math.floor(timeLeft / 60);
  seconds = timeLeft - minutes * 60;

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
          <h2>
            {minutes} : {seconds < 10 ? "0" + seconds : seconds}{" "}
          </h2>
          <ProgressBar progress={progress} />
          <DancingAvatar />
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

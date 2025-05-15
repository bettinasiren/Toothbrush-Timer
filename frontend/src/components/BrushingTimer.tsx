import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";



function BrushingTimer() {
  const [timer, _setTimer] = useState(2);
  const [_isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0);
  const [_progressDone, setProgressDone] = useState(false);
  // const [_progress, setProgress] = useState(100); //100 %

  // let timeInMilliseconds = timer * 60 * 1000;
  let timeInSeconds = timer * 60;
  let seconds = timeInSeconds - timer * 60;

  useEffect(() => {
    let brushingtimer : number;
    if(timeLeft > 0){
      brushingtimer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      },1000)

    } else if(timeLeft === 0){
      setIsActive(false)
      setProgressDone(true)
    }
 return () => clearTimeout(brushingtimer)
  },[timeLeft]);

  let minutes = Math.floor(timeLeft / 60)
  seconds = timeLeft - minutes * 60

  if(seconds < 10){
    seconds = 0 + seconds
  }
function handleButtonClick(){
setIsActive(true)
setTimeLeft(timeInSeconds)
setProgressDone(false)
}


  return (
    <>
      Brushing Timer
      <div>
      <button onClick={handleButtonClick }>Start brushing-timer</button>
      {minutes} : {seconds}
      </div>

      <ProgressBar></ProgressBar>
    </>
  );
}
export default BrushingTimer;

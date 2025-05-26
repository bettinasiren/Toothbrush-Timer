// import { useEffect, useState } from "react";
import styled from "styled-components";


const CircleBackground = styled.svg`
  width: 300px;
  height: 300px;
  transform: rotate(-420deg);
`;


const CircleProgress = styled.circle`
  fill: none;
  stroke: #EFE222;
  /* background-color: #4caf50;
  width: 75%; */
  stroke-width: 20;
  /* height: 100%; */
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
`;



interface ProgressBarProps {
  progress: number;
}

function ProgressBar(props: ProgressBarProps) {
  const radius = 100;
  const circleLength = 2 * Math.PI * radius; //omkretsen på cirkeln (283)
  const totalLength = circleLength - (props.progress / 100) * circleLength; //räknar ut hur mycket av processen som är kvar att fylla i av den totala omkretsen. (porps.progress/ 100) omvandlar procenten till decimal.



  return (
    <>
      <div>
        <CircleBackground>
          <CircleProgress
            cx="150"
            cy="150"
            r={radius}
            strokeDasharray={circleLength}
            strokeDashoffset={totalLength} //omkretsen
          />
        </CircleBackground>
      </div>

      {/* <MyProgressCircle>
        <CircleBackground cx="150" cy="150" r={radius}>
          <CircleProgress
            cx="150"
            cy="150"
            r={radius}
            strokeDasharray={circleLength}
            strokeDashoffset={totalLength} //omkretsen stroke
             style={{ stroke: `${props.progress}%` }}
          ></CircleProgress>
        </CircleBackground>
      </MyProgressCircle> */}
    </>
  );
}
export default ProgressBar;

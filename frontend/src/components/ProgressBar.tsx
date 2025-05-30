// import { useEffect, useState } from "react";
import styled from "styled-components";

const CircleBackground = styled.svg`
  width: 300px;
  height: 300px;
  transform: rotate(-450deg);
`;

const CircleShadow = styled.circle`
  stroke: grey;
  stroke-width: 18px;
  fill: none;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: #efe222;
  stroke-width: 20;
  stroke-linecap: round;
   transition: stroke-dashoffset 1.5s ease-in-out;
  /* stroke-dasharray: 100;
  stroke-dashoffset: 100; */
  /* animation: progressAnimation  2.5s  ease-in-out forwards;

  /*transform-origin: center; */
   /* @keyframes progressAnimation {
    0% {
      stroke-dashoffset: 100;
    }
    80% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 0;
    }
  } */
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
          <CircleShadow cx="150" cy="150" r={radius}>
            {" "}
          </CircleShadow>
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

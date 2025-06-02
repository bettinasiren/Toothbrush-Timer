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
  transform-origin: center;
`;

interface ProgressBarProps {
  progress: number;
}

function ProgressBar(props: ProgressBarProps) {
  const radius = 100;
  const circleLength = 2 * Math.PI * radius;
  const totalLength = circleLength - (props.progress / 100) * circleLength;

  return (
    <>
      <CircleBackground>
        <CircleShadow cx="150" cy="150" r={radius}>
          {" "}
        </CircleShadow>
        <CircleProgress
          cx="150"
          cy="150"
          r={radius}
          strokeDasharray={circleLength}
          strokeDashoffset={totalLength}
        />
      </CircleBackground>
    </>
  );
}
export default ProgressBar;

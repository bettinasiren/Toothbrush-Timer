// import { useEffect, useState } from "react";
import styled from "styled-components";

const MyBar = styled.div`
  width: 100%;
  height: 30px;
  position: relative;
   background-color: #ddd;

`;

const MyProgress = styled.div`
  background-color: #4caf50;
  width: 10px;
  height: 30px;
  position: relative;
`;

interface ProgressBarProps {
  progress: number;
}

function ProgressBar(props: ProgressBarProps) {


  return (
    <>
      ProgressBar
      <MyBar>
        <MyProgress style={{ width: `${props.progress}%` }}></MyProgress>
      </MyBar>
    </>
  );
}
export default ProgressBar;

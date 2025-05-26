import { useAuth } from "../context/UserContext";
import { medalImage } from "../assets/images";
import { useEffect, useState } from "react";
import styled from "styled-components";
// import { useState } from "react";

// interface MedalType {
//   id: number;
//   medal_name: string;
//   medal_image: string;
//   criteria: string;
//   user_id: number;
// }

const ScoreBoardWrapper = styled.div`
width: 100%;
height: 100px;

`
const MedalScoreBoard = styled.div`
  background-color: #4caf50;
  width: 250px;
  height: 10px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
`;

const MedalImage = styled.img`
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ScoreboardComponent() {
  const { userId } = useAuth();
  const [earnedMedals, setEarnedMedals] = useState<number>(0);
  const medals = [];

  //skapar en array som heter medals med antalet tilldelade medaljer
  for (let i = 0; i < earnedMedals; i++) {
    medals.push(medalImage);
  }

  async function fetchUserMedals() {
    await fetch(`http://localhost:3000/brushingmedals/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        let earnedMedals = Math.floor(data.length / 5);
        setEarnedMedals(earnedMedals);
        // if(earnedMedals <= 6){
        //   setEarnedMedals(0)
        // }
      });
  }

  useEffect(() => {
    if (userId) {
      fetchUserMedals();
    }
  }, [userId]);

  return (
    <>
      Här ska medaljerna visas
      {earnedMedals === 0 ? (
        <p>visa inget?</p>
      ) : (
        <ScoreBoardWrapper>
          <p>Du har {earnedMedals} st medaljer </p>
          <MedalScoreBoard>
              {" "}
              {medals.map((medal) => (
                <MedalImage src={medal} alt="Avatar" />
              ))}
          </MedalScoreBoard>
        </ScoreBoardWrapper>
      )}

      {earnedMedals > 6 &&
      <p>Du borde få troféer istället</p>

      }
      {earnedMedals > 11 &&
      <p>Du borde få diamanter istället </p>
      }
    </>
  );
}
export default ScoreboardComponent;

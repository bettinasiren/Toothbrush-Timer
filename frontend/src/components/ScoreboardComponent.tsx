import { useAuth } from "../context/AuthUser";
import { diamondImage, medalImage, starImage } from "../assets/images";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "react-bootstrap";

interface MedalType {
  id: number;
  image: string;
}

const ScoreBoardWrapper = styled.div`
  width: 100%;
  height: 100px;
`;
const MedalScoreBoard = styled.div`
  background-color: #4caf50;
  width: 250px;
  height: 10px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
`;

const PrizeImage = styled.img`
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ScoreboardComponent() {
  const { userId, isLoading } = useAuth();
  const [earnedMedals, setEarnedMedals] = useState<number>(0);
  const [medals, setMedals] = useState<MedalType[]>([]);
  const [stars, setStars] = useState<MedalType[]>([]);
  const [diamonds, setDiamonds] = useState<MedalType[]>([]);

  useEffect(() => {
    const newMedals = [];
    const newStars = [];
    const newDiamonds = [];

    for (let i = 0; i < earnedMedals; i++) {
      if (i < 5) {
        newMedals.push({ id: i, image: medalImage });
      } else if (i >= 5 && i < 10) {
        newStars.push({ id: i - 5, image: starImage });
      } else if (i >= 11 && i < 16) {
        newDiamonds.push({ id: i - 11, image: diamondImage });
      }
    }
    setMedals(newMedals);
    setStars(newStars);
    setDiamonds(newDiamonds);
  }, [earnedMedals]);

  const fetchUserMedals = useCallback(async () => {
    if (userId) {
      await fetch(`/brushing-sessions/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          const earnedMedals = Math.floor(data.length / 5);
          setEarnedMedals(earnedMedals);
        });
    }
  }, [userId]);

  useEffect(() => {
    fetchUserMedals();
  }, [fetchUserMedals]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      {earnedMedals <= 5 && (
        <ScoreBoardWrapper>
          <MedalScoreBoard>
            {" "}
            {medals.map((medal) => (
              <PrizeImage key={medal.id} src={medal.image} alt="medal" />
            ))}
          </MedalScoreBoard>
        </ScoreBoardWrapper>
      )}
      {earnedMedals >= 6 && earnedMedals < 11 && (
        <ScoreBoardWrapper>
          <MedalScoreBoard>
            {" "}
            {stars.map((star) => (
              <PrizeImage key={star.id} src={star.image} alt="star" />
            ))}
          </MedalScoreBoard>
        </ScoreBoardWrapper>
      )}
      {earnedMedals >= 11 && (
        <ScoreBoardWrapper>
          <MedalScoreBoard>
            {" "}
            {diamonds.map((diamond) => (
              <PrizeImage key={diamond.id} src={diamond.image} alt="diamond" />
            ))}
          </MedalScoreBoard>
        </ScoreBoardWrapper>
      )}
    </Container>
  );
}
export default ScoreboardComponent;

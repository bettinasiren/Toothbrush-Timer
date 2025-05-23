// import { useEffect } from "react";
// import { useState } from "react";
import { useAuth } from "../context/UserContext";
import { medalImage } from "../assets/images";
import { useState } from "react";

// interface MedalType {
//   id: number;
//   medal_name: string;
//   medal_image: string;
//   criteria: string;
//   user_id: number;
// }

function ScoreboardComponent() {
  const { earnedMedals } = useAuth();
  const [medals, _setMedals] = useState(
    Array.from({ length: earnedMedals }, () => medalImage)
  );

  // function displayMedals(string: string, number: number){

  // }

  return (
    <>
      Här ska medaljerna visas
      <p>Du har {earnedMedals} st medaljer </p>
      {medals.map((medal) => (
        <ul key={medal.length}>
          <img src={medal} alt="Avatar" />
        </ul>
      ))}
    </>
  );
}
export default ScoreboardComponent;

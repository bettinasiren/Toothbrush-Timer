import { Link } from "react-router-dom";
import ScoreboardComponent from "../components/ScoreboardComponent";
import ShowUser from "../components/ShowUser";

function Home() {
  return <>Home

  <ScoreboardComponent></ScoreboardComponent>

  <button> <Link to ={"/brushing-page"}>Start Brushing!!</Link></button>

  <ShowUser></ShowUser>
  </>;
}
export default Home;

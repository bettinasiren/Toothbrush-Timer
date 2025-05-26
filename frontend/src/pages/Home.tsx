import { Link } from "react-router-dom";
import ScoreboardComponent from "../components/ScoreboardComponent";
import ShowUser from "../components/ShowUser";
// import Dashboard from "../components/Dashboard";



function Home() {
  return <>Home
  {/* <Dashboard></Dashboard> */}

  <ScoreboardComponent></ScoreboardComponent>


  <button> <Link to ={"/brushing-page"}>Börja spela</Link></button>

  <ShowUser></ShowUser>
  </>;
}
export default Home;

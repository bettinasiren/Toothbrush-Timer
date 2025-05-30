import { Link, useNavigate } from "react-router-dom";
import ScoreboardComponent from "../components/ScoreboardComponent";
import ShowUser from "../components/ShowUser";
// import Dashboard from "../components/Dashboard";
import { useAuth } from "../context/UserContext";

function Home() {
  const {userId, setUserId, setIsLoggedIn, } = useAuth();

  const navigate = useNavigate()


  async function logOut() {
    await fetch("http://localhost:3000/logout/", {
      method: "POST",
      body: JSON.stringify({
        userId
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      console.log(response);
      console.log(document.cookie)
      console.log(userId)
      if (response.ok) {
        setIsLoggedIn(false);
        setUserId(null);
        console.log("du har loggat ut");
        navigate("/");
      }
    });
  }



  return (
    <>
      Home
      {/* <Dashboard></Dashboard> */}
      <ScoreboardComponent />
      <button>
        {" "}
        <Link to={"/brushing-page"}>Börja spela</Link>
      </button>
      <ShowUser/>
      <button onClick={logOut}>Logout</button>
      <i className="fa fa-gear"></i>
    </>
  );
}
export default Home;

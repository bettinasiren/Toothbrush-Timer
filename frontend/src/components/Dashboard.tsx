import { Link, useNavigate } from "react-router-dom";
import ScoreboardComponent from "./ScoreboardComponent";
import ShowUser from "./ShowUser";
// import Dashboard from "../components/Dashboard";
import { useAuth } from "../context/UserContext";
import Button from "react-bootstrap/Button";

function Home() {
  const { userId, setUserId, setIsLoggedIn } = useAuth();

  const navigate = useNavigate();

  async function logOut() {
    await fetch("http://localhost:3000/logout/", {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      console.log(response);
      console.log(document.cookie);
      console.log(userId);
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
      <ScoreboardComponent />
      <Button>
        {" "}
        <Link to={"/brushing-page"}>Börja spela</Link>
      </Button>
      <ShowUser />
      <Button onClick={logOut}>Logout</Button>
      <i className="fa fa-gear"></i>
    </>
  );
}
export default Home;

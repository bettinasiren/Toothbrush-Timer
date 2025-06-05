import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { Container, Row, Button } from "react-bootstrap";
import ScoreboardComponent from "./ScoreboardComponent";
import ShowUser from "./ShowUser";

function Home() {
  const { userId, setUserId, setIsLoggedIn } = useAuth();

  const navigate = useNavigate();

  async function logOut() {
    await fetch("/logout/", {
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
      if (response.ok) {
        setIsLoggedIn(false);
        setUserId(null);
        navigate("/");
      }
    });
  }

  function onGetReady() {
    navigate("/brushing-page");
  }
  return (
    <Container>
      <Row>
        <ScoreboardComponent />
      </Row>
      <Row className="m-3 mb-5">
        <Button onClick={onGetReady}>Gå till spelet</Button>
      </Row>
      <Row className="m-3 mb-5">
        <ShowUser />
      </Row>
      <Row>
        <Button onClick={logOut}>
          <i className="bi bi-box-arrow-left"></i> Logga ut
        </Button>
      </Row>
    </Container>
  );
}
export default Home;

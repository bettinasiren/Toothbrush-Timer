import { Container } from "react-bootstrap";
import { useAuth } from "../context/AuthUser";

function ShowUser() {
  const { userName, userAvatarImg } = useAuth();

  return (
    <Container>
      <p>Hej {userName} !</p>
      {userAvatarImg && <img src={userAvatarImg} alt="avatar" />}
    </Container>
  );
}
export default ShowUser;

import styled, { keyframes } from "styled-components";
import { useAuth } from "../context/UserContext";
import { Container } from "react-bootstrap";

const dance = keyframes`
  0% {
    transform: translate(50px) rotate(-5deg);
  }
  30%{
    transform: translate(70px)
  }
  60% {
    transform: translate(100px) rotate(5deg);
  }
 80%{
    transform: translate(70px)
  }
  100% {
    transform: translate(50px) rotate(-5deg);
  }
`;
const Dancing = styled.img`
  animation: ${dance} 1.5s ease-in-out infinite;
`;

function DancingAvatar() {
  const { userAvatarImg } = useAuth();

  return (
    <Container>
      <Dancing src={userAvatarImg} alt="avatar" />
    </Container>
  );
}
export default DancingAvatar;

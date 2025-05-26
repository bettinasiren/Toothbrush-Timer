import styled, { keyframes } from "styled-components";
import { useAuth } from "../context/UserContext";

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
const DancingAvatar = styled.img`
  animation: ${dance} 1.5s ease-in-out infinite;
`;

function ShowUser() {
  const { userName, userAvatarImg } = useAuth();

  return (
    <>
      <div>
        <p>Användarnamn {userName}</p>
        <DancingAvatar src={userAvatarImg} alt="" />
      </div>
    </>
  );
}
export default ShowUser;

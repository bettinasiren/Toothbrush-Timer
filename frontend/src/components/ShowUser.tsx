import {useAuth} from "../context/UserContext"

function ShowUser() {
  const {  userName, userAvatarImg  }  = useAuth();



  return (
    <>
      <p>Användarnamn {userName}</p>
      <img src={userAvatarImg} alt="" />
    </>
  );
}
export default ShowUser;

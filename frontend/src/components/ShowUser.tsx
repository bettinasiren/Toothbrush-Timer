import {useAuth} from "../context/UserContext"

function ShowUser() {
  const { userId, setUserId, isLoggedIn, setIsLoggedIn } = useAuth();

  console.log(userId)

 async function getUser(){
  await fetch (`http://localhost:3000/user/${userId.id}`)
  }

  return (
    <>
      <p>Användarnamn</p>
      <p>Avatar</p>
    </>
  );
}
export default ShowUser;

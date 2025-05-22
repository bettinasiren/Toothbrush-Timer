import { useEffect, useState } from "react";
import  { useAuth }  from "../context/UserContext"

interface AvatarType {
  id: number;
  avatar: string;
}

function Avatars() {
  const [avatars, setAvatars] = useState<AvatarType[]>([]);
  const { userId } = useAuth()

  useEffect(() => {
    getAvatars();
  }, []);

  function getAvatars() {
    fetch("http://localhost:3000/avatars")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAvatars(data);
      });
  }

  async function selectAvatar(id: number) {
    await fetch(`http://localhost:3000/user/avatar?userId=${userId}&avatarId=${id}`, {
      method: "PUT",
      // body: JSON.stringify({
      // id,
      // avatar

      // }),
    })
    .then((res) => console.log(res))
    .then((json)=> console.log(json))
  }

  return (
    <>
      <p>Välj avatar </p>
      {userId}
      {avatars &&
        avatars.map((avatar) => (
          <ul onClick={() => selectAvatar(avatar.id)} key={avatar.id}>
            <img src={avatar.avatar} alt="Avatar" />
          </ul>
        ))}
      {/* {avatars &&
      avatars.map((avatar) => (
        <ul>
          <img src={avatar.data.avatar} alt="" />
        </ul>
      )} */}
      <button>spara info</button>
    </>
  );
}
export default Avatars;

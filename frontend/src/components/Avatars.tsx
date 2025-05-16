import { useEffect, useState } from "react";

interface AvatarType {
  id: number;
  avatar: string;
}


function Avatars() {
  const [avatars, setAvatars] = useState<AvatarType[]>([]);

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



  async function selectAvatar() {

    await fetch(`http://localhost:3000/user/avatar?userId=1&avatarId=2}`, {
      method: "PUT",
      body: JSON.stringify({
        userId: Number,
        avatarId: Number,
      }),
    })
    .then((res) => res.json())
    .then((json)=> console.log(json))
  }

  return (
    <>
      <p>Välj avatar </p>
      {avatars &&
        avatars.map((avatar) => (
          <ul onClick={selectAvatar} key={avatar.id}>
            <img src={avatar.avatar}  alt="Avatar" />
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

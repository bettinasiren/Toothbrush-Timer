import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

interface AvatarType {
  id: number;
  avatar: string;
}

// interface UserType {
//   username: string;
//   password: string;
//   email: string;
//   avatar_id: number;
// }
// interface AuthUserType {
//   userId: number | null;
//   isLoggedIn: boolean;
//   setUserId: (id: number | null) => void;
//   setIsLoggedIn : (isLoggedIn: boolean) => void;

// }
function CreateAccountForm() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatars, setAvatars] = useState<AvatarType[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isCreated, setIsCreated] = useState(false);

  const navigate = useNavigate()

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
  function selectAvatar(id: number) {
    setSelectedAvatar(id);
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    console.log("Email", email);
    console.log("Password", password);
    console.log("Avatar", selectedAvatar);

    await fetch("http://localhost:3000/user/", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
        selectedAvatar,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    setIsCreated(true)
    navigate("/")
  }

  return (
    <>
      {isCreated ? (
        <p> Du lyckades skapa ett konto!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <legend>
            <h3> Skapa nytt konto</h3>
          </legend>
          <label>
            Ange ett användarnamn
            <input
              name="username"
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(event) => setUserName(event.target.value)}
            />
          </label>
          <label>
            Ange din mejl-adress
            <input
              name="email"
              type="email"
              placeholder="Mejl"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Ange ett lösenord, minst 6 tecken!
            <input
              name="password"
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {avatars &&
            avatars.map((avatar) => (
              <ul onClick={() => selectAvatar(avatar.id)} key={avatar.id}>
                <img src={avatar.avatar} alt="Avatar" />
              </ul>
            ))}
          <button type="submit">Spara</button>
        </form>
      )}
    </>
  );
}
export default CreateAccountForm;

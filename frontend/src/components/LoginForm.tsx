import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(
    event: { preventDefault: () => void },
  ) {
    event.preventDefault();
    console.log("Email", email);

    await fetch("http://localhost:3000/login/", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(async (response) => {
      console.log(response);
      if (response.ok) {
        console.log("Response was ok");
        setIsLoggedIn(true);
        // await fetch(`http://localhost:3000/user/email/${email} `)
        //   .then((response) => response.json())
        //   .then((data) => {
        //     console.log(data)
        //     console.log(data.id);
        //     setUserId(data.id);
        //     // localStorage.setItem(
        //   });
        navigate("/home");
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <legend>
          <h3>Logga in för att börja borsta</h3>
        </legend>
        <label>
          Användarnamn
          <input
            name="email"
            type="email"
            placeholder="Mejl"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Lösenord
          <input
            name="password"
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Logga in</button>
      </form>
      <p>
        <Link to={"/create-account"}>Har du inget konto, skapa ett här</Link>
      </p>
    </>
  );
}
export default LoginForm;

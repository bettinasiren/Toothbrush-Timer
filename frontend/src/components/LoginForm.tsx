import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContext";

function LoginForm() {
  const { setUserId, isLoggedIn, setIsLoggedIn, userId } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data.id);
    setUserId(data.id);
    setUserId({
      name: data.username,
      id: data.id,
    });
    setIsLoggedIn(true);
  }

  return (
    <>
      Login Form
      {isLoggedIn ? (
        <>
          <p>Välkommen {userId.name}!</p>

        </>
      ) : (
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
            <Link to={"/create-account"}>
              Har du inget konto, skapa ett här
            </Link>
          </p>
        </>
      )}
    </>
  );
}
export default LoginForm;

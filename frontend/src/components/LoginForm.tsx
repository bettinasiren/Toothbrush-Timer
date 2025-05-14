import { Link } from "react-router-dom";

function LoginForm() {
  function handleSubmit() {}
  return (
    <>
      Login Form
      <form onSubmit={handleSubmit}>
        <legend>
          <h3>Logga in för att börja borsta</h3>
        </legend>
        <label>
          Användarnamn
          <input name="username" type="text" placeholder="Användarnamn" />
        </label>
        <label>
          Lösenord
          <input name="password" type="passowrd" placeholder="Lösenord" />
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

import { useState } from "react";

interface UserType {
  username: string;
  password: string;
  email: string;
  avatar_id: number;
}
function CreateAccountForm() {
  const[account, setAccount] = useState<UserType[]>([])
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("")
  const[password, setPassword] = useState("")

  async function createAccount(){

  }

  function handleSubmit() {}

  return (
    <>
      CreateAccount Form
      <form onSubmit={handleSubmit}>
        <legend>
          <h3> Skapa nytt konto</h3>
        </legend>
        <label>
          Användarnamn
          <input name="username" type="text" placeholder="Användarnamn" />
        </label>
        <label>
          Mejl
          <input name="email" type="email" placeholder="Mejl" />
        </label>
        <label>
          Lösenord
          <input name="password" type="passowrd" placeholder="Lösenord" />
        </label>
        <button type="submit">Spara</button>
      </form>
    </>
  );
}
export default CreateAccountForm;

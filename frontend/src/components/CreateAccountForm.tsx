function CreateAccountForm() {
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

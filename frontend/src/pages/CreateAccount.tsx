// import Avatars from "../components/Avatars";
import CreateAccountForm from "../components/CreateAccountForm";
import UserCreatedMessage from "../components/UserCreatedMessage";

function CreateAccount() {
  return (
    <>
      <CreateAccountForm></CreateAccountForm>
      {/* <Avatars></Avatars> */}
      <UserCreatedMessage></UserCreatedMessage>
    </>
  );
}
export default CreateAccount;

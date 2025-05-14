import Avatars from "../components/Avatars";
import CreateAccountForm from "../components/CreateAccountForm";
import ShowUser from "../components/ShowUser";

function CreateAccount() {
  return (
    <>
      <CreateAccountForm></CreateAccountForm>
      <Avatars></Avatars>
      <ShowUser></ShowUser>
    </>
  );
}
export default CreateAccount;

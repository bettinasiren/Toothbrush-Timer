
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/UserContext";
import Dashboard from "../components/Dashboard";

function Start() {
  const { isLoggedIn, isLoading } = useAuth();

  if(isLoading){
    return <div>Loading...</div>
  }


  return (
    <>
      {!isLoading && !isLoggedIn && <LoginForm />}
      {!isLoading && isLoggedIn && <Dashboard/>}
    </>
  );
}
export default Start;

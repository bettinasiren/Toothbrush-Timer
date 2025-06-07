import { useAuth } from "../context/AuthUser";
import { Container } from "react-bootstrap";
import Dashboard from "../components/Dashboard";
import LoginForm from "../components/LoginForm";

function Start() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      {!isLoading && isLoggedIn && <Dashboard />}
      {!isLoading && !isLoggedIn && <LoginForm />}
    </Container>
  );
}
export default Start;

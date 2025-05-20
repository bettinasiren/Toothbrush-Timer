import { useAuth } from "../context/UserContext";


function Dashboard() {
  const { userId, setUserId, isLoggedIn, setIsLoggedIn } = useAuth();

  function logIn(event: { preventDefault: () => void }) {
    event.preventDefault();
    setIsLoggedIn(true);
    setUserId({
      name: "Olof",
      id: 1
    });
  }

  function logOut(event: { preventDefault: () => void }) {
    event.preventDefault();
    setIsLoggedIn(false);
    setUserId(null);
  }

  return (
    <>
      <span>User is currently: {isLoggedIn ? "Logged-in" : "Logged-out"}</span>
      {isLoggedIn ? <span>User name: {userId.name}</span> : null}
      <br />
      {isLoggedIn ? (
        <button
          onClick={(event) => {
            logOut(event);
          }}
        >
          Log Out
        </button>
      ) : (
        <button
          onClick={(event) => {
            logIn(event);
          }}
        >
          Log In
        </button>
      )}
    </>
  );
}
export default Dashboard;

import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import UserContextProvider from "./context/UserContext";
import "./styles.scss";

function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={routes} />
    </UserContextProvider>
  );
}

export default App;

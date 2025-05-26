
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import UserContextProvider from "./context/UserContext";

function App() {


  return (
    <UserContextProvider>
      <RouterProvider router={routes} />
    </UserContextProvider>
  );
}

export default App;

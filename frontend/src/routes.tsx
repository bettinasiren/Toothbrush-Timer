import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import CreateAccount from "./pages/CreateAccount";
import Layout from "./components/Layout";
import BrushingPage from "./pages/BrushingPage";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { element: <Start />, path: "/" },
      { element: <Home />, path: "/home" },
      { element: <CreateAccount />, path: "/create-account" },
      { element: <BrushingPage />, path: "/brushing-page" },
    ],
  },
]);
export default routes;

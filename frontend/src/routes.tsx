import { createBrowserRouter } from "react-router-dom";
import CreateAccount from "./pages/CreateAccount";
import Layout from "./components/Layout";
import BrushingPage from "./pages/BrushingPage";
import PrivateRoutes from "./components/PrivateRoutes";
import Start from "./pages/Start";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { element: <Start />, path: "/" },
      { element: <CreateAccount />, path: "/create-account/" },
      {
        element: <PrivateRoutes />,
        children: [
          { element: <BrushingPage />, path: "/brushing-page" },
        ],
      },
    ],
  },
]);
export default routes;

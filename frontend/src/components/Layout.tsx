import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Container>
      <main>
        <Outlet />
      </main>
    </Container>
  );
}

export default Layout;

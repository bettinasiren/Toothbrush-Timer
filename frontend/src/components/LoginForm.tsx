import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { Container, Button, Form } from "react-bootstrap";
import { StarBrushLogo } from "../assets/images";
import styled from "styled-components";

const LogoImg = styled.img`
  width: 200px;
  border-radius: 1rem;
  margin-bottom: 20px;
`;

function LoginForm() {
  const { setIsLoggedIn, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();

    await fetch("/login/", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        setIsLoggedIn(true);
        navigate("/");
      }
    });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <LogoImg src={StarBrushLogo} alt="Logo" />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <legend>
            <h3>Logga in för att börja borsta</h3>
          </legend>
          <Form.Label>Mejl</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Mejl"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label> Lösenord</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        <Button type="submit">Logga in</Button>
      </Form>
      <Container className="p-3">
        <Link to="/create-account">Har du inget konto, skapa ett här</Link>
      </Container>
    </Container>
  );
}
export default LoginForm;

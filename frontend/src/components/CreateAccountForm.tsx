import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import styled from "styled-components";

interface AvatarType {
  id: number;
  avatar: string;
}

const AvatarContainer = styled.div`
  cursor: pointer;
  border-radius: 5px;
  padding: 10px;
  transition: background-color 0.3s;
  text-align: center;
`;
// interface UserType {
//   username: string;
//   password: string;
//   email: string;
//   avatar_id: number;
// }
// interface AuthUserType {
//   userId: number | null;
//   isLoggedIn: boolean;
//   setUserId: (id: number | null) => void;
//   setIsLoggedIn : (isLoggedIn: boolean) => void;

// }
function CreateAccountForm() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatars, setAvatars] = useState<AvatarType[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isCreated, setIsCreated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAvatars();
  }, []);

  function getAvatars() {
    fetch("http://localhost:3000/avatars")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAvatars(data);
      });
  }
  function selectAvatar(id: number) {
    setSelectedAvatar(id);
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    console.log("Email", email);
    console.log("Password", password);
    console.log("Avatar", selectedAvatar);

    await fetch("http://localhost:3000/user/", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
        selectedAvatar,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    setIsCreated(true);
  }

  function handleButtonClick() {
    navigate("/");
  }

  return (
    <>
      {" "}
      <Button onClick={handleButtonClick}>
        <i className="bi bi-arrow-return-left"></i>{" "}
      </Button>
      {isCreated ? (
        <Container>
          <p> Du lyckades skapa ett konto!</p>
          {/* <Button onClick={handleButtonClick}>
            <i className="bi bi-arrow-return-left"></i>{" "}
          </Button> */}
        </Container>
      ) : (
        <Container>
          <Form onSubmit={handleSubmit}>
            <legend>
              <h3> Skapa nytt konto</h3>
            </legend>
            <Form.Group className="mb-3" controlId="formBasicUserName">
              <Form.Label> Ange ett användarnamn</Form.Label>
              <Form.Control
                name="username"
                type="text"
                placeholder="Användarnamn"
                value={username}
                onChange={(event) => setUserName(event.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ange din mejl-adress</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Mejl"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Form.Text className="text-muted">
                Din mejladress kommer inte delas med någon annan
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label> Ange ett lösenord</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Form.Text className="text-muted">
                Lösenordet måste vara minst 6 tecken långt
              </Form.Text>
            </Form.Group>

            <h2>Välj din avatar</h2>
            <Row>
              {avatars &&
                avatars.map((avatar) => (
                  <Col xs={6} md={4} key={avatar.id} className="mb-3">
                    <AvatarContainer
                      key={avatar.id}
                      onClick={() => selectAvatar(avatar.id)}
                      style={{
                        backgroundColor:
                          selectedAvatar === avatar.id
                            ? "#111010"
                            : "transparent",
                      }}
                    >
                      <img src={avatar.avatar} alt="Avatar" />
                    </AvatarContainer>
                  </Col>
                ))}
            </Row>
            <Button type="submit">Spara</Button>
          </Form>
        </Container>
      )}
    </>
  );
}
export default CreateAccountForm;

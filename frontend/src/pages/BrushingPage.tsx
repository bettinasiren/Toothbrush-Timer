import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BrushingTimer from "../components/BrushingTimer";

function BrushingPage() {
  const navigate = useNavigate();

  function handleButtonClick() {
    navigate("/");
  }

  return (
    <>
      <Button className="btn-custom" onClick={handleButtonClick}>
        <i className="bi bi-arrow-return-left"></i> Tillbaka
      </Button>
      <BrushingTimer />
    </>
  );
}
export default BrushingPage;

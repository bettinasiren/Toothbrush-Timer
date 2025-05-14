import { Link } from "react-router-dom";

function ShowUser() {
  return (
    <>
      <p>Ditt konto är skapat, visa namn och bild</p>
      <button> <Link to={"/home"}> Gå till Home-sidan</Link></button>
    </>
  );
}
export default ShowUser;

import { Link } from "react-router-dom";
// import ShowUser from "./ShowUser";

function UserCreatedMessage() {
  return (
    <>
      {/* <ShowUser></ShowUser> */}
      <button>
        {" "}
        <Link to={"/"}> Gå tillbaka till Förstasidan</Link>
      </button>
    </>
  );
}
export default UserCreatedMessage

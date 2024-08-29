import { useSelector } from "react-redux";
import { selectAllUsers } from "./usersSlice";
import { Link } from "react-router-dom";

const UsersView = () => {
  const allUsers = useSelector(selectAllUsers);

  const usersList = allUsers.map((user) => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ));

  return (
    <section>
      <h2>Users</h2>
      <ul>{usersList}</ul>
    </section>
  );
}
export default UsersView;
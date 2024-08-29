import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";

const UsersOptions = () => {
  const users = useSelector(selectAllUsers);

  const usersOptions = users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
  ));

  return (
    <>
      <option value=""></option>
      {usersOptions}
    </>
  );
};
export default UsersOptions;

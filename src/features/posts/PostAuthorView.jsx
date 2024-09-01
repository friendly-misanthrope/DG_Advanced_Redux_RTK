import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { Link } from 'react-router-dom';

const PostAuthorView = ({userId}) => {
  const users = useSelector(selectAllUsers);
  const author = users.find(user => user.id === userId);

  return (
    <span>by {author? <Link to={`/users/${userId}`}>
      {author.name}
    </Link> : 'Unknown Author'}</span>
  )
}

export default PostAuthorView;
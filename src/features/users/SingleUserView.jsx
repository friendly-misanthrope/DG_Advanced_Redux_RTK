import { useSelector } from "react-redux";
import { selectUserById } from "./usersSlice";
import { selectPostsByUser } from "../posts/postsSlice";
import { Link, useParams } from "react-router-dom";

const SingleUserView = () => {
  const { userId } = useParams();
  const user = useSelector(state => selectUserById(state, Number(userId)));

  const userPosts = useSelector(state => selectPostsByUser(state, Number(userId)));

  const postLinks = userPosts.map((post) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{`Posts by ${user?.name}`}</h2>
      <ol>{postLinks}</ol>
    </section>
  );
}
export default SingleUserView;
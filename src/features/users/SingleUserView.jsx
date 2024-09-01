import { useSelector } from "react-redux";
import { selectUserById } from "./usersSlice";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";
import { BallTriangle } from "react-loader-spinner";

import { Link, useParams } from "react-router-dom";

const SingleUserView = () => {
  const { userId } = useParams();
  const user = useSelector(state => selectUserById(state, Number(userId)));

  const {
    data: userPosts,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsByUserIdQuery();

  let content;

  if (isLoading) {
    content = 
    <>
      <p className="loader">Loading...</p>
      <div className="loader">
        <BallTriangle 
        height={100}
        color="#61dbfb" />
      </div>
    </>
  } else if (isSuccess) {
    const { ids, entities } = userPosts;
    content = ids.map((id) => (
      <li key={id}>
        <Link to={`/post/${id}`}>{entities[id].title}</Link>
      </li>
    ));
  } else if (isError) {
    content =
    <p>{ error }</p>
  }

  return (
    <section>
      <h2>{`Posts by ${user?.name}`}</h2>
      <ol>{content}</ol>
    </section>
  );
}
export default SingleUserView;
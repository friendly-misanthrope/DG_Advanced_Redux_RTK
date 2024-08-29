
import { useSelector } from "react-redux";
import { BallTriangle } from "react-loader-spinner";
import PostsExcerpt from "./PostsExcerptView";
import {
  selectPostIds,
  getPostsStatus,
  getPostsError,
} from "./postsSlice";

const PostsView = () => {

  // postsSlice selectors
  const orderedPostIds = useSelector(selectPostIds)
  const postsStatus = useSelector(getPostsStatus);
  const postsError = useSelector(getPostsError);

  let content;

  // Loading spinner
  if (postsStatus === "pending") {
    content = 
    <>
      <p className="loader">Loading...</p>
      <div className="loader">
        <BallTriangle 
        height={100}
        color="#61dbfb" />
      </div>
    </>
    // Render post content if fetch successful
  } else if (postsStatus === "fulfilled") {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
    // PostsView content if fetch not successful
  } else if (postsStatus === "rejected") {
    content = <p>{postsError}</p>;
  }

  return (
    <section>
      {content}
    </section>
  );
};

export default PostsView;
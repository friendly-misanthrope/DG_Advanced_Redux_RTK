
import { useSelector } from "react-redux";
import { BallTriangle } from "react-loader-spinner";
import PostsExcerpt from "./PostsExcerptView";
import { selectPostIds } from "./postsSlice";
import { useGetPostsQuery } from "./postsSlice";

const PostsView = () => {

  const {
    isLoading,
    isSuccess,
    isError,
    error: postsError
  } = useGetPostsQuery();

  // postsSlice selectors
  const orderedPostIds = useSelector(selectPostIds);

  let content;

  // Loading spinner
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
    // Render post content if fetch successful
  } else if (isSuccess) {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
    // PostsView content if fetch not successful
  } else if (isError) {
    content = <p>{postsError}</p>;
  }

  return (
    <section>
      {content}
    </section>
  );
};

export default PostsView;
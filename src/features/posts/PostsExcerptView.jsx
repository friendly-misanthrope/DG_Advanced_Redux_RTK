// import React from "react";
import PostAuthorView from "./PostAuthorView";
import CreatedAt from "./CreatedAtView";
import ReactionsView from "./ReactionsView";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

let PostsExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId));
  
  return (
    <article>
      <h2>{post.title}</h2>
      {
        post.body.length > 75 ?
        <p className="excerpt">{post.body.substring(0, 75)}...</p>
          : <p className="excerpt">{post.body}</p>
      }
      
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthorView userId={post.userId} />
        <CreatedAt timestamp={post.createdAt} />
      </p>
      <ReactionsView post={post} />
    </article>
  );
}

// PostsExcerpt = React.memo(PostsExcerpt);
export default PostsExcerpt;
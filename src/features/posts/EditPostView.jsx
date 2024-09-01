import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectPostById, useUpdatePostMutation } from "./postsSlice";
import UsersOptions from "./UsersOptions";


const EditPostView = () => {
  // Hooks
  const { postId } = useParams();
  const navigate = useNavigate();
  const [updatePost, { isLoading }] = useUpdatePostMutation();

  // Post selector
  const postToEdit = useSelector((state) => selectPostById(state, Number(postId)));

  if (!postToEdit) {
    return (
      <section>
        <h2>This post doesn't exist!</h2>
      </section>
    );
  }

  const [editedPost, setEditedPost] = useState({
    id: postToEdit.id,
    title: postToEdit.title,
    body: postToEdit.body,
    userId: postToEdit.userId,
    reactions: postToEdit.reactions,
    createdAt: postToEdit.createdAt
  });

  const { title, body, userId } = editedPost;

  const postChangeHandler  = (e) => {
    setEditedPost(prevState => {
      return {...prevState, [e.target.name]: e.target.value}
    });
  }

  const postIsValid = [title, body, userId].every(Boolean) && !isLoading;
  
  const updatePostOnClick = async (e) => {
    e.preventDefault();
    if (postIsValid) {
      try {
        await updatePost(postToEdit).unwrap();
        setEditedPost({
          title: '',
          body: '',
          userId: ''
        });
        navigate(`/post/${postToEdit.id}`);
      } catch(err) {
        console.error('Unable to update post\n', err);
      }
    }
  }
  
  return (
    <section>
      <h2>Update Post</h2>
      <form>
        <label htmlFor="title">Post Title: </label>
        <input type="text"
        id="title"
        name="title"
        value={title}
        onChange={postChangeHandler} />

        <label htmlFor="userId">Author: </label>
        <select name="userId"
        id="userId"
        value={userId}
        onChange={postChangeHandler} >
          <UsersOptions />
        </select>

        <label htmlFor="body">Post Content: </label>
        <textarea
        rows="5"
        name="body"
        id="body"
        value={body}
        onChange={postChangeHandler} />

        <button
        onClick={updatePostOnClick}
        disabled={!postIsValid}>
          Update Post
        </button>
      </form>
    </section>
  );
}
export default EditPostView;
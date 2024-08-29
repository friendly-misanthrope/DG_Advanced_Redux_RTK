import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { selectPostById, deletePost } from './postsSlice';
import PostAuthorView from './PostAuthorView';
import CreatedAt from './CreatedAtView';
import ReactionsView from './ReactionsView';

const SinglePostView = () => {

  const { postId } = useParams();
  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDeletePostClicked = (e) => {
    e.preventDefault();
    if (post) {
      if (window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )){
        dispatch(deletePost(post));
        navigate('/');
      }
    }
  }

  if (post) {
    return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className="postCredit">
        <Link to={`/post/edit/${post.id}`}>Edit</Link>
        <Link onClick={onDeletePostClicked}>Delete</Link>
        <PostAuthorView userId={post.userId} />
        <CreatedAt timestamp={post.createdAt} />
      </p>
      <ReactionsView post={post} />
    </article>
    );
  }
  return (
    <section>
      <h2>This post doesn't exist!</h2>
    </section>
  );
}

export default SinglePostView;

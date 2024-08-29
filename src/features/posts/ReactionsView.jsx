import { useDispatch } from "react-redux";
import { reactionAdded, reactionRemoved } from "../posts/postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😲",
  heart: "❤",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionsView = ({ post }) => {

  const dispatch = useDispatch();
  
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    
    const addReaction = () => {
      dispatch(reactionAdded({ postId: post.id, reaction: name }));
    }

    const removeReaction = (e) => {
      e.preventDefault();
      dispatch(reactionRemoved({ postId: post.id, reaction: name }));
    }

    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={addReaction}
        onContextMenu={removeReaction}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>
};
export default ReactionsView;

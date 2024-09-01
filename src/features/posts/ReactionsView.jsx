import { useAddReactionMutation } from "../posts/postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😲",
  heart: "❤",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionsView = ({ post }) => {

  const [addReaction] = useAddReactionMutation();
  
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    
    const onReactionAddClick = () => {
      const newReactionCount = post.reactions[name] + 1;
      addReaction({ postId: post.id, reactions: { ...post.reactions, [name]: newReactionCount } });
    }

    // const onReactionRemoveClick = (e) => {
    //   e.preventDefault();
    //   dispatch(reactionRemoved({ postId: post.id, reaction: name }));
    // }

    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={onReactionAddClick}
        // onContextMenu={removeReaction}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>
};
export default ReactionsView;

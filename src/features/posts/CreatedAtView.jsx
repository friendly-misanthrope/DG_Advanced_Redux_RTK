import { parseISO, formatDistanceToNow } from 'date-fns';

const CreatedAt = ({timestamp}) => {
  let timeAgo ='';

  if (timestamp) {
    const createdAt = parseISO(timestamp);
    const timeSince = formatDistanceToNow(createdAt);
    timeAgo = `${timeSince} ago`;

  }
  return (
    <span title = {parseISO(timestamp)}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  )
}
export default CreatedAt;
import { 
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter
 } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import axios from 'axios';
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
});

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => (
  await axios.get(POSTS_URL)
    .then((response) => response.data)
    .catch(e => console.error(e))
));

export const addPost = createAsyncThunk('posts/addPost', async (newPost) => (
  await axios.post(POSTS_URL, newPost)
    .then((response) => response.data)
    .catch((e) => console.error(e))
));

export const editPost = createAsyncThunk('posts/editPost', async (editedPost) => {
  try {
    const { id } = editedPost;
    const res = await axios.put(`${POSTS_URL}/${id}`, editedPost)
    return res.data
  } catch(err) {
    // return err.message;
    return editedPost; // Return edited post to update state for posts that don't exist on fake API
  }  
});

export const deletePost = createAsyncThunk('posts/deletePost', async (postToDelete) => {
  const { id } = postToDelete;
  return await axios.delete(`${POSTS_URL}/${id}`, postToDelete)
    .then((response) => {
      if (response.status === 200) {
        return postToDelete;
      }
      return `${response.status}: ${response.statusText}`;
    });
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const {postId, reaction} = action.payload;
      const post = state.entities[postId];
      if (post) {
        post.reactions[reaction]++;
      }
    },
    reactionRemoved(state, action) {
      const {postId, reaction} = action.payload;
      const post = state.entities[postId];
      if (post && post.reactions[reaction] > 0) {
        post.reactions[reaction]--;
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        const posts = action.payload.map(post => {
          post.createdAt = sub(new Date(), { minutes: Math.random() * 500 }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post;
        });
        postsAdapter.upsertMany(state, posts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        action.payload.id = state.posts.length + 1;
        action.payload.userId = Number(action.payload.userId);
        action.payload.createdAt = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0
        }
        state.posts.push(action.payload);
        postsAdapter.addOne(action.payload);
      })
      .addCase(editPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        if (!action.payload?.id) {
          console.error("No post ID provided, update failed\n", action.payload);
          return;
        }
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.error('No post ID provided, delete failed', action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id);
      });
  } 
});

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts);

// createSelector creates a memoized selector which takes
// any number of input fns and uses their return values
// in the output fn to return a new value
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
);

export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const { postAdded, reactionAdded, reactionRemoved } = postsSlice.actions;
export default postsSlice.reducer;
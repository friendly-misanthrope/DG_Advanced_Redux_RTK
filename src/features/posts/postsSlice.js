import { 
  createSelector,
  createEntityAdapter
} from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import { apiSlice } from '../api/apiSlice';

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: allPosts => {
        const loadedPosts = allPosts.map(post => {
          if (!post.createdAt)
            post.createdAt = sub(
              new Date(),
              { minutes: Math.random() * 500 }
            ).toISOString();
          
          if (!post.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0
            }
            return post;
        })
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        { type: 'Post', id: "POSTLIST" },
        ...result.ids.map(id => ({ type: 'Post', id }))
      ]
    }),
    getPostsByUserId: builder.query({
      query: id => `/posts/?userId=${id}`,
      transformResponse: postsData => {
        const loadedPosts = postsData.map(post => {
          if (!post.createdAt)
            post.createdAt = sub(
              new Date(),
              { minutes: Math.random() * 500 }
            ).toISOString();
  
            if (!post.reactions)
              post.reactions = {
                thumbsUp: 0,
                wow: 0,
                heart: 0,
                rocket: 0,
                coffee: 0
              }
              return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        console.log(result);
        return [
          ...result.ids.map(id => ({type: 'Post', id}))
        ];
      }
    }),
    addNewPost: builder.mutation({
      query: newPost => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...newPost,
          userId: Number(newPost.userId),
          createdAt: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
        }
      }),
      invalidatesTags: [
        { type: 'Post', id: "POSTLIST" }
      ]
    }),
    updatePost: builder.mutation({
      query: postToUpdate => ({
        url: `/posts/${postToUpdate.id}`,
        method: 'PUT',
        body: {
          ...postToUpdate,
          // todo: try using updatedAt field instead
          createdAt: new Date().toISOString()
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.id }
      ] 
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id } 
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.id }
      ]
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        body: { reactions }
      }),
      async onQueryStarted({ postId, reactions }, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
            const post = draft.entities[postId];
            if (post) post.reactions = reactions;
          })
        )
        try {
          await queryFulfilled;
        } catch(e) {
          patchResult.undo();
        }
      }
    })
  })
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation
} = extendedApiSlice;

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
  selectPostsResult,
  postsResult => postsResult.data
);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState);

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
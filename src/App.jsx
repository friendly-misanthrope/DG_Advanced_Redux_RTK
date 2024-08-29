import AddPostView from "./features/posts/AddPostView";
import PostsView from "./features/posts/PostsView";
import SinglePostView from "./features/posts/SinglePostView";
import Layout from "./components/Layout";
import EditPostView from "./features/posts/EditPostView";
import UsersView from "./features/users/UsersView";
import SingleUserView from "./features/users/SingleUserView";
import { Route, Routes, Navigate } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsView />} />

        <Route path="post">
          <Route index element={<AddPostView />} />
          <Route path=":postId" element={<SinglePostView />} />
          <Route path="edit/:postId" element={<EditPostView />} />
        </Route>

        <Route path='users'>
          <Route index element={<UsersView />} />
          <Route path=':userId' element={<SingleUserView />} />
        </Route>

        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  );
};

export default App;

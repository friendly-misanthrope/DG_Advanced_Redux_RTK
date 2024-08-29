import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

const initialState = [
  {
    id: 11,
    name: "Dude Lebowski",
  },
  {
    id: 12,
    name: "Neil Young"
  },
  {
    id: 13,
    name: "King Leonidas"
  },
  {
    id: 14,
    name: "John Prine"
  }
];

export const fetchUsers = createAsyncThunk('users/fetchUsers', () => (
  axios.get(USERS_URL)
    .then((response) => response.data)
));

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.push(...action.payload)
    }
    );
  }
});

export const selectAllUsers = (state) => state.users;
export const selectUserById = (state, userId) =>
  state.users.find(user => user.id == userId)
export default usersSlice.reducer;
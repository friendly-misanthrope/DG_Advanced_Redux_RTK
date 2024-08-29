import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes: ['Post'],
  endpoints: (builder) => {

  }
});
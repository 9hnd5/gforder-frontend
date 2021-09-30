import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';

export const baseApi = createApi({
   baseQuery: fetchBaseQuery({
      baseUrl: process.env.REACT_APP_API_URL,
      prepareHeaders: (headers, { getState }) => {
         const auth = (getState() as RootState).authentication.auth;
         let token: string = '';
         if (auth !== undefined) token = auth.token;
         if (token) {
            headers.set('authorization', `Bearer ${token}`);
         }
         return headers;
      },
   }),
   endpoints: () => ({}),
});

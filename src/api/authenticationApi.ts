import { HTTP_METHOD } from 'constants/httpMethod';
import { Authentication } from 'features/Authentication/type';
import { baseApi } from './baseApi';
const url = 'Accounts';
const authenticationApi = baseApi.injectEndpoints({
   endpoints: build => ({
      login: build.mutation<Authentication, any>({
         query: data => ({
            url: `${url}/login`,
            method: HTTP_METHOD.POST,
            body: data,
         }),
      }),
   }),
});

export const { useLoginMutation } = authenticationApi;

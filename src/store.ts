import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import { Modal } from 'antd';
import { baseApi } from 'api/baseApi';
import { LOCAL_STORAGE } from 'constants/localStorage';
import { setAuth } from 'features/Authentication/slice';
import { Authentication } from 'features/Authentication/type';
import { history } from 'index';
import React from 'react';
import {
  purchasePrice,
  authentication,
  purchaseRequest,
  purchaseOrder,
  vendor,
  goodsPOReceipt,
  goodsTransfer,
  role,
  user,
  userOrder,
  item,
  userPrice,
} from './features/slice';
import layout from './layouts/slice';

const errorLoggerMiddleware = (api: any) => (next: any) => (action: any) => {
  if (isRejectedWithValue(action) && action?.payload?.status === 401) {
    Modal.warning({
      title: 'Yêu cầu đăng nhập',
      content: React.createElement('p', null, 'Phiên đăng nhập đã hết hạn!'),
      onOk: (): any => {
        localStorage.removeItem(LOCAL_STORAGE.USER);
        api.dispatch(setAuth({} as Authentication));
        history.push('/');
      },
    });
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    vendor,
    purchasePrice,
    purchaseRequest,
    purchaseOrder,
    goodsPOReceipt,
    goodsTransfer,
    authentication,
    layout,
    role,
    user,
    userOrder,
    item,
    userPrice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware, errorLoggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

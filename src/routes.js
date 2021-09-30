import React from 'react';
import {
  Authentication,
  GoodsPOReceipt,
  GoodsTransfer,
  PurchaseOrder,
  PurchasePrice,
  PurchaseRequest,
  Role,
  User,
  Vendor,
  Order,
  Item,
  UserPrice,
} from './features/index';

export const routes = [
  {
    path: '/login',
    exact: false,
    Component: <Authentication />,
  },
  {
    path: '/master-data/user',
    exact: false,
    Component: (
      <React.Fragment>
        <User />
        <UserPrice />
      </React.Fragment>
    ),
  },
  {
    path: '/master-data/purchase-price',
    exact: false,
    Component: <PurchasePrice />,
  },
  {
    path: '/master-data/role',
    exact: false,
    Component: <Role />,
  },
  {
    path: '/master-data/vendor',
    exact: false,
    Component: <Vendor />,
  },
  {
    path: '/master-data/item',
    exact: false,
    Component: <Item />,
  },
  {
    path: '/purchasing/purchase-request',
    exact: false,
    Component: <PurchaseRequest />,
  },
  {
    path: '/purchasing/purchase-order',
    exact: false,
    Component: <PurchaseOrder />,
  },
  {
    path: '/purchasing/goods-receipt-po',
    exact: false,
    Component: <GoodsPOReceipt />,
  },
  {
    path: '/purchasing/goods-transfer',
    exact: false,
    Component: <GoodsTransfer />,
  },
  {
    path: '/ordering/order',
    exact: false,
    Component: <Order />,
  },
];

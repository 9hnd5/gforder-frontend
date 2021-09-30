import {
   AppstoreAddOutlined,
   CodepenOutlined,
   CodeSandboxOutlined,
   FundViewOutlined,
   ScheduleOutlined,
   SwapOutlined,
   TrademarkOutlined,
   UserAddOutlined,
   WindowsOutlined,
} from '@ant-design/icons';
import { isObject } from 'lodash';
import { useEffect, useState } from 'react';

export const useLocalStorage = (key, defaultValue) => {
   const [value, setValue] = useState(defaultValue);

   console.log('value', value);
   const setState = object => {
      try {
         if (isObject(object)) {
            localStorage.setItem(key, JSON.stringify(object));
         } else {
            localStorage.setItem(key, object);
         }
         setValue(object);
      } catch (erros) {
         console.log(erros);
      }
   };
   const removeState = () => {
      localStorage.removeItem(key);
      setValue({});
   };
   useEffect(() => {
      if (key) {
         const item = localStorage.getItem(key);
         setValue(JSON.parse(item));
      }
   }, [key]);
   return [value, setState, removeState];
};

const mainMenu = [
   {
      id: 1,
      name: 'Master Data',
      icon: <FundViewOutlined />,
      subMenu: [
         {
            id: 1,
            name: 'User',
            icon: <UserAddOutlined />,
            path: '/master-data/user-management',
         },
         {
            id: 2,
            name: 'Purchase Price',
            icon: <ScheduleOutlined />,
            path: '/master-data/purchase-price-management',
         },
         {
            id: 3,
            name: 'Role',
            icon: <CodeSandboxOutlined />,
            path: '/master-data/role-management',
         },
         {
            id: 4,
            name: 'Vendor',
            icon: <CodepenOutlined />,
            path: '/master-data/vendor-management',
         },
      ],
   },
   {
      id: 2,
      name: 'Purchasing',
      icon: <TrademarkOutlined />,
      subMenu: [
         {
            id: 5,
            name: 'Purchase Request',
            icon: <WindowsOutlined />,
            path: '/purchasing/purchase-request-management',
         },
         {
            id: 6,
            name: 'Purchase Order',
            icon: <AppstoreAddOutlined />,
            path: '/purchasing/purchase-order-management',
         },
         {
            id: 7,
            name: 'Purchase Order Receipt',
            icon: <AppstoreAddOutlined />,
            path: '/purchasing/purchase-order-receipt-management',
         },
         {
            id: 8,
            name: 'Goods Transfer',
            icon: <SwapOutlined />,
            path: '/purchasing/goods-transfer-management',
         },
      ],
   },
];

export const useRoute = () => {};

export const useMenu = () => {
   const [menus, setMenus] = useState([]);
   useEffect(() => {
      setMenus(mainMenu);
   }, [menus]);
   return menus;
};

import '@ant-design/pro-card/dist/card.css';
import '@ant-design/pro-layout/dist/layout.css';
import { useLocalStorageState, useToggle } from 'ahooks';
import { Layout as AntdLayout } from 'antd';
import 'antd/dist/antd.css';
import { LOCAL_STORAGE } from 'constants/localStorage';
import { setAuth } from 'features/Authentication/slice';
import { Authentication } from 'features/Authentication/type';
import { isEmpty } from 'lodash';
import { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { routes } from 'routes';
import Header from './Header';
import './Layout.scss';
import Sider from './Sider';
const { Content, Footer } = AntdLayout;
export const LayoutContext = createContext<any>({});

export default function Layout() {
   const [collapsed, { toggle }] = useToggle();
   const [auth] = useLocalStorageState<Authentication>(LOCAL_STORAGE.USER);
   const dispatch = useDispatch();
   useEffect(() => {
      if (!isEmpty(auth)) dispatch(setAuth(auth!));
   }, [auth, dispatch]);
   return (
      <LayoutContext.Provider value={{ collapsed, toggle }}>
         <AntdLayout style={{ minHeight: '100vh' }}>
            <Sider />
            <AntdLayout>
               <Header style={{ marginBottom: 8 }} />
               <Content>
                  <Switch>
                     {routes.map(({ path, exact, Component }, key) => (
                        <Route key={key} path={path} exact={exact} render={() => Component} />
                     ))}
                  </Switch>
               </Content>
               <Footer style={{ textAlign: 'center', background: '#fff', marginTop: 8 }}>
                  GreenFeed ©2021 Created by ERP
               </Footer>
            </AntdLayout>
         </AntdLayout>
      </LayoutContext.Provider>
   );
}

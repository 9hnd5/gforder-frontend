import {
  AccountBookOutlined,
  BlockOutlined,
  CloudOutlined,
  ClusterOutlined,
  ContactsOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  ScheduleOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  ToolOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocalStorageState } from 'ahooks';
import { Col, Dropdown, Layout, Menu, Row } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { LOCAL_STORAGE } from 'constants/localStorage';
import { setAuth } from 'features/Authentication/slice';
import { Authentication } from 'features/Authentication/type';
import { useAppSelector } from 'hooks/reduxHooks';
import { find, isEmpty } from 'lodash';
import React, { createElement, useContext, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { LayoutContext } from './Layout';
const { Header: AntdHeader } = Layout;

const MenuStyle = styled(Menu)`
  border: 0px;
`;
const MenuItemStyle = styled(Menu.Item)`
  display: flex !important;
  align-items: center;
  justify-content: center;
`;
const HeaderStyle = styled(AntdHeader)`
  background: #fff;
  height: 40px;
  line-height: 40px;
  padding: 0px 30px;
`;

interface Props {
  style?: React.CSSProperties;
}

export default function Header(props: Props) {
  return (
    <HeaderStyle style={props.style}>
      <Row gutter={[8, 0]}>
        <HeaderLeft />
        <HeaderRight />
      </Row>
    </HeaderStyle>
  );
}

function HeaderRight() {
  const user = useAppSelector(s => s.authentication.auth.user);
  const [, setUserToLocalStorage] = useLocalStorageState<Authentication>(LOCAL_STORAGE.USER);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    setUserToLocalStorage({} as Authentication);
    dispatch(setAuth({} as Authentication));
    history.push(`/login`);
  };
  const handleLogin = () => {
    history.push('/login');
  };
  const MenuDropdownStyle = (
    <Menu>
      {isEmpty(user) ? (
        <Menu.Item key={1} onClick={handleLogin} icon={<LogoutOutlined />}>
          Login
        </Menu.Item>
      ) : (
        <Menu.Item key={1} onClick={handleLogout} icon={<LogoutOutlined />}>
          Logout
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <Col style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={4}>
      <Dropdown overlay={MenuDropdownStyle} trigger={['click']}>
        <UserOutlined />
      </Dropdown>
    </Col>
  );
}

const iconMap: { [key: string]: JSX.Element } = {
  userIcon: <UserAddOutlined />,
  userListIcon: <OrderedListOutlined />,
  priceListIcon: <OrderedListOutlined />,

  roleIcon: <ToolOutlined />,
  vendorId: <AccountBookOutlined />,
  purchasePriceIcon: <BlockOutlined />,
  purchaseRequestIcon: <CloudOutlined />,
  purchaseOrderIcon: <ClusterOutlined />,
  goodsPOReceiptIcon: <ContactsOutlined />,
  goodsTransferIcon: <SwapOutlined />,
  orderIcon: <ShoppingCartOutlined />,
  itemIcon: <ScheduleOutlined />,
  purchaseOrderListIcon: <OrderedListOutlined />,
  purchaseOrderApproveListIcon: <OrderedListOutlined />,
  purchaseRequestListIcon: <OrderedListOutlined />,
  purchaseRequestApproveListIcon: <OrderedListOutlined />,
  goodsTransferListIcon: <OrderedListOutlined />,
  goodsTransferConfirmListIcon: <OrderedListOutlined />,
  purchasePriceListIcon: <OrderedListOutlined />,
  purchasePriceApproveListIcon: <OrderedListOutlined />,
  orderListIcon: <OrderedListOutlined />,
  itemListIcon: <OrderedListOutlined />,
};
function HeaderLeft() {
  const siderId = useAppSelector(s => s.layout.siderId);
  const { collapsed, toggle } = useContext(LayoutContext);
  const location = useLocation();
  const [selectedKey, setSelectedKey] = React.useState<string>('');
  const siders = useAppSelector(s => s.authentication.auth.siders);
  const menus = useMemo(() => {
    return find(siders, { id: siderId })?.menus;
  }, [siderId, siders]);
  React.useEffect(() => {
    if (menus) {
      for (const menu of menus) {
        let path: string | undefined = '';
        if (menu.menuItems) {
          path = menu.menuItems.find(x => location.pathname.startsWith(x.menuItemPath))?.menuItemPath;
        } else {
          path = location.pathname.startsWith(menu.menuPath) ? menu.menuPath : undefined;
        }
        if (path) setSelectedKey(path);
      }
    }
  }, [location.pathname, menus]);
  const displayMenu = () => {
    return (
      <MenuStyle selectedKeys={[selectedKey]} mode="horizontal">
        {menus?.map(menu => {
          const menuItems = menu.menuItems;
          if (menuItems !== null) {
            return (
              <SubMenu icon={iconMap[menu.menuIcon]} key={menu.menuPath} title={menu.menuName}>
                {menuItems.map(menuItem => (
                  <Menu.Item icon={iconMap[menuItem.menuItemIcon]} key={menuItem.menuItemPath}>
                    <Link to={menuItem.menuItemPath}>{menuItem.menuItemName}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <MenuItemStyle icon={iconMap[menu.menuIcon]} key={menu.menuPath}>
                <Link to={menu.menuPath}>{menu.menuName}</Link>
              </MenuItemStyle>
            );
          }
        })}
      </MenuStyle>
    );
  };
  return (
    <>
      <Col xs={1}>
        {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          onClick: () => toggle(),
        })}
      </Col>
      <Col xs={19}>{displayMenu()}</Col>
    </>
  );
}

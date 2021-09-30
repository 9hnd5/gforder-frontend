import { Divider, Layout, Menu, Space } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import reactLogo from './../assets/images/reactlogo.svg';
import siderbarImg from './../assets/images/siderbar.jpg';
import { LayoutContext } from './Layout';
import { setSiderId } from './slice';
import { useLocation } from 'react-router-dom';
import { CodepenOutlined, ShopOutlined, TranslationOutlined } from '@ant-design/icons';
const { Sider: AntdSider } = Layout;
const MenuStyle = styled(Menu)`
  background: transparent;
  border: 0px;
  padding: 0px 12px;
`;
const MenuItemStyle = styled(Menu.Item)`
  color: #fff !important;
  border-radius: 4px;
  &.ant-menu-item-selected {
    background: hsla(0, 0%, 100%, 0.23) !important;
  }
  &:hover {
    color: #fff !important;
    border-radius: 4px;
    background: hsla(0, 0%, 100%, 0.13);
  }
`;
const DividerStyle = styled(Divider)`
  border-color: hsla(0, 0%, 100%, 0.23);
  margin: 16px 0px;
`;

const iconMap: { [key: string]: JSX.Element } = {
  masterDataIcon: <CodepenOutlined />,
  purchasingIcon: <TranslationOutlined />,
  orderingIcon: <ShopOutlined />,
};

export default function Sider() {
  const { collapsed } = useContext(LayoutContext);
  const dispatch = useAppDispatch();
  const siderId = useAppSelector(s => s.layout.siderId);
  const siders = useAppSelector(s => s.authentication.auth.siders);
  const location = useLocation();
  const handleClick = (id: string) => {
    dispatch(setSiderId(id));
  };
  useEffect(() => {
    if (siders) {
      const siderId = siders.find(item => location.pathname.startsWith(item.siderPath))?.id;
      if (siderId) {
        dispatch(setSiderId(siderId));
      }
    }
  }, [dispatch, siders, location.pathname]);
  return (
    <AntdSider trigger={null} collapsible collapsed={collapsed} style={{ backgroundImage: `url(${siderbarImg})` }}>
      <Space direction="vertical" align="center" style={{ height: '48px', color: '#fff', width: '100%' }}>
        <Avatar src={reactLogo} />
        <span>GF-ORDER</span>
      </Space>
      <DividerStyle type="horizontal" />
      <MenuStyle selectedKeys={[siderId + '']}>
        {siders?.map(item => (
          <MenuItemStyle icon={iconMap[item.siderIcon as string]} onClick={() => handleClick(item.id)} key={item.id}>
            {item.siderName}
          </MenuItemStyle>
        ))}
      </MenuStyle>
    </AntdSider>
  );
}

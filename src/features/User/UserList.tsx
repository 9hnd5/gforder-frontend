import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Dropdown, Input as TextField, Menu, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useDeleteUserMutation, useGetUsersQuery } from 'api/userApi';
import { PERMISSION_TYPE } from 'constants/permission';
import { Permission } from 'features/Authentication/type';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

interface ActionCellProps {
  user: UserType;
  permissions: Permission[];
  basePath: string;
}
const ActionCell = (props: ActionCellProps) => {
  const {
    user: { id },
    basePath,
  } = props;
  const history = useHistory();
  const [deleteUser] = useDeleteUserMutation();
  const handleEditClicked = () => {
    history.push(`${basePath}/add-edit/${id}`);
  };
  const handleDeleteClicked = async () => {
    await deleteUser(id).unwrap();
  };
  const handleClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'Edit':
        handleEditClicked();
        break;
      default:
        handleDeleteClicked();
        break;
    }
  };
  const menu = (
    <Menu onClick={handleClick}>
      <Menu.Item icon={<EditOutlined />} key="Edit">
        Edit
      </Menu.Item>
      <Menu.Item icon={<DeleteOutlined />} key="Delete">
        Delete
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown.Button onClick={() => history.push(`${props.basePath}/detail/${id}`)} overlay={menu} size="small">
      Detail
    </Dropdown.Button>
  );
};

interface ListProps {
  basePath: string;
}
const UserList = (props: ListProps) => {
  const { basePath } = props;
  const { permissions } = useContext(AuthContext);
  const { data: users, isFetching } = useGetUsersQuery(null);
  const history = useHistory();
  const routes = [
    {
      path: '',
      breadcrumbName: 'Master Data',
    },
    {
      path: '',
      breadcrumbName: 'User',
    },
  ];
  const columns: ColumnsType<UserType> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      ellipsis: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      ellipsis: true,
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ellipsis: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      ellipsis: true,
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_, record) => <ActionCell basePath={basePath} user={record} permissions={permissions} />,
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'User UserList',
        breadcrumb: { routes },
        onBack: () => history.goBack(),
      }}
      extra={
        <Space>
          <TextField placeholder="Search something" prefix={<SearchOutlined />} style={{ width: 250 }} />
          {hasPermission(PERMISSION_TYPE.FULL, permissions) && (
            <Button onClick={() => history.push(`${props.basePath}/add-edit`)} type="primary" icon={<PlusOutlined />}>
              Add New
            </Button>
          )}
        </Space>
      }
    >
      <ProCard size="small" bordered>
        <Table<UserType> columns={columns} dataSource={users} bordered loading={isFetching} tableLayout="fixed" size="small" />
      </ProCard>
    </PageContainer>
  );
};
export default UserList;

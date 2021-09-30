import { CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined, RetweetOutlined, SearchOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, DatePicker, Input, Space, Table, Tooltip, Menu, Dropdown } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useDeleteUserOrderMutation, useGetUserOrdersQuery } from 'api/userOrderApi';
import { PERMISSION_TYPE } from 'constants/permission';
import { UserOrderStatusEnum } from 'enums/userOrderStatus';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { setCopyId } from './slice';
import UserOrderStatus from './UserOrderStatus';

const routes = [
  { path: '', breadcrumbName: 'Ordering' },
  { path: '', breadcrumbName: 'Order List' },
];
interface UserOrderListProps {
  basePath: string;
}
const UserOrderList = (props: UserOrderListProps) => {
  const { basePath } = props;
  const { data: userOrders, isFetching } = useGetUserOrdersQuery(null);
  const columns: ColumnsType<UserOrderType> = [
    {
      title: 'Order Number',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: 'Buy Date',
      dataIndex: 'buyDate',
      ellipsis: true,
    },
    {
      title: 'Receipt Date',
      dataIndex: 'receiptDate',
      ellipsis: true,
    },
    {
      title: 'Created By',
      dataIndex: 'createdByName',
      ellipsis: true,
      render: (_, record) => record.createdBy.lastName,
    },

    {
      title: 'Note',
      dataIndex: 'note',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_, record) => <UserOrderStatus userOrderStatus={record.status} />,
    },
    {
      title: 'Action',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_, record) => <ActionCell userOrder={record} basePath={basePath} />,
    },
  ];
  return (
    <PageContainer
      header={{
        title: ' Order List',
        onBack: () => false,
        breadcrumb: { routes },
      }}
      extra={<ExtraPage basePath={basePath} />}
    >
      <ProCard size="small" bordered>
        <Table bordered columns={columns} dataSource={userOrders} size="small" tableLayout="fixed" loading={isFetching} />
      </ProCard>
    </PageContainer>
  );
};

interface ExtraPageProps {
  basePath: string;
}
const ExtraPage = (props: ExtraPageProps) => {
  const { basePath } = props;
  const { permissions } = React.useContext(AuthContext);
  const [typeSearch, setTypeSearch] = React.useState<'common' | 'from-to'>('common');
  const history = useHistory();
  const handleChangeSearch = () => (typeSearch === 'common' ? setTypeSearch('from-to') : setTypeSearch('common'));
  const handleSearchCommon = () => {};
  const handleSearchFromTo = (dateStrings: [string, string]) => {};
  return (
    <Space>
      <Space>
        <Tooltip title="Change Type Search">
          <Button onClick={handleChangeSearch} icon={<RetweetOutlined />} />
        </Tooltip>
        {typeSearch === 'common' ? (
          <Input
            onChange={handleSearchCommon}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            placeholder="Search something"
          />
        ) : (
          <DatePicker.RangePicker
            onChange={(dates, dateStrings) => handleSearchFromTo(dateStrings)}
            style={{ width: 250 }}
            placeholder={['From CreateDate', 'To CreateDate']}
          />
        )}
      </Space>
      {hasPermission(PERMISSION_TYPE.FULL, permissions) && (
        <Button onClick={() => history.push(`${basePath}/add-edit`)} key={1} icon={<PlusOutlined />} type="primary">
          Add More
        </Button>
      )}
    </Space>
  );
};
interface ActionCellProps {
  userOrder: UserOrderType;
  basePath: string;
}
const ActionCell = (props: ActionCellProps) => {
  const {
    userOrder: {
      id,
      status: { id: statusId },
    },
    basePath,
  } = props;
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [deleteUserOrder] = useDeleteUserOrderMutation();
  const isDisabledEditDelele = React.useMemo(() => statusId !== UserOrderStatusEnum.Draft, [statusId]);

  const handleEditClicked = () => history.push(`${basePath}/add-edit/${id}`);
  const handleDetailClicked = () => history.push(`${basePath}/detail/${id}`);
  const handleDeleteClicked = async () => await deleteUserOrder(id).unwrap();
  const handleCopyClicked = () => {
    dispatch(setCopyId(id));
    history.push(`${basePath}/add-edit`);
  };
  const handleDropdownClicked = ({ key }: { key: string }) => {
    switch (key) {
      case 'edit':
        handleEditClicked();
        break;
      case 'delete':
        handleDeleteClicked();
        break;
      default:
        handleCopyClicked();
        break;
    }
  };
  const menu = (
    <Menu onClick={handleDropdownClicked}>
      <Menu.Item disabled={isDisabledEditDelele} icon={<EditOutlined />} key="edit">
        Edit
      </Menu.Item>
      <Menu.Item disabled={isDisabledEditDelele} icon={<DeleteOutlined />} key="delete">
        Delete
      </Menu.Item>
      <Menu.Item icon={<CopyOutlined />} key="copy">
        Copy
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown.Button onClick={handleDetailClicked} overlay={menu}>
      Detail
    </Dropdown.Button>
  );
};

export default UserOrderList;

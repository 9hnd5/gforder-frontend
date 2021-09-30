import { CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined, RetweetOutlined, SearchOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, DatePicker, Dropdown, Input, Menu, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useDeleteUserPriceMutation, useGetUserPricesQuery } from 'api/userPriceApi';
import { PERMISSION_TYPE } from 'constants/permission';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { setCopyId } from './slice';

const routes = [
  { path: '', breadcrumbName: 'Master Data' },
  { path: '', breadcrumbName: 'User' },
  { path: '', breadcrumbName: 'Price List' },
];
interface UserPriceListProps {
  basePath: string;
}
const UserPriceList = (props: UserPriceListProps) => {
  const { basePath } = props;
  const {
    user: { id: userId },
  } = React.useContext(AuthContext);
  const history = useHistory();
  const params = React.useMemo(() => ({ createdById: { eq: userId } }), [userId]);
  const { data: userPrices, isFetching } = useGetUserPricesQuery(params, { refetchOnMountOrArgChange: true });
  const columns: ColumnsType<UserPriceType> = [
    {
      title: 'Price Number',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: 'User',
      ellipsis: true,
      render: (_, record) => record.user?.firstName,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      ellipsis: true,
    },
    {
      title: 'Purchase Org',
      ellipsis: true,
      render: (_, record) => record.purchaseOrg.name,
    },
    {
      title: 'Purchase Division',
      ellipsis: true,
      render: (_, record) => record.purchaseDivision.name,
    },
    {
      title: 'Purchase Office',
      ellipsis: true,
      render: (_, record) => record.purchaseOffice.name,
    },
    {
      title: 'Purchase Group',
      ellipsis: true,
      render: (_, record) => record.purchaseGroup.name,
    },
    {
      title: 'Action',
      ellipsis: true,
      width: 120,
      align: 'center',
      render: (_, record) => <ActionCell userPrice={record} basePath={basePath} />,
    },
  ];

  const handlePrevPage = () => history.goBack();

  return (
    <PageContainer
      header={{ title: 'Price List', breadcrumb: { routes }, onBack: handlePrevPage }}
      extra={<ExtraPage basePath={basePath} />}
    >
      <ProCard size="small" bordered>
        <Table size="small" bordered columns={columns} dataSource={userPrices} loading={isFetching} />
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
        <Button onClick={() => history.push(`${basePath}/price-list/add-edit`)} key={1} icon={<PlusOutlined />} type="primary">
          Add More
        </Button>
      )}
    </Space>
  );
};

interface ActionCellProps {
  userPrice: UserPriceType;
  basePath: string;
}
const ActionCell = (props: ActionCellProps) => {
  const {
    userPrice: { id },
    basePath,
  } = props;
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [deleteUserPrice] = useDeleteUserPriceMutation();

  const handleEditClicked = () => history.push(`${basePath}/price-list/add-edit/${id}`);
  const handleDetailClicked = () => history.push(`${basePath}/price-list/detail/${id}`);
  const handleDeleteClicked = async () => await deleteUserPrice(id).unwrap();
  const handleCopyClicked = () => {
    dispatch(setCopyId(id));
    history.push(`${basePath}/price-list/add-edit`);
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
      <Menu.Item icon={<EditOutlined />} key="edit">
        Edit
      </Menu.Item>
      <Menu.Item icon={<DeleteOutlined />} key="delete">
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

export default UserPriceList;

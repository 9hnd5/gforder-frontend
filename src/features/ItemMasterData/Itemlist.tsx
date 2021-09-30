import { CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined, RetweetOutlined, SearchOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, DatePicker, Dropdown, Input, Menu, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useDeleteItemMasterDataMutation, useGetItemMasterDataQuery } from 'api/itemMasterDataApi';
import { PERMISSION_TYPE } from 'constants/permission';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { setCopyId } from './slice';

const routes = [
  {
    path: '',
    breadcrumbName: 'Master Data',
  },
  {
    path: '',
    breadcrumbName: 'Item',
  },
];
interface ItemListProps {
  basePath: string;
}
const ItemList = (props: ItemListProps) => {
  const { basePath } = props;
  const history = useHistory();
  const { data: items } = useGetItemMasterDataQuery(null);

  const handlePrevPage = () => history.goBack();
  const columns: ColumnsType<ItemType> = [
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      ellipsis: true,
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      ellipsis: true,
    },
    {
      title: 'UoM',
      dataIndex: 'uoMName',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      ellipsis: true,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      ellipsis: true,
    },
    {
      title: 'Action',
      ellipsis: true,
      width: 120,
      align: 'center',
      render: (_, record) => <ActionCell basePath={basePath} item={record} />,
    },
  ];

  return (
    <PageContainer
      header={{ title: 'Item List', breadcrumb: { routes }, onBack: handlePrevPage }}
      extra={<ExtraPage basePath={basePath} />}
    >
      <ProCard bordered size="small">
        <Table size="small" bordered columns={columns} dataSource={items} tableLayout="fixed" />
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
  item: ItemType;
  basePath: string;
}
const ActionCell = (props: ActionCellProps) => {
  const {
    item: { itemCode },
    basePath,
  } = props;
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [deleteItem] = useDeleteItemMasterDataMutation();

  const handleEditClicked = () => history.push(`${basePath}/add-edit/${itemCode}`);
  const handleDetailClicked = () => history.push(`${basePath}/detail/${itemCode}`);
  const handleDeleteClicked = async () => await deleteItem(itemCode).unwrap();
  const handleCopyClicked = () => {
    dispatch(setCopyId(itemCode));
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
export default ItemList;

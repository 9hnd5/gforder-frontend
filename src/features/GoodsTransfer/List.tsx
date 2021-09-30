import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  RetweetOutlined,
  SearchOutlined,
  SelectOutlined
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Button, DatePicker, Dropdown, Input as TextField, Menu, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  useDeleteGoodsTransferMutation,
  useGetGoodsTransfersQuery,
  useReleaseGoodsTransfersMutation
} from 'api/goodsTransferApi';
import { useGetGoodsTransferItems1Query } from 'api/goodsTransferItemApi';
import PurchaseStatus from 'components/PurchaseStatus';
import { PERMISSION_TYPE } from 'constants/permission';
import { Permission } from 'features/Authentication/type';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import withData, { WithDataProps } from 'Hocs/withData';
import { debounce } from 'lodash';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useHistory } from 'react-router-dom';

interface ActionCellProps {
  goodsTransfer: GoodsTransferType;
  permissions: Permission[];
  basePath: string;
}
const ActionCell = (props: ActionCellProps) => {
  const {
    goodsTransfer: { id, statusId },
    basePath,
    permissions,
  } = props;
  const history = useHistory();
  const [deleteGoodsTransfer] = useDeleteGoodsTransferMutation();
  const [releaseGoodsTransfers] = useReleaseGoodsTransfersMutation();

  const handleDeleteClicked = async () => await deleteGoodsTransfer(id).unwrap();
  const handleReleaseClicked = async () => await releaseGoodsTransfers(id).unwrap();
  const handleCopyClicked = () => {
    history.push(`${basePath}/add-edit`);
  };
  const handleDropdownClicked = async ({ key }: { key: string }) => {
    switch (key) {
      case 'edit':
        history.push(`${basePath}/add-edit/${id}`);
        break;
      case 'delete':
        handleDeleteClicked();
        break;
      case 'release':
        handleReleaseClicked();
        break;
      default:
        handleCopyClicked();
        break;
    }
  };
  const menu = (
    <Menu onClick={handleDropdownClicked}>
      {hasPermission(PERMISSION_TYPE.FULL, permissions) && statusId === 1 && (
        <>
          <Menu.Item key={'edit'} icon={<EditOutlined />}>
            Edit
          </Menu.Item>
          <Menu.Item key={'delete'} icon={<DeleteOutlined />}>
            Delete
          </Menu.Item>
          <Menu.Item key={'release'} icon={<SelectOutlined />}>
            Release
          </Menu.Item>
        </>
      )}
      <Menu.Item key={'copy'} icon={<CopyOutlined />}>
        Copy
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown.Button onClick={() => history.push(`${basePath}/detail/${id}`)} size="small" overlay={menu}>
      Detail
    </Dropdown.Button>
  );
};

interface ActionCellForConfirmProps {
  goodsTransfer: GoodsTransferType;
  basePath: string;
}
const ActionCellForConfirm = (props: ActionCellForConfirmProps) => {
  const {
    goodsTransfer: { id, statusId },
    basePath,
  } = props;
  const history = useHistory();
  const isDisabledDropdown = statusId !== 2;
  const handleDropdownClicked = ({ key }: { key: string }) => {
    switch (key) {
      case 'Edit':
        handleEditClicked();
        break;
      default:
        break;
    }
  };
  const handleEditClicked = () => {
    history.push(`${basePath}/add-edit/${id}/confirm`);
  };
  const menu = (
    <Menu onClick={handleDropdownClicked}>
      <Menu.Item disabled={isDisabledDropdown} key="Edit" icon={<EditOutlined />}>
        Edit
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown.Button
      onClick={() => history.push(`${basePath}/detail/${id}`)}
      size="small"
      icon={<EllipsisOutlined />}
      trigger={['click']}
      overlay={menu}
    >
      Detail
    </Dropdown.Button>
  );
};

interface Props extends WithDataProps {
  mode: 'list' | 'confirm';
  basePath: string;
}

const List = (props: Props) => {
  const { warehouses, basePath, mode } = props;
  const history = useHistory();
  const { user, permissions } = React.useContext(AuthContext);
  const [skip, setSkip] = React.useState(true);
  const [typeSearch, setTypeSearch] = React.useState<'from-to' | 'common'>('common');
  const [idSearch, setIdSearch] = React.useState<string>('');

  const { data: goodsTransferItems } = useGetGoodsTransferItems1Query(
    React.useMemo(() => ({ warehouseIdReceipt: { in: warehouses?.map(x => x.id) } }), [warehouses]),
    { skip, refetchOnMountOrArgChange: true }
  );
  const listParams = React.useMemo(
    () => ({
      createdById: {
        eq: user.id,
      },
      id: idSearch,
    }),
    [idSearch, user.id]
  );

  const confirmParams = React.useMemo(() => {
    if (goodsTransferItems === undefined) return undefined;
    const ids = goodsTransferItems.map(item => item.goodsTransferId);
    if (ids.length === 0) return undefined;
    return {
      id: {
        in: ids,
      },
      statusId: {
        in: [2, 3],
      },
    };
  }, [goodsTransferItems]);
  const {
    data: goodsTransfers,
    isFetching,
    refetch,
  } = useGetGoodsTransfersQuery(mode === 'list' ? listParams : confirmParams ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const debounceSearch = React.useRef(
    debounce(value => {
      setIdSearch(value);
      refetch();
    }, 500)
  );
  const handleChangeSearch = () => {
    if (typeSearch === 'common') setTypeSearch('from-to');
    else setTypeSearch('common');
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debounceSearch.current(value);
  };
  const handleSearchFromTo = (dateStrings: [string, string]) => {
    console.log('dateStrings', dateStrings);
  };
  const columns: ColumnsType<GoodsTransferType> = [
    {
      title: 'GT Number',
      dataIndex: 'id',
      ellipsis: true,
      render: text => (
        <Highlighter
          highlightStyle={{ padding: 0, backgroundColor: 'yellow' }}
          autoEscape={true}
          searchWords={[idSearch]}
          textToHighlight={text}
        />
      ),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      ellipsis: true,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      ellipsis: true,
    },
    {
      title: 'Purchase Org',
      dataIndex: 'purchaseOrgName',
      ellipsis: true,
    },
    {
      title: 'Purchase Division',
      dataIndex: 'purchaseDivisionName',
      ellipsis: true,
    },
    {
      title: 'Purchase Office',
      dataIndex: 'purchaseOfficeName',
      ellipsis: true,
    },
    {
      title: 'Purchase Group',
      dataIndex: 'purchaseGroupName',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'statusId',
      align: 'center',
      render: (_, record) => <PurchaseStatus id={record.statusId} name={record.statusName} />,
      ellipsis: true,
    },
    {
      title: 'Action',
      ellipsis: true,
      align: 'center',
      width: 100,
      render: (_, record) =>
        props.mode === 'list' ? (
          <ActionCell basePath={basePath} goodsTransfer={record} permissions={permissions!} />
        ) : (
          <ActionCellForConfirm basePath={basePath} goodsTransfer={record} />
        ),
    },
  ];
  const routes = [
    {
      path: '',
      breadcrumbName: 'Purchasing',
    },
    {
      path: '',
      breadcrumbName: 'Goods Transfer',
    },
  ];
  React.useEffect(() => {
    if (mode === 'confirm') setSkip(false);
    else setSkip(true);
  }, [mode]);
  return (
    <PageContainer
      header={{
        title: 'Goods Transfer List',
        breadcrumb: { routes },
        onBack: () => history.goBack(),
      }}
      extra={
        <Space>
          <Space>
            <Button onClick={handleChangeSearch} icon={<RetweetOutlined />} />
            {typeSearch === 'common' ? (
              <TextField
                onChange={handleSearch}
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
          {mode === 'list' && (
            <Button onClick={() => history.push(`${basePath}/add-edit`)} type="primary" icon={<PlusOutlined />} key={1}>
              Add More
            </Button>
          )}
        </Space>
      }
    >
      <ProCard size="small" bordered>
        <Table<GoodsTransferType>
          columns={columns}
          dataSource={goodsTransfers}
          size="small"
          bordered
          tableLayout="fixed"
          loading={isFetching}
          rowClassName={(_, index) => (index % 2 !== 0 ? 'row-odd' : '')}
        />
      </ProCard>
    </PageContainer>
  );
};

export default withData(List);

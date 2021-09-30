import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  RetweetOutlined,
  SearchOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, DatePicker, Dropdown, Input as TextField, Menu, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  useDeleteGoodsPOReceiptMutation,
  useGetGoodsPOReceiptsQuery,
  useReleaseGoodsPOReceiptMutation,
} from 'api/goodsPOReceiptApi';
import PurchaseStatus from 'components/PurchaseStatus';
import { PERMISSION_TYPE } from 'constants/permission';
import { Permission } from 'features/Authentication/type';
import hasPermision from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch } from 'hooks/reduxHooks';
import { debounce } from 'lodash';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useHistory } from 'react-router-dom';
import { setAddModeGRPO, setGoodsPOReceiptId } from './slice';
import { GoodsPOReceipt } from './types';

interface ActionCellProps {
  record: GoodsPOReceipt;
  permissions: Permission[];
  basePath: string;
}
const ActionCell: React.FC<ActionCellProps> = ({ record, permissions, basePath }) => {
  const { id, statusId } = record;
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [deleteGoodsPOReceipt] = useDeleteGoodsPOReceiptMutation();
  const [releaseGoodsPOReceipt] = useReleaseGoodsPOReceiptMutation();
  const handleCopy = () => {
    dispatch(setGoodsPOReceiptId(id));
    history.push(`${basePath}/add-edit`);
  };
  const handleClick = async ({ key }: { key: string }) => {
    switch (key) {
      case 'EDIT':
        history.push(`${basePath}/add-edit/${id}`);
        break;
      case 'DELETE':
        handleDelete(id);
        break;
      case 'RELEASE':
        handleRelease();
        break;
      default:
        handleCopy();
        break;
    }
  };
  const menu = (
    <Menu onClick={handleClick}>
      {hasPermision(PERMISSION_TYPE.FULL, permissions) && statusId === 1 && (
        <>
          <Menu.Item key={'EDIT'} icon={<EditOutlined />}>
            Edit
          </Menu.Item>
          <Menu.Item key={'DELETE'} icon={<DeleteOutlined />}>
            Delete
          </Menu.Item>
          <Menu.Item key={'RELEASE'} icon={<SelectOutlined />}>
            Release
          </Menu.Item>
        </>
      )}
      <Menu.Item key={'COPY'} icon={<CopyOutlined />}>
        Copy
      </Menu.Item>
    </Menu>
  );
  const handleDelete = async (id: string) => {
    await deleteGoodsPOReceipt(id).unwrap();
  };
  const handleRelease = async () => {
    await releaseGoodsPOReceipt({ id, body: [] }).unwrap();
  };
  return (
    <div onClick={e => e.stopPropagation()}>
      <Dropdown.Button
        onClick={() => history.push(`${basePath}/detail/${id}`)}
        size="small"
        icon={<EllipsisOutlined />}
        trigger={['click']}
        overlay={menu}
      >
        Detail
      </Dropdown.Button>
    </div>
  );
};

interface ListProps {
  basePath: string;
}
const List = (props: ListProps) => {
  const { user, permissions } = React.useContext(AuthContext);
  const dispatch = useAppDispatch();
  const [typeSearch, setTypeSearch] = React.useState<'FROM_TO' | 'COMMON'>('COMMON');
  const [idSearch, setIdSearch] = React.useState<string>('');
  const params = React.useMemo(
    () => ({
      createdById: {
        eq: user.id,
      },
      id: idSearch,
    }),
    [user.id, idSearch]
  );
  const {
    data: goodsPOReceipts,
    isFetching,
    refetch,
  } = useGetGoodsPOReceiptsQuery(params, {
    refetchOnMountOrArgChange: true,
  });
  const debounceSearch = React.useRef(
    debounce(value => {
      setIdSearch(value);
      refetch();
    }, 500)
  );
  const handleChangeSearch = () => {
    if (typeSearch === 'COMMON') setTypeSearch('FROM_TO');
    else setTypeSearch('COMMON');
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debounceSearch.current(value);
  };
  const handleSearchFromTo = (dateStrings: [string, string]) => {
    console.log('dateStrings', dateStrings);
  };
  const handleAdd = (addMode: 'FROM_PO' | 'FROM_MULTI_PO') => {
    history.push(`${props.basePath}/add-edit`);
    dispatch(setAddModeGRPO(addMode));
  };
  const history = useHistory();
  const columns: ColumnsType<GoodsPOReceipt> = [
    {
      title: 'Id',
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
      title: 'Org',
      dataIndex: 'purchaseOrgName',
      ellipsis: true,
    },
    {
      title: 'Division',
      dataIndex: 'purchaseDivisionName',
      ellipsis: true,
    },
    {
      title: 'Office',
      dataIndex: 'purchaseOfficeName',
      ellipsis: true,
    },
    {
      title: 'Group',
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
      render: (_: any, record) => <ActionCell permissions={permissions} record={record} basePath={props.basePath} />,
    },
  ];
  const routes = [
    {
      path: '',
      breadcrumbName: 'Purchasing',
    },
    {
      path: '',
      breadcrumbName: 'Goods PO Receipt',
    },
  ];
  return (
    <PageContainer
      header={{ title: 'Goods PO Receipt List', breadcrumb: { routes } }}
      extra={
        <Space>
          <Space>
            <Tooltip title="Change Type Search">
              <Button onClick={handleChangeSearch} icon={<RetweetOutlined />} />
            </Tooltip>
            {typeSearch === 'COMMON' ? (
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

          {hasPermision(PERMISSION_TYPE.FULL, permissions) && (
            <Button type="primary" onClick={() => handleAdd('FROM_MULTI_PO')} icon={<PlusOutlined />}>
              Add More
            </Button>
          )}
        </Space>
      }
    >
      <ProCard size="small" bordered>
        <Table<GoodsPOReceipt>
          columns={columns}
          dataSource={goodsPOReceipts}
          bordered
          scroll={{ x: 1000 }}
          loading={isFetching}
          size="small"
          tableLayout="fixed"
          rowClassName={(_, index) => (index % 2 !== 0 ? 'row-odd' : '')}
        />
      </ProCard>
    </PageContainer>
  );
};
export default List;

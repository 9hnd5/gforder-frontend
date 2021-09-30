import {
  CheckOutlined,
  CloseOutlined,
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
import { useToggle } from 'ahooks';
import { Button, DatePicker, Dropdown, Form, Input as TextField, Menu, Modal, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  useApprovePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useEditPurchaseOrderHandlerMutation,
  useGetPurchaseOrdersQuery,
  useRejectPurchaseOrderMutation
} from 'api/purchaseOrderApi';
import { TextAreaField } from 'components';
import PurchaseApprovals from 'components/PurchaseApprovals';
import PurchaseStatus from 'components/PurchaseStatus';
import { PERMISSION_TYPE } from 'constants/permission';
import { Permission } from 'features/Authentication/type';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch } from 'hooks/reduxHooks';
import { debounce } from 'lodash';
import React, { useContext } from 'react';
import Highlighter from 'react-highlight-words';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { setAddMode, setCopyId } from './slice';

interface ActionCellProps {
  purchaseOrder: PurchaseOrderType;
  permissions: Permission[];
  basePath: string;
}
const ActionCell = ({ purchaseOrder, permissions, basePath }: ActionCellProps) => {
  const dispatch = useAppDispatch();
  const { id, purchaseStatusId, purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId, isCreatedFromPR } =
    purchaseOrder;
  const [openModal, { toggle }] = useToggle(false);
  const [deletePurchaseOrder] = useDeletePurchaseOrderMutation();
  const [editPurchaseOrderHandler] = useEditPurchaseOrderHandlerMutation();
  const [approvePurchaseOrder] = useApprovePurchaseOrderMutation();
  const handleClick = async ({ key }: { key: string }) => {
    switch (key) {
      case 'EDIT':
        history.push(`${basePath}/add-edit/${id}`);
        break;
      case 'DELETE':
        handleDelete(id);
        break;
      case 'SEND':
        if (isCreatedFromPR) {
          console.log('app');
          const body = [
            {
              path: '/handlerMessage',
              op: 'replace',
              value: 'Auto Approve',
            },
          ];
          await approvePurchaseOrder({ id, body });
        } else {
          console.log('toggle');
          toggle();
        }
        break;
      default:
        handleCopy();
        break;
    }
  };
  const menu = (
    <Menu onClick={handleClick}>
      {hasPermission(PERMISSION_TYPE.FULL, permissions) && purchaseStatusId === 1 && (
        <>
          <Menu.Item key={'EDIT'} icon={<EditOutlined />}>
            Edit
          </Menu.Item>
          <Menu.Item key={'DELETE'} icon={<DeleteOutlined />}>
            Delete
          </Menu.Item>
          <Menu.Item key={'SEND'} icon={<SelectOutlined />}>
            Send
          </Menu.Item>
        </>
      )}
      <Menu.Item key={'COPY'} icon={<CopyOutlined />}>
        Copy
      </Menu.Item>
    </Menu>
  );
  const handleDelete = async (id: string) => {
    await deletePurchaseOrder(id).unwrap();
  };
  const handlePartialEdit = async (userId: number) => {
    const body = [
      {
        path: 'handlerId',
        op: 'replace',
        value: userId,
      },
    ];
    await editPurchaseOrderHandler({ id, body }).unwrap();
    toggle();
  };
  const handleCopy = () => {
    dispatch(setCopyId(id));
    history.push(`${basePath}/add-edit`);
  };
  const history = useHistory();
  return (
    <div onClick={e => e.stopPropagation()}>
      <Dropdown.Button
        onClick={() => history.push(`${basePath}/detail/${id}`)}
        icon={<EllipsisOutlined />}
        trigger={['click']}
        overlay={menu}
        size="small"
      >
        Detail
      </Dropdown.Button>
      <Modal
        title="Danh Sách Người Duyệt"
        width={1000}
        visible={openModal}
        onCancel={() => toggle()}
        destroyOnClose
        footer={null}
      >
        <PurchaseApprovals
          purchaseOrgId={purchaseOrgId}
          purchaseDivisionId={purchaseDivisionId}
          purchaseOfficeId={purchaseOfficeId}
          purchaseGroupId={purchaseGroupId}
          onSave={handlePartialEdit}
        />
      </Modal>
    </div>
  );
};
interface FormValueType {
  handlerMessage: string;
}
function ActionCellForApproval(props: { purchaseOrder: PurchaseOrderType; basePath: string }) {
  const { id, purchaseStatusId } = props.purchaseOrder;
  const isDisabledDropdown = purchaseStatusId !== 2;
  const [actionType, setActionType] = React.useState<'REJECTED' | 'APPROVED'>();
  const { control, handleSubmit } = useForm<FormValueType>();
  const [openModal, { toggle: toggleModal }] = useToggle();
  const history = useHistory();
  const handleClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'APPROVED':
        toggleModal();
        setActionType('APPROVED');
        break;
      default:
        toggleModal();
        setActionType('REJECTED');
        break;
    }
  };
  const menu = (
    <Menu onClick={handleClick}>
      <Menu.Item disabled={isDisabledDropdown} key="APPROVED" icon={<CheckOutlined />}>
        Approved
      </Menu.Item>
      <Menu.Item disabled={isDisabledDropdown} key="REJECTED" icon={<CloseOutlined />}>
        Rejected
      </Menu.Item>
    </Menu>
  );
  const [approvePurchaseOrder] = useApprovePurchaseOrderMutation();
  const [rejectPurchaseOrder] = useRejectPurchaseOrderMutation();
  const handleApprovedOrRejected: SubmitHandler<FormValueType> = async formValue => {
    const body = [
      {
        path: '/handlerMessage',
        op: 'replace',
        value: formValue.handlerMessage,
      },
    ];
    if (actionType === 'APPROVED') await approvePurchaseOrder({ id, body }).unwrap();
    else await rejectPurchaseOrder({ id, body }).unwrap();
    toggleModal();
  };
  return (
    <>
      <Dropdown.Button
        onClick={() => history.push(`${props.basePath}/detail/${id}`)}
        size="small"
        icon={<EllipsisOutlined />}
        trigger={['click']}
        overlay={menu}
      >
        Detail
      </Dropdown.Button>
      <Modal title="Approved Message" visible={openModal} footer={null} destroyOnClose onCancel={() => toggleModal()}>
        <Form layout="vertical">
          <Form.Item label="Message">
            <TextAreaField name="handlerMessage" control={control} />
          </Form.Item>
        </Form>
        <Button onClick={handleSubmit(handleApprovedOrRejected)} type="primary">
          Save Change
        </Button>
      </Modal>
    </>
  );
}

interface PurchaseOrderListProps {
  mode: 'list' | 'approve-list';
  basePath: string;
}

const PurchaseOrderList = (props: PurchaseOrderListProps) => {
  const { mode, basePath } = props;
  var {
    user: { id },
    permissions,
  } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [typeSearch, setTypeSearch] = React.useState<'from-to' | 'common'>('common');
  const [idSearch, setIdSearch] = React.useState<string>('');
  const params = React.useMemo(() => {
    return mode === 'list'
      ? { createdById: { eq: id }, id: idSearch }
      : { purchaseStatusId: { ne: 1 }, approvedById: { eq: id }, id: idSearch };
  }, [mode, id, idSearch]);
  const {
    data: purchaseOrders,
    isFetching: isLoading,
    refetch,
  } = useGetPurchaseOrdersQuery(params, {
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
  const handleAddClicked = (addMode: 'from-single-pr' | 'from-multiple-pr' | 'common') => {
    history.push(`${basePath}/add-edit`);
    dispatch(setAddMode(addMode));
  };

  const columns: ColumnsType<PurchaseOrderType> = [
    {
      title: 'PO Number',
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
      dataIndex: 'purchaseStatusName',
      ellipsis: true,
      align: 'center',
      render: (_, record) => <PurchaseStatus id={record.purchaseStatusId} name={record.purchaseStatusName} />,
    },
    {
      title: 'Action',
      ellipsis: true,
      align: 'center',
      width: 100,
      render: (_, record) =>
        mode === 'list' ? (
          <ActionCell purchaseOrder={record} permissions={permissions!} basePath={basePath} />
        ) : (
          <ActionCellForApproval purchaseOrder={record} basePath={basePath} />
        ),
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'Purchase Order List',
        breadcrumb: {
          routes: [
            {
              path: '',
              breadcrumbName: 'Purchasing',
            },
            {
              path: '',
              breadcrumbName: 'Purchase Order',
            },
          ],
        },
        onBack: () => history.goBack(),
      }}
      extra={
        <Space>
          <Space>
            <Tooltip title="Change Type Search">
              <Button onClick={handleChangeSearch} icon={<RetweetOutlined />} />
            </Tooltip>
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
          {hasPermission(PERMISSION_TYPE.FULL, permissions) && mode === 'list' && (
            <Dropdown.Button
              key={1}
              onClick={() => handleAddClicked('common')}
              icon={<PlusOutlined />}
              type="primary"
              overlay={
                <Menu onClick={() => handleAddClicked('from-multiple-pr')}>
                  <Menu.Item>From Purchase Request</Menu.Item>
                </Menu>
              }
            >
              Add More
            </Dropdown.Button>
          )}
        </Space>
      }
    >
      <ProCard size="small" bordered>
        <Table<PurchaseOrderType>
          columns={columns}
          dataSource={purchaseOrders}
          loading={isLoading}
          tableLayout="fixed"
          bordered
          size="small"
          scroll={{ x: 1000 }}
          rowClassName={(_, index) => (index % 2 !== 0 ? 'row-odd' : '')}
        />
      </ProCard>
    </PageContainer>
  );
};
export default PurchaseOrderList;

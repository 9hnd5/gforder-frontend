import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RetweetOutlined,
  SearchOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { useToggle } from 'ahooks';
import { Button, DatePicker, Dropdown, Form, Input as TextField, Menu, Modal, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  useApprovePurchaseRequestMutation,
  useDeletePurchaseRequestMutation,
  useEditPurchaseRequestHandlerMutation,
  useGetPurchaseRequestsQuery,
  useRejectPurchaseRequestMutation,
} from 'api/purchaseRequestApi';
import { TextAreaField } from 'components';
import PurchaseApprovals from 'components/PurchaseApprovals';
import PurchaseStatus from 'components/PurchaseStatus';
import VendorDetail from 'components/VendorDetail';
import { PERMISSION_TYPE } from 'constants/permission';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch } from 'hooks/reduxHooks';
import { debounce } from 'lodash';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { setCopyId } from './slice';

interface ActionCellProps {
  purchaseRequest: PurchaseRequestType;
  basePath: string;
}
function ActionCell(props: ActionCellProps) {
  const { purchaseRequest, basePath } = props;
  const { id, purchaseStatusId, purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId } = purchaseRequest;
  const { permissions } = React.useContext(AuthContext);
  const [openModal, { toggle }] = useToggle(false);
  const [deletePurchaseRequest] = useDeletePurchaseRequestMutation();
  const [editPurchaseRequestHandler] = useEditPurchaseRequestHandlerMutation();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleOpenModal = () => toggle();
  const handleCloseModal = () => toggle();
  const handleDropdownClicked = ({ key }: { key: string }) => {
    switch (key) {
      case 'edit':
        history.push(`${basePath}/add-edit/${id}`);
        break;
      case 'delete':
        handleDelete();
        break;
      case 'send':
        handleOpenModal();
        break;
      default:
        handleCopy();
        break;
    }
  };
  const handleDelete = async () => await deletePurchaseRequest(id);
  const handlePartialEdit = async (userId: number) => {
    const body = [
      {
        path: 'handlerId',
        op: 'replace',
        value: userId,
      },
    ];
    await editPurchaseRequestHandler({ id, body }).unwrap();
    toggle();
  };
  const handleCopy = () => {
    dispatch(setCopyId(id));
    history.push(`${basePath}/add-edit`);
  };

  const menu = (
    <Menu onClick={handleDropdownClicked}>
      {hasPermission(PERMISSION_TYPE.FULL, permissions) && purchaseStatusId === 1 && (
        <React.Fragment>
          <Menu.Item key={'edit'} icon={<EditOutlined />}>
            Edit
          </Menu.Item>
          <Menu.Item key={'delete'} icon={<DeleteOutlined />}>
            Delete
          </Menu.Item>
          <Menu.Item key={'send'} icon={<SelectOutlined />}>
            Send
          </Menu.Item>
        </React.Fragment>
      )}
      <Menu.Item key={'copy'} icon={<CopyOutlined />}>
        Copy
      </Menu.Item>
    </Menu>
  );

  return (
    <React.Fragment>
      <Dropdown.Button onClick={() => history.push(`${basePath}/detail/${id}`)} size="small" overlay={menu}>
        Detail
      </Dropdown.Button>
      <Modal title="Approver List" width={1000} visible={openModal} onCancel={handleCloseModal} destroyOnClose footer={null}>
        <PurchaseApprovals
          purchaseOrgId={purchaseOrgId}
          purchaseDivisionId={purchaseDivisionId}
          purchaseOfficeId={purchaseOfficeId}
          purchaseGroupId={purchaseGroupId}
          onSave={handlePartialEdit}
        />
      </Modal>
    </React.Fragment>
  );
}

interface FormValueType {
  handlerMessage: string;
}
interface ActionCellForApprovedProps {
  purchaseRequest: PurchaseRequestType;
  basePath: string;
}
function ActionCellForApproved(props: ActionCellForApprovedProps) {
  const { basePath, purchaseRequest } = props;
  const { id, purchaseStatusId } = purchaseRequest;
  const [openModal, { toggle: toggleModal }] = useToggle();
  const [actionType, setActionType] = React.useState<'reject' | 'approve'>();
  const { control, handleSubmit } = useForm<FormValueType>();
  const [approvePurchaseRequest] = useApprovePurchaseRequestMutation();
  const [rejectPurchaseRequest] = useRejectPurchaseRequestMutation();
  const isDisabledMenu = purchaseStatusId !== 2;
  const history = useHistory();

  const handleOpenModal = () => toggleModal();
  const handleCloseModal = () => toggleModal();
  const handleDropdownClicked = ({ key }: { key: string }) => {
    switch (key) {
      case 'approve':
        toggleModal();
        setActionType('approve');
        break;
      default:
        handleOpenModal();
        setActionType('reject');
        break;
    }
  };
  const handleApprovedOrRejected: SubmitHandler<FormValueType> = async formValue => {
    const body = [
      {
        path: '/handlerMessage',
        op: 'replace',
        value: formValue.handlerMessage,
      },
    ];
    if (actionType === 'approve') await approvePurchaseRequest({ id, body }).unwrap();
    else await rejectPurchaseRequest({ id, body }).unwrap();
    toggleModal();
  };
  const menu = (
    <Menu onClick={handleDropdownClicked}>
      <Menu.Item disabled={isDisabledMenu} key="approve" icon={<CheckOutlined />}>
        Approved
      </Menu.Item>
      <Menu.Item disabled={isDisabledMenu} key="reject" icon={<CloseOutlined />}>
        Rejected
      </Menu.Item>
    </Menu>
  );

  return (
    <React.Fragment>
      <Dropdown.Button onClick={() => history.push(`${basePath}/detail/${id}`)} size="small" overlay={menu}>
        Detail
      </Dropdown.Button>
      <Modal title="Approved Message" visible={openModal} footer={null} destroyOnClose onCancel={handleCloseModal}>
        <Form layout="vertical">
          <Form.Item label="Message">
            <TextAreaField name="handlerMessage" control={control} />
          </Form.Item>
        </Form>
        <Button onClick={handleSubmit(handleApprovedOrRejected)} type="primary">
          Save Change
        </Button>
      </Modal>
    </React.Fragment>
  );
}

interface PurchaseRequestListProps {
  mode: 'list' | 'approve-list';
  basePath: string;
}
export default function PurchaseRequestList(props: PurchaseRequestListProps) {
  const { mode, basePath } = props;
  const [openVendorDetail, { toggle: toggleVendorDetail }] = useToggle();
  const {
    user: { id },
    permissions,
  } = React.useContext(AuthContext);
  const [typeSearch, setTypeSearch] = React.useState<'from-to' | 'common'>('common');
  const [idSearch, setIdSearch] = React.useState<string>('');
  const [vendorId, setVendorId] = React.useState<string>('');
  const history = useHistory();
  const params = React.useMemo(
    () =>
      mode === 'list'
        ? { createdById: { eq: id }, id: idSearch }
        : { purchaseStatusId: { ne: 1 }, approvedById: { eq: id }, id: idSearch },
    [id, mode, idSearch]
  );
  const {
    data: purchaseRequests,
    isFetching,
    refetch,
  } = useGetPurchaseRequestsQuery(params, {
    refetchOnMountOrArgChange: true,
  });

  const debounceSearch = React.useRef(
    debounce((value: string) => {
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
  const handleOpenModal = () => toggleVendorDetail();
  const handleCloseModal = () => toggleVendorDetail();

  const columns: ColumnsType<PurchaseRequestType> = [
    {
      title: 'PR Number',
      dataIndex: 'id',
      ellipsis: true,
      render: text => (
        <Highlighter
          highlightStyle={{ padding: 0, backgroundColor: 'yellow' }}
          activeIndex={-1}
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
      render: (_, record) => (
        <Typography.Link
          onClick={() => {
            setVendorId(record.vendorId);
            handleOpenModal();
          }}
        >
          {record.vendorName}
        </Typography.Link>
      ),
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
      render: (_, { purchaseStatusId, purchaseStatusName }) => <PurchaseStatus id={purchaseStatusId} name={purchaseStatusName} />,
    },
    {
      title: 'Action',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (_, record) =>
        mode === 'list' ? (
          <ActionCell purchaseRequest={record} basePath={basePath} />
        ) : (
          <ActionCellForApproved purchaseRequest={record} basePath={basePath} />
        ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Purchase Request List',
        ghost: true,
        onBack: () => history.goBack(),
        breadcrumb: {
          routes: [
            {
              path: '',
              breadcrumbName: 'Purchasing',
            },
            {
              path: '',
              breadcrumbName: 'Purchase Request',
            },
          ],
        },
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
            <Button onClick={() => history.push(`${basePath}/add-edit`)} key={1} icon={<PlusOutlined />} type="primary">
              Add More
            </Button>
          )}
        </Space>
      }
    >
      <ProCard size="small" bordered>
        <Table<PurchaseRequestType>
          dataSource={purchaseRequests}
          loading={isFetching}
          columns={columns}
          size="small"
          tableLayout="fixed"
          bordered
          rowClassName={(_, index) => (index % 2 !== 0 ? 'row-odd' : '')}
          scroll={{ x: 1000 }}
        />
      </ProCard>
      <Modal
        width={1000}
        style={{ top: 20 }}
        title="Vendor Detail"
        visible={openVendorDetail}
        footer={null}
        destroyOnClose
        onCancel={handleCloseModal}
      >
        <VendorDetail vendorId={vendorId} />
      </Modal>
    </PageContainer>
  );
}

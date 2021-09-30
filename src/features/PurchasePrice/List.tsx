import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { useToggle } from 'ahooks';
import { Button, Dropdown, Form, Input as TextField, Menu, Modal, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  useApprovePurchasePriceMutation,
  useDeletePurchasePriceMutation,
  useGetPurchasePricesQuery,
  usePartialEditPurchasePriceMutation,
  useRejectPurchasePriceMutation,
} from 'api/purchasePriceApi';
import { TextAreaField } from 'components';
import PurchaseApprovals from 'components/PurchaseApprovals';
import PurchaseStatus from 'components/PurchaseStatus';
import { PERMISSION_TYPE } from 'constants/permission';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch } from 'hooks/reduxHooks';
import React, { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { setCopyId } from './slice';

interface ActionCellProps {
  basePath: string;
  purchasePrice: PurchasePriceType;
}
function ActionCell(props: ActionCellProps) {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { permissions } = useContext(AuthContext);
  const { purchasePrice, basePath } = props;
  const { id, purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId } = purchasePrice;
  const [openModal, { toggle: toggleModal }] = useToggle();
  const [deletePurchasePrice] = useDeletePurchasePriceMutation();
  const [partialEditPurchasePrice, { isLoading: isSendLoading }] = usePartialEditPurchasePriceMutation();
  const handleDropdownClick = async ({ key }: { key: string }) => {
    switch (key) {
      case 'EDIT':
        handleEditClicked();
        break;
      case 'DELETE':
        handleDeleteClicked();
        break;
      case 'SEND':
        handleOpenModal();
        break;
      default:
        handleCopy();
        break;
    }
  };
  const handleEditClicked = () => history.push(`${basePath}/add-edit/${id}`);
  const handleDetailClicked = () => history.push(`${basePath}/detail/${id}`);
  const handleDeleteClicked = async () => await deletePurchasePrice(id).unwrap();
  const handleSendClicked = async (userId: number) => {
    const body = [
      {
        path: 'handledById',
        op: 'replace',
        value: userId,
      },
    ];
    await partialEditPurchasePrice({ id, body }).unwrap();
    handleCloseModal();
  };
  const handleCopy = () => {
    dispatch(setCopyId(id));
    history.push(`${basePath}/add-edit`);
  };
  const handleOpenModal = () => toggleModal();
  const handleCloseModal = () => toggleModal();
  const menu = (
    <Menu onClick={handleDropdownClick}>
      {hasPermission(PERMISSION_TYPE.FULL, permissions) && purchasePrice.purchaseStatusId === 1 && (
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

  return (
    <React.Fragment>
      <Dropdown.Button size="small" onClick={handleDetailClicked} overlay={menu}>
        Detail
      </Dropdown.Button>
      <Modal
        style={{ top: 20 }}
        width={1000}
        title="Approver List"
        visible={openModal}
        onCancel={handleCloseModal}
        destroyOnClose
        footer={null}
      >
        <PurchaseApprovals
          purchaseOrgId={purchaseOrgId}
          purchaseDivisionId={purchaseDivisionId}
          purchaseOfficeId={purchaseOfficeId}
          purchaseGroupId={purchaseGroupId}
          onSave={handleSendClicked}
          isLoading={isSendLoading}
        />
      </Modal>
    </React.Fragment>
  );
}

interface ActionCellApprovedProps {
  purchasePrice: PurchasePriceType;
  basePath: string;
}
function ActionCellApproved(props: ActionCellApprovedProps) {
  const {
    basePath,
    purchasePrice: { id, purchaseStatusId },
  } = props;
  const history = useHistory();
  const isDisabledDropdownItem = purchaseStatusId === 2 ? false : true;
  const [openModal, { toggle: toggleModal }] = useToggle();
  const { control, handleSubmit } = useForm<{ handledMessage: string }>();
  const [isApprove, setIsApprove] = React.useState(true);
  const [approvePurchasePrice, { isLoading: isApproving }] = useApprovePurchasePriceMutation();
  const [rejectPurchasePrice, { isLoading: isRejecting }] = useRejectPurchasePriceMutation();

  const handleDropdownClicked = ({ key }: { key: string }) => {
    switch (key) {
      case 'approve':
        handleOpenModal();
        break;
      default:
        handleOpenModal();
        setIsApprove(false);
        break;
    }
  };
  const handleDetailClicked = () => history.push(`${basePath}/detail/${id}`);
  const handleOpenModal = () => toggleModal();
  const handleCloseModal = () => toggleModal();
  const handleSaveClicked: SubmitHandler<{ handledMessage: string }> = async formValue => {
    const body = [
      {
        path: 'handledMessage',
        op: 'replace',
        value: formValue.handledMessage,
      },
    ];
    if (isApprove) {
      await approvePurchasePrice({ id, body }).unwrap();
    } else {
      await rejectPurchasePrice({ id, body }).unwrap();
    }
    handleCloseModal();
  };
  const menu = (
    <Menu onClick={handleDropdownClicked}>
      <Menu.Item disabled={isDisabledDropdownItem} key="approve" icon={<CheckOutlined />}>
        Approved
      </Menu.Item>
      <Menu.Item disabled={isDisabledDropdownItem} key="reject" icon={<CloseOutlined />}>
        Rejected
      </Menu.Item>
    </Menu>
  );
  return (
    <React.Fragment>
      <Dropdown.Button onClick={handleDetailClicked} size="small" overlay={menu}>
        Detail
      </Dropdown.Button>
      <Modal
        title={isApprove ? 'Approve Message' : 'Reject Message'}
        style={{ top: 20 }}
        visible={openModal}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="Message">
            <TextAreaField name="handledMessage" control={control} />
          </Form.Item>
          <Form.Item>
            <Button
              loading={isApproving || isRejecting}
              onClick={handleSubmit(handleSaveClicked)}
              type="primary"
              icon={<SaveOutlined />}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
}

interface Props {
  mode: 'list' | 'approve-list';
  basePath: string;
}
export default function List(props: Props) {
  const { mode, basePath } = props;
  const {
    user: { id },
    permissions,
  } = useContext(AuthContext);
  const history = useHistory();
  const params = React.useMemo(() => {
    return mode === 'list'
      ? { createdById: { eq: id } }
      : {
          approvedById: {
            eq: id,
          },
          purchaseStatusId: {
            in: [2, 3, 4],
          },
        };
  }, [mode, id]);
  const { data: purchasePrices, isFetching: isLoading } = useGetPurchasePricesQuery(params, {
    refetchOnMountOrArgChange: true,
  });
  const columns: ColumnsType<PurchasePriceType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
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
      align: 'center',
      render: (_, { purchaseStatusId, purchaseStatusName }) => <PurchaseStatus id={purchaseStatusId} name={purchaseStatusName} />,
      ellipsis: true,
    },
    {
      title: 'Action',
      ellipsis: true,
      align: 'center',
      width: 100,
      render: (_, record) =>
        props.mode === 'list' ? (
          <ActionCell purchasePrice={record} basePath={basePath} />
        ) : (
          <ActionCellApproved purchasePrice={record} basePath={basePath} />
        ),
    },
  ];
  const routes = [
    {
      path: '',
      breadcrumbName: 'Master Data',
    },
    {
      path: '',
      breadcrumbName: 'Purchase Price',
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Purchase Price List',
        breadcrumb: { routes },
        onBack: () => history.goBack(),
      }}
      extra={
        <Space>
          <TextField prefix={<SearchOutlined />} placeholder="Search something" />
          {hasPermission(PERMISSION_TYPE.FULL, permissions) && props.mode === 'list' && (
            <Button onClick={() => history.push(`${basePath}/add-edit`)} icon={<PlusOutlined />} type="primary">
              Add More
            </Button>
          )}
        </Space>
      }
    >
      <ProCard size="small" bordered>
        <Table<PurchasePriceType>
          columns={columns}
          dataSource={purchasePrices}
          bordered
          loading={isLoading}
          tableLayout="fixed"
          size="small"
          rowClassName={(_, index) => (index % 2 !== 0 ? 'row-odd' : '')}
        />
      </ProCard>
    </PageContainer>
  );
}

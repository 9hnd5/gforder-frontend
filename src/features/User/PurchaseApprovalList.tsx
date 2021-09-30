import { DeleteOutlined, EllipsisOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Button, Dropdown, Form, Menu, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseApprovalForUserQuery } from 'api/userApi';
import { DatePickerField, SelectField } from 'components';
import withData, { WithDataProps } from 'Hocs/withData';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { addApprovalAddEditList, deleteApprovalAddEdit } from './slice';

const ActionCell = ({ approval }: { approval: PurchaseApprovalAddEditType }) => {
  const dispatch = useAppDispatch();
  const handleDelete = async () => {
    dispatch(deleteApprovalAddEdit(approval));
  };
  const handleClick = ({ key }: { key: string }) => {
    if (key === 'Delete') {
      handleDelete();
    }
  };
  const menu = (
    <Menu onClick={handleClick}>
      <Menu.Item key="Delete" icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  const handleEdit = () => {};
  return (
    <Dropdown.Button icon={<EllipsisOutlined />} size="small" overlay={menu} onClick={handleEdit}>
      Edit
    </Dropdown.Button>
  );
};

export interface PurchaseApprovalAddEditFormType extends PurchaseApprovalAddEditType {
  purchaseOrg: { label: string; value: string };
  purchaseDivision: { label: string; value: string };
  purchaseOffice: { label: string; value: string };
  purchaseGroup: { label: string; value: string };
  effectiveEnd: string;
}
interface Props extends WithDataProps {}
const PurchaseApprovalAddEditList = (props: Props) => {
  const { purchaseOrgs, purchaseDivisions, purchaseOffices, purchaseGroups } = props;
  const { id } = useParams<{ id: string }>();
  const [openModal, { toggle }] = useToggle();
  const approvalAddEditList = useAppSelector(s => s.user.approvalAddEditList);
  const { data: approvalList } = useGetPurchaseApprovalForUserQuery(id ?? skipToken);
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<PurchaseApprovalAddEditFormType>();
  const columns: ColumnsType<PurchaseApprovalAddEditType> = [
    {
      title: <Button onClick={() => toggle()} size="small" icon={<PlusOutlined />} type="primary" />,
      width: 50,
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
      title: 'Effective End',
      dataIndex: 'effectiveEnd',
      ellipsis: true,
    },
    {
      title: 'Action',
      ellipsis: true,
      align: 'center',
      render: (_, record) => <ActionCell approval={record} />,
    },
  ];
  const handleSave: SubmitHandler<PurchaseApprovalAddEditFormType> = formValue => {
    const {
      purchaseOrg: { value: purchaseOrgId, label: purchaseOrgName },
      purchaseDivision: { value: purchaseDivisionId, label: purchaseDivisionName },
      purchaseOffice: { value: purchaseOfficeId, label: purchaseOfficeName },
      purchaseGroup: { value: purchaseGroupId, label: purchaseGroupName },
      effectiveEnd,
    } = formValue;
    const approvalAddEdit = {
      purchaseOrgId,
      purchaseOrgName,
      purchaseDivisionId,
      purchaseDivisionName,
      purchaseOfficeId,
      purchaseOfficeName,
      purchaseGroupId,
      purchaseGroupName,
      effectiveEnd,
    };
    dispatch(addApprovalAddEditList(approvalAddEdit));
    toggle();
  };
  React.useEffect(() => {
    if (approvalList !== undefined) {
      const approvalAddEditList: PurchaseApprovalAddEditType[] = approvalList.map(x => ({
        id: x.id,
        purchaseDivisionId: x.purchaseDivisionId,
        purchaseDivisionName: x.purchaseDivisionName,
        purchaseOfficeId: x.purchaseOfficeId,
        purchaseOfficeName: x.purchaseOfficeName,
        purchaseGroupId: x.purchaseGroupId,
        purchaseGroupName: x.purchaseGroupName,
        purchaseOrgId: x.purchaseOrgId,
        purchaseOrgName: x.purchaseOrgName,
        effectiveEnd: x.effectiveEnd,
      }));
      dispatch(addApprovalAddEditList(approvalAddEditList));
    }
  }, [approvalList, dispatch]);
  React.useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);
  return (
    <React.Fragment>
      <Table<PurchaseApprovalAddEditType>
        dataSource={approvalAddEditList}
        size="small"
        columns={columns}
        tableLayout="fixed"
        rowKey={x => x.purchaseOrgId + x.purchaseDivisionId + x.purchaseOfficeId + x.purchaseGroupId}
        scroll={{ x: 1000 }}
      />
      <Modal
        onCancel={() => toggle()}
        visible={openModal}
        destroyOnClose
        title="Add Purchase Approval"
        footer={null}
        style={{ top: 20 }}
      >
        <Form layout="vertical">
          <Form.Item required label="Purchase Org">
            <SelectField
              name="purchaseOrg"
              control={control}
              labelInValue={true}
              options={purchaseOrgs?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
          <Form.Item required label="Purchase Division">
            <SelectField
              name="purchaseDivision"
              control={control}
              labelInValue={true}
              options={purchaseDivisions?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
          <Form.Item required label="Purchase Office">
            <SelectField
              name="purchaseOffice"
              control={control}
              labelInValue={true}
              options={purchaseOffices?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
          <Form.Item required label="Purchase Group">
            <SelectField
              name="purchaseGroup"
              control={control}
              labelInValue={true}
              options={purchaseGroups?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
          <Form.Item required label="Effective End">
            <DatePickerField name="effectiveEnd" control={control} />
          </Form.Item>
          <Button onClick={handleSubmit(handleSave)} type="primary" icon={<SaveOutlined />}>
            Save Changes
          </Button>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
export default withData(PurchaseApprovalAddEditList);

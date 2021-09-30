import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Space } from 'antd';
import { useAddUserMutation, useEditUserMutation } from 'api/userApi';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import UserAddEditForm from './UserAddEditForm';
import PurchaseApprovalList from './PurchaseApprovalList';
import { resetUserSlice } from './slice';

const validationSchema = yup
  .object()
  .shape({
    firstName: yup.string().required("'First Name' is required").nullable(),
    lastName: yup.string().required("'Last Name' is required").nullable(),
    phoneNumber: yup.string().required("'Phone' is required").nullable(),
    dateOfBirth: yup.string().required("'DoB' is required").nullable(),
    email: yup.string().required("'Email' is required").nullable(),
    password: yup.string().required("'Password' is required").nullable(),
    roleId: yup.number().required("'Role' is required").nullable(),
  })
  .required();

interface Props {
  basePath: string;
}
const UserAddEdit = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [addUser] = useAddUserMutation();
  const [editUser] = useEditUserMutation();
  const methods = useForm<UserAddEditType>({ resolver: yupResolver(validationSchema) });
  const approvalAddEditList = useAppSelector(s => s.user.approvalAddEditList);
  const handleSave: SubmitHandler<UserAddEditType> = async formValue => {
    const submitValue: UserSubmitType = {
      ...formValue,
      purchaseApprovals: approvalAddEditList,
    };
    if (id) {
      await editUser({ id: +id, user: submitValue });
    } else {
      await addUser(submitValue);
    }
    history.goBack();
  };
  React.useEffect(() => {
    if (methods.formState.isSubmitSuccessful) methods.reset();
  }, [methods]);
  React.useEffect(() => {
    return function cleanup() {
      dispatch(resetUserSlice());
    };
  }, [dispatch]);
  return (
    <FormProvider {...methods}>
      <PageContainer header={{ title: 'Add User' }}>
        <ProCard size="small" bordered split="horizontal">
          <ProCard size="small" split="vertical">
            <ProCard colSpan={6} size="small">
              <UserAddEditForm />
            </ProCard>
            <ProCard size="small" tabs={{ type: 'card', size: 'small' }}>
              <ProCard.TabPane key="1" tab="Purchase Approvals">
                <PurchaseApprovalList />
              </ProCard.TabPane>
              <ProCard.TabPane key="2" tab="Price List"></ProCard.TabPane>
            </ProCard>
          </ProCard>

          <ProCard size="small">
            <Space>
              <Button onClick={() => history.goBack()} icon={<RollbackOutlined />}>
                Back
              </Button>
              <Button onClick={methods.handleSubmit(handleSave)} type="primary" icon={<SaveOutlined />}>
                Save Changes
              </Button>
            </Space>
          </ProCard>
        </ProCard>
      </PageContainer>
    </FormProvider>
  );
};
export default UserAddEdit;

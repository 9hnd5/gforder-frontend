import { ExclamationCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dropdown, Menu, Space } from 'antd';
import { useAddUserOrderMutation, useEditUserOrderMutation } from 'api/userOrderApi';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { resetUserOrderSlice, selectAllUserOrderItem } from './slice';
import UserOrderAddEditForm, { UserOrderFormType } from './UserOrderAddEditForm';
import UserOrderItemList from './UserOrderItemList';
import UserOrderItemListSearchBar from './UserOrderItemListSearchBar';

const routes = [
  { path: '', breadcrumbName: 'Ordering' },
  { path: '', breadcrumbName: 'Order' },
  { path: '', breadcrumbName: 'Adding' },
];
const validationSchema = yup
  .object({
    buyDate: yup.string().required("'Buy Date' is required"),
    receiptDate: yup.string().required("'Receipt Date' is required"),
  })
  .required();
interface UserOrderAddEditProps {}

const UserOrderAddEdit = (props: UserOrderAddEditProps) => {
  const { id } = useParams<{ id?: string }>();
  const methods = useForm<UserOrderFormType>({ resolver: yupResolver(validationSchema) });
  const history = useHistory();
  const dispatch = useAppDispatch();
  const userOrderItems = useAppSelector(selectAllUserOrderItem);
  const [addUserOrder, { isLoading: isAdding }] = useAddUserOrderMutation();
  const [editUserOrder, { isLoading: isEditing }] = useEditUserOrderMutation();

  const handleBackPrevious = () => history.goBack();

  const handleSaveClicked = async (formValue: UserOrderFormType, type: 'draft' | 'save') => {
    const userOrderSubmit = {
      ...formValue,
      statusId: type === 'draft' ? 1 : 2,
      userOrderItems: userOrderItems.map(x => ({
        id: x.id,
        itemCode: x.item.itemCode,
        unitPrice: x.unitPrice,
        quantity: x.quantity,
        totalPrice: x.totalPrice,
      })),
    };
    if (id !== undefined) {
      await editUserOrder({ id, userOrder: userOrderSubmit }).unwrap();
    } else {
      await addUserOrder(userOrderSubmit).unwrap();
    }
    handleBackPrevious();
  };

  const handleDropdownClicked = ({ key }: { key: string }) => {
    methods.handleSubmit(formValue => handleSaveClicked(formValue, 'draft'))();
  };

  const renderMenu = (
    <Menu onClick={handleDropdownClicked}>
      <Menu.Item key="draft" icon={<ExclamationCircleOutlined />}>
        Save Draft
      </Menu.Item>
    </Menu>
  );

  React.useEffect(() => {
    return function cleanup() {
      dispatch(resetUserOrderSlice());
    };
  }, [dispatch]);

  return (
    <FormProvider {...methods}>
      <PageContainer header={{ title: 'Add Order', onBack: handleBackPrevious, breadcrumb: { routes } }}>
        <ProCard size="small" bordered split="horizontal">
          <ProCard size="small">
            <UserOrderItemListSearchBar />
          </ProCard>
          <ProCard size="small" split="vertical">
            <ProCard size="small" colSpan={6}>
              <UserOrderAddEditForm />
            </ProCard>
            <ProCard size="small" colSpan={18}>
              <UserOrderItemList />
            </ProCard>
          </ProCard>
          
          <ProCard size="small">
            <Space>
              <Button onClick={handleBackPrevious} icon={<RollbackOutlined />}>
                Back
              </Button>
              <Dropdown.Button
                overlay={renderMenu}
                onClick={methods.handleSubmit(formValue => handleSaveClicked(formValue, 'save'))}
                type="primary"
                buttonsRender={([leftButton, rightButton]) => [
                  React.cloneElement(leftButton as React.ReactElement<any>, { loading: isAdding || isEditing }),
                  React.cloneElement(rightButton as React.ReactElement<any>, { loading: isAdding || isEditing }),
                ]}
              >
                Save Changes
              </Dropdown.Button>
            </Space>
          </ProCard>
        </ProCard>
      </PageContainer>
    </FormProvider>
  );
};
export default UserOrderAddEdit;

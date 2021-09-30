import { RollbackOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import UserOrderAddEditForm, { UserOrderFormType } from './UserOrderAddEditForm';
import UserOrderItemList from './UserOrderItemList';
const routes = [
  {
    path: '',
    breadcrumbName: 'Ordering',
  },
  {
    path: '',
    breadcrumbName: 'Order',
  },
  {
    path: '',
    breadcrumbName: 'Detail',
  },
];
interface UserOrderDetailProps {}
const UserOrderDetail = (props: UserOrderDetailProps) => {
  const { id } = useParams<{ id?: string }>();
  const methods = useForm<UserOrderFormType>();
  const history = useHistory();

  const handlePrevPage = () => history.goBack();

  return (
    <FormProvider {...methods}>
      <PageContainer header={{ title: 'User Order Detail', breadcrumb: { routes }, onBack: handlePrevPage }}>
        <ProCard size="small" bordered split="horizontal">
          <ProCard size="small" split="vertical">
            <ProCard size="small" colSpan={6}>
              <UserOrderAddEditForm viewId={id} />
            </ProCard>
            <ProCard size="small" colSpan={18}>
              <UserOrderItemList viewId={id} />
            </ProCard>
          </ProCard>
          <ProCard size="small">
            <Button onClick={handlePrevPage} icon={<RollbackOutlined />}>
              Back
            </Button>
          </ProCard>
        </ProCard>
      </PageContainer>
    </FormProvider>
  );
};
export default UserOrderDetail;

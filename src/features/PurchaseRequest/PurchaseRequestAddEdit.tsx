import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, notification, Space } from 'antd';
import { useAddPurchaseRequestMutation, useEditPurchaseRequestMutation } from 'api/purchaseRequestApi';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import PurchaseRequestAddEditForm, { RequestFormType } from './PurchaseRequestAddEditForm';
import PurchaseRequestItemList from './PurchaseRequestItemList';
import { resetPurchaseRequestSlice, selectAllPurchaseRequestItem } from './slice';

const validationSchema = yup
  .object()
  .shape({
    vendorId: yup.string().required('Vendor is required').nullable(),
    purchaseOrgId: yup.string().required('Purchase Org is required'),
    purchaseDivisionId: yup.string().required('Purchase Division is required'),
    purchaseOfficeId: yup.string().required('Purchase Office is required'),
    purchaseGroupId: yup.string().required('Purchase Group is required'),
    buyDate: yup.string().required('Buy Date is required').nullable(),
    receiptDate: yup.string().required('Receipt Date is required').nullable(),
  })
  .required();
interface Props {
  basePath: string;
}
export default function PurchaseRequestAddEdit(props: Props) {
  const { basePath } = props;
  const { id }: { id: string } = useParams();
  const dispatch = useAppDispatch();
  const methods = useForm<RequestFormType>({ resolver: yupResolver(validationSchema) });
  const history = useHistory();
  const purchaseRequestItems = useAppSelector(selectAllPurchaseRequestItem);
  const [addPurchaseRequest, { isLoading: isAdding }] = useAddPurchaseRequestMutation();
  const [editPurchaseRequest, { isLoading: isEditing }] = useEditPurchaseRequestMutation();

  const handleSave: SubmitHandler<RequestFormType> = async formValue => {
    if (purchaseRequestItems.length === 0) return notification.error({ message: 'Purchase Request Item is required' });
    const purchaseRequest = { ...formValue, purchaseRequestItems: purchaseRequestItems } as PurchaseRequestType;
    if (id) {
      await editPurchaseRequest({ id, purchaseRequest }).unwrap();
    } else {
      await addPurchaseRequest(purchaseRequest).unwrap();
    }
    history.push(`${basePath}/list`);
  };
  const routes = [
    {
      path: '',
      breadcrumbName: 'Purchasing',
    },
    {
      path: '',
      breadcrumbName: 'Purchase Request',
    },
    {
      path: '',
      breadcrumbName: 'Adding',
    },
  ];
  React.useEffect(() => {
    return () => {
      dispatch(resetPurchaseRequestSlice());
    };
  }, [dispatch]);
  return (
    <PageContainer
      header={{
        breadcrumb: { routes },
        title: id ? 'Edit Purchase Request' : 'Add Purchase Request',
        onBack: () => history.push(`${basePath}/list`),
        ghost: true,
      }}
    >
      <ProCard split="horizontal" size="small" ghost>
        <ProCard bordered size="small">
          <FormProvider {...methods}>
            <PurchaseRequestAddEditForm />
          </FormProvider>
        </ProCard>
        <ProCard tabs={{ type: 'card', size: 'small' }} size="small" bordered>
          <ProCard.TabPane tab="Item List">
            <PurchaseRequestItemList />
          </ProCard.TabPane>
        </ProCard>
        <ProCard size="small" bordered>
          <Space>
            <Button onClick={() => history.push(`${props.basePath}/list`)} icon={<RollbackOutlined />}>
              Back
            </Button>
            <Button
              loading={isAdding || isEditing}
              onClick={methods.handleSubmit(handleSave)}
              icon={<SaveOutlined />}
              type="primary"
            >
              Save Changes
            </Button>
          </Space>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}

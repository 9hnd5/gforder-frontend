import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToggle } from 'ahooks';
import { Button, Modal, notification, Space } from 'antd';
import { useAddPurchaseOrderMutation, useEditPurchaseOrderMutation } from 'api/purchaseOrderApi';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import PurchaseOrderAddEditForm, { PurchaseOrderFormType } from './PurchaseOrderAddEditForm';
import PurchaseOrderItemList from './PurchaseOrderItemList';
import PurchaseRequests from './PurchaseRequests';
import { resetPurchaseOrderSlice, selectAllPurchaseOrderItem } from './slice';
const validationSchema = yup
  .object()
  .shape({
    vendorId: yup.string().required('Vendor is required').nullable(),
    paymentMethodId: yup.string().required('Payment is required').nullable(),
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

export default function PurchaseOrderAddEdit(props: Props) {
  const { basePath } = props;
  const { id } = useParams<{ id: string }>();
  const addMode = useAppSelector(s => s.purchaseOrder.addMode);
  const [openModal, { toggle }] = useToggle();
  const dispatch = useAppDispatch();
  const methods = useForm<PurchaseOrderFormType>({ resolver: yupResolver(validationSchema) });
  const history = useHistory();
  const [addPurchaseOrder, { isLoading: isAdding }] = useAddPurchaseOrderMutation();
  const [editPurchaseOrder, { isLoading: isEditing }] = useEditPurchaseOrderMutation();
  const purchaseOrderItems = useAppSelector(selectAllPurchaseOrderItem);

  const handleCloseModal = () => toggle();
  const handleOpenModal = () => toggle();
  const handleCopyFrom = () => handleOpenModal();
  const handleSave: SubmitHandler<PurchaseOrderFormType> = async formValue => {
    if (purchaseOrderItems.length === 0) return notification.error({ message: 'Purchase Order Item is required' });
    const { purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId, ...rest } = formValue;
    const purchaseOrder = {
      ...rest,
      purchaseOrgId,
      purchaseDivisionId,
      purchaseGroupId,
      purchaseOfficeId,
      purchaseOrderItems: purchaseOrderItems,
    } as PurchaseOrderType;
    if (id) {
      await editPurchaseOrder({ id, purchaseOrder }).unwrap();
    } else {
      await addPurchaseOrder(purchaseOrder).unwrap();
    }
    history.push(`${basePath}/list`);
  };
  const prevPath = React.useMemo(() => `${props.basePath}/list`, [props.basePath]);
  const routes = [
    {
      path: '',
      breadcrumbName: 'Master Data',
    },
    {
      path: '',
      breadcrumbName: 'Purchase Request',
    },
    {
      path: '',
      breadcrumbName: id ? 'Editing' : 'Adding',
    },
  ];
  const watch = useWatch({
    control: methods.control,
    name: ['vendorId', 'purchaseOrgId', 'purchaseDivisionId', 'purchaseOfficeId', 'purchaseGroupId'],
  });
  React.useEffect(() => {
    return () => {
      dispatch(resetPurchaseOrderSlice());
    };
  }, [dispatch]);
  return (
    <PageContainer
      header={{
        breadcrumb: { routes },
        title: id ? 'Edit Purchase Order' : 'Add Purchase Order',
        onBack: () => history.push(prevPath),
      }}
      extra={
        addMode === 'from-multiple-pr' && (
          <Button onClick={handleCopyFrom} key={1} type="primary">
            Copy From
          </Button>
        )
      }
    >
      <ProCard direction="column" size="small" ghost>
        <ProCard size="small" bordered>
          <FormProvider {...methods}>
            <PurchaseOrderAddEditForm />
          </FormProvider>
        </ProCard>
        <ProCard size="small" bordered>
          <PurchaseOrderItemList />
        </ProCard>
        <ProCard size="small" bordered>
          <Space>
            <Button onClick={() => history.goBack()} icon={<RollbackOutlined />}>
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
        <Modal
          footer={null}
          width={1000}
          visible={openModal}
          onCancel={handleCloseModal}
          destroyOnClose
          title="Purchase Request List"
        >
          <PurchaseRequests data={watch} onCloseModal={handleCloseModal} />
        </Modal>
      </ProCard>
    </PageContainer>
  );
}

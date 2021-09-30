import { CopyOutlined, RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToggle } from 'ahooks';
import { Button, Modal, notification, Space } from 'antd';
import { useAddGoodsPOReceiptMutation, useEditGoodsPOReceiptMutation } from 'api/goodsPOReceiptApi';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import moment from 'moment';
import React from 'react';
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import AddEditForm, { GoodsPOReceiptForm } from './AddEditForm';
import ItemAddEditFormList from './ItemAddEditFormList';
import PurchaseOrders from './PurchaseOrders';
import { resetGoodsPOReceipSlice, setWarehouseIdForGoodsPOReceiptFormList } from './slice';
import { GoodsPOReceiptAddEdit, GoodsPOReceiptItemAddEdit } from './types';

const validationSchema = yup
  .object()
  .shape({
    vendorId: yup.string().required("'Vendor' is required").nullable(),
    purchaseOrgId: yup.string().required("'Purchase Org' is required").nullable(),
    purchaseDivisionId: yup.string().required("'Purchase Division' is required").nullable(),
    purchaseOfficeId: yup.string().required("'Purchase Office' is required").nullable(),
    purchaseGroupId: yup.string().required("'Purchase Group' is required").nullable(),
    buyDate: yup.mixed().test('buyDate', '', function (value) {
      const momentObject = moment(value, 'YYYY-MM-DD', true);
      if (!momentObject.isValid()) return this.createError({ message: "'Buy Date' invalid" });
      return true;
    }),
    receiptDate: yup.mixed().when('buyDate', buyDate => {
      return yup.mixed().test('receiptDate', '', function (receiptDate: any) {
        if (moment(receiptDate).isBefore(buyDate)) {
          return this.createError({ message: "'Receipt Date' invalid" });
        }
        return true;
      });
    }),
  })
  .required();

interface AddEditProps {
  basePath: string;
}

const AddEdit = (props: AddEditProps) => {
  const { id } = useParams<{ id: string }>();
  const addMode = useAppSelector(s => s.goodsPOReceipt.addMode);
  const methods = useForm<GoodsPOReceiptForm>({ resolver: yupResolver(validationSchema) });
  const dispatch = useAppDispatch();
  const goodsPOReceiptFormList = useAppSelector(s => s.goodsPOReceipt.goodsPOReceiptFormList);
  const [addGoodsPOReceipt, { isLoading: isAdding }] = useAddGoodsPOReceiptMutation();
  const [editGoodsPOReceipt, { isLoading: isEditing }] = useEditGoodsPOReceiptMutation();
  const [openModal, { toggle }] = useToggle(false);
  const history = useHistory();
  const handleCloseModal = () => toggle();
  const handleOpenModal = () => toggle();
  const handleCopyFrom = () => handleOpenModal();
  const handleSave: SubmitHandler<GoodsPOReceiptForm> = async data => {
    if (goodsPOReceiptFormList.length === 0) return notification.error({ message: 'Item is required' });
    let goodsPOReceiptItems: GoodsPOReceiptItemAddEdit[] = [];
    console.log('goodsPOReceiptFormList', goodsPOReceiptFormList);
    for (const item of goodsPOReceiptFormList) {
      if (item.warehouseId === undefined) return notification.error({ message: 'Please select the warehouse' });
      goodsPOReceiptItems.push({
        id: item.id,
        purchaseOrderItemId: item.purchaseOrderItemId,
        purchasePriceId: item.purchasePriceId,
        itemCode: item.itemCode,
        uoMId: item.uoMId,
        batchNo: item.batchNo,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        unitPrice: item.unitPrice,
        warehouseId: item.warehouseId,
      });
    }

    const goodsPOReceipt: GoodsPOReceiptAddEdit = {
      id: data.id,
      purchaseOrgId: data.purchaseOrgId,
      purchaseDivisionId: data.purchaseDivisionId,
      purchaseOfficeId: data.purchaseOfficeId,
      purchaseGroupId: data.purchaseGroupId,
      buyDate: data.buyDate,
      receiptDate: data.receiptDate,
      vendorId: data.vendorId,
      note: data.note,
      defaultWarehouseId: data.defaultWarehouse?.value,
      goodsPOReceiptItems,
    };
    if (id) {
      await editGoodsPOReceipt({ id, goodsPOReceipt }).unwrap();
    } else {
      await addGoodsPOReceipt(goodsPOReceipt).unwrap();
    }
    history.push(props.basePath);
  };
  const watch = useWatch({
    control: methods.control,
    name: ['vendorId', 'purchaseOrgId', 'purchaseDivisionId', 'purchaseOfficeId', 'purchaseGroupId', 'defaultWarehouse'],
  });
  React.useEffect(() => {
    return function cleanup() {
      dispatch(resetGoodsPOReceipSlice());
    };
  }, [dispatch]);
  React.useEffect(() => {
    if (watch[5] !== undefined) {
      dispatch(setWarehouseIdForGoodsPOReceiptFormList({ warehouseId: watch[5].value, warehouseName: watch[5].label }));
    }
  }, [watch, dispatch]);
  const routes = [
    {
      path: '',
      breadcrumbName: 'Purchasing',
    },
    {
      path: '',
      breadcrumbName: 'Goods PO Receipt',
    },
    {
      path: '',
      breadcrumbName: 'Adding',
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'Add Goods PO Receipt',
        onBack: () => history.push(props.basePath),
        breadcrumb: { routes },
      }}
      extra={
        addMode === 'FROM_MULTI_PO' && (
          <Button key={1} onClick={handleCopyFrom} type="primary" icon={<CopyOutlined />}>
            Copy From
          </Button>
        )
      }
    >
      <ProCard split="horizontal" size="small" ghost>
        <ProCard size="small" bordered>
          <FormProvider {...methods}>
            <AddEditForm />
          </FormProvider>
        </ProCard>
        <ProCard size="small" bordered>
          <ItemAddEditFormList />
        </ProCard>
        <ProCard size="small" bordered>
          <Space>
            <Button onClick={() => history.push(props.basePath)} icon={<RollbackOutlined />}>
              Back
            </Button>
            <Button
              loading={isAdding || isEditing}
              onClick={methods.handleSubmit(handleSave)}
              type="primary"
              icon={<SaveOutlined />}
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
          title="Purchase Order List"
        >
          <PurchaseOrders watch={watch} onCloseModal={handleCloseModal} />
        </Modal>
      </ProCard>
    </PageContainer>
  );
};
export default AddEdit;

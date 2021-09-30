import { CopyOutlined, RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToggle } from 'ahooks';
import { Button, Modal, notification, Space } from 'antd';
import { useAddGoodsTransferMutation, useEditGoodsTransferMutation } from 'api/goodsTransferApi';
import { GoodsPOReceiptItem } from 'features/GoodsPOReceipt/types';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import AddEditForm, { GoodsTransferFormType } from './AddEditForm';
import GoodsPOReceiptList from './GoodsPOReceiptList';
import ItemAddEditList from './ItemAddEditList';
import { addTransferItemAddEditList, resetGoodsTransferSlice, setDefaultWarehouseIdForItemAddEditList } from './slice';
const validationSchema = yup
  .object()
  .shape({
    vendorId: yup.string().required("'Vendor' is required").nullable(),
    purchaseOrgId: yup.string().required("'Purchase Org' is required").nullable(),
    purchaseDivisionId: yup.string().required("'Purchase Division' is required").nullable(),
    purchaseOfficeId: yup.string().required("'Purchase Office' is required").nullable(),
    purchaseGroupId: yup.string().required("'Purchase Group' is required").nullable(),
  })
  .required();
interface Props {
  basePath: string;
}
const AddEdit = (props: Props) => {
  const { id, mode } = useParams<{ id: string; mode: string }>();
  const dispatch = useAppDispatch();
  const isDisabled = mode === 'confirm' ? true : false;
  const methods = useForm<GoodsTransferFormType>({ resolver: yupResolver(validationSchema) });
  const history = useHistory();
  const transferItemAddEditList = useAppSelector(s => s.goodsTransfer.transferItemAddEditList);
  const [addGoodsTransfer, { isLoading: isAdding }] = useAddGoodsTransferMutation();
  const [editGoodsTransfer, { isLoading: isEditing }] = useEditGoodsTransferMutation();
  const [openModal, { toggle }] = useToggle();
  const handleSave: SubmitHandler<GoodsTransferFormType> = async formValue => {
    if (transferItemAddEditList.length === 0) return notification.error({ message: 'Item is required' });
    const { defaultWarehouseReceipt, ...rest } = formValue;
    const goodsTransfer: GoodsTransferSubmitType = {
      ...rest,
      defaultWarehouseIdReceipt: formValue.defaultWarehouseReceipt?.value,
      goodsTransferItems: transferItemAddEditList.map(item => ({
        id: item.id,
        goodsPOReceiptId: item.goodsPOReceiptId,
        goodsPOReceiptItemId: item.goodsPOReceiptItemId,
        itemCode: item.itemCode,
        warehouseIdIssue: item.warehouseIdIssue,
        warehouseIdReceipt: item.warehouseIdReceipt,
        quantityReceipt: item.quantityReceipt,
        quantityIssue: item.quantityIssue,
        quantityVar: item.quantityVar,
        batchNo: item.batchNo,
      })),
    };
    if (id) {
      await editGoodsTransfer({ id, goodsTransfer }).unwrap();
    } else {
      await addGoodsTransfer(goodsTransfer).unwrap();
    }
    history.goBack();
  };
  const watch = useWatch({
    control: methods.control,
    name: ['vendorId', 'purchaseOrgId', 'purchaseDivisionId', 'purchaseOfficeId', 'purchaseGroupId'],
  });
  const defaultWarehouseReceipt = useWatch({ control: methods.control, name: 'defaultWarehouseReceipt' });
  const handleCloseModal = () => {
    toggle();
  };
  const handleSaveModal = (items: GoodsPOReceiptItem[]) => {
    const transferItemAddEditList: GoodsTransferItemAddEditType[] = items.map(item => ({
      batchNo: item.batchNo,
      itemCode: item.itemCode,
      itemName: item.itemName,
      quantityIssue: item.quantity,
      warehouseIdIssue: item.warehouseId,
      warehouseNameIssue: item.warehouseName,
      goodsPOReceiptId: item.goodsPOReceiptId,
      goodsPOReceiptItemId: item.id,
      warehouseIdReceipt: defaultWarehouseReceipt?.value,
      warehouseNameReceipt: defaultWarehouseReceipt?.label,
      quantityReceipt: item.quantity,
      quantityVar: 0,
    }));
    dispatch(addTransferItemAddEditList(transferItemAddEditList));
  };
  React.useEffect(() => {
    return function () {
      dispatch(resetGoodsTransferSlice());
    };
  }, [dispatch]);
  React.useEffect(() => {
    if (defaultWarehouseReceipt !== undefined) {
      const defaultWh = {
        id: defaultWarehouseReceipt?.value,
        name: defaultWarehouseReceipt?.label,
      };
      dispatch(setDefaultWarehouseIdForItemAddEditList(defaultWh));
    }
  }, [defaultWarehouseReceipt, dispatch]);
  const routes = [
    {
      path: '',
      breadcrumbName: 'Purchasing',
    },
    {
      path: '',
      breadcrumbName: 'Goods Transfer',
    },
    {
      path: '',
      breadcrumbName: 'Adding',
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'Add Goods Transfer',
        breadcrumb: { routes },
        onBack: () => history.goBack(),
      }}
      extra={
        mode !== 'confirm' && (
          <Button icon={<CopyOutlined />} disabled={isDisabled} onClick={() => toggle()} type="primary" key={1}>
            Copy From
          </Button>
        )
      }
    >
      <ProCard split="horizontal" size="small" ghost bordered>
        <ProCard size="small" bordered>
          <FormProvider {...methods}>
            <AddEditForm />
          </FormProvider>
        </ProCard>
        <ProCard size="small" bordered>
          <ItemAddEditList />
        </ProCard>
        <ProCard size="small" bordered>
          <Space>
            <Button icon={<RollbackOutlined />} onClick={() => history.goBack()}>
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
          title="Goods PO Receipt List"
        >
          <GoodsPOReceiptList onCloseModal={handleCloseModal} data={watch} onSave={handleSaveModal} />
        </Modal>
      </ProCard>
    </PageContainer>
  );
};

export default AddEdit;

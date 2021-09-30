import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Button, notification, Space } from 'antd';
import { useAddPurchasePriceMutation, useEditPurchasePriceMutation, useGetPurchasePriceByIdQuery } from 'api/purchasePriceApi';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { FormProvider, NestedValue, SubmitHandler, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import AddEditForm, { PurchasePriceFormType } from './AddEditForm';
import ItemAddEditList from './ItemAddEditList';
import { resetPurchasePriceSlice, selectAllPriceItem, selectCopyId } from './slice';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required').nullable(),
  effectiveStart: yup.string().required('Effective start is required').nullable(),
  effectiveEnd: yup.string().required('Effective end is required').nullable(),
  purchaseOrg: yup.mixed().required('Purchase Org is required').nullable(),
  purchaseDivision: yup.mixed().required('Purchase Division is required').nullable(),
  purchaseOffice: yup.mixed().required('Purchase Office is required').nullable(),
  purchaseGroup: yup.mixed().required('Purchase Group is required').nullable(),
}).required();

export default function AddEdit() {
  const { id } = useParams<{ id: string }>();
  const copyId = useAppSelector(selectCopyId);
  const skipOrId = React.useMemo(() => {
    if (id === undefined && copyId === undefined) return undefined;
    if (id !== undefined) return +id;
    if (copyId !== undefined) return copyId;
  }, [id, copyId]);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const methods = useForm<PurchasePriceFormType>({ resolver: yupResolver(validationSchema) });
  const purchasePriceItems = useAppSelector(selectAllPriceItem);
  const [addPurchasePrice, { isLoading: isAdding }] = useAddPurchasePriceMutation();
  const [editPurchasePrice, { isLoading: isEditing }] = useEditPurchasePriceMutation();
  const { data: purchaserPrice } = useGetPurchasePriceByIdQuery(skipOrId ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const handleAddEdit: SubmitHandler<PurchasePriceFormType> = async formValue => {
    if (purchasePriceItems.length === 0) return notification.error({ message: 'Purchase Price Item is required' });
    const {
      purchaseOrg: { value: purchaseOrgId },
      purchaseDivision: { value: purchaseDivisionId },
      purchaseOffice: { value: purchaseOfficeId },
      purchaseGroup: { value: purchaseGroupId },
      ...rest
    } = formValue;
    const purchasePrice = {
      ...rest,
      purchaseOrgId,
      purchaseDivisionId,
      purchaseOfficeId,
      purchaseGroupId,
      purchasePriceItems: purchasePriceItems,
    } as PurchasePriceType;
    if (id === undefined) {
      await addPurchasePrice(purchasePrice).unwrap();
    } else {
      await editPurchasePrice({ id: +id, purchasePrice: purchasePrice }).unwrap();
    }
    history.goBack();
  };
  const routes = [
    {
      path: '',
      breadcrumbName: 'Master Data',
    },
    {
      path: '',
      breadcrumbName: 'Purchase Price',
    },
    {
      path: '',
      breadcrumbName: 'Adding',
    },
  ];
  React.useEffect(() => {
    if (purchaserPrice !== undefined) {
      const {
        purchaseOrgId,
        purchaseOrgName,
        purchaseDivisionId,
        purchaseDivisionName,
        purchaseOfficeId,
        purchaseOfficeName,
        purchaseGroupId,
        purchaseGroupName,
        purchasePriceItems,
        ...rest
      } = purchaserPrice;
      const purchaseOrg = { label: purchaseOrgName, value: purchaseOrgId } as NestedValue<{ label: string; value: string }>;
      const purchaseDivision = { label: purchaseDivisionName, value: purchaseDivisionId } as NestedValue<{
        label: string;
        value: string;
      }>;
      const purchaseOffice = { label: purchaseOfficeName, value: purchaseOfficeId } as NestedValue<{
        label: string;
        value: string;
      }>;
      const purchaseGroup = { label: purchaseGroupName, value: purchaseGroupId } as NestedValue<{ label: string; value: string }>;
      const purchasePriceForm = { ...rest, purchaseOrg, purchaseDivision, purchaseOffice, purchaseGroup };
      for (const [key, value] of Object.entries(purchasePriceForm)) {
        methods.setValue(key as keyof PurchasePriceFormType, value);
      }
    }
  }, [methods, purchaserPrice]);

  React.useEffect(() => {
    return function () {
      dispatch(resetPurchasePriceSlice());
    };
  }, [dispatch]);
  return (
    <PageContainer
      header={{
        title: 'Add Purchase Price',
        breadcrumb: { routes },
        onBack: () => history.goBack(),
      }}
    >
      <ProCard size="small" ghost split="horizontal">
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
            <Button onClick={() => history.goBack()} icon={<RollbackOutlined />}>
              Back
            </Button>
            <Button
              loading={isAdding || isEditing}
              onClick={methods.handleSubmit(handleAddEdit)}
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

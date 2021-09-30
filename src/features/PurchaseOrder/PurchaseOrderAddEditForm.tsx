import { SearchOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Col, Form, Modal, Row } from 'antd';
import { useGetPurchaseOrderByIdQuery } from 'api/purchaseOrderApi';
import { useGetPurchaseRequestByIdQuery } from 'api/purchaseRequestApi';
import { DatePickerField, SelectField, TextAreaField, TextField } from 'components';
import withData, { WithDataProps } from 'Hocs/withData';
import { useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import VendorList from './VendorList';

interface Props extends WithDataProps {}
export interface PurchaseOrderFormType {
  vendorId: string;
  paymentMethodId: string;
  purchaseOrgId: string;
  purchaseDivisionId: string;
  purchaseOfficeId: string;
  purchaseGroupId: string;
  buyDate: string;
  receiptDate: string;
  note: string;
}
const PurchaseOrderAddEditForm = (props: Props) => {
  const { purchaseOrgs, purchaseDivisions, purchaseOffices, purchaseGroups } = props;
  const { id } = useParams<{ id: string | undefined }>();
  const copyId = useAppSelector(s => s.purchaseOrder.copyId);
  const purchaseRequestId = useAppSelector(s => s.purchaseOrder.purchaseRequestId);
  const [openModal, { toggle }] = useToggle(false);
  const vendor = useAppSelector(s => s.purchaseOrder.vendor);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<PurchaseOrderFormType>();
  const { data: purchaseRequest } = useGetPurchaseRequestByIdQuery(purchaseRequestId ?? skipToken);
  const { data } = useGetPurchaseOrderByIdQuery((id || copyId) ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });

  const handleCloseModal = () => {
    toggle();
  };
  React.useEffect(() => {
    if (vendor !== undefined) {
      setValue('vendorId', vendor.id, { shouldValidate: true });
    }
  }, [setValue, vendor]);
  React.useEffect(() => {
    if (purchaseRequest !== undefined) {
      const formValue = {
        vendorId: purchaseRequest.vendorId,
        buyDate: purchaseRequest.buyDate,
        receiptDate: purchaseRequest.receiptDate,
        paymentMethodId: '',
        note: '',
        purchaseOrgId: purchaseRequest.purchaseOrgId,
        purchaseDivisionId: purchaseRequest.purchaseDivisionId,
        purchaseOfficeId: purchaseRequest.purchaseOfficeId,
        purchaseGroupId: purchaseRequest.purchaseGroupId,
      };
      for (const [key, value] of Object.entries<any>(formValue)) {
        setValue(key as keyof PurchaseOrderFormType, value);
      }
    }
  }, [purchaseRequest, setValue]);
  React.useEffect(() => {
    if (data !== undefined) {
      const formValue = {
        vendorId: data.vendorId,
        purchaseOrgId: data.purchaseOrgId,
        purchaseDivisionId: data.purchaseDivisionId,
        purchaseOfficeId: data.purchaseOfficeId,
        purchaseGroupId: data.purchaseGroupId,
        buyDate: data.buyDate,
        receiptDate: data.receiptDate,
        note: data.note,
      };
      for (const [key, value] of Object.entries<any>(formValue)) {
        setValue(key as keyof PurchaseOrderFormType, value);
      }
    }
  }, [data, setValue]);
  return (
    <React.Fragment>
      <Form layout="vertical">
        <Row gutter={[64, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              hasFeedback
              validateStatus={errors?.vendorId && 'error'}
              help={errors?.vendorId?.message}
              required
              label="Vendor"
            >
              <TextField onClick={() => toggle()} name="vendorId" control={control} suffix={<SearchOutlined />} readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              hasFeedback
              validateStatus={errors?.paymentMethodId && 'error'}
              help={errors?.paymentMethodId?.message}
              required
              label="Payment"
            >
              <SelectField
                name="paymentMethodId"
                control={control}
                options={[
                  { label: 'Chuyển Khoản', value: 1 },
                  { label: 'Tiền Mặt', value: 2 },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              hasFeedback
              validateStatus={errors?.purchaseOrgId && 'error'}
              help={errors?.purchaseOrgId?.message}
              required
              label="Purchase Org"
            >
              <SelectField
                control={control}
                name="purchaseOrgId"
                options={purchaseOrgs?.map(item => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              hasFeedback
              validateStatus={errors?.purchaseDivisionId && 'error'}
              help={errors?.purchaseDivisionId?.message}
              required
              label="Purchase Division"
            >
              <SelectField
                control={control}
                name="purchaseDivisionId"
                options={purchaseDivisions?.map(item => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              hasFeedback
              validateStatus={errors?.purchaseOfficeId && 'error'}
              help={errors?.purchaseOfficeId?.message}
              required
              label="Purchase Office"
            >
              <SelectField
                control={control}
                name="purchaseOfficeId"
                options={purchaseOffices?.map(item => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              hasFeedback
              validateStatus={errors?.purchaseGroupId && 'error'}
              help={errors?.purchaseGroupId?.message}
              required
              label="Purchase Group"
            >
              <SelectField
                control={control}
                name="purchaseGroupId"
                options={purchaseGroups?.map(item => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              hasFeedback
              validateStatus={errors?.buyDate && 'error'}
              help={errors?.buyDate?.message}
              required
              label="Buy Date"
            >
              <DatePickerField name="buyDate" control={control} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              hasFeedback
              validateStatus={errors?.receiptDate && 'error'}
              help={errors?.receiptDate?.message}
              required
              label="Receipt Date"
            >
              <DatePickerField name="receiptDate" control={control} />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item required label="Note">
              <TextAreaField control={control} name="note" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal width={1000} visible={openModal} title="Vendor List" destroyOnClose onCancel={handleCloseModal} footer={null}>
        <VendorList onCloseModal={handleCloseModal} />
      </Modal>
    </React.Fragment>
  );
};
export default withData(PurchaseOrderAddEditForm);

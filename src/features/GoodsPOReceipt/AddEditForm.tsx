import { SearchOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Col, Form, Modal, Row } from 'antd';
import { useGetGoodsPOReceiptByIdQuery } from 'api/goodsPOReceiptApi';
import { DatePickerField, SelectField, TextAreaField, TextField } from 'components';
import withData, { WithDataProps } from 'Hocs/withData';
import { useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { GoodsPOReceiptAddEdit } from './types';
import Vendors from './Vendors';

interface Props extends WithDataProps {}
export interface GoodsPOReceiptForm extends Omit<GoodsPOReceiptAddEdit, 'defaultWarehouseId' | 'goodsPOReceiptItems'> {
  defaultWarehouse: {
    label?: string;
    value?: string;
  };
}
const AddEditForm = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const goodsPOReceiptId = useAppSelector(s => s.goodsPOReceipt.goodsPOReceiptId);
  const { purchaseOrgs, purchaseDivisions, purchaseOffices, purchaseGroups, warehouses } = props;
  const goodsPOReceiptForm = useAppSelector(s => s.goodsPOReceipt.goodsPOReceiptForm);
  const { data: goodsPOReceipt } = useGetGoodsPOReceiptByIdQuery((id || goodsPOReceiptId) ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const [openModal, { toggle }] = useToggle();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<GoodsPOReceiptForm>();
  const vendorIdSelected = useAppSelector(s => s.goodsPOReceipt.vendorIdSelected);

  const handleCloseModal = () => {
    toggle();
  };

  React.useEffect(() => {
    if (vendorIdSelected) setValue('vendorId', vendorIdSelected, { shouldValidate: true });
  }, [setValue, vendorIdSelected]);
  React.useEffect(() => {
    if (goodsPOReceiptForm) {
      for (const [key, value] of Object.entries(goodsPOReceiptForm)) {
        console.log(key, value);
        setValue(key as keyof GoodsPOReceiptForm, value);
      }
    }
  }, [setValue, goodsPOReceiptForm]);
  React.useEffect(() => {
    if (goodsPOReceipt !== undefined) {
      const goodsPOReceiptForm: GoodsPOReceiptForm = {
        buyDate: goodsPOReceipt.buyDate,
        note: goodsPOReceipt.note,
        purchaseDivisionId: goodsPOReceipt.purchaseDivisionId,
        purchaseGroupId: goodsPOReceipt.purchaseGroupId,
        purchaseOfficeId: goodsPOReceipt.purchaseOfficeId,
        purchaseOrgId: goodsPOReceipt.purchaseOrgId,
        receiptDate: goodsPOReceipt.receiptDate,
        vendorId: goodsPOReceipt.vendorId,
        defaultWarehouse: {
          label: goodsPOReceipt.defaultWarehouseName,
          value: goodsPOReceipt.defaultWarehouseId,
        },
        id: goodsPOReceipt.id,
      };
      for (const [key, value] of Object.entries(goodsPOReceiptForm)) {
        setValue(key as keyof GoodsPOReceiptForm, value);
      }
    }
  }, [goodsPOReceipt, setValue]);
  return (
    <React.Fragment>
      <Form layout="vertical">
        <Row gutter={[64, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              required
              label="Vendor"
              hasFeedback
              help={errors?.vendorId?.message}
              validateStatus={errors?.vendorId && 'error'}
            >
              <TextField name="vendorId" control={control} suffix={<SearchOutlined onClick={() => toggle()} />} readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Default Warehouse">
              <SelectField
                name="defaultWarehouse"
                control={control}
                labelInValue={true}
                options={warehouses?.map(item => ({ label: item.name, value: item.id }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              required
              label="Purchase Org"
              hasFeedback
              help={errors?.purchaseOrgId?.message}
              validateStatus={errors?.purchaseOrgId && 'error'}
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
              required
              label="Purchase Division"
              hasFeedback
              help={errors?.purchaseDivisionId?.message}
              validateStatus={errors?.purchaseDivisionId && 'error'}
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
              required
              label="Purchase Office"
              hasFeedback
              help={errors?.purchaseOfficeId?.message}
              validateStatus={errors?.purchaseOfficeId && 'error'}
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
              required
              label="Purchase Group"
              hasFeedback
              help={errors?.purchaseGroupId?.message}
              validateStatus={errors?.purchaseGroupId && 'error'}
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
              required
              label="Buy Date"
              hasFeedback
              help={errors?.buyDate?.message}
              validateStatus={errors?.buyDate && 'error'}
            >
              <DatePickerField name="buyDate" control={control} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              required
              label="Receipt Date"
              hasFeedback
              help={errors?.receiptDate?.message}
              validateStatus={errors?.receiptDate && 'error'}
            >
              <DatePickerField name="receiptDate" control={control} />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item label="Note">
              <TextAreaField control={control} name="note" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal width={1000} visible={openModal} title="Vendor List" destroyOnClose onCancel={handleCloseModal} footer={null}>
        <Vendors onCloseModal={handleCloseModal} />
      </Modal>
    </React.Fragment>
  );
};

export default withData(AddEditForm);

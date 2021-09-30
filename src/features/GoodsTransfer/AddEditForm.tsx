import { SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Col, Form, Modal, Row } from 'antd';
import { useGetGoodsTransferByIdQuery } from 'api/goodsTransferApi';
import { SelectField, TextAreaField, TextField } from 'components';
import withData, { WithDataProps } from 'Hocs/withData';
import { useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { NestedValue, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Vendors from './Vendor';

interface Props extends WithDataProps {}

export interface GoodsTransferFormType extends Omit<GoodsTransferAddEditType, 'defaultWarehouseIdReceipt'> {
  defaultWarehouseReceipt: NestedValue<{ label?: string; value?: string }>;
}
const AddEditForm = (props: Props) => {
  const { purchaseOrgs, purchaseDivisions, purchaseGroups, purchaseOffices, warehouses } = props;
  const { id, mode } = useParams<{ id: string; mode: string }>();
  const isDisabled = mode === 'confirm' ? true : false;
  const { data: goodsTransfer } = useGetGoodsTransferByIdQuery(id ?? skipToken);
  const [openModal, { toggle }] = useToggle();
  const vendorId = useAppSelector(s => s.goodsTransfer.vendorIdSelected);
  const ref = React.useRef<any>();
  const handleCloseModal = () => {
    toggle();
  };
  const handleSave = () => {
    ref.current.saveItem();
    handleCloseModal();
  };
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<GoodsTransferFormType>();
  React.useEffect(() => {
    if (vendorId) {
      setValue('vendorId', vendorId, { shouldValidate: true });
    }
  }, [vendorId, setValue]);
  React.useEffect(() => {
    if (goodsTransfer !== undefined) {
      const goodsTransferForm: GoodsTransferFormType = {
        id: goodsTransfer.id,
        note: goodsTransfer.note,
        purchaseDivisionId: goodsTransfer.purchaseDivisionId,
        purchaseGroupId: goodsTransfer.purchaseGroupId,
        purchaseOfficeId: goodsTransfer.purchaseOfficeId,
        purchaseOrgId: goodsTransfer.purchaseOrgId,
        vendorId: goodsTransfer.vendorId,
        defaultWarehouseReceipt: {
          label: goodsTransfer.defaultWarehouseNameReceipt,
          value: goodsTransfer.defaultWarehouseIdReceipt,
        } as NestedValue<{ label: string; value: string }>,
      };
      for (const [key, value] of Object.entries(goodsTransferForm)) {
        setValue(key as keyof GoodsTransferFormType, value);
      }
    }
  }, [setValue, goodsTransfer]);
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
              <TextField
                name="vendorId"
                control={control}
                suffix={<SearchOutlined onClick={() => toggle()} />}
                readOnly
                disabled={isDisabled}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Default Ws Receipt">
              <SelectField
                disabled={isDisabled}
                control={control}
                labelInValue={true}
                name="defaultWarehouseReceipt"
                options={warehouses?.map(x => ({ label: x.name, value: x.id }))}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
                control={control}
                name="purchaseGroupId"
                options={purchaseGroups?.map(item => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item label="Note">
              <TextAreaField disabled={isDisabled} control={control} name="note" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal
        visible={openModal}
        title="Vendor List"
        destroyOnClose
        onCancel={handleCloseModal}
        width={1000}
        okText="Save Changs"
        okButtonProps={{ icon: <SaveOutlined /> }}
        cancelText="Back"
        onOk={handleSave}
      >
        <Vendors ref={ref} />
      </Modal>
    </React.Fragment>
  );
};

export default withData(AddEditForm);

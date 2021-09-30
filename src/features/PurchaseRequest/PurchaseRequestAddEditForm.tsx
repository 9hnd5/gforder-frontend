import { SearchOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Col, Form, Modal, Row } from 'antd';
import { useGetPurchaseRequestByIdQuery } from 'api/purchaseRequestApi';
import { DatePickerField, SelectField, TextAreaField, TextField } from 'components';
import withData, { WithDataProps } from 'Hocs/withData';
import { useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import VendorList from './VendorList';

interface Props extends WithDataProps {}

export type RequestFormType = {
  id?: string;
  vendorId: string;
  buyDate: string;
  receiptDate: string;
  purchaseOrgId: string;
  purchaseDivisionId: string;
  purchaseOfficeId: string;
  purchaseGroupId: string;
  note?: string;
};

const PurchaseRequestAddEditForm = ({ purchaseOrgs, purchaseDivisions, purchaseOffices, purchaseGroups }: Props) => {
  const { id }: { id: string } = useParams();
  const copyId = useAppSelector(s => s.purchaseRequest.copyId);
  const [openModal, { toggle }] = useToggle();
  const vendor = useAppSelector(s => s.purchaseRequest.vendor);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<RequestFormType>();
  const { data: purchaseRequest } = useGetPurchaseRequestByIdQuery((id || copyId) ?? skipToken);
  const handleCloseModal = () => {
    toggle();
  };
  React.useEffect(() => {
    if (vendor !== undefined) {
      setValue('vendorId', vendor.id, { shouldValidate: true });
    }
  }, [vendor, setValue]);
  React.useEffect(() => {
    if (purchaseRequest !== undefined) {
      for (const [key, value] of Object.entries<any>(purchaseRequest)) {
        setValue(key as keyof Omit<RequestFormType, 'purchaseRequestItems'>, value);
      }
    }
  }, [purchaseRequest, setValue]);
  return (
    <React.Fragment>
      <Form layout="vertical">
        <Row gutter={[64, 0]}>
          <Col xs={24} md={24}>
            <Form.Item
              hasFeedback
              validateStatus={errors?.vendorId && 'error'}
              help={errors?.vendorId?.message}
              required
              label="Vendor"
            >
              <TextField name="vendorId" control={control} suffix={<SearchOutlined onClick={() => toggle()} />} readOnly />
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
            <Form.Item label="Note">
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
export default withData(PurchaseRequestAddEditForm);

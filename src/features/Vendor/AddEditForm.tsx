import { skipToken } from '@reduxjs/toolkit/query/react';
import { Col, Form, Row } from 'antd';
import { useGetPurchaseTypesQuery } from 'api/purchaseTypeApi';
import { useGetVendorByIdQuery } from 'api/vendorApi';
import { useGetVendorStatusesQuery } from 'api/vendorStatusApi';
import { useGetVendorTypesQuery } from 'api/vendorTypeApi';
import { SelectField, TextField } from 'components';
import { WithDataProps } from 'Hocs/withData';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

interface Props extends WithDataProps {}

const AddEditForm = (props: Props) => {
  const { purchaseOrgs, purchaseDivisions, purchaseOffices, purchaseGroups } = props;
  const { id } = useParams<{ id: string }>();
  const { control, setValue } = useFormContext();
  const { data: vendorForEdit } = useGetVendorByIdQuery(id ?? skipToken);
  const { data: vendorTypes } = useGetVendorTypesQuery();
  const { data: purchaseTypes } = useGetPurchaseTypesQuery();
  const { data: vendorStatuses } = useGetVendorStatusesQuery();
  useEffect(() => {
    if (!isEmpty(vendorForEdit)) {
      for (const [key, value] of Object.entries<any>(vendorForEdit!)) {
        setValue(key, value);
      }
    }
  }, [vendorForEdit, setValue]);
  return (
    <Form layout="vertical">
      <Row gutter={[32, 0]}>
        <Col xs={12}>
          <Form.Item label="First Name" required>
            <TextField name="firstName" control={control} />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Last Name" required>
            <TextField name="lastName" control={control} />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Phone" required>
            <TextField name="phoneNumber" control={control} />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Type" required>
            <SelectField
              name="vendorTypeId"
              control={control}
              options={vendorTypes?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Purchase Type" required>
            <SelectField
              name="purchaseTypeId"
              control={control}
              options={purchaseTypes?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Status" required>
            <SelectField
              name="vendorStatusId"
              control={control}
              options={vendorStatuses?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Purchase Org" required>
            <SelectField
              name="purchaseOrgId"
              control={control}
              options={purchaseOrgs?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Purchase Division" required>
            <SelectField
              name="purchaseDivisionId"
              control={control}
              options={purchaseDivisions?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Purchase Office" required>
            <SelectField
              name="purchaseOfficeId"
              control={control}
              options={purchaseOffices?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Purchase Group" required>
            <SelectField
              name="purchaseGroupId"
              control={control}
              options={purchaseGroups?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Contact" required>
            <TextField name="contactName" control={control} />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Contact Number" required>
            <TextField name="contactNumber" control={control} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item label="Tax" required>
            <TextField name="taxNumber" control={control} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default AddEditForm;

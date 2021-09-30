import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row } from 'antd';
import { CheckboxField, TextField } from 'components';
import { SubmitHandler, useForm } from 'react-hook-form';
import React from 'react';

interface VendorAddressFormType extends VendorAddress {}
interface Props {
  vendorAddressEdit?: VendorAddress;
  onAdd: (vendorAddressAdd: VendorAddress) => void;
  onEdit: (vendorAddressEdit: VendorAddress) => void;
}

const VendorAddressAddEditForm = (props: Props) => {
  const { onAdd, vendorAddressEdit, onEdit } = props;
  const { control, handleSubmit, setValue } = useForm<VendorAddressFormType>();

  const handleAddEdit: SubmitHandler<VendorAddressFormType> = formValue => {
    if (vendorAddressEdit !== undefined) {
      onEdit({ ...formValue });
    } else {
      onAdd({ ...formValue });
    }
  };
  React.useEffect(() => {
    if (vendorAddressEdit !== undefined) {
      for (const [key, value] of Object.entries(vendorAddressEdit)) {
        setValue(key as keyof VendorAddress, value);
      }
    }
  }, [vendorAddressEdit, setValue]);
  return (
    <Form layout="vertical">
      <Row gutter={[8, 0]}>
        <Col xs={24}>
          <Form.Item>
            <CheckboxField name="isPrimary" control={control}>
              Is Primary
            </CheckboxField>
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item required label="Stress">
            <TextField control={control} name="stress" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item required label="District">
            <TextField control={control} name="district" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item required label="City">
            <TextField control={control} name="city" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item required label="Country">
            <TextField control={control} name="country" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item required label="Contact">
            <TextField control={control} name="contactName" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item required label="ContactNumber">
            <TextField control={control} name="contactNumber" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item required label="Tax">
            <TextField control={control} name="taxNumber" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Button onClick={handleSubmit(handleAddEdit)} type="primary" icon={<SaveOutlined />}>
            Save Changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default VendorAddressAddEditForm;

import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row } from 'antd';
import { useGetFarmStatusesQuery } from 'api/farmStatusApi';
import { useGetFarmTypesQuery } from 'api/farmTypeApi';
import { SelectField, TextField } from 'components';
import { NestedValue, SubmitHandler, useForm } from 'react-hook-form';
import React from 'react';
import { useAppSelector } from 'hooks/reduxHooks';

interface Props {
  farmEdit?: Farm;
  onAdd: (farmAdd: Farm) => void;
  onEdit: (farmEdit: Farm) => void;
}

export interface FarmFormType
  extends Omit<Farm, 'farmTypeId' | 'farmTypeName' | 'farmStatusId' | 'farmStatusName' | 'vendorAddressId' | 'vendorAddress'> {
  farmType: NestedValue<{ label: string; value: number }>;
  farmStatus: NestedValue<{ label: string; value: number }>;
  vendorAddress: NestedValue<{ label: string; value: number }>;
}
const FarmAddEditForm = (props: Props) => {
  const { onAdd, onEdit, farmEdit } = props;
  const { control, handleSubmit, setValue } = useForm<FarmFormType>();
  const { data: farmTypes } = useGetFarmTypesQuery();
  const { data: farmStatuses } = useGetFarmStatusesQuery();
  const vendorAddressAddEditList = useAppSelector(s => s.vendor.vendorAddressAddEditList);

  const handleAddEdit: SubmitHandler<FarmFormType> = formValue => {
    const {
      farmType: { label: farmTypeName, value: farmTypeId },
      farmStatus: { label: farmStatusName, value: farmStatusId },
      vendorAddress: { label: vendorAddress, value: vendorAddressId },
      ...rest
    } = formValue;
    const farmAddEdit = { ...rest, farmTypeId, farmTypeName, farmStatusId, farmStatusName, vendorAddress, vendorAddressId };
    if (farmEdit !== undefined) {
      onEdit(farmAddEdit);
    } else {
      onAdd(farmAddEdit);
    }
  };
  React.useEffect(() => {
    if (farmEdit !== undefined) {
      const { farmTypeId, farmTypeName, farmStatusId, farmStatusName, vendorAddressId, ...rest } = farmEdit;
      const vendorAddressAddEdit = vendorAddressAddEditList.find(x => x.id === vendorAddressId);
      const farmForm: FarmFormType = {
        ...rest,
        farmType: { label: farmTypeName, value: farmTypeId } as NestedValue<{ label: string; value: number }>,
        farmStatus: { label: farmStatusName, value: farmStatusId } as NestedValue<{ label: string; value: number }>,
        vendorAddress: { label: vendorAddressAddEdit?.stress, value: vendorAddressId } as NestedValue<{
          label: string;
          value: number;
        }>,
      };
      for (const [key, value] of Object.entries(farmForm)) {
        setValue(key as keyof FarmFormType, value);
      }
    }
  }, [setValue, farmEdit, vendorAddressAddEditList]);
  return (
    <Form layout="vertical">
      <Row gutter={[0, 8]}>
        <Col xs={24}>
          <Form.Item required label="Name">
            <TextField control={control} name="name" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item required label="Owner">
            <TextField control={control} name="owner" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item required label="Owner Number">
            <TextField control={control} name="ownerNumber" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item required label="Address">
            <SelectField
              control={control}
              name="vendorAddress"
              options={vendorAddressAddEditList?.map(item => ({ label: item.stress, value: item.key }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item required label="Type">
            <SelectField
              control={control}
              labelInValue
              name="farmType"
              options={farmTypes?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item required label="Status">
            <SelectField
              control={control}
              labelInValue
              name="farmStatus"
              options={farmStatuses?.map(item => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item required label="Sizing">
            <TextField control={control} name="farmSize" />
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
export default FarmAddEditForm;

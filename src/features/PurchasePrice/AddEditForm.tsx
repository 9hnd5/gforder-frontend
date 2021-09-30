import { Col, Form, Row } from 'antd';
import { DatePickerField, SelectField, TextAreaField, TextField } from 'components';
import withData, { WithDataProps } from 'Hocs/withData';
import { NestedValue, useFormContext } from 'react-hook-form';

interface Props extends WithDataProps {}
export interface PurchasePriceFormType
  extends Omit<
    PurchasePriceType,
    | 'purchaseOrgId'
    | 'purchaseOrgName'
    | 'purchaseDivisionId'
    | 'purchaseDivisionName'
    | 'purchaseOfficeId'
    | 'purchaseOfficeName'
    | 'purchaseGroupId'
    | 'purchaseGroupName'
    | 'purchasePriceItems'
  > {
  purchaseOrg: NestedValue<{ label: string; value: string }>;
  purchaseDivision: NestedValue<{ label: string; value: string }>;
  purchaseOffice: NestedValue<{ label: string; value: string }>;
  purchaseGroup: NestedValue<{ label: string; value: string }>;
}
const AddEditForm = (props: Props) => {
  const { purchaseOrgs, purchaseDivisions, purchaseOffices, purchaseGroups } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext<PurchasePriceFormType>();

  return (
    <Form layout="vertical">
      <Row gutter={[64, 0]}>
        <Col xs={24} md={24}>
          <Form.Item hasFeedback validateStatus={errors?.name && 'error'} help={errors?.name?.message} required label="Name">
            <TextField control={control} name="name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            validateStatus={errors?.effectiveStart && 'error'}
            help={errors?.effectiveStart?.message}
            required
            label="Date Effect"
          >
            <DatePickerField control={control} name="effectiveStart" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            validateStatus={errors?.effectiveEnd && 'error'}
            help={errors?.effectiveEnd?.message}
            required
            label="Date End"
          >
            <DatePickerField control={control} name="effectiveEnd" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            validateStatus={errors?.purchaseOrg && 'error'}
            help={errors?.purchaseOrg?.message}
            required
            label="Purchase Org"
          >
            <SelectField
              control={control}
              name="purchaseOrg"
              labelInValue
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
            validateStatus={errors?.purchaseDivision && 'error'}
            help={errors?.purchaseDivision?.message}
            required
            label="Purchase Division"
          >
            <SelectField
              control={control}
              name="purchaseDivision"
              labelInValue
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
            validateStatus={errors?.purchaseOffice && 'error'}
            help={errors?.purchaseOffice?.message}
            required
            label="Purchase Office"
          >
            <SelectField
              control={control}
              name="purchaseOffice"
              labelInValue
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
            validateStatus={errors?.purchaseGroup && 'error'}
            help={errors?.purchaseGroup?.message}
            required
            label="Purchase Group"
          >
            <SelectField
              control={control}
              name="purchaseGroup"
              labelInValue
              options={purchaseGroups?.map(item => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={24}>
          <Form.Item label="Note">
            <TextAreaField control={control} name="note" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default withData(AddEditForm);

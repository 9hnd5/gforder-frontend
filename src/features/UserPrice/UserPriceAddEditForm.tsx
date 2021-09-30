import { Avatar, Col, Form, Row, Select, Space, Spin, Typography } from 'antd';
import { useLazyGetUsersQuery } from 'api/userApi';
import { useGetUserPricesQuery } from 'api/userPriceApi';
import { SelectField, TextAreaField, TextField } from 'components';
import withData, { WithDataProps } from 'Hocs/withData';
import { debounce } from 'lodash';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

const { Option } = Select;
export interface UserPriceFormType {
  id?: string;
  name: string;
  purchaseOrgId: string;
  purchaseDivisionId: string;
  purchaseOfficeId: string;
  purchaseGroupId: string;
  userId?: number;
  note: string;
}
interface UserPriceAddEditProps extends WithDataProps {}
const UserPriceAddEditForm = (props: UserPriceAddEditProps) => {
  const { id } = useParams<{ id: string }>();
  const { purchaseOrgs, purchaseDivisions, purchaseGroups, purchaseOffices } = props;
  const { control, setValue } = useFormContext<UserPriceFormType>();
  const { userPrice } = useGetUserPricesQuery(null, { selectFromResult: x => ({ userPrice: x.data?.find(y => y.id === id) }) });

  React.useEffect(() => {
    if (userPrice) {
      const { createdBy, createdDate, ...rest } = userPrice;
      const formValue = {
        id: rest.id,
        name: rest.name,
        purchaseOrgId: rest.purchaseOrg.id,
        purchaseDivisionId: rest.purchaseDivision.id,
        purchaseOfficeId: rest.purchaseOffice.id,
        purchaseGroupId: rest.purchaseGroup.id,
        userId: rest.user?.id,
        note: rest.note,
      };
      for (const [key, value] of Object.entries(formValue)) {
        setValue(key as keyof UserPriceFormType, value);
      }
    }
  }, [userPrice, setValue]);

  return (
    <Form layout="vertical">
      <Row gutter={[4, 0]}>
        <Col xs={12}>
          <Form.Item label="Name" required>
            <TextField name="name" control={control} />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="User" required>
            {/* <TextField name="userId" control={control} /> */}
            <UserSearchBar />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Purchase Org" required>
            <SelectField
              name="purchaseOrgId"
              control={control}
              options={purchaseOrgs?.map(x => ({ label: x.name, value: x.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Purchase Division" required>
            <SelectField
              name="purchaseDivisionId"
              control={control}
              options={purchaseDivisions?.map(x => ({ label: x.name, value: x.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Purchase Office" required>
            <SelectField
              name="purchaseOfficeId"
              control={control}
              options={purchaseOffices?.map(x => ({ label: x.name, value: x.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label="Purchase Group" required>
            <SelectField
              name="purchaseGroupId"
              control={control}
              options={purchaseGroups?.map(x => ({ label: x.name, value: x.id }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item label="Note">
            <TextAreaField name="note" control={control} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default withData(UserPriceAddEditForm);

const UserSearchBar = () => {
  const { setValue } = useFormContext<UserPriceFormType>();
  const [fetch, { data, isFetching }] = useLazyGetUsersQuery();

  const debounceSearch = React.useRef(
    debounce(value => {
      if (value) {
        const params = { firstName: { eq: value } };
        fetch(params);
      }
    }, 1000)
  );

  const renderOptions = data?.map(x => (
    <Option label={x.firstName} key={x.id} value={x.id}>
      <Space>
        <Avatar src="" />
        <Space direction="vertical">
          <Typography.Text strong>{x.firstName}</Typography.Text>
          <Typography.Text type="secondary">{x.lastName}</Typography.Text>
        </Space>
      </Space>
    </Option>
  ));

  const handleSelected = (value: any) => {
    const item = data?.find(x => x.id === value);
    setValue('userId', item?.id);
  };

  const handleSearch = (value: string) => debounceSearch.current(value);

  return (
    <Select
      onSearch={handleSearch}
      onSelect={handleSelected}
      showSearch
      placeholder="Search Item"
      optionLabelProp="label"
      style={{ width: '100%' }}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
    >
      {renderOptions}
    </Select>
  );
};

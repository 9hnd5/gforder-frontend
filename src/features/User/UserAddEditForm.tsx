import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Col, Form, Row } from 'antd';
import { useGetRolesQuery } from 'api/roleApi';
import { useGetUserByIdQuery } from 'api/userApi';
import { DatePickerField, PasswordField, SelectField, TextField } from 'components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';

const UserAddEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<UserAddEditType>();
  const { data: roles } = useGetRolesQuery(null);
  const { data: user } = useGetUserByIdQuery(id ?? skipToken);

  React.useEffect(() => {
    if (user !== undefined) {
      for (const [key, value] of Object.entries(user)) {
        setValue(key as keyof UserAddEditType, value);
      }
    }
  }, [user, setValue]);
  return (
    <Form layout="vertical">
      <Row gutter={[2, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            validateStatus={errors?.firstName && 'error'}
            help={errors?.firstName?.message}
            label="First Name"
            required
          >
            <TextField control={control} name="firstName" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            validateStatus={errors?.lastName && 'error'}
            help={errors?.lastName?.message}
            label="Last Name"
            required
          >
            <TextField control={control} name="lastName" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            validateStatus={errors?.phoneNumber && 'error'}
            help={errors?.phoneNumber?.message}
            label="Phone"
            required
          >
            <TextField control={control} name="phoneNumber" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            validateStatus={errors?.dateOfBirth && 'error'}
            help={errors?.dateOfBirth?.message}
            label="Date of Birth"
            required
          >
            <DatePickerField control={control} name="dateOfBirth" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item hasFeedback validateStatus={errors?.email && 'error'} help={errors?.email?.message} label="Email" required>
            <TextField control={control} name="email" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            validateStatus={errors?.password && 'error'}
            help={errors?.password?.message}
            label="Password"
            required
          >
            <PasswordField control={control} name="password" />
          </Form.Item>
        </Col>
        <Col xs={24} md={24}>
          <Form.Item hasFeedback validateStatus={errors?.roleId && 'error'} help={errors?.roleId?.message} label="Role" required>
            <SelectField
              control={control}
              name="roleId"
              options={roles?.map((item: any) => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default UserAddEditForm;

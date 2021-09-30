import { Col, Form, Row } from 'antd';
import { TextAreaField, TextField } from 'components';
import { useFormContext } from 'react-hook-form';
import { RoleAddEdit } from './types';

export default function RoleAddEditForm() {
   const {
      control,
      formState: { errors },
   } = useFormContext<RoleAddEdit>();
   return (
      <Form labelAlign="left" labelCol={{ xs: 2 }} wrapperCol={{ xs: 12 }} layout="horizontal">
         <Row gutter={[8, 0]}>
            <Col xs={24}>
               <Form.Item
                  hasFeedback
                  validateStatus={errors?.name && 'error'}
                  help={errors?.name?.message}
                  required
                  label="Name"
               >
                  <TextField control={control} name="name" />
               </Form.Item>
            </Col>
            <Col xs={24}>
               <Form.Item label="Description">
                  <TextAreaField control={control} name="description" />
               </Form.Item>
            </Col>
         </Row>
      </Form>
   );
}

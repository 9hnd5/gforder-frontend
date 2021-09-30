import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Form } from 'antd';
import { useGetUserOrderByIdQuery } from 'api/userOrderApi';
import { DatePickerField, TextAreaField } from 'components';
import { useAppSelector } from 'hooks/reduxHooks';
import moment from 'moment';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { selectCopyId } from './slice';

export interface UserOrderFormType {
  createdDate?: string;
  buyDate: string;
  receiptDate: string;
  note?: string;
}
interface UserOrderAddEditFormProps {
  viewId?: string;
}
const UserOrderAddEditForm = (props: UserOrderAddEditFormProps) => {
  const { viewId } = props;
  const isDisalbedField = React.useMemo(() => (viewId ? true : false), [viewId]);
  const { id } = useParams<{ id?: string }>();
  const copyId = useAppSelector(selectCopyId);
  const { data } = useGetUserOrderByIdQuery((id || copyId || viewId) ?? skipToken);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<UserOrderFormType>();

  React.useEffect(() => {
    if (data !== undefined) {
      const formValue = {
        createdDate: data.createdDate,
        buyDate: data.buyDate,
        receiptDate: data.receiptDate,
        note: data.note,
      };
      for (const [key, value] of Object.entries(formValue)) {
        setValue(key as keyof UserOrderFormType, value);
      }
    }
  }, [data, setValue]);
  return (
    <Form layout="vertical">
      <Form.Item required label="Created Date">
        <DatePickerField disabled defaultValue={moment().format('YYYY-MM-DD')} name="createdDate" control={control} />
      </Form.Item>
      <Form.Item
        hasFeedback
        validateStatus={errors?.buyDate && 'error'}
        help={errors?.buyDate?.message}
        required
        label="Buy Date"
      >
        <DatePickerField disabled={isDisalbedField} name="buyDate" control={control} />
      </Form.Item>
      <Form.Item
        hasFeedback
        validateStatus={errors?.receiptDate && 'error'}
        help={errors?.receiptDate?.message}
        required
        label="Receipt Date"
      >
        <DatePickerField disabled={isDisalbedField} name="receiptDate" control={control} />
      </Form.Item>
      <Form.Item label="Note">
        <TextAreaField disabled={isDisalbedField} name="note" control={control} />
      </Form.Item>
    </Form>
  );
};
export default UserOrderAddEditForm;

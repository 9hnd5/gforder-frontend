import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { TextField } from 'components';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { editOnePurchaseRequestItem } from './slice';
const validationSchema = yup
  .object()
  .shape({
    unitPrice: yup.number().required("'Unit Price' is required"),
    quantity: yup.number().required("'Quantity' is required"),
  })
  .required();

interface PurchaseRequestItemFormType {
  unitPrice: number;
  quantity: number;
}
interface Props {
  purchaseRequestItem: PurchaseRequestItemType;
  onCloseModal: () => void;
}
export default function PurchaseRequestItemForm(props: Props) {
  const dispatch = useAppDispatch();
  const { purchaseRequestItem, onCloseModal } = props;
  const { control, setValue, handleSubmit } = useForm<PurchaseRequestItemFormType>({ resolver: yupResolver(validationSchema) });

  const handleSaveClicked: SubmitHandler<PurchaseRequestItemFormType> = formValue => {
    const { key } = purchaseRequestItem;
    const changes = {
      quantity: formValue.quantity,
      unitPrice: formValue.unitPrice,
      totalPrice: formValue.quantity * formValue.unitPrice,
    };
    dispatch(editOnePurchaseRequestItem({ id: key, changes }));
    onCloseModal();
  };
  React.useEffect(() => {
    const formValue: PurchaseRequestItemFormType = {
      quantity: purchaseRequestItem.quantity,
      unitPrice: purchaseRequestItem.unitPrice,
    };
    for (const [key, value] of Object.entries(formValue)) {
      setValue(key as keyof PurchaseRequestItemFormType, value);
    }
  }, [setValue, purchaseRequestItem]);
  return (
    <Form layout="vertical">
      <Form.Item label="Unit Price" required>
        <TextField control={control} name="unitPrice" />
      </Form.Item>
      <Form.Item label="Quantity" required>
        <TextField control={control} name="quantity" />
      </Form.Item>
      <Button onClick={handleSubmit(handleSaveClicked)} type="primary" icon={<SaveOutlined />}>
        Save Changes
      </Button>
    </Form>
  );
}

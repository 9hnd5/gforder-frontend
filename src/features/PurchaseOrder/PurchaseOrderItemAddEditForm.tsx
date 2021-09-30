import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { TextField } from 'components';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

interface FormValueType {
  unitPrice: number;
  quantity: number;
}
interface Props {
  purchaseOrderItem: PurchaseOrderItemType;
  onEdit: (newItem: PurchaseOrderItemType) => void;
}
export default function PurchaseOrderItemAddEditForm(props: Props) {
  const { purchaseOrderItem, onEdit } = props;
  const { unitPrice, quantity } = purchaseOrderItem;
  const maxQuantity = React.useRef<number>(quantity);
  const maxUnitPrice = React.useRef<number>(unitPrice);
  const validationSchema = yup
    .object()
    .shape({
      unitPrice: yup
        .number()
        .required("'Unit Price' is required")
        .max(maxUnitPrice.current, `'Unit Price' must be less than or equal ${maxUnitPrice.current}`),
      quantity: yup
        .number()
        .required("'Quantity' is required")
        .max(maxQuantity.current, `'Unit Price' must be less than or equal ${maxQuantity.current}`),
    })
    .required();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValueType>({ resolver: yupResolver(validationSchema) });

  const handleSaveClicked: SubmitHandler<FormValueType> = formValue => {
    const newItem: PurchaseOrderItemType = {
      ...purchaseOrderItem,
      quantity: formValue.quantity,
      unitPrice: formValue.unitPrice,
    };
    onEdit(newItem);
  };
  React.useEffect(() => {
    const formValue: FormValueType = {
      quantity: props.purchaseOrderItem.quantity,
      unitPrice: props.purchaseOrderItem.unitPrice,
    };
    for (const [key, value] of Object.entries(formValue)) {
      setValue(key as keyof FormValueType, value);
    }
  }, [setValue, props.purchaseOrderItem]);
  return (
    <Form layout="vertical">
      <Form.Item
        hasFeedback
        validateStatus={errors?.unitPrice && 'error'}
        help={errors?.unitPrice?.message}
        label="Unit Price"
        required
      >
        <TextField control={control} name="unitPrice" />
      </Form.Item>
      <Form.Item
        hasFeedback
        validateStatus={errors?.quantity && 'error'}
        help={errors?.quantity?.message}
        label="Quantity"
        required
      >
        <TextField control={control} name="quantity" />
      </Form.Item>
      <Button onClick={handleSubmit(handleSaveClicked)} type="primary" icon={<SaveOutlined />}>
        Save Changes
      </Button>
    </Form>
  );
}

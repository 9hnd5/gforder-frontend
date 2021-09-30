import { SaveOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { TextField } from 'components';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { editOnePurchasePriceItem } from './slice';

interface PurchasePriceItemFormType {
  priceMin: number;
  priceStd: number;
  priceMax: number;
}
interface Props {
  purchasePriceItem: PurchasePriceItemType;
  onCloseModal: () => void;
}
const ItemAddEditForm = (props: Props) => {
  const { purchasePriceItem, onCloseModal } = props;
  const { control, setValue, handleSubmit } = useForm<PurchasePriceItemFormType>();
  const dispatch = useAppDispatch();

  const handleSaveClicked: SubmitHandler<PurchasePriceItemFormType> = formValue => {
    const { priceMax, priceMin, priceStd } = formValue;
    dispatch(editOnePurchasePriceItem({ id: purchasePriceItem.itemCode, changes: { priceMin, priceStd, priceMax } }));
    onCloseModal();
  };
  React.useEffect(() => {
    const formValue = {
      priceMin: purchasePriceItem.priceMin,
      priceStd: purchasePriceItem.priceStd,
      priceMax: purchasePriceItem.priceMax,
    };
    for (const [key, value] of Object.entries(formValue)) {
      setValue(key as keyof PurchasePriceItemFormType, value);
    }
  }, [setValue, purchasePriceItem]);
  return (
    <Form layout="vertical">
      <Form.Item required label="Price Min">
        <TextField control={control} name="priceMin" />
      </Form.Item>
      <Form.Item required label="Price Std">
        <TextField control={control} name="priceStd" />
      </Form.Item>
      <Form.Item required label="Price Max">
        <TextField control={control} name="priceMax" />
      </Form.Item>
      <Form.Item>
        <Button onClick={handleSubmit(handleSaveClicked)} icon={<SaveOutlined />} type="primary">
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ItemAddEditForm;

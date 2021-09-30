import { Form } from 'antd';
import { useGetItemMasterDataQuery } from 'api/itemMasterDataApi';
import { SelectField, TextField } from 'components';
import { useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { selectCopyId } from './slice';

const categories = [
  {
    id: 'C1',
    name: 'Gia súc - Gia cầm',
  },
  {
    id: 'C2',
    name: 'Thủy sản',
  },
  {
    id: 'C3',
    name: 'Thú y',
  },
];
const unitOfMeasures = [
  {
    id: '1',
    name: 'Quả',
  },
  {
    id: '2',
    name: 'Kg',
  },
  {
    id: '3',
    name: 'Ml',
  },
  {
    id: '4',
    name: 'Con',
  },
];
export interface ItemFormType {
  itemCode: string;
  itemName: string;
  uoMId: string;
  image?: any;
  categoryId: string;
}
interface ItemAddEditFormProps {
  mode?: 'view';
}
const ItemAddEditForm = (props: ItemAddEditFormProps) => {
  const { mode } = props;
  const { itemCode } = useParams<{ itemCode?: string }>();
  const copyId = useAppSelector(selectCopyId);
  const isDisabledField = React.useMemo(() => mode === 'view', [mode]);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ItemFormType>();
  const { item } = useGetItemMasterDataQuery(null, {
    selectFromResult: x => {
      return { item: x.data?.find(y => y.itemCode === itemCode || y.itemCode === copyId) };
    },
  });

  React.useEffect(() => {
    if (item !== undefined) {
      const formValue = {
        itemCode: item.itemCode,
        itemName: item.itemName,
        uoMId: item.uoMId,
        image: item.image,
        categoryId: item.categoryId,
      };
      for (const [key, value] of Object.entries(formValue)) {
        setValue(key as keyof ItemFormType, value);
      }
    }
  }, [item, setValue]);
  return (
    <Form layout="vertical">
      <Form.Item
        hasFeedback
        validateStatus={errors?.itemCode && 'error'}
        help={errors?.itemCode?.message}
        label="Item Code"
        required
      >
        <TextField disabled={isDisabledField} name="itemCode" control={control} />
      </Form.Item>
      <Form.Item
        hasFeedback
        validateStatus={errors?.itemName && 'error'}
        help={errors?.itemName?.message}
        label="Item Name"
        required
      >
        <TextField disabled={isDisabledField} name="itemName" control={control} />
      </Form.Item>
      <Form.Item hasFeedback validateStatus={errors?.uoMId && 'error'} help={errors?.uoMId?.message} label="UoM" required>
        <SelectField
          disabled={isDisabledField}
          name="uoMId"
          control={control}
          options={unitOfMeasures.map(x => ({ label: x.name, value: x.id }))}
        />
      </Form.Item>
      <Form.Item
        hasFeedback
        validateStatus={errors?.categoryId && 'error'}
        help={errors?.categoryId?.message}
        label="Catefory"
        required
      >
        <SelectField
          disabled={isDisabledField}
          name="categoryId"
          control={control}
          options={categories.map(x => ({ label: x.name, value: x.id }))}
        />
      </Form.Item>
    </Form>
  );
};
export default ItemAddEditForm;

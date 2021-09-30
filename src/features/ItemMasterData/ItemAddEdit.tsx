import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Space } from 'antd';
import { useAddItemMasterDataMutation, useEditItemMasterDataMutation } from 'api/itemMasterDataApi';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import ItemAddEditForm, { ItemFormType } from './ItemAddEditForm';
import ItemDragDropFile from './ItemDragDropFile';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from 'hooks/reduxHooks';
import { resetItemSlice } from './slice';
const validationSchema = yup
  .object()
  .shape({
    itemCode: yup.string().required("'Item Code' is required").nullable(),
    itemName: yup.string().required("'Item Name' is required").nullable(),
    uoMId: yup.string().required("'UoM' is required").nullable(),
    categoryId: yup.string().required("'Category' is required").nullable(),
  })
  .required();

const routes = [
  {
    path: '',
    breadcrumbName: 'Master Data',
  },
  {
    path: '',
    breadcrumbName: 'Item',
  },
  {
    path: '',
    breadcrumbName: 'Adding',
  },
];
interface ItemAddEditProps {
  basePath: string;
}
const ItemAddEdit = (props: ItemAddEditProps) => {
  const { itemCode } = useParams<{ itemCode: string }>();
  const history = useHistory();
  const methods = useForm<ItemFormType>({ resolver: yupResolver(validationSchema) });
  const dispatch = useAppDispatch();
  const [addItem, { isLoading: isAdding }] = useAddItemMasterDataMutation();
  const [editItem, { isLoading: isEditing }] = useEditItemMasterDataMutation();
  const [image, setImage] = React.useState<any>();

  const handlePrevPage = () => history.goBack();

  const handleSaveClicked: SubmitHandler<ItemFormType> = async formValue => {
    const formData = new FormData();
    for (const [key, value] of Object.entries({ ...formValue, image })) {
      console.log(key, value);
      formData.append(key, value);
    }
    if (itemCode) {
      await editItem({ itemCode, item: formData }).unwrap();
    } else {
      await addItem(formData).unwrap();
    }

    handlePrevPage();
  };

  React.useEffect(() => {
    return function cleanup() {
      dispatch(resetItemSlice());
    };
  }, [dispatch]);
  return (
    <FormProvider {...methods}>
      <PageContainer header={{ title: 'Add Item', breadcrumb: { routes }, onBack: handlePrevPage }}>
        <ProCard size="small" bordered split="vertical">
          <ProCard size="small" colSpan={6}>
            <ItemAddEditForm />
          </ProCard>
          <ProCard size="small" colSpan={18}>
            <ItemDragDropFile onChange={setImage} />
          </ProCard>
        </ProCard>
        <ProCard size="small">
          <Space>
            <Button onClick={handlePrevPage} icon={<RollbackOutlined />}>
              Back
            </Button>
            <Button
              loading={isAdding || isEditing}
              onClick={methods.handleSubmit(handleSaveClicked)}
              icon={<SaveOutlined />}
              type="primary"
            >
              Save Changes
            </Button>
          </Space>
        </ProCard>
      </PageContainer>
    </FormProvider>
  );
};
export default ItemAddEdit;

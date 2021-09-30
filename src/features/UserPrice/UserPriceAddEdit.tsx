import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Space } from 'antd';
import { useAddUserPriceMutation, useEditUserPriceMutation } from 'api/userPriceApi';
import { useAppSelector } from 'hooks/reduxHooks';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { selectAllUserPriceItem } from './slice';
import UserPriceAddEditForm, { UserPriceFormType } from './UserPriceAddEditForm';
import UserPriceItemList from './UserPriceItemList';
import UserPriceItemSearchBar from './UserPriceItemSearchBar';
const routes = [
  { path: '', breadcrumbName: 'Master Data' },
  { path: '', breadcrumbName: 'Price List' },
  { path: '', breadcrumbName: 'Adding' },
];
interface UserPriceAddEditProps {
  basePath: string;
}
const UserPriceAddEdit = (props: UserPriceAddEditProps) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const methods = useForm<UserPriceFormType>();
  const userPriceItems = useAppSelector(selectAllUserPriceItem);
  const [addUserPrice, { isLoading: isAdding }] = useAddUserPriceMutation();
  const [editUserPrice, { isLoading: isEditing }] = useEditUserPriceMutation();

  const handlePrevPage = () => history.goBack();

  const handleSaveClicked: SubmitHandler<UserPriceFormType> = async formValue => {
    const usePriceSubmit = {
      ...formValue,
      userPriceItems: userPriceItems.map(x => ({
        itemCode: x.item.itemCode,
        categoryId: x.item.categoryId,
        unitPrice: x.unitPrice,
      })),
    };
    if (id) {
      await editUserPrice({ id, userPrice: usePriceSubmit }).unwrap();
    } else {
      await addUserPrice(usePriceSubmit).unwrap();
    }

    handlePrevPage();
  };
  return (
    <FormProvider {...methods}>
      <PageContainer header={{ title: 'Add Price', breadcrumb: { routes }, onBack: handlePrevPage }}>
        <ProCard size="small" ghost gutter={[0, 4]} split="horizontal">
          <ProCard size="small" ghost gutter={[4, 0]} split="vertical">
            <ProCard colSpan={8} size="small" bordered>
              <UserPriceAddEditForm />
            </ProCard>
            <ProCard size="small" bordered tabs={{ size: 'small', type: 'card' }} style={{ height: '100%' }}>
              <ProCard.TabPane key="1" tab="Items">
                <ProCard size="small" headerBordered>
                  <UserPriceItemSearchBar />
                  <ProCard.Divider />
                  <UserPriceItemList />
                </ProCard>
              </ProCard.TabPane>
            </ProCard>
          </ProCard>

          <ProCard size="small" bordered>
            <Space>
              <Button onClick={handlePrevPage} icon={<RollbackOutlined />}>
                Back
              </Button>
              <Button
                loading={isAdding || isEditing}
                onClick={methods.handleSubmit(handleSaveClicked)}
                type="primary"
                icon={<SaveOutlined />}
              >
                Save Changes
              </Button>
            </Space>
          </ProCard>
        </ProCard>
      </PageContainer>
    </FormProvider>
  );
};

export default UserPriceAddEdit;

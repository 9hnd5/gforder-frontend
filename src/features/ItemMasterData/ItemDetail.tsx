import { RollbackOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Image } from 'antd';
import { useGetItemMasterDataQuery } from 'api/itemMasterDataApi';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import ItemAddEditForm, { ItemFormType } from './ItemAddEditForm';
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
    breadcrumbName: 'Detail',
  },
];
interface ItemDetailProps {
  basePath: string;
}
const ItemDetail = (props: ItemDetailProps) => {
  const { itemCode } = useParams<{ itemCode: string }>();
  const methods = useForm<ItemFormType>();
  const history = useHistory();
  const { item } = useGetItemMasterDataQuery(null, {
    selectFromResult: x => ({ item: x.data?.find(y => y.itemCode === itemCode) }),
  });

  const handlePrevPage = () => history.goBack();
  return (
    <FormProvider {...methods}>
      <PageContainer header={{ title: 'Item Detail', breadcrumb: { routes }, onBack: handlePrevPage }}>
        <ProCard size="small" bordered split="vertical">
          <ProCard size="small" colSpan={14}>
            <ItemAddEditForm mode="view" />
          </ProCard>
          <ProCard size="small" colSpan={10}>
            <Image src={item?.image} />
          </ProCard>
        </ProCard>
        <ProCard size="small">
          <Button onClick={handlePrevPage} icon={<RollbackOutlined />}>
            Back
          </Button>
        </ProCard>
      </PageContainer>
    </FormProvider>
  );
};
export default ItemDetail;

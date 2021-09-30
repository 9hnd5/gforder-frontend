import { RollbackOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Button, Descriptions, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchasePriceByIdQuery, useGetPurchasePriceItemsQuery } from 'api/purchasePriceApi';
import PurchaseStatus from 'components/PurchaseStatus';
import { useHistory, useParams } from 'react-router-dom';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { data: purchaseOrderItems } = useGetPurchasePriceItemsQuery(id, { refetchOnMountOrArgChange: true });
  const { data: purchasePrice } = useGetPurchasePriceByIdQuery(+id ?? skipToken);
  const columns: ColumnsType<PurchasePriceItemType> = [
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      ellipsis: true,
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      ellipsis: true,
    },
    {
      title: 'Price Min',
      dataIndex: 'priceMin',
      ellipsis: true,
    },
    {
      title: 'Price Std',
      dataIndex: 'priceStd',
      ellipsis: true,
    },
    {
      title: 'Price Max',
      dataIndex: 'priceMax',
      ellipsis: true,
    },
  ];
  const routes = [
    {
      path: '',
      breadcrumbName: 'Master Data',
    },
    {
      path: '',
      breadcrumbName: 'Purchase Price',
    },
    {
      path: '',
      breadcrumbName: id,
    },
  ];
  return (
    <PageContainer header={{ onBack: () => history.goBack(), title: 'Purchase Price Detail', breadcrumb: { routes } }}>
      <ProCard size="small" ghost split="horizontal">
        <ProCard size="small" bordered>
          <Descriptions column={4} bordered size="small" layout="vertical">
            <Descriptions.Item label={<Typography.Text strong>Id</Typography.Text>}>{id}</Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Created Date</Typography.Text>}>
              {purchasePrice?.createdDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Created By</Typography.Text>}>
              <Typography.Link>{purchasePrice?.createdByName}</Typography.Link>
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Status</Typography.Text>}>
              <PurchaseStatus id={purchasePrice?.purchaseStatusId} name={purchasePrice?.purchaseStatusName} />
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Org</Typography.Text>}>
              {purchasePrice?.purchaseOrgName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Division</Typography.Text>}>
              {purchasePrice?.purchaseDivisionName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Office</Typography.Text>}>
              {purchasePrice?.purchaseOfficeName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Group</Typography.Text>}>
              {purchasePrice?.purchaseGroupName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Handled Date</Typography.Text>}>
              {purchasePrice?.handledDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Handled By</Typography.Text>}>
              <Typography.Link>{purchasePrice?.handledByName}</Typography.Link>
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Date Effect</Typography.Text>}>
              {purchasePrice?.effectiveStart}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Date End</Typography.Text>}>
              {purchasePrice?.effectiveEnd}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Note</Typography.Text>}>{purchasePrice?.note}</Descriptions.Item>
          </Descriptions>
        </ProCard>
        <ProCard size="small" tabs={{ size: 'small', type: 'card' }} bordered>
          <ProCard.TabPane tab="Item List" key="1">
            <Table<PurchasePriceItemType> columns={columns} dataSource={purchaseOrderItems} size="small" tableLayout="fixed" />
          </ProCard.TabPane>
        </ProCard>
        <ProCard size="small" bordered>
          <Button onClick={() => history.goBack()} icon={<RollbackOutlined />}>
            Back
          </Button>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}

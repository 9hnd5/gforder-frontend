import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Descriptions, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetGoodsPOReceiptByIdQuery, useGetItemsForGoodsPOReceiptQuery } from 'api/goodsPOReceiptApi';
import PurchaseStatus from 'components/PurchaseStatus';
import { useHistory, useParams } from 'react-router-dom';
import { GoodsPOReceiptItem } from './types';

interface DetailProps {
  basePath: string;
}
const Detail = (props: DetailProps) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { data: goodsPOReceipt } = useGetGoodsPOReceiptByIdQuery(id ?? skipToken, { refetchOnMountOrArgChange: true });
  const { data: goodsPOReceiptItems, isFetching } = useGetItemsForGoodsPOReceiptQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const columns: ColumnsType<GoodsPOReceiptItem> = [
    {
      title: 'Warehouse',
      dataIndex: 'warehouseName',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: 'Price Name',
      dataIndex: 'purchasePriceName',
      ellipsis: true,
    },
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
      title: 'UoM',
      dataIndex: 'uoMName',
      ellipsis: true,
    },
    {
      title: 'UnitPrice',
      dataIndex: 'unitPrice',
      ellipsis: true,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      ellipsis: true,
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      ellipsis: true,
    },
    {
      title: 'Batch',
      dataIndex: 'batchNo',
      ellipsis: true,
    },
  ];
  const routes = [
    {
      path: '',
      breadcrumbName: 'Purchasing',
    },
    {
      path: '',
      breadcrumbName: 'Goods Receipt PO',
    },
    {
      path: '',
      breadcrumbName: id,
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'Goods PO Receipt Detail',
        onBack: () => history.push(props.basePath),
        breadcrumb: { routes },
      }}
    >
      <ProCard size="small" split="horizontal" ghost>
        <ProCard size="small" bordered>
          <Descriptions size="small" column={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }} bordered layout="vertical">
            <Descriptions.Item label={<Typography.Text strong>GPOR Number</Typography.Text>}>{id}</Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Created By</Typography.Text>}>
              {goodsPOReceipt?.createdByName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Org</Typography.Text>}>
              {goodsPOReceipt?.purchaseOrgName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Division</Typography.Text>}>
              {goodsPOReceipt?.purchaseDivisionName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Office</Typography.Text>}>
              {goodsPOReceipt?.purchaseOfficeName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Group</Typography.Text>}>
              {goodsPOReceipt?.purchaseGroupName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Create Date</Typography.Text>}>
              {goodsPOReceipt?.createdDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Vendor</Typography.Text>}>
              <Typography.Link>{goodsPOReceipt?.vendorName}</Typography.Link>
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Buy Date</Typography.Text>}>
              {goodsPOReceipt?.buyDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Receipt Date</Typography.Text>}>
              {goodsPOReceipt?.receiptDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Release By</Typography.Text>}>
              {goodsPOReceipt?.releaseByName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Release Date</Typography.Text>}>
              {goodsPOReceipt?.releaseDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Default Warehouse</Typography.Text>}>
              {goodsPOReceipt?.defaultWarehouseName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Status</Typography.Text>}>
              <PurchaseStatus id={goodsPOReceipt?.statusId} name={goodsPOReceipt?.statusId === 1 ? 'Khỏi Tạo' : 'Xác Nhận'} />
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Note</Typography.Text>}>{goodsPOReceipt?.note}</Descriptions.Item>
          </Descriptions>
        </ProCard>
        <ProCard size="small" bordered tabs={{ type: 'card' }}>
          <ProCard.TabPane tab="Item List">
            <Table<GoodsPOReceiptItem>
              columns={columns}
              loading={isFetching}
              dataSource={goodsPOReceiptItems}
              size="small"
              tableLayout="fixed"
              rowKey={record => record.id}
              scroll={{ x: 1000 }}
            />
          </ProCard.TabPane>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default Detail;

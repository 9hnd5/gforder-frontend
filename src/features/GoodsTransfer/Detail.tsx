import { RollbackOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Button, Descriptions, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetGoodsTransferByIdQuery, useGetGoodsTransferItemsQuery } from 'api/goodsTransferApi';
import PurchaseStatus from 'components/PurchaseStatus';
import { useHistory, useParams } from 'react-router-dom';

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const { data: goodsTransferItems } = useGetGoodsTransferItemsQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const { data: goodsTransfer } = useGetGoodsTransferByIdQuery(id ?? skipToken, { refetchOnMountOrArgChange: true });
  const columns: ColumnsType<GoodsTransferItemType> = [
    {
      title: 'Issue',
      children: [
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
          title: 'Quantity Issue',
          dataIndex: 'quantityIssue',
          ellipsis: true,
        },
        {
          title: 'Batch',
          dataIndex: 'batchNo',
          ellipsis: true,
        },
        {
          title: 'Warehouse Issue',
          dataIndex: 'warehouseNameIssue',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Receipt',
      children: [
        {
          title: 'Warehouse Receipt',
          dataIndex: 'warehouseNameReceipt',
          ellipsis: true,
        },
        {
          title: 'Quantity Receipt',
          dataIndex: 'quantityReceipt',
          ellipsis: true,
        },
        {
          title: 'Variant',
          dataIndex: 'quantityVar',
          ellipsis: true,
        },
      ],
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
        onBack: () => history.goBack(),
        breadcrumb: { routes },
        title: 'Goods Transfer Detail',
      }}
    >
      <ProCard size="small" split="horizontal" ghost>
        <ProCard size="small" bordered>
          <Descriptions layout="vertical" column={4} size="small" bordered>
            <Descriptions.Item label={<Typography.Text strong>Id</Typography.Text>}>{id}</Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Created Date</Typography.Text>}>
              {goodsTransfer?.createdDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Status</Typography.Text>}>
              <PurchaseStatus id={goodsTransfer?.statusId} name={goodsTransfer?.statusName} />
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Vendor</Typography.Text>}>
              <Typography.Link>{goodsTransfer?.vendorName}</Typography.Link>
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Org</Typography.Text>}>
              {goodsTransfer?.purchaseOrgName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Division</Typography.Text>}>
              {goodsTransfer?.purchaseDivisionName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Office</Typography.Text>}>
              {goodsTransfer?.purchaseOfficeName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Group</Typography.Text>}>
              {goodsTransfer?.purchaseGroupName}
            </Descriptions.Item>

            <Descriptions.Item label={<Typography.Text strong>Note</Typography.Text>}>{goodsTransfer?.note}</Descriptions.Item>
          </Descriptions>
        </ProCard>
        <ProCard size="small" bordered tabs={{ type: 'card' }} style={{ height: '100%' }}>
          <ProCard.TabPane tab="Item List">
            <Table<GoodsTransferItemType>
              bordered
              columns={columns}
              dataSource={goodsTransferItems}
              size="small"
              tableLayout="fixed"
            />
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
};

export default Detail;

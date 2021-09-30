import { CopyOutlined, RollbackOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Button, Descriptions, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseRequestByIdQuery, useGetPurchaseRequestItemsQuery } from 'api/purchaseRequestApi';
import PurchaseStatus from 'components/PurchaseStatus';
import { setAddMode, setPurchaseRequestId } from 'features/PurchaseOrder/slice';
import { useAppDispatch } from 'hooks/reduxHooks';
import { useHistory, useParams } from 'react-router-dom';

interface Props {
  basePath: string;
}

const PurchaseRequestDetail = (props: Props) => {
  const { basePath } = props;
  const { id } = useParams<{ id: string }>();
  const { data: purchaseRequestItems, isFetching } = useGetPurchaseRequestItemsQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const { data: purchaseRequest } = useGetPurchaseRequestByIdQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useAppDispatch();
  const history = useHistory();
  const handleCopyTo = () => {
    dispatch(setPurchaseRequestId(id));
    dispatch(setAddMode('from-single-pr'));
    history.push('/purchasing/purchase-order/add-edit');
  };

  const columns: ColumnsType<PurchaseRequestItemType> = [
    {
      title: 'Price Name',
      dataIndex: 'purchasePriceName',
      ellipsis: true,
      fixed: 'left',
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
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      ellipsis: true,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      ellipsis: true,
    },
    {
      title: 'Open Quantity',
      dataIndex: 'availableQuantity',
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
      breadcrumbName: 'Master Data',
    },
    {
      path: '',
      breadcrumbName: 'Purchase Request',
    },
    {
      path: '',
      breadcrumbName: id,
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'Purchase Request Detail',
        onBack: () => history.push(`${basePath}/list`),
        breadcrumb: { routes },
      }}
      extra={
        <Button
          disabled={purchaseRequest?.purchaseStatusId === 3 ? false : true}
          type="primary"
          icon={<CopyOutlined />}
          onClick={handleCopyTo}
        >
          Copy To
        </Button>
      }
    >
      <ProCard split="horizontal" ghost size="small">
        <ProCard bordered size="small">
          <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }} layout="vertical" bordered size="small">
            <Descriptions.Item label={<Typography.Text strong>PR Number</Typography.Text>}>{id}</Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Created By</Typography.Text>}>
              {purchaseRequest?.createdByName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Created Date</Typography.Text>}>
              {purchaseRequest?.createdDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Status</Typography.Text>}>
              <PurchaseStatus id={purchaseRequest?.purchaseStatusId} name={purchaseRequest?.purchaseStatusName} />
            </Descriptions.Item>

            <Descriptions.Item label={<Typography.Text strong>Purchase Org</Typography.Text>}>
              {purchaseRequest?.purchaseOrgName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Division</Typography.Text>}>
              {purchaseRequest?.purchaseDivisionName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Office</Typography.Text>}>
              {purchaseRequest?.purchaseOfficeName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Group</Typography.Text>}>
              {purchaseRequest?.purchaseGroupName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Buy Date</Typography.Text>}>
              {purchaseRequest?.buyDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Receipt Date</Typography.Text>}>
              {purchaseRequest?.receiptDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Vendor</Typography.Text>}>
              <Typography.Link>{purchaseRequest?.vendorName}</Typography.Link>
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Handler</Typography.Text>}>
              <Typography.Link>{purchaseRequest?.handlerName}</Typography.Link>
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Handle Date</Typography.Text>}>
              {purchaseRequest?.handlerDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Note</Typography.Text>}>{purchaseRequest?.note}</Descriptions.Item>
          </Descriptions>
        </ProCard>
        <ProCard bordered size="small" tabs={{ type: 'card' }}>
          <ProCard.TabPane key="1" tab="Item List">
            <Table<PurchaseRequestItemType>
              columns={columns}
              dataSource={purchaseRequestItems}
              loading={isFetching}
              tableLayout="fixed"
              bordered
              size="small"
              scroll={{ x: 1000 }}
            />
          </ProCard.TabPane>
        </ProCard>
        <ProCard bordered size="small">
          <Button onClick={() => history.goBack()} icon={<RollbackOutlined />}>
            Back
          </Button>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
export default PurchaseRequestDetail;

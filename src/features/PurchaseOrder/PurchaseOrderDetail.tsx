import { CopyOutlined, RollbackOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Button, Descriptions, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseOrderByIdQuery, useGetPurchaseOrderItemsQuery } from 'api/purchaseOrderApi';
import PurchaseStatus from 'components/PurchaseStatus';
import { GoodsPOReceiptForm } from 'features/GoodsPOReceipt/AddEditForm';
import { GoodsPOReceiptItemForm } from 'features/GoodsPOReceipt/ItemAddEditFormList';
import { addGoodsPOReceiptFormList, setAddModeGRPO, setGoodsPOReceiptForm } from 'features/GoodsPOReceipt/slice';
import { useAppDispatch } from 'hooks/reduxHooks';
import { useHistory, useParams } from 'react-router-dom';

interface Props {
  basePath: string;
}

export default function PurchaseOrderDetail(props: Props) {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { data: purchaseOrder } = useGetPurchaseOrderByIdQuery(id ?? skipToken, { refetchOnMountOrArgChange: true });
  const { data: purchaseOrderItems } = useGetPurchaseOrderItemsQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const columns: ColumnsType<PurchaseOrderItemType> = [
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
  const handleCopyTo = () => {
    if (purchaseOrder !== undefined) {
      const goodsPOReceiptForm: GoodsPOReceiptForm = {
        vendorId: purchaseOrder.vendorId,
        purchaseOrgId: purchaseOrder.purchaseOrgId,
        purchaseDivisionId: purchaseOrder.purchaseDivisionId,
        purchaseOfficeId: purchaseOrder.purchaseOfficeId,
        purchaseGroupId: purchaseOrder.purchaseGroupId,
        buyDate: purchaseOrder.buyDate,
        receiptDate: purchaseOrder.receiptDate,
        defaultWarehouse: {},
        note: '',
      };
      dispatch(setGoodsPOReceiptForm(goodsPOReceiptForm));
    }
    if (purchaseOrderItems !== undefined) {
      const goodsPOReceiptFormList: GoodsPOReceiptItemForm[] = purchaseOrderItems
        .map(item => ({
          purchaseOrderItemId: item.id,
          batchNo: item.batchNo,
          itemCode: item.itemCode,
          itemName: item.itemName,
          purchasePriceId: item.purchasePriceId,
          purchasePriceName: item.purchasePriceName,
          quantity: item.availableQuantity,
          totalPrice: item.unitPrice * item.availableQuantity,
          unitPrice: item.unitPrice,
          uoMId: item.uoMId,
          uoMName: item.uoMName,
        }))
        .filter(item => item.quantity > 0);
      dispatch(addGoodsPOReceiptFormList(goodsPOReceiptFormList));
    }
    dispatch(setAddModeGRPO('FROM_PO'));
    history.push('/purchasing/goods-receipt-po/add-edit');
  };
  const routes = [
    {
      path: '',
      breadcrumbName: 'Master Data',
    },
    {
      path: '',
      breadcrumbName: 'Purchase Order',
    },
    {
      path: '',
      breadcrumbName: id,
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'Purchase Order Detail',
        onBack: () => history.push(`${props.basePath}/list`),
        breadcrumb: { routes },
      }}
      extra={
        <Button
          disabled={purchaseOrder?.purchaseStatusId === 3 ? false : true}
          type="primary"
          icon={<CopyOutlined />}
          onClick={handleCopyTo}
        >
          Copy To
        </Button>
      }
    >
      <ProCard size="small" ghost split="horizontal">
        <ProCard bordered size="small">
          <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }} layout="vertical" bordered size="small">
            <Descriptions.Item label={<Typography.Text strong>PO Number</Typography.Text>}>{id}</Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Created By</Typography.Text>}>
              {purchaseOrder?.createdByName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Org</Typography.Text>}>
              {purchaseOrder?.purchaseOrgName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Division</Typography.Text>}>
              {purchaseOrder?.purchaseDivisionName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Office</Typography.Text>}>
              {purchaseOrder?.purchaseOfficeName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Purchase Group</Typography.Text>}>
              {purchaseOrder?.purchaseGroupName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Created Date</Typography.Text>}>
              {purchaseOrder?.createdDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Vendor</Typography.Text>}>
              <Typography.Link>{purchaseOrder?.vendorName}</Typography.Link>
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Buy Date</Typography.Text>}>
              {purchaseOrder?.buyDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Receipt Date</Typography.Text>}>
              {purchaseOrder?.receiptDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Handler</Typography.Text>}>
              {purchaseOrder?.handlerName}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Handle Date</Typography.Text>}>
              {purchaseOrder?.handleDate}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Status</Typography.Text>}>
              <PurchaseStatus id={purchaseOrder?.purchaseStatusId} name={purchaseOrder?.purchaseStatusName} />
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Note</Typography.Text>}>{purchaseOrder?.note}</Descriptions.Item>
          </Descriptions>
        </ProCard>
        <ProCard bordered size="small" tabs={{ type: 'card' }}>
          <ProCard.TabPane tab="Item List">
            <Table<PurchaseOrderItemType>
              columns={columns}
              dataSource={purchaseOrderItems}
              size="small"
              tableLayout="fixed"
              rowKey={record => record.id}
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
}

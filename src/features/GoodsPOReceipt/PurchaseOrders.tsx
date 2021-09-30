import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseOrdersQuery } from 'api/purchaseOrderApi';
import { useGetPurchaseOrderItems1Query } from 'api/purchaseOrderItemApi';
import withData, { WithDataProps } from 'Hocs/withData';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { GoodsPOReceiptItemForm } from './ItemAddEditFormList';
import { addGoodsPOReceiptFormList } from './slice';

interface Props extends WithDataProps {
  watch: [string, string, string, string, string, { label?: string; value?: string }];
  onCloseModal: () => void;
}

const PurchaseOrders = (props: Props) => {
  const { watch, onCloseModal } = props;
  const [vendorId, purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId, defaultWarehouse] = watch;
  const { data: purchaseOrders, isFetching } = useGetPurchaseOrdersQuery(
    React.useMemo(() => {
      return {
        vendorId: {
          eq: vendorId,
        },
        purchaseStatusId: {
          eq: 3,
        },
        purchaseOrgId: {
          eq: purchaseOrgId,
        },
        purchaseDivisionId: {
          eq: purchaseDivisionId,
        },
        purchaseOfficeId: {
          eq: purchaseOfficeId,
        },
        purchaseGroupId: {
          eq: purchaseGroupId,
        },
      };
    }, [vendorId, purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId]),
    { refetchOnMountOrArgChange: true }
  );
  const [purchaseOrdersSelected, setPurchaseOrders] = React.useState<PurchaseOrderType[]>([]);
  const [skip, setSkip] = React.useState<boolean>(true);
  const params = React.useMemo(
    () => ({ purchaseOrderId: { in: purchaseOrdersSelected?.map(item => item.id) } }),
    [purchaseOrdersSelected]
  );
  const { data: purchaseOrderItems } = useGetPurchaseOrderItems1Query(params, {
    skip,
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useAppDispatch();

  const handleSave = () => {
    setSkip(false);
  };
  const columns: ColumnsType<PurchaseOrderType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      ellipsis: true,
    },
    {
      title: 'Org',
      dataIndex: 'purchaseOrgName',
      ellipsis: true,
    },
    {
      title: 'Division',
      dataIndex: 'purchaseDivisionName',
      ellipsis: true,
    },
    {
      title: 'Office',
      dataIndex: 'purchaseOfficeName',
      ellipsis: true,
    },
    {
      title: 'Group',
      dataIndex: 'purchaseGroupName',
      ellipsis: true,
    },
  ];
  React.useEffect(() => {
    if (purchaseOrderItems !== undefined) {
      const goodsPOReceiptItemFormList: GoodsPOReceiptItemForm[] = purchaseOrderItems
        .map(item => ({
          purchaseOrderItemId: item.id,
          purchasePriceId: item.purchasePriceId,
          purchasePriceName: item.purchasePriceName,
          itemCode: item.itemCode,
          itemName: item.itemName,
          uoMId: item.uoMId,
          uoMName: item.uoMName,
          quantity: item.availableQuantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.availableQuantity,
          warehouseId: defaultWarehouse?.value,
          warehouseName: defaultWarehouse?.label,
          batchNo: item.batchNo,
        }))
        .filter(item => item.quantity > 0);
      dispatch(addGoodsPOReceiptFormList(goodsPOReceiptItemFormList));
      onCloseModal();
    }
  }, [purchaseOrderItems, onCloseModal, dispatch, defaultWarehouse]);
  return (
    <Space direction="vertical">
      <Table<PurchaseOrderType>
        size="small"
        tableLayout="fixed"
        columns={columns}
        dataSource={purchaseOrders}
        loading={isFetching}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => {
            setPurchaseOrders(selectedRows);
          },
        }}
      />
      <Space>
        <Button onClick={onCloseModal} icon={<CloseOutlined />}>
          Back
        </Button>
        <Button onClick={handleSave} icon={<SaveOutlined />} type="primary">
          Save Changes
        </Button>
      </Space>
    </Space>
  );
};

export default withData(PurchaseOrders);

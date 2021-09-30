import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseRequestsQuery } from 'api/purchaseRequestApi';
import { useGetPurchaseRequestItems1Query } from 'api/purchaseRequestItemApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import React, { useState } from 'react';
import { addManyPurchaseOrderItem } from './slice';

interface Props {
  data: string[];
  onCloseModal: () => void;
}

const PurchaseRequests: React.FC<Props> = ({ data, onCloseModal }) => {
  const [vendorId, purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId] = data;
  const [purchaseRequestsSelected, setPurchaseRequestsSelected] = useState<PurchaseRequestType[]>([]);
  const [skip, setSkip] = useState<boolean>(true);
  const params = React.useMemo(
    () => ({ purchaseRequestId: { in: purchaseRequestsSelected.map(item => item.id) } }),
    [purchaseRequestsSelected]
  );
  const { data: purchaseRequestItems } = useGetPurchaseRequestItems1Query(params, {
    refetchOnMountOrArgChange: true,
    skip,
  });
  const dispatch = useAppDispatch();
  const handleSave = () => {
    setSkip(false);
  };
  const { data: purchaseRequests, isFetching } = useGetPurchaseRequestsQuery(
    React.useMemo(
      () => ({
        vendorId: {
          eq: vendorId,
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
        purchaseStatusId: {
          eq: 3,
        },
      }),
      [vendorId, purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId]
    ),
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const columns: ColumnsType<PurchaseRequestType> = [
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
      title: 'Created Date',
      dataIndex: 'createdDate',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'purchaseStatusName',
      ellipsis: true,
    },
  ];
  React.useEffect(() => {
    if (purchaseRequestItems !== undefined) {
      const purchaseOrderItems = purchaseRequestItems
        .map(
          item =>
            ({
              key: item.id.toString(),
              purchaseRequestItemId: item.id,
              purchasePriceId: item.purchasePriceId,
              purchasePriceName: item.purchasePriceName,
              itemCode: item.itemCode,
              itemName: item.itemName,
              uoMId: item.uoMId,
              uoMName: item.uoMName,
              quantity: item.availableQuantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              batchNo: item.batchNo,
              note: '',
            } as PurchaseOrderItemType)
        )
        .filter(item => item.quantity > 0);
      dispatch(addManyPurchaseOrderItem(purchaseOrderItems));
      onCloseModal();
    }
  }, [purchaseRequestItems, onCloseModal, dispatch]);
  return (
    <Space direction="vertical">
      <Table<PurchaseRequestType>
        columns={columns}
        dataSource={purchaseRequests}
        size="small"
        tableLayout="fixed"
        bordered
        loading={isFetching}
        rowSelection={{
          type: 'checkbox',
          onChange: (keys, rows) => {
            setPurchaseRequestsSelected(rows);
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

export default PurchaseRequests;

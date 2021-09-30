import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Button, Dropdown, Menu, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseOrderItemsQuery } from 'api/purchaseOrderApi';
import { useGetPurchaseRequestItemsQuery } from 'api/purchaseRequestApi';
import PurchasePriceList from 'components/PurchasePriceList';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { useParams } from 'react-router-dom';
import PurchaseOrderAddEditForm from './PurchaseOrderItemAddEditForm';
import {
  addManyPurchaseOrderItem,
  editOnePurchaseOrderItem,
  removeOnePurchaseOrderItem,
  selectAllPurchaseOrderItem,
} from './slice';
const ActionCell = ({ purchaseOrderItem }: { purchaseOrderItem: PurchaseOrderItemType }) => {
  const [openModal, { toggle: toggleModal }] = useToggle(false);
  const dispatch = useAppDispatch();

  const handleEditClicked = (newItem: PurchaseOrderItemType) => {
    const { quantity, unitPrice, key } = newItem;
    dispatch(editOnePurchaseOrderItem({ id: key, changes: { quantity, unitPrice } }));
    toggleModal();
  };
  const handleDeleteClicked = React.useCallback(() => {
    dispatch(removeOnePurchaseOrderItem(purchaseOrderItem.key));
  }, [dispatch, purchaseOrderItem]);
  const handleDropdownClick = ({ key }: { key: string }) => {
    if (key === 'delete') handleDeleteClicked();
  };
  const menu = (
    <Menu onClick={handleDropdownClick}>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  return (
    <React.Fragment>
      <Dropdown.Button onClick={() => toggleModal()} overlay={menu} size="small">
        Edit
      </Dropdown.Button>
      <Modal title="Edit Item" visible={openModal} destroyOnClose footer={null} onCancel={() => toggleModal()}>
        <PurchaseOrderAddEditForm onEdit={handleEditClicked} purchaseOrderItem={purchaseOrderItem} />
      </Modal>
    </React.Fragment>
  );
};
const PurchaseOrderItemList = () => {
  const { id } = useParams<{ id: string }>();
  const addMode = useAppSelector(s => s.purchaseOrder.addMode);
  const purchaseRequestId = useAppSelector(s => s.purchaseOrder.purchaseRequestId);
  const dispatch = useAppDispatch();
  const purchaseOrderItems = useAppSelector(selectAllPurchaseOrderItem);
  const { data } = useGetPurchaseOrderItemsQuery(id ?? skipToken);
  const { data: purchaseRequestItems } = useGetPurchaseRequestItemsQuery(purchaseRequestId ?? skipToken);
  const [openModal, { toggle }] = useToggle(false);
  const handleCloseModal = () => {
    toggle();
  };

  const columns: ColumnsType<PurchaseOrderItemType> = [
    {
      title: (
        <Button
          disabled={addMode === 'common' ? false : true}
          onClick={() => toggle()}
          type="primary"
          size="small"
          icon={<PlusOutlined />}
        />
      ),
      width: 50,
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
      title: 'Total Price',
      dataIndex: 'totalPrice',
      ellipsis: true,
    },
    {
      title: 'Batch',
      dataIndex: 'batchNo',
      ellipsis: true,
    },
    {
      title: 'Action',
      ellipsis: true,
      width: 100,
      align: 'center',
      render: (_: any, record) => <ActionCell purchaseOrderItem={record} />,
    },
  ];

  const handleSave = (purchasePrice: PurchasePriceType, purchasePriceItems: PurchasePriceItemType[]) => {
    const purchaseOrderItems = purchasePriceItems.map(item => ({
      key: item.id.toString() + item.purchasePriceId,
      purchasePriceId: purchasePrice.id,
      purchasePriceName: purchasePrice.name,
      itemCode: item.itemCode,
      itemName: item.itemName,
      uoMId: item.uoMId,
      uoMName: item.uoMName,
      quantity: 1,
      unitPrice: item.priceStd,
      totalPrice: item.priceStd * 1,
      batchNo: 'Auto Generate',
    })) as PurchaseOrderItemType[];
    dispatch(addManyPurchaseOrderItem(purchaseOrderItems));
  };
  React.useEffect(() => {
    if (data !== undefined) {
      const purchaseOrderItems = data.map(item => ({
        id: item.id,
        purchaseRequestItemId: item.purchaseRequestItemId,
        purchasePriceId: item.purchasePriceId,
        purchasePriceName: item.purchasePriceName,
        itemCode: item.itemCode,
        itemName: item.itemName,
        uoMId: item.uoMId,
        uoMName: item.uoMName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        batchNo: item.batchNo,
      })) as PurchaseOrderItemType[];
      dispatch(addManyPurchaseOrderItem(purchaseOrderItems));
    }
    if (purchaseRequestItems !== undefined) {
      const purchaseOrderItems = purchaseRequestItems
        .map(item => ({
          key: item.id.toString() + item.purchaseRequestId,
          purchaseRequestItemId: item.id,
          purchasePriceId: item.purchasePriceId,
          purchasePriceName: item.purchasePriceName,
          itemCode: item.itemCode,
          itemName: item.itemName,
          uoMId: item.uoMId,
          uoMName: item.uoMName,
          quantity: item.availableQuantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.availableQuantity,
          batchNo: item.batchNo,
        }))
        .filter(item => item.quantity > 0) as PurchaseOrderItemType[];
      dispatch(addManyPurchaseOrderItem(purchaseOrderItems));
    }
  }, [dispatch, data, purchaseRequestItems]);
  return (
    <React.Fragment>
      <Table<PurchaseOrderItemType>
        columns={columns}
        dataSource={purchaseOrderItems}
        size="small"
        bordered
        scroll={{ x: 1000 }}
        tableLayout="fixed"
      />
      <Modal
        title="Purchase Price List"
        visible={openModal}
        width={1000}
        onCancel={handleCloseModal}
        destroyOnClose
        footer={null}
      >
        <PurchasePriceList onSave={handleSave} onCloseModal={handleCloseModal} />
      </Modal>
    </React.Fragment>
  );
};

export default PurchaseOrderItemList;

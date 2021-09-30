import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useToggle } from 'ahooks';
import { Button, Dropdown, Menu, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseRequestItemsQuery } from 'api/purchaseRequestApi';
import PurchasePriceList from 'components/PurchasePriceList';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PurchaseRequestItemAddEditForm from './PurchaseRequestItemAddEditForm';
import { addManyPurchaseRequestItem, removeOnePurchaseRequestItem, selectAllPurchaseRequestItem } from './slice';

interface ActionCellProps {
  purchaseRequestItem: PurchaseRequestItemType;
}
const ActionCell = (props: ActionCellProps) => {
  const { purchaseRequestItem } = props;
  const { key } = purchaseRequestItem;
  const [openModal, { toggle: toggleModal }] = useToggle(false);
  const dispatch = useAppDispatch();

  const handleDeleteClicked = () => dispatch(removeOnePurchaseRequestItem(key));
  const handleOpenModal = () => toggleModal();
  const handleCloseModal = () => toggleModal();
  const handleDropdownClicked = ({ key }: { key: string }) => key === 'delete' && handleDeleteClicked();
  const menu = (
    <Menu onClick={handleDropdownClicked}>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  return (
    <React.Fragment>
      <Dropdown.Button onClick={handleOpenModal} overlay={menu} size="small">
        Edit
      </Dropdown.Button>
      <Modal title="Edit Item" visible={openModal} destroyOnClose footer={null} onCancel={handleCloseModal}>
        <PurchaseRequestItemAddEditForm onCloseModal={handleCloseModal} purchaseRequestItem={purchaseRequestItem} />
      </Modal>
    </React.Fragment>
  );
};

export default function PurchaseRequestItemList() {
  const { id }: { id: string } = useParams();
  const copyId = useAppSelector(s => s.purchaseRequest.copyId);
  const dispatch = useDispatch();
  const [openModal, { toggle: toggleModal }] = useToggle();
  const purchaseRequestItems = useAppSelector(selectAllPurchaseRequestItem);
  const { data, isFetching } = useGetPurchaseRequestItemsQuery((id || copyId) ?? skipToken);
  const columns: ColumnsType<PurchaseRequestItemType> = [
    {
      title: <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => toggleModal()} />,
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
      align: 'center',
      width: 100,
      render: (_: any, record) => <ActionCell purchaseRequestItem={record} />,
    },
  ];

  const handleSave = (purchasePrice: PurchasePriceType, purchasePriceItem: PurchasePriceItemType[]) => {
    const purchaseRequestItems = purchasePriceItem.map(item => ({
      key: item.itemCode.toString() + purchasePrice.id.toString(),
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
    }));
    dispatch(addManyPurchaseRequestItem(purchaseRequestItems as PurchaseRequestItemType[]));
  };
  React.useEffect(() => {
    if (data !== undefined) {
      dispatch(addManyPurchaseRequestItem(data));
    }
  }, [dispatch, data]);
  return (
    <React.Fragment>
      <Table
        columns={columns}
        dataSource={purchaseRequestItems}
        size="small"
        tableLayout="fixed"
        bordered
        loading={isFetching}
        scroll={{ x: true }}
      />
      <Modal
        title="Purchase Price List"
        visible={openModal}
        onCancel={() => toggleModal()}
        destroyOnClose
        width={1000}
        footer={null}
      >
        <PurchasePriceList onSave={handleSave} onCloseModal={() => toggleModal()} />
      </Modal>
    </React.Fragment>
  );
}

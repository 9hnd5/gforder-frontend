import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Button, Dropdown, Menu, Modal, Table } from 'antd';
import { useGetPurchasePriceItemsQuery } from 'api/purchasePriceApi';
import { ColumnTypes } from 'components/EditableTable';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { useParams } from 'react-router';
import ItemAddEditForm from './ItemAddEditForm';
import ItemMasterData from './ItemMasterData';
import { addManyPurchasePriceItem, removeOnePurchasePriceItem, selectAllPriceItem } from './slice';

interface ActionCellProps {
  purchasePriceItem: PurchasePriceItemType;
}
function ActionCell(props: ActionCellProps) {
  const { purchasePriceItem } = props;
  const [openModal, { toggle: toggleModal }] = useToggle();
  const dispatch = useAppDispatch();

  const handleDropdownClicked = ({ key }: { key: string }) => key === 'delete' && handleDeleteClicked();
  const handleEditClicked = () => handleOpenModal();
  const handleDeleteClicked = () => dispatch(removeOnePurchasePriceItem(purchasePriceItem.itemCode));
  const handleOpenModal = () => toggleModal();
  const handleCloseModal = () => toggleModal();

  const menu = (
    <Menu onClick={handleDropdownClicked}>
      <Menu.Item icon={<DeleteOutlined />} key="delete">
        Delete
      </Menu.Item>
    </Menu>
  );
  return (
    <React.Fragment>
      <Dropdown.Button onClick={handleEditClicked} overlay={menu} size="small">
        Edit
      </Dropdown.Button>
      <Modal title="Edit" visible={openModal} footer={null} destroyOnClose onCancel={handleCloseModal}>
        <ItemAddEditForm purchasePriceItem={purchasePriceItem} onCloseModal={handleCloseModal} />
      </Modal>
    </React.Fragment>
  );
}

export default function ItemAddEditList() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const purchasePriceItems = useAppSelector(selectAllPriceItem);
  const [openModal, { toggle: toggleModal }] = useToggle();
  const { data = [], isFetching } = useGetPurchasePriceItemsQuery(id !== undefined ? +id : id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const columns: ColumnTypes<PurchasePriceItemType> = [
    {
      title: <Button size="small" icon={<PlusOutlined />} type="primary" onClick={() => toggleModal()} />,
      width: 50,
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
      title: 'Min Price',
      dataIndex: 'priceMin',
      ellipsis: true,
      editable: true,
    },
    {
      title: 'Standard Price',
      dataIndex: 'priceStd',
      ellipsis: true,
      editable: true,
    },
    {
      title: 'Max Price',
      dataIndex: 'priceMax',
      ellipsis: true,
      editable: true,
    },
    {
      title: 'Action',
      render: (_: any, record) => <ActionCell purchasePriceItem={record} />,
      ellipsis: true,
      width: 100,
      align: 'center',
    },
  ];
  React.useEffect(() => {
    if (data !== undefined) {
      const purchasePriceItems = data.map(
        item =>
          ({
            id: item.id,
            key: item.key,
            itemCode: item.itemCode,
            itemName: item.itemName,
            priceMax: item.priceMax,
            priceMin: item.priceMin,
            priceStd: item.priceStd,
          } as PurchasePriceItemType)
      );
      dispatch(addManyPurchasePriceItem(purchasePriceItems));
    }
  }, [dispatch, data, id]);
  return (
    <React.Fragment>
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={purchasePriceItems}
        size="small"
        tableLayout="fixed"
        bordered
        scroll={{ x: 1000 }}
      />
      <Modal
        title="Item List"
        visible={openModal}
        destroyOnClose
        onCancel={() => toggleModal()}
        width={1000}
        footer={null}
        style={{ top: 20 }}
      >
        <ItemMasterData onCancel={() => toggleModal()} />
      </Modal>
    </React.Fragment>
  );
}

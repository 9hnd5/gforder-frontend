import { ColumnsType } from 'antd/es/table';
import { Button, Table } from 'antd';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { receivedUserPriceItems, removedUserPriceItem, selectAllUserPriceItem } from './slice';
import { DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useGetItemsForUserPriceQuery } from 'api/userPriceApi';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';

interface ActionCellProps {
  userPriceItem: UserPriceItemType;
}
const ActionCell = (props: ActionCellProps) => {
  const {
    userPriceItem: {
      item: { itemCode },
    },
  } = props;
  const dispatch = useAppDispatch();

  const handleDeleteClicked = () => dispatch(removedUserPriceItem(itemCode));
  return <Button onClick={handleDeleteClicked} size="small" icon={<DeleteOutlined />} />;
};
const UserPriceItemList = () => {
  const { id } = useParams<{ id: string }>();
  const usePriceItems = useAppSelector(selectAllUserPriceItem);
  const dispatch = useAppDispatch();
  const { data, isFetching } = useGetItemsForUserPriceQuery(id ?? skipToken);
  const columns: ColumnsType<UserPriceItemType> = [
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      ellipsis: true,
      render: (_, record) => record.item.itemCode,
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      ellipsis: true,
      render: (_, record) => record.item.itemName,
    },
    {
      title: 'UoM',
      dataIndex: 'uoMName',
      ellipsis: true,
      render: (_, record) => record.item.uoMName,
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      ellipsis: true,
      render: (_, record) => record.item.categoryId,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      ellipsis: true,
    },
    {
      title: 'Action',
      ellipsis: true,
      align: 'center',
      width: 100,
      render: (_, record) => <ActionCell userPriceItem={record} />,
    },
  ];

  React.useEffect(() => {
    if (data) {
      dispatch(receivedUserPriceItems(data));
    }
  }, [data, dispatch]);

  return <Table size="small" dataSource={usePriceItems} columns={columns} loading={isFetching} bordered />;
};
export default UserPriceItemList;

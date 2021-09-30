import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Button, InputNumber, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetItemsForUserOrderQuery } from 'api/userOrderApi';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  changeUserOrderItemQuantity,
  decreasedUserOrderItemQuantity,
  increasedUserOrderItemQuantity,
  receivedUserOrderItems,
  removedUserOrderItem,
  selectAllUserOrderItem,
  selectCopyId,
} from './slice';

interface QuantityCellProps {
  userOrderItem: UserOrderItemType;
}
const QuantityCell = (props: QuantityCellProps) => {
  const {
    userOrderItem: { key, quantity },
  } = props;
  const dispatch = useAppDispatch();
  const handleIncreasedQuantity = () => dispatch(increasedUserOrderItemQuantity(key));
  const handleDecreasedQuantity = () => dispatch(decreasedUserOrderItemQuantity(key));
  const handleChangeQuantity = (newQuantity: number | null) => dispatch(changeUserOrderItemQuantity({ key, newQuantity }));
  return (
    <InputNumber
      addonAfter={<PlusOutlined onClick={handleIncreasedQuantity} />}
      addonBefore={<MinusOutlined onClick={handleDecreasedQuantity} />}
      onChange={handleChangeQuantity}
      value={quantity}
      size="small"
      min={1}
      controls={false}
    />
  );
};

interface ActionCellProps {
  userOrderItem: UserOrderItemType;
}
const ActionCell = (props: ActionCellProps) => {
  const {
    userOrderItem: { key },
  } = props;
  const dispatch = useAppDispatch();

  const handleDeleteClicked = () => dispatch(removedUserOrderItem(key));
  return <Button onClick={handleDeleteClicked} size="small" icon={<DeleteOutlined />} />;
};

interface UserOrderItemListProps {
  viewId?: string;
}
const UserOrderItemList = (props: UserOrderItemListProps) => {
  const { viewId } = props;
  const { id } = useParams<{ id?: string }>();
  const copyId = useAppSelector(selectCopyId);
  const { data } = useGetItemsForUserOrderQuery((id || copyId || viewId) ?? skipToken);
  const dispatch = useAppDispatch();
  const userOrderItems = useAppSelector(selectAllUserOrderItem);

  const columns = React.useMemo(() => {
    const cols: ColumnsType<UserOrderItemType> = [
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
        title: 'Unit Price',
        dataIndex: 'unitPrice',
        ellipsis: true,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        ellipsis: true,
        render: (quantity, record) => (viewId ? quantity : <QuantityCell userOrderItem={record} />),
      },
      {
        title: 'UoM',
        dataIndex: 'uoMName',
        ellipsis: true,
        render: (_, record) => record.item.uoMName,
      },
      {
        title: 'Total Price',
        dataIndex: 'totalPrice',
        ellipsis: true,
      },
    ];
    if (viewId === undefined) {
      cols.push({
        title: 'Action',
        ellipsis: true,
        width: 100,
        align: 'center',
        render: (_, record) => <ActionCell userOrderItem={record} />,
      });
    }
    return cols;
  }, [viewId]);

  const summary = React.useCallback(
    (records: readonly UserOrderItemType[]) => {
      const totalPrice = records.reduce((prev, cur) => prev + cur.totalPrice, 0);
      return (
        <Table.Summary.Row>
          <Table.Summary.Cell index={1}>
            <Typography.Text type="danger">Total</Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}></Table.Summary.Cell>
          <Table.Summary.Cell index={3}></Table.Summary.Cell>
          <Table.Summary.Cell index={4}></Table.Summary.Cell>
          <Table.Summary.Cell index={4}></Table.Summary.Cell>
          <Table.Summary.Cell index={5}>
            <Typography.Text type="danger">{totalPrice}</Typography.Text>
          </Table.Summary.Cell>
          {!viewId && <Table.Summary.Cell index={6}></Table.Summary.Cell>}
        </Table.Summary.Row>
      );
    },
    [viewId]
  );
  React.useEffect(() => {
    if (data !== undefined) {
      dispatch(receivedUserOrderItems(data));
    }
  }, [data, dispatch]);
  return (
    <Table<UserOrderItemType>
      bordered
      columns={columns}
      dataSource={userOrderItems}
      size="small"
      tableLayout="fixed"
      summary={summary}
    />
  );
};
export default UserOrderItemList;

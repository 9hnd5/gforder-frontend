import { RollbackOutlined, SelectOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetItemMasterDataQuery } from 'api/itemMasterDataApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import { useState } from 'react';
import { addManyPurchasePriceItem } from './slice';

interface Props {
  onCancel: () => void;
}
export default function ItemMasterData(props: Props) {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any>([]);
  const { data, isFetching } = useGetItemMasterDataQuery(null);
  const handleSave = () => {
    const priceItems = items.map(
      (item: any) =>
        ({
          itemCode: item.itemCode,
          itemName: item.itemName,
          priceStd: 0,
          priceMin: 0,
          priceMax: 0,
        } as PurchasePriceItemType)
    );
    dispatch(addManyPurchasePriceItem(priceItems));
    props.onCancel();
  };
  const handleCancel = () => {
    props.onCancel();
  };

  const columns: ColumnsType<ItemType> = [
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
      title: 'Category',
      dataIndex: 'categoryId',
      ellipsis: true,
    },
    {
      title: 'UoM',
      dataIndex: 'uoMName',
      ellipsis: true,
    },
  ];

  return (
    <Space direction="vertical">
      <Table
        columns={columns}
        dataSource={data}
        loading={isFetching}
        tableLayout="fixed"
        size="small"
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => setItems(selectedRows),
        }}
        rowClassName={(_, index) => (index % 2 !== 0 ? 'row-odd' : '')}
      />
      <Space>
        <Button onClick={handleCancel} icon={<RollbackOutlined />}>
          Back
        </Button>
        <Button onClick={handleSave} type="primary" icon={<SelectOutlined />}>
          Save Changes
        </Button>
      </Space>
    </Space>
  );
}

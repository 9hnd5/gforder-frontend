import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseOfficesQuery } from 'api/purchaseOfficeApi';
import { useGetPurchaseOfficesForRoleQuery } from 'api/roleApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { setPurchaseOfficeIds } from './slice';
interface Props {
  roleId?: number;
}
const PurchaseOffices = (props: Props) => {
  const { roleId } = props;
  const { data: purchaseOffices, isFetching } = useGetPurchaseOfficesQuery(null);
  const { data: purchaseOfficesForRole } = useGetPurchaseOfficesForRoleQuery(roleId ?? skipToken);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>();
  const dispatch = useAppDispatch();
  const columns: ColumnsType<PurchaseOfficeType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      ellipsis: true,
    },
  ];
  React.useEffect(() => {
    if (purchaseOfficesForRole) {
      const purchaseOfficeIds = purchaseOfficesForRole.map(item => item.id);
      setSelectedRowKeys(purchaseOfficeIds);
      dispatch(setPurchaseOfficeIds(purchaseOfficeIds));
    }
  }, [purchaseOfficesForRole, dispatch]);
  return (
    <Table<PurchaseOfficeType>
      columns={columns}
      dataSource={purchaseOffices}
      loading={isFetching}
      size="small"
      tableLayout="fixed"
      bordered
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: selectedRowKeys,
        onChange: (keys, rows) => {
          setSelectedRowKeys(keys as string[]);
          dispatch(setPurchaseOfficeIds(rows.map(item => item.id)));
        },
      }}
    />
  );
};
export default PurchaseOffices;

import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseDivisionsQuery } from 'api/purchaseDivisionApi';
import { useGetPurchaseDivisionsForRoleQuery } from 'api/roleApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { setPurchaseDivisionIds } from './slice';

interface Props {
  roleId?: number;
}
const PurchaseDivisions = (props: Props) => {
  const { roleId } = props;
  const { data: purchaseDivisions, isFetching } = useGetPurchaseDivisionsQuery(null);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>();
  const { data: purchaseDivisionsForRole } = useGetPurchaseDivisionsForRoleQuery(roleId ?? skipToken);
  const dispatch = useAppDispatch();
  const columns: ColumnsType<PurchaseDivisionType> = [
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
    if (purchaseDivisionsForRole) {
      const purchaseDivisionIds = purchaseDivisionsForRole.map(item => item.id);
      setSelectedRowKeys(purchaseDivisionIds);
      dispatch(setPurchaseDivisionIds(purchaseDivisionIds));
    }
  }, [purchaseDivisionsForRole, dispatch]);
  return (
    <Table<PurchaseDivisionType>
      columns={columns}
      dataSource={purchaseDivisions}
      loading={isFetching}
      size="small"
      tableLayout="fixed"
      bordered
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: selectedRowKeys,
        onChange: (keys, rows) => {
          setSelectedRowKeys(keys as string[]);
          dispatch(setPurchaseDivisionIds(rows.map(item => item.id)));
        },
      }}
    />
  );
};
export default PurchaseDivisions;

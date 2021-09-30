import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseGroupsQuery } from 'api/purchaseGroupApi';
import { useGetPurchaseGroupsForRoleQuery } from 'api/roleApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { setPurchaseGroupsIds } from './slice';

interface Props {
  roleId?: number;
}
const PurchaseGroups = (props: Props) => {
  const { roleId } = props;
  const { data: purchaseGroups, isFetching } = useGetPurchaseGroupsQuery(null);
  const { data: purchaseGroupsForRole } = useGetPurchaseGroupsForRoleQuery(roleId ?? skipToken);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>();
  const dispatch = useAppDispatch();
  const columns: ColumnsType<PurchaseGroupType> = [
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
    if (purchaseGroupsForRole) {
      const purchaseGroupIds = purchaseGroupsForRole.map(item => item.id);
      setSelectedRowKeys(purchaseGroupIds);
      dispatch(setPurchaseGroupsIds(purchaseGroupIds));
    }
  }, [purchaseGroupsForRole, dispatch]);
  return (
    <Table<PurchaseGroupType>
      columns={columns}
      dataSource={purchaseGroups}
      loading={isFetching}
      size="small"
      tableLayout="fixed"
      bordered
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: selectedRowKeys,
        onChange: (keys, rows) => {
          setSelectedRowKeys(keys as string[]);
          dispatch(setPurchaseGroupsIds(rows.map(item => item.id)));
        },
      }}
    />
  );
};
export default PurchaseGroups;

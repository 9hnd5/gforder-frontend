import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseOrgsQuery } from 'api/purchaseOrgApi';
import { useGetPurchaseOrgsForRoleQuery } from 'api/roleApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { setPurchaseOrgIds } from './slice';

interface Props {
  roleId?: number;
}
const PurchaseOrgs = (props: Props) => {
  const { roleId } = props;
  const { data: purchaseOrgsForRole } = useGetPurchaseOrgsForRoleQuery(roleId ?? skipToken);
  const { data: purchaseOrgs, isFetching } = useGetPurchaseOrgsQuery(null);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>();
  const dispatch = useAppDispatch();
  const columns: ColumnsType<PurchaseOrgType> = [
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
    if (purchaseOrgsForRole) {
      const purchaseOrgIds = purchaseOrgsForRole.map(item => item.id);
      setSelectedRowKeys(purchaseOrgIds);
      dispatch(setPurchaseOrgIds(purchaseOrgIds));
    }
  }, [purchaseOrgsForRole, dispatch]);
  return (
    <Table<PurchaseOrgType>
      columns={columns}
      dataSource={purchaseOrgs}
      loading={isFetching}
      size="small"
      tableLayout="fixed"
      bordered
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: selectedRowKeys,
        onChange: (keys, rows) => {
          setSelectedRowKeys(keys as string[]);
          dispatch(setPurchaseOrgIds(rows.map(item => item.id)));
        },
      }}
    />
  );
};
export default PurchaseOrgs;

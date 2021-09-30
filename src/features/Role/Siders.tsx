import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetSidersForRoleQuery } from 'api/roleApi';
import { useGetSidersQuery } from 'api/siderApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import { useState } from 'react';
import { setSiderIds } from './slice';
import { Sider } from './types';
import React from 'react';

interface Props {
   roleId?: number;
}
const Siders = ({ roleId }: Props) => {
   const { data: siders, isFetching } = useGetSidersQuery();
   const { data: sidersForRole } = useGetSidersForRoleQuery(roleId ?? skipToken);
   const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>();
   const dispatch = useAppDispatch();
   const columns: ColumnsType<Sider> = [
      {
         title: 'Id',
         dataIndex: 'id',
         ellipsis: true,
      },
      {
         title: 'Sider Name',
         dataIndex: 'siderName',
         ellipsis: true,
      },
      {
         title: 'Header Menu Name',
         dataIndex: 'headerMenuName',
         ellipsis: true,
      },
      {
         title: 'Header Menu Item Name',
         dataIndex: 'headerMenuItemName',
         ellipsis: true,
      },
   ];
   React.useEffect(() => {
      if (sidersForRole) {
         const siderIds = sidersForRole.map(item => item.id);
         setSelectedRowKeys(siderIds);
         dispatch(setSiderIds(siderIds));
      }
   }, [sidersForRole, dispatch]);
   return (
      <Table<Sider>
         dataSource={siders}
         columns={columns}
         loading={isFetching}
         size="small"
         tableLayout="fixed"
         bordered
         rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onChange: (keys, rows) => {
               setSelectedRowKeys(keys as number[]);
               dispatch(setSiderIds(rows.map(item => item.id)));
            },
         }}
      />
   );
};
export default Siders;

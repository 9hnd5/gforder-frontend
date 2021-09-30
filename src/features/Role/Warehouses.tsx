import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetWarehousesForRoleQuery } from 'api/roleApi';
import { useGetWarehousesQuery } from 'api/warehouseApi';
import { useDispatch } from 'react-redux';
import React from 'react';
import { setWarehouseIds } from './slice';

interface Props {
   roleId?: number;
}
const Warehouses = (props: Props) => {
   const { roleId } = props;
   const { data: warehouses, isFetching } = useGetWarehousesQuery(null);
   const { data: warehousesForRole } = useGetWarehousesForRoleQuery(roleId ?? skipToken);
   const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>();
   const dispatch = useDispatch();
   const columns: ColumnsType<Warehouse> = [
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
      if (warehousesForRole) {
         const warehouseIds = warehousesForRole.map(item => item.id);
         setSelectedRowKeys(warehouseIds);
         dispatch(setWarehouseIds(warehouseIds));
      }
   }, [warehousesForRole, dispatch]);
   return (
      <Table<Warehouse>
         columns={columns}
         dataSource={warehouses}
         loading={isFetching}
         size="small"
         tableLayout="fixed"
         rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onChange: (keys, rows) => {
               setSelectedRowKeys(keys as string[]);
               dispatch(setWarehouseIds(rows.map(item => item.id)));
            },
         }}
      />
   );
};
export default Warehouses;

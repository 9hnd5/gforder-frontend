import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetVendorsQuery } from 'api/vendorApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { setVendorIdSelected } from './slice';

const Vendors = forwardRef((props, ref): any => {
   const { data: vendors, isFetching } = useGetVendorsQuery({}, { refetchOnMountOrArgChange: true });
   const [vendorId, setVendorId] = useState<string>('');
   const dispatch = useAppDispatch();
   useImperativeHandle(ref, () => ({
      saveItem: () => dispatch(setVendorIdSelected(vendorId)),
   }));
   const columns = useMemo(() => {
      const cols: ColumnsType<Vendor> = [
         {
            title: 'Id',
            dataIndex: 'id',
            ellipsis: true,
         },
         {
            title: 'First Name',
            dataIndex: 'firstName',
            ellipsis: true,
         },
         {
            title: 'last Name',
            dataIndex: 'lastName',
            ellipsis: true,
         },
         {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            ellipsis: true,
         },
         {
            title: 'Type',
            dataIndex: 'vendorTypeName',
            ellipsis: true,
         },
      ];
      return cols;
   }, []);
   return (
      <Table<Vendor>
         dataSource={vendors}
         columns={columns}
         size="small"
         tableLayout="fixed"
         loading={isFetching}
         rowSelection={{
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => setVendorId(selectedRows[0].id),
         }}
      />
   );
});

export default Vendors;

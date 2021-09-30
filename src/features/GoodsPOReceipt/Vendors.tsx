import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetVendorsQuery } from 'api/vendorApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import React, { useMemo, useState } from 'react';
import { setVendorIdSelected } from './slice';

interface Props {
   onCloseModal: () => void;
}

const Vendors: React.FC<Props> = ({ onCloseModal }) => {
   const { data: vendors, isFetching } = useGetVendorsQuery({}, { refetchOnMountOrArgChange: true });
   const [vendorId, setVendorId] = useState<string>('');
   const dispatch = useAppDispatch();
   const handleSave = () => {
      dispatch(setVendorIdSelected(vendorId));
      onCloseModal();
   };
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
            title: 'Last Name',
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
      <>
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
         <Space>
            <Button onClick={() => onCloseModal()} icon={<CloseOutlined />}>
               Hủy
            </Button>
            <Button onClick={handleSave} type="primary" icon={<SaveOutlined />}>
               Lưu Thay Đổi
            </Button>
         </Space>
      </>
   );
};

export default Vendors;

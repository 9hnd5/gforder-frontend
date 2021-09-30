import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { useGetVendorsQuery } from 'api/vendorApi';
import { useAppDispatch } from 'hooks/reduxHooks';
import React from 'react';
import { setVendor } from './slice';

interface Props {
  onCloseModal: () => void;
}

const VendorList: React.FC<Props> = ({ onCloseModal }) => {
  const { data: vendors, isFetching } = useGetVendorsQuery({}, { refetchOnMountOrArgChange: true });
  const [vendorSelected, setVendorSelected] = React.useState({} as Vendor);
  const dispatch = useAppDispatch();

  const handleSave = () => {
    dispatch(setVendor(vendorSelected));
    onCloseModal();
  };
  const columns = React.useMemo(() => {
    const cols = [
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
    <Space direction="vertical">
      <Table
        dataSource={vendors}
        columns={columns}
        size="small"
        tableLayout="fixed"
        loading={isFetching}
        rowSelection={{
          type: 'radio',
          onChange: (selectedRowKeys, selectedRows) => setVendorSelected(selectedRows[0] as Vendor),
        }}
      />
      <Space>
        <Button onClick={onCloseModal} icon={<CloseOutlined />}>
          Back
        </Button>
        <Button onClick={handleSave} type="primary" icon={<SaveOutlined />}>
          Save Changes
        </Button>
      </Space>
    </Space>
  );
};

export default VendorList;

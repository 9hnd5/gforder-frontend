import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useToggle } from 'ahooks';
import { Button, Dropdown, Menu, Modal, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { addVendorAddressAddEdit, deleteVendorAddressAddEdit, editVendorAddressAddEdit } from './slice';
import VendorAddressAddEditForm from './VendorAddressAddEditForm';

interface ActionCellProps {
  vendorAddressAddEdit: VendorAddress;
  onDelete: (vendorAddressAddEdit: VendorAddress) => void;
  onEdit: (vendorAddressAddEdit: VendorAddress) => void;
}
const ActionCell = (props: ActionCellProps) => {
  const { vendorAddressAddEdit, onEdit, onDelete } = props;
  const handleDropdownClick = ({ key }: { key: string }) => {
    if (key === 'delete') {
      onDelete(vendorAddressAddEdit);
    }
  };
  const menu = (
    <Menu onClick={handleDropdownClick}>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown.Button onClick={() => onEdit(vendorAddressAddEdit)} overlay={menu}>
      Edit
    </Dropdown.Button>
  );
};

const VendorAddressAddEditList = () => {
  const [openModal, { toggle: toggleModal }] = useToggle();
  const [vendorAddressEdit, setVendorAddressEdit] = React.useState<VendorAddress>();
  const vendorAddressAddEditList = useAppSelector(s => s.vendor.vendorAddressAddEditList);
  const dispatch = useAppDispatch();
  const columns: ColumnsType<VendorAddress> = [
    {
      title: <Button onClick={() => handleOpenModal()} size="small" type="primary" icon={<PlusOutlined />} />,
      width: 50,
    },
    {
      title: 'Stress',
      dataIndex: 'stress',
      ellipsis: true,
    },
    {
      title: 'District',
      dataIndex: 'district',
      ellipsis: true,
    },
    {
      title: 'City',
      dataIndex: 'city',
      ellipsis: true,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      ellipsis: true,
    },
    {
      title: 'Contact',
      dataIndex: 'contactName',
      ellipsis: true,
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      ellipsis: true,
    },
    {
      title: 'Tax',
      dataIndex: 'taxNumber',
      ellipsis: true,
    },
    {
      title: 'Is Primary',
      dataIndex: 'isPrimary',
      render: (value, record) => {
        if (record.isPrimary) return <Tag color="green">True</Tag>;
        else return <Tag color="red">False</Tag>;
      },
      ellipsis: true,
    },
    {
      title: 'Action',
      render: (_, vendorAddressAddEdit) => (
        <ActionCell onEdit={handleOpenModal} vendorAddressAddEdit={vendorAddressAddEdit} onDelete={handleDelete} />
      ),
    },
  ];

  const handleAdd = (vendorAddressAdd: VendorAddress) => {
    dispatch(addVendorAddressAddEdit(vendorAddressAdd));
    handleCloseModal();
  };
  const handleEdit = (vendorAddressEdit: VendorAddress) => {
    dispatch(editVendorAddressAddEdit(vendorAddressEdit));
    handleCloseModal();
  };
  const handleDelete = (vendorAddressDelete: VendorAddress) => {
    dispatch(deleteVendorAddressAddEdit(vendorAddressDelete));
  };
  const handleOpenModal = (vendorAddressEdit?: VendorAddress) => {
    if (vendorAddressEdit !== undefined) {
      setVendorAddressEdit(vendorAddressEdit);
    }
    toggleModal();
  };
  const handleCloseModal = () => {
    toggleModal();
  };

  return (
    <React.Fragment>
      <Table size="small" columns={columns} dataSource={vendorAddressAddEditList} tableLayout="fixed" />
      <Modal title="Add Address" visible={openModal} onCancel={handleCloseModal} destroyOnClose footer={null} style={{ top: 20 }}>
        <VendorAddressAddEditForm vendorAddressEdit={vendorAddressEdit} onAdd={handleAdd} onEdit={handleEdit} />
      </Modal>
    </React.Fragment>
  );
};
export default VendorAddressAddEditList;

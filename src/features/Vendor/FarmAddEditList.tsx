import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Button, Dropdown, Menu, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetFarmsQuery } from 'api/vendorApi';
import { PERMISSION_TYPE } from 'constants/permission';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import FarmAddEditForm, { FarmFormType } from './FarmAddEditForm';
import { addFarmAddEdit, deleteFarmAddEdit, editFarmAddEdit } from './slice';

interface ActionCellProps {
  farmAddEdit: Farm;
  onDelete: (farmAddEdit: Farm) => void;
  onEdit: (farmAddEdit: Farm) => void;
}
const ActionCell = (props: ActionCellProps) => {
  const { farmAddEdit, onEdit, onDelete } = props;
  const handleDropdownClick = ({ key }: { key: string }) => {
    if (key === 'delete') {
      onDelete(farmAddEdit);
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
    <Dropdown.Button onClick={() => onEdit(farmAddEdit)} overlay={menu}>
      Edit
    </Dropdown.Button>
  );
};

const FarmAddEditList = () => {
  const { id: vendorId } = useParams<{ id: string }>();
  const { permissions } = useContext(AuthContext);
  const [openModal, { toggle: toggleModal }] = useToggle();
  const { data: farmList, isFetching } = useGetFarmsQuery(vendorId ?? skipToken, { refetchOnMountOrArgChange: true });
  const methods = useForm<FarmFormType>();
  const dispatch = useAppDispatch();
  const farmAddEditList = useAppSelector(s => s.vendor.farmAddEditList);
  const [farmEdit, setFarmEdit] = React.useState<Farm>();

  const handleAdd = (farmAddEdit: Farm) => {
    dispatch(addFarmAddEdit(farmAddEdit));
    handleCloseModal();
  };
  const handleEdit = (farmAddEdit: Farm) => {
    dispatch(editFarmAddEdit(farmAddEdit));
    handleCloseModal();
  };
  const handleDelete = (farmAddEdit: Farm) => {
    dispatch(deleteFarmAddEdit(farmAddEdit));
  };
  const handleOpenModal = (farmEdit?: Farm) => {
    if (farmEdit !== undefined) {
      setFarmEdit(farmEdit);
    }
    toggleModal();
  };
  const handleCloseModal = () => {
    toggleModal();
  };
  const columns: ColumnsType<Farm> = [
    {
      title: hasPermission(PERMISSION_TYPE.FULL, permissions) && (
        <Button onClick={() => handleOpenModal()} type="primary" size="small" icon={<PlusOutlined />} />
      ),
      width: 50,
    },
    {
      title: 'Farm Name',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'vendorAddress',
      ellipsis: true,
    },
    {
      title: 'Farm Type',
      dataIndex: 'farmTypeName',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'farmStatusName',
      ellipsis: true,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      ellipsis: true,
    },
    {
      title: 'Owner Number',
      dataIndex: 'ownerNumber',
      ellipsis: true,
    },
    {
      title: 'Action',
      ellipsis: true,
      align: 'center',
      render: (_, farmAddEdit) => <ActionCell onEdit={handleOpenModal} onDelete={handleDelete} farmAddEdit={farmAddEdit} />,
    },
  ];
  React.useEffect(() => {
    if (farmList !== undefined) {
      dispatch(addFarmAddEdit(farmList));
    }
  }, [farmList, dispatch]);
  return (
    <React.Fragment>
      <Table<Farm> columns={columns} dataSource={farmAddEditList} size="small" tableLayout="fixed" loading={isFetching} />
      <Modal style={{ top: 20 }} visible={openModal} destroyOnClose title="Add Farm" footer={null} onCancel={handleCloseModal}>
        <FormProvider {...methods}>
          <FarmAddEditForm farmEdit={farmEdit} onEdit={handleEdit} onAdd={handleAdd} />
        </FormProvider>
      </Modal>
    </React.Fragment>
  );
};

export default FarmAddEditList;

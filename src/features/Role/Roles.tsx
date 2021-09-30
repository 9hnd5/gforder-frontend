import { DeleteOutlined, PlusOutlined, RetweetOutlined, RollbackOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToggle } from 'ahooks';
import { Button, Dropdown, Input as Textfied, Menu, Modal, Space, Table, Tabs, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAddRoleMutation, useDeleteRoleMutation, useEditRoleMutation, useGetRolesQuery } from 'api/roleApi';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import Permissions from './Permissions';
import PurchaseDivisions from './PurchaseDivisions';
import PurchaseGroups from './PurchaseGroups';
import PurchaseOffices from './PurchaseOffices';
import PurchaseOrgs from './PurchaseOrgs';
import RoleAddEditForm from './RoleAddEditForm';
import Siders from './Siders';
import { resetRoleSlice } from './slice';
import { Role, RoleAddEdit } from './types';
import Warehouses from './Warehouses';

interface ActionCellProps {
  id: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const validationSchema = yup
  .object()
  .shape({
    name: yup.string().required('Role name is required').nullable(),
  })
  .required();

const ActionCell = (props: ActionCellProps) => {
  const { id, onEdit, onDelete } = props;

  const handleDropdownClicked = ({ key }: { key: string }) => {
    if (key === 'delete') handleDelete();
  };
  const handleDelete = async () => {
    onDelete(id);
  };
  const handleEdit = () => {
    onEdit(id);
  };
  const menu = (
    <Menu onClick={handleDropdownClicked}>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown.Button onClick={handleEdit} size="small" overlay={menu}>
      Edit
    </Dropdown.Button>
  );
};

const Roles = () => {
  const [openModal, { toggle }] = useToggle();
  const history = useHistory();
  const { data: roles, isFetching } = useGetRolesQuery(null);
  const [addRole, { isLoading: isAdding }] = useAddRoleMutation();
  const [editRole, { isLoading: isEditing }] = useEditRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const siderIds = useAppSelector(s => s.role.siderIds);
  const permissionIds = useAppSelector(s => s.role.permissionIds);
  const purchaseOrgIds = useAppSelector(s => s.role.purchaseOrgIds);
  const purchaseDivisionIds = useAppSelector(s => s.role.purchaseDivisionIds);
  const purchaseOfficeIds = useAppSelector(s => s.role.purchaseOfficeIds);
  const purchaseGroupIds = useAppSelector(s => s.role.purchaseGroupIds);
  const warehouseIds = useAppSelector(s => s.role.warehouseIds);

  const [mode, setMode] = React.useState<'EDIT' | 'ADD'>('ADD');
  const [roleId, setRoleId] = React.useState<number>();
  const dispatch = useAppDispatch();
  const methods = useForm<RoleAddEdit>({ resolver: yupResolver(validationSchema) });

  const handleCloseModal = () => {
    toggle();
    setMode('ADD');
    setRoleId(undefined);
    methods.reset();
    dispatch(resetRoleSlice());
  };
  const handleSave: SubmitHandler<RoleAddEdit> = async data => {
    const roleAddEditing: RoleAddEdit = {
      ...data,
      permissionIds,
      siderIds,
      purchaseOrgIds,
      purchaseDivisionIds,
      purchaseGroupIds,
      purchaseOfficeIds,
      warehouseIds,
    };
    if (mode === 'EDIT' && roleId) {
      await editRole({ id: roleId, roleEditing: roleAddEditing }).unwrap();
    } else {
      await addRole(roleAddEditing).unwrap();
    }
    handleCloseModal();
  };
  const handleEdit = (id: number) => {
    const role = roles?.find(r => r.id === id);
    if (role) {
      for (const [key, value] of Object.entries(role)) {
        methods.setValue(key as keyof RoleAddEdit, value);
      }
      setRoleId(id);
      setMode('EDIT');
      toggle();
    }
  };
  const handleDelete = async (id: number) => {
    await deleteRole(id).unwrap();
  };
  const columns: ColumnsType<Role> = [
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
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Action',
      render: (_, record) => <ActionCell id={record.id} onEdit={handleEdit} onDelete={handleDelete} />,
      width: 100,
      ellipsis: true,
      align: 'center',
    },
  ];
  const routes = [
    {
      path: '',
      breadcrumbName: 'Master Data',
    },
    {
      path: '',
      breadcrumbName: 'Role',
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'Role List',
        breadcrumb: { routes },
        onBack: () => history.goBack(),
      }}
      extra={
        <Space>
          <Space>
            <Tooltip title="Change Type Search">
              <Button icon={<RetweetOutlined />} />
            </Tooltip>
            <Textfied style={{ width: 250 }} key={1} prefix={<SearchOutlined />} placeholder="Search something" />
          </Space>
          <Button onClick={() => toggle()} icon={<PlusOutlined />} key={2} type="primary">
            Add More
          </Button>
        </Space>
      }
    >
      <ProCard size="small" bordered>
        <Table<Role> columns={columns} dataSource={roles} loading={isFetching} tableLayout="fixed" size="small" bordered />
      </ProCard>
      <Modal
        title="Add Role"
        width={1000}
        style={{ top: 20 }}
        visible={openModal}
        onCancel={handleCloseModal}
        destroyOnClose
        footer={null}
      >
        <FormProvider {...methods}>
          <RoleAddEditForm />
          <Tabs>
            <Tabs.TabPane key={0} tab="Menu">
              <Siders roleId={roleId} />
            </Tabs.TabPane>
            <Tabs.TabPane forceRender key={1} tab="Permission">
              <Permissions roleId={roleId} />
            </Tabs.TabPane>
            <Tabs.TabPane forceRender key={2} tab="Purchase Org">
              <PurchaseOrgs roleId={roleId} />
            </Tabs.TabPane>
            <Tabs.TabPane forceRender key={3} tab="Purchase Division">
              <PurchaseDivisions roleId={roleId} />
            </Tabs.TabPane>
            <Tabs.TabPane forceRender key={4} tab="Purchase Office">
              <PurchaseOffices roleId={roleId} />
            </Tabs.TabPane>
            <Tabs.TabPane forceRender key={5} tab="Purchase Group">
              <PurchaseGroups roleId={roleId} />
            </Tabs.TabPane>
            <Tabs.TabPane forceRender key={6} tab="Warehouse">
              <Warehouses roleId={roleId} />
            </Tabs.TabPane>
          </Tabs>
          <Space>
            <Button onClick={handleCloseModal} icon={<RollbackOutlined />}>
              Back
            </Button>
            <Button
              onClick={methods.handleSubmit(handleSave)}
              loading={isAdding || isEditing}
              icon={<SaveOutlined />}
              type="primary"
            >
              Save Changes
            </Button>
          </Space>
        </FormProvider>
      </Modal>
    </PageContainer>
  );
};
export default Roles;

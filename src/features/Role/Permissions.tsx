import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPermmissionsQuery } from 'api/permissionApi';
import { useGetPermissionsForRoleQuery } from 'api/roleApi';
import { Permission } from 'features/Authentication/type';
import { useAppDispatch } from 'hooks/reduxHooks';
import { useState } from 'react';
import { setPermissionIds } from './slice';
import React from 'react';

interface Props {
  roleId?: number;
}

const Permissions = ({ roleId }: Props) => {
  const { data: permissions, isFetching } = useGetPermmissionsQuery();
  const { data: permissionsForRole } = useGetPermissionsForRoleQuery(roleId ?? skipToken);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>();
  const dispatch = useAppDispatch();
  const columns: ColumnsType<Permission> = [
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
  ];
  React.useEffect(() => {
    if (permissionsForRole) {
      const permissionIds = permissionsForRole.map(item => item.id);
      setSelectedRowKeys(permissionIds);
      dispatch(setPermissionIds(permissionIds));
    }
  }, [permissionsForRole, dispatch]);
  return (
    <Table<Permission>
      columns={columns}
      dataSource={permissions}
      loading={isFetching}
      size="small"
      tableLayout="fixed"
      bordered
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: selectedRowKeys,
        onChange: (keys, rows) => {
          setSelectedRowKeys(keys as number[]);
          dispatch(setPermissionIds(rows.map(item => item.id)));
        },
      }}
    />
  );
};
export default Permissions;

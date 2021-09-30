import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Dropdown, Menu, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useDeleteVendorMutation, useGetVendorsQuery } from 'api/vendorApi';
import { PERMISSION_TYPE } from 'constants/permission';
import hasPermission from 'helpers/hasPermission';
import { AuthContext } from 'Hocs/withAuthorize';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

interface ActionCellProps {
  vendor: Vendor;
  basePath: string;
}
const ActionCell = (props: ActionCellProps) => {
  const { vendor, basePath } = props;
  const history = useHistory();
  const [deleteVendor] = useDeleteVendorMutation();
  const handleDelete = async () => {
    await deleteVendor(vendor.id);
  };

  const handleDropdownClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'edit':
        history.push(`${basePath}/add-edit`);
        break;

      default:
        handleDelete();
        break;
    }
  };
  const menu = (
    <Menu onClick={handleDropdownClick}>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown.Button onClick={() => history.push(`${basePath}/detail/${vendor.id}`)} overlay={menu}>
      Detail
    </Dropdown.Button>
  );
};

interface VendorListProps {
  basePath: string;
}

export default function List(props: VendorListProps) {
  const { basePath } = props;
  const history = useHistory();
  const { permissions } = useContext(AuthContext);
  const { data: vendors, isFetching } = useGetVendorsQuery(null, { refetchOnMountOrArgChange: true });

  const columns: ColumnsType<Vendor> = [
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
      title: 'Contact',
      dataIndex: 'contactName',
      ellipsis: true,
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactName',
      ellipsis: true,
    },
    {
      title: 'Tax',
      dataIndex: 'taxNumber',
      ellipsis: true,
    },
    {
      title: 'Action',
      ellipsis: true,
      render: (_, record) => <ActionCell basePath={basePath} vendor={record} />,
    },
  ];
  const routes = [
    {
      path: '',
      breadcrumbName: 'Master Data',
    },
    {
      path: '',
      breadcrumbName: 'Vendor',
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'Vendor List',
        onBack: () => history.goBack(),
        breadcrumb: { routes },
      }}
      extra={[
        hasPermission(PERMISSION_TYPE.FULL, permissions) && (
          <Button onClick={() => history.push(`${basePath}/add-edit`)} key={1} icon={<PlusOutlined />} type="primary">
            Add More
          </Button>
        ),
      ]}
    >
      <ProCard size="small" bordered>
        <Table<Vendor>
          columns={columns}
          dataSource={vendors}
          loading={isFetching}
          size="small"
          tableLayout="fixed"
        />
      </ProCard>
    </PageContainer>
  );
}

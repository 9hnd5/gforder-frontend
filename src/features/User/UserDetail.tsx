import { RollbackOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Descriptions, Typography, Table, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseApprovalForUserQuery, useGetUserByIdQuery } from 'api/userApi';
import { useHistory, useParams } from 'react-router-dom';

interface Props {
  basePath: string;
}
const UserDetail = (props: Props) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data: user, isFetching: isUserLoading } = useGetUserByIdQuery(id ?? skipToken);
  const { data: approvalList, isFetching } = useGetPurchaseApprovalForUserQuery(id ?? skipToken);
  const routes = [
    {
      path: '',
      breadcrumbName: 'User',
    },
    {
      path: '',
      breadcrumbName: 'Detail',
    },
  ];
  const columns: ColumnsType<PurchaseApprovalType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: 'Purchase Org',
      dataIndex: 'purchaseOrgName',
      ellipsis: true,
    },
    {
      title: 'Purchase Division',
      dataIndex: 'purchaseDivisionName',
      ellipsis: true,
    },
    {
      title: 'Purchase Office',
      dataIndex: 'purchaseOfficeName',
      ellipsis: true,
    },
    {
      title: 'Purchase Group',
      dataIndex: 'purchaseGroupName',
      ellipsis: true,
    },
    {
      title: 'Effective End',
      dataIndex: 'effectiveEnd',
      ellipsis: true,
    },
  ];
  return (
    <PageContainer
      header={{
        title: 'User Detail',
        breadcrumb: { routes },
        onBack: () => history.goBack(),
      }}
    >
      <ProCard split="horizontal" size="small" ghost>
        <ProCard loading={isUserLoading} bordered>
          <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }} layout="vertical" size="small" bordered>
            <Descriptions.Item label={<Typography.Text strong>Id</Typography.Text>}>{user?.id}</Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Role</Typography.Text>}>{user?.roleName}</Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>First Name</Typography.Text>}>{user?.firstName}</Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Last Name</Typography.Text>}>{user?.lastName}</Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Date Of Birth</Typography.Text>}>
              {user?.dateOfBirth}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Phone Number</Typography.Text>}>
              {user?.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label={<Typography.Text strong>Email</Typography.Text>}>{user?.email}</Descriptions.Item>
          </Descriptions>
        </ProCard>
        <ProCard size="small" bordered tabs={{ type: 'card', size: 'small' }}>
          <ProCard.TabPane key="1" tab="Purchase Approval">
            <Table
              columns={columns}
              dataSource={approvalList}
              size="small"
              tableLayout="fixed"
              loading={isFetching}
              rowKey={x => x.id}
              scroll={{ x: 1000 }}
              bordered
            />
          </ProCard.TabPane>
        </ProCard>
        <ProCard size="small" bordered>
          <Button onClick={() => history.goBack()} icon={<RollbackOutlined />}>
            Back
          </Button>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default UserDetail;

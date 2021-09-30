import ProCard from '@ant-design/pro-card';
import { Descriptions, Table } from 'antd';
import { useGetVendorByIdQuery } from 'api/vendorApi';

type VendorDetailProps = {
  vendorId: string;
};

const VendorDetail = (props: VendorDetailProps) => {
  const { vendorId } = props;
  const { data: vendor } = useGetVendorByIdQuery(vendorId);
  return (
    <ProCard split="vertical" ghost size="small" gutter={[4, 4]} wrap>
      <ProCard bordered colSpan={{ xs: 24 }}>
        <Descriptions column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }} layout="vertical" bordered size="small">
          <Descriptions.Item label="Id">{vendor?.id}</Descriptions.Item>
          <Descriptions.Item label="First Name">{vendor?.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{vendor?.lastName}</Descriptions.Item>
          <Descriptions.Item label="Phone">{vendor?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Contact">{vendor?.contactName}</Descriptions.Item>
          <Descriptions.Item label="Contact Number">{vendor?.contactNumber}</Descriptions.Item>
          <Descriptions.Item label="Tax">{vendor?.taxNumber}</Descriptions.Item>
        </Descriptions>
      </ProCard>
      <ProCard bordered colSpan={{ xs: 24 }} tabs={{ type: 'card', size: 'small' }} style={{ height: '100%' }}>
        <ProCard.TabPane key="1" tab="Addess List">
          <Table
            //   columns={columns}
            //   dataSource={purchaseRequestItems}
            //   loading={isFetching}
            tableLayout="fixed"
            size="small"
            scroll={{ x: 1000 }}
          />
        </ProCard.TabPane>
        <ProCard.TabPane key="2" tab="Farm List"></ProCard.TabPane>
      </ProCard>
    </ProCard>
  );
};

export default VendorDetail;

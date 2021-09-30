import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import AddEditForm from './AddEditForm';
import FarmAddEditList from './FarmAddEditList';
import VendorAddressAddEditList from './VendorAddressAddEditList';

interface Props {
  basePath: string;
}
export interface VendorFormType {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  contactName: string;
  contactNumber: string;
  taxNumber: string;
  createdDate: string;
  vendorTypeId: number;
  vendorStatusId: number;
  purchaseOrgId: string;
  purchaseDivisionId: string;
  purchaseOfficeId: string;
  purchaseGroupId: string;
}
const routes = [
  {
    path: '',
    breadcrumbName: 'Master Data',
  },
  {
    path: '',
    breadcrumbName: 'Vendor',
  },
  {
    path: '',
    breadcrumbName: 'Adding',
  },
];
const AddEdit = (props: Props) => {
  const history = useHistory();
  const methods = useForm<VendorFormType>();
  return (
    <PageContainer header={{ title: 'Add Vendor', breadcrumb: { routes }, onBack: () => history.goBack() }}>
      <ProCard size="small" ghost split="horizontal">
        <ProCard size="small" bordered>
          <FormProvider {...methods}>
            <AddEditForm />
          </FormProvider>
        </ProCard>
        <ProCard tabs={{ type: 'card', size: 'small' }} bordered>
          <ProCard.TabPane key="1" tab="Address List">
            <VendorAddressAddEditList />
          </ProCard.TabPane>
          <ProCard.TabPane key="2" tab="Farm List">
            <FarmAddEditList />
          </ProCard.TabPane>
        </ProCard>
        <ProCard size="small" bordered>
          <Button icon={<RollbackOutlined />}>Back</Button>
          <Button type="primary" icon={<SaveOutlined />}>
            Save Changes
          </Button>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
export default AddEdit;

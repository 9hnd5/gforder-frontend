import { SaveOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchaseApprovalsQuery } from 'api/purchaseApprovalApi';
import React, { useState } from 'react';

export interface PurchaseApproval {
  id: number;
  userId: number;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  purchaseOrgId: string;
  purchaseOrgName: string;
  purchaseDivisionId: string;
  purchaseDivisionName: string;
  purchaseOfficeId: string;
  purchaseOfficeName: string;
  purchaseGroupId: string;
  purchaseGroupName: string;
  priority: number;
}

interface Props {
  onSave: (userId: number) => void;
  purchaseOrgId: string;
  purchaseDivisionId: string;
  purchaseOfficeId: string;
  purchaseGroupId: string;
  isLoading?: boolean;
}

const PurchaseApprovals = (props: Props) => {
  const { purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId, onSave, isLoading } = props;
  const [userId, setUserId] = useState<number>(0);
  const { data: purchaseApprovals, isFetching } = useGetPurchaseApprovalsQuery(
    React.useMemo(() => {
      return {
        purchaseOrgId: {
          eq: purchaseOrgId,
        },
        purchaseDivisionId: {
          eq: purchaseDivisionId,
        },
        purchaseOfficeId: {
          eq: purchaseOfficeId,
        },
        purchaseGroupId: {
          eq: purchaseGroupId,
        },
      };
    }, [purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId]),
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handleSave = () => {
    onSave(userId);
  };

  const columns = React.useMemo(() => {
    const cols: ColumnsType<PurchaseApproval> = [
      {
        title: 'Id',
        dataIndex: 'id',
        ellipsis: true,
      },
      {
        title: 'Name',
        dataIndex: 'fullName',
        ellipsis: true,
      },
      {
        title: 'Date of Birth',
        dataIndex: 'dateOfBirth',
        ellipsis: true,
      },
      {
        title: 'Phone',
        dataIndex: 'phoneNumber',
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
    ];
    return cols;
  }, []);
  return (
    <React.Fragment>
      <Table<PurchaseApproval>
        loading={isFetching}
        columns={columns}
        dataSource={purchaseApprovals}
        size="small"
        tableLayout="fixed"
        bordered
        rowSelection={{
          type: 'radio',
          onChange: (keys, rows) => {
            setUserId(rows[0].userId);
          },
        }}
      />
      <Space>
        <Button loading={isLoading} onClick={handleSave} type="primary" icon={<SaveOutlined />}>
          Save Changes
        </Button>
      </Space>
    </React.Fragment>
  );
};
export default PurchaseApprovals;

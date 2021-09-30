import { ArrowLeftOutlined, ArrowRightOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Button, Input as TextField, Space, Steps, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetGoodsPOReceiptsQuery } from 'api/goodsPOReceiptApi';
import { useGetGoodsPOReceiptItemsQuery } from 'api/goodsPOReceiptItemApi';
import { GoodsPOReceipt, GoodsPOReceiptItem } from 'features/GoodsPOReceipt/types';
import React, { useState } from 'react';
const { Step } = Steps;

interface Props {
   data: string[];
   onSave: (items: GoodsPOReceiptItem[]) => void;
   onCloseModal: () => void;
}
const GoodsPOReceipts = ({ data, onCloseModal, onSave }: Props) => {
   const [currentStep, setCurrentStep] = React.useState<number>(0);
   const [vendorId, purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId] = data;
   // const dispatch = useAppDispatch();
   const [selectedIds, setSelectedIds] = useState<string[]>([]);
   const [items, setItems] = React.useState<GoodsPOReceiptItem[]>([]);
   const params = React.useMemo(() => {
      return {
         vendorId: {
            eq: vendorId,
         },
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
         statusId: {
            eq: 2,
         },
      };
   }, [vendorId, purchaseOrgId, purchaseDivisionId, purchaseOfficeId, purchaseGroupId]);
   const { data: goodsPOReceipts } = useGetGoodsPOReceiptsQuery(params);
   const columns: ColumnsType<GoodsPOReceipt> = [
      {
         title: 'Id',
         dataIndex: 'id',
         ellipsis: true,
      },
      {
         title: 'Created Date',
         dataIndex: 'createdDate',
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
   const handleSave = () => {
      onSave(items);
      onCloseModal();
   };
   const steps = [
      {
         title: 'Select Goods PO Receipt',
         content: (
            <ProCard size="small" extra={<TextField prefix={<SearchOutlined />} placeholder="Search something" />}>
               <Table<GoodsPOReceipt>
                  rowSelection={{
                     type: 'checkbox',
                     onChange: (keys, rows) => setSelectedIds(rows.map(x => x.id)),
                  }}
                  columns={columns}
                  dataSource={goodsPOReceipts}
                  size="small"
                  tableLayout="fixed"
               />
            </ProCard>
         ),
      },
      {
         title: 'Select Purchase Price Item',
         content: (
            <ProCard size="small" extra={<TextField prefix={<SearchOutlined />} placeholder="Search something" />}>
               <GoodsPOReceiptItemList ids={selectedIds} onChange={setItems} />
            </ProCard>
         ),
      },
   ];

   return (
      <ProCard direction="column" size="small" ghost>
         <ProCard size="small">
            <Steps current={currentStep} size="small">
               {steps.map(item => (
                  <Step title={item.title} />
               ))}
            </Steps>
         </ProCard>
         {steps[currentStep].content}
         <ProCard colSpan={4} size="small">
            <Space>
               {currentStep < steps.length - 1 && (
                  <Button onClick={() => setCurrentStep(c => c + 1)} type="primary" icon={<ArrowRightOutlined />}>
                     Next
                  </Button>
               )}
               {currentStep > 0 && (
                  <Button onClick={() => setCurrentStep(c => c - 1)} icon={<ArrowLeftOutlined />}>
                     Previous
                  </Button>
               )}
               {currentStep === steps.length - 1 && (
                  <Button onClick={handleSave} type="primary" icon={<SaveOutlined />}>
                     Save Change
                  </Button>
               )}
            </Space>
         </ProCard>
      </ProCard>
   );
};
export default GoodsPOReceipts;

interface GoodsPOReceiptItemListProps {
   ids: string[];
   onChange: (items: GoodsPOReceiptItem[]) => void;
}
const GoodsPOReceiptItemList = (props: GoodsPOReceiptItemListProps) => {
   const params = React.useMemo(
      () => ({ goodsPOReceiptId: { in: [props.ids] }, availableQuantity: { gt: 0 } }),
      [props.ids]
   );
   console.log('apram', params);
   const { data: items, isFetching } = useGetGoodsPOReceiptItemsQuery(params);
   const columns: ColumnsType<GoodsPOReceiptItem> = [
      {
         title: 'Id',
         dataIndex: 'id',
         ellipsis: true,
      },
      {
         title: 'GPOR Number',
         dataIndex: 'goodsPOReceiptId',
         ellipsis: true,
      },
      {
         title: 'Warehouse',
         dataIndex: 'warehouseName',
         ellipsis: true,
      },
      {
         title: 'Item Code',
         dataIndex: 'itemCode',
         ellipsis: true,
      },
      {
         title: 'Item Name',
         dataIndex: 'itemName',
         ellipsis: true,
      },
      {
         title: 'UoM',
         dataIndex: 'uoMName',
         ellipsis: true,
      },
      {
         title: 'Unit Price',
         dataIndex: 'unitPrice',
         ellipsis: true,
      },
      {
         title: 'Quantity',
         dataIndex: 'quantity',
         ellipsis: true,
      },
      {
         title: 'Total Price',
         dataIndex: 'totalPrice',
         ellipsis: true,
      },
      {
         title: 'Batch',
         dataIndex: 'batchNo',
         ellipsis: true,
      },
   ];

   return (
      <Table
         rowSelection={{ type: 'checkbox', onChange: (keys, rows) => props.onChange(rows) }}
         dataSource={items}
         loading={isFetching}
         columns={columns}
         size="small"
         tableLayout="fixed"
         rowKey={x => x.id}
      />
   );
};

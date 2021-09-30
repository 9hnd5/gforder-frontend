import { ArrowLeftOutlined, ArrowRightOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Button, Input as TextField, Space, Steps, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetPurchasePriceItemsQuery, useGetPurchasePricesQuery } from 'api/purchasePriceApi';
import moment from 'moment';
import React from 'react';
const { Step } = Steps;

interface ContextType {
  setPurchasePriceItemListSelected: (itemListSelected: PurchasePriceItemType[]) => void;
}
const Context = React.createContext<ContextType>({} as ContextType);
interface PurchasePriceListProps {
  onSave: (purchasePrice: PurchasePriceType, itemList: PurchasePriceItemType[]) => void;
  onCloseModal: () => void;
}

const PurchasePriceList = ({ onSave, onCloseModal }: PurchasePriceListProps) => {
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [purchasePrice, setPurchasePrice] = React.useState<PurchasePriceType>();
  const [purchasePriceItemAddList, setPurchasePriceItemList] = React.useState<PurchasePriceItemType[]>(
    {} as PurchasePriceItemType[]
  );
  const params = React.useMemo(
    () => ({
      purchaseStatusId: {
        eq: 3,
      },
      effectiveEnd: {
        gte: moment().format('YYYY-MM-DD').toString(),
      },
    }),
    []
  );
  const { data: purchasePrices } = useGetPurchasePricesQuery(params, { refetchOnMountOrArgChange: true });
  const columns: ColumnsType<PurchasePriceType> = [
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
    onSave(purchasePrice!, purchasePriceItemAddList);
    onCloseModal();
  };
  const steps = [
    {
      title: 'Select Purchase Price',
      content: (
        <ProCard size="small" extra={<TextField prefix={<SearchOutlined />} placeholder="Search something" />}>
          <Table<PurchasePriceType>
            columns={columns}
            dataSource={purchasePrices}
            size="small"
            tableLayout="fixed"
            bordered
            rowSelection={{
              type: 'radio',
              onChange: (keys, rows) => setPurchasePrice(rows[0]),
            }}
          />
        </ProCard>
      ),
    },
    {
      title: 'Select Purchase Price Item',
      content: (
        <ProCard size="small" extra={<TextField prefix={<SearchOutlined />} placeholder="Search something" />}>
          <PurchasePriceItemList purchasePriceId={purchasePrice?.id} />
        </ProCard>
      ),
    },
  ];
  return (
    <Context.Provider value={{ setPurchasePriceItemListSelected: setPurchasePriceItemList }}>
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
    </Context.Provider>
  );
};
export default PurchasePriceList;

interface PurchasePriceItemListProps {
  purchasePriceId: number | undefined;
}
const PurchasePriceItemList = ({ purchasePriceId }: PurchasePriceItemListProps) => {
  const context = React.useContext(Context);
  const { data: purchasePriceItemAddList } = useGetPurchasePriceItemsQuery(purchasePriceId ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const columns: ColumnsType<PurchasePriceItemType> = [
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
      title: 'Price Min',
      dataIndex: 'priceMin',
      ellipsis: true,
    },
    {
      title: 'Price Standard',
      dataIndex: 'priceStd',
      ellipsis: true,
    },
    {
      title: 'Price Max',
      dataIndex: 'priceMax',
      ellipsis: true,
    },
  ];
  return (
    <Table<PurchasePriceItemType>
      dataSource={purchasePriceItemAddList}
      columns={columns}
      size="small"
      tableLayout="fixed"
      bordered
      rowSelection={{ type: 'checkbox', onChange: (keys, rows) => context.setPurchasePriceItemListSelected(rows) }}
    />
  );
};

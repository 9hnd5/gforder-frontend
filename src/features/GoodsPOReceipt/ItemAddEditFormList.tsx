import { CloseOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Button, Col, Dropdown, Form, Menu, Modal, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetItemsForGoodsPOReceiptQuery } from 'api/goodsPOReceiptApi';
import { NumberFormatField, SelectField } from 'components';
import withData, { WithDataProps } from 'Hocs/withData';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { NestedValue, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { addGoodsPOReceiptFormList, deleteGoodsPOReceiptForm, editGoodsPOReceiptForm } from './slice';
import { GoodsPOReceiptItemAddEdit } from './types';

interface FormValueType {
  quantity: number;
  warehouse: NestedValue<{ label: string; value: string }>;
  totalPrice: number;
  unitPrice: number;
}
interface ActionCellProps {
  goodsPOReceiptItem: GoodsPOReceiptItemForm;
  warehouses?: Warehouse[];
}
const ActionCell = ({ goodsPOReceiptItem, warehouses }: ActionCellProps) => {
  const validationSchema = yup
    .object()
    .shape({
      quantity: yup.mixed().test('quantity', '', function (value) {
        const max = goodsPOReceiptItem.quantity + goodsPOReceiptItem.quantity * 0.1;
        const min = goodsPOReceiptItem.quantity;
        if (value < min) return this.createError({ message: `Không được nhỏ hơn ${min}` });
        if (value > max) return this.createError({ message: `Không được lớn hơn ${max}` });
        return true;
      }),
    })
    .required();
  const [openModal, { toggle }] = useToggle(false);
  const dispatch = useAppDispatch();
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitSuccessful, errors },
  } = useForm<FormValueType>({ resolver: yupResolver(validationSchema) });
  const quantity = useWatch({ control, name: 'quantity' });
  const handleSaveClicked: SubmitHandler<FormValueType> = formValue => {
    const newItem: GoodsPOReceiptItemForm = {
      ...goodsPOReceiptItem,
      warehouseId: formValue.warehouse.value,
      warehouseName: formValue.warehouse.label,
      quantity: formValue.quantity,
      unitPrice: formValue.unitPrice,
      totalPrice: formValue.totalPrice,
    };
    dispatch(editGoodsPOReceiptForm(newItem));
    toggle();
  };
  const handleOpenModal = () => {
    const formValue = {
      quantity: goodsPOReceiptItem.quantity,
      unitPrice: goodsPOReceiptItem.unitPrice,
      totalPrice: goodsPOReceiptItem.totalPrice,
      warehouse: {
        label: goodsPOReceiptItem.warehouseName,
        value: goodsPOReceiptItem.warehouseId,
      } as NestedValue<{ label: string; value: string }>,
    } as FormValueType;
    for (const [key, value] of Object.entries<any>(formValue)) {
      setValue(key as keyof FormValueType, value);
    }
    toggle();
  };
  const handleDelete = () => {
    dispatch(deleteGoodsPOReceiptForm(goodsPOReceiptItem));
  };
  const handleCloseModal = () => {
    toggle();
    reset();
  };
  const handleDropdownClick = ({ key }: { key: string }) => key === 'delete' && handleDelete();
  React.useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  React.useEffect(() => {
    const totalPrice = quantity * getValues('unitPrice');
    setValue('totalPrice', totalPrice);
  }, [quantity, setValue, getValues]);

  const menu = (
    <Menu onClick={handleDropdownClick}>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  return (
    <React.Fragment>
      <Dropdown.Button onClick={handleOpenModal} overlay={menu} size="small">
        Edit
      </Dropdown.Button>
      <Modal footer={null} style={{ top: 20 }} visible={openModal} title="Edit" destroyOnClose onCancel={handleCloseModal}>
        <Form layout="vertical">
          <Row gutter={[8, 0]}>
            <Col xs={24}>
              <Form.Item label="Warehouse">
                <SelectField
                  name="warehouse"
                  control={control}
                  labelInValue={true}
                  options={warehouses?.map(item => ({ value: item.id, label: item.name }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                validateStatus={errors?.quantity && 'error'}
                hasFeedback
                help={errors?.quantity?.message}
                label="Quantity"
              >
                <NumberFormatField allowNegative={false} thousandSeparator isNumericString name="quantity" control={control} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Unit Price">
                <NumberFormatField
                  allowNegative={false}
                  thousandSeparator
                  isNumericString
                  name="unitPrice"
                  control={control}
                  disabled
                  suffix=" VND"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Total Price">
                <NumberFormatField
                  allowNegative={false}
                  thousandSeparator
                  isNumericString
                  name="totalPrice"
                  control={control}
                  disabled
                  suffix=" VND"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Space>
                <Button onClick={handleCloseModal} icon={<CloseOutlined />}>
                  Back
                </Button>
                <Button onClick={handleSubmit(handleSaveClicked)} icon={<SaveOutlined />} type="primary">
                  Save Changes
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

interface Props extends WithDataProps {}

export interface GoodsPOReceiptItemForm extends Omit<GoodsPOReceiptItemAddEdit, 'warehouseId'> {
  purchasePriceName: string;
  itemName: string;
  uoMName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warehouseName?: string;
  warehouseId?: string;
  batchNo: string;
}
const ItemAddEditFormList = (props: Props) => {
  const { warehouses } = props;
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const goodsPOReceiptFormList = useAppSelector(s => s.goodsPOReceipt.goodsPOReceiptFormList);
  const { data: itemList } = useGetItemsForGoodsPOReceiptQuery(id ?? skipToken);
  const columns: ColumnsType<GoodsPOReceiptItemForm> = [
    {
      title: 'Ware house',
      dataIndex: 'warehouseName',
      ellipsis: true,
    },
    {
      title: 'Price Name',
      dataIndex: 'purchasePriceName',
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
    {
      title: 'Action',
      width: 100,
      ellipsis: true,
      align: 'center',
      render: (_: any, record: GoodsPOReceiptItemForm) => <ActionCell warehouses={warehouses} goodsPOReceiptItem={record} />,
    },
  ];
  React.useEffect(() => {
    if (itemList !== undefined) {
      const goodsPOReceiptFormList: GoodsPOReceiptItemForm[] = itemList.map(item => ({
        purchaseOrderItemId: item.purchaseOrderItemId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        purchasePriceId: item.purchasePriceId,
        purchasePriceName: item.purchasePriceName,
        uoMId: item.uoMId,
        uoMName: item.uoMName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        batchNo: item.batchNo,
        warehouseId: item.warehouseId,
        warehouseName: item.warehouseName,
      }));
      dispatch(addGoodsPOReceiptFormList(goodsPOReceiptFormList));
    }
  }, [dispatch, itemList]);
  return (
    <Table<GoodsPOReceiptItemForm>
      rowKey={record => record.purchaseOrderItemId}
      columns={columns}
      bordered
      scroll={{ x: 1000 }}
      dataSource={goodsPOReceiptFormList}
      size="small"
      tableLayout="fixed"
    />
  );
};

export default withData(ItemAddEditFormList);

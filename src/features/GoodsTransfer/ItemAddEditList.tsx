import { DeleteOutlined, EditOutlined, RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useToggle } from 'ahooks';
import { Button, Dropdown, Form, Menu, Modal, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useConfirmGoodsTransferItemsMutation, useGetGoodsTransferItemsQuery } from 'api/goodsTransferApi';
import { SelectField, TextField } from 'components';
import withData, { WithDataProps } from 'Hocs/withData';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { addTransferItemAddEditList, deleteTransferItemAddEdit, editTransferItemAddEdit } from './slice';

interface ActionCellProps {
  goodsTransfer: GoodsTransferItemAddEditType;
  warehouses?: Warehouse[];
}
interface FormValueType1 {
  warehouseReceipt: { label: string; value: string };
}
interface FormValueType2 {
  quantityReceipt: number;
  quantityVar: number;
}
const ActionCell = (props: ActionCellProps) => {
  const { goodsTransfer, warehouses } = props;
  const dispatch = useAppDispatch();
  const { mode } = useParams<{ mode: string }>();
  const [confirmGoodsTranferItem] = useConfirmGoodsTransferItemsMutation();
  const isDisabledDropdown = React.useMemo(() => {
    if (mode !== 'confirm') return false;
    if (warehouses === undefined) return true;
    if (goodsTransfer.confirmById !== null) return true;
    const index = warehouses.findIndex(x => x.id === goodsTransfer.warehouseIdReceipt);
    if (index >= 0) return false;
    return true;
  }, [warehouses, goodsTransfer, mode]);
  const { control, handleSubmit, reset } = useForm<FormValueType1 | FormValueType2>();
  const [openModal, { toggle }] = useToggle();

  const handleSave: SubmitHandler<FormValueType1 | FormValueType2> = async formValue => {
    if ('warehouseReceipt' in formValue) {
      const transferItemAddEdit = {
        ...goodsTransfer,
        warehouseIdReceipt: formValue.warehouseReceipt.value,
        warehouseNameReceipt: formValue.warehouseReceipt.label,
      };
      dispatch(editTransferItemAddEdit(transferItemAddEdit));
    } else {
      const transferItemAddEdit = {
        ...goodsTransfer,
        quantityReceipt: formValue.quantityReceipt,
        quantityVar: formValue.quantityVar,
      };
      dispatch(editTransferItemAddEdit(transferItemAddEdit));
    }
    toggle();
  };
  const handleDeleteClicked = () => {
    dispatch(deleteTransferItemAddEdit(goodsTransfer));
  };
  const handleConfirmClicked = async () => {
    await confirmGoodsTranferItem({ id: goodsTransfer.goodsTransferId!, itemId: goodsTransfer.id! }).unwrap();
  };
  const form =
    mode === 'confirm' ? (
      <Form layout="vertical">
        <Form.Item required label="Quantity Receipt">
          <TextField control={control} name="quantityReceipt" />
        </Form.Item>
        <Form.Item required label="Variant">
          <TextField control={control} name="quantityVar" />
        </Form.Item>
      </Form>
    ) : (
      <Form layout="vertical">
        <Form.Item required label="Warehouse Receipt">
          <SelectField
            labelInValue={true}
            options={warehouses?.map(x => ({ label: x.name, value: x.id }))}
            control={control}
            name="warehouseReceipt"
          />
        </Form.Item>
      </Form>
    );
  const handleClick = ({ key }: { key: string }) => {
    if (key === 'Delete') {
      handleDeleteClicked();
    }
    if (key === 'Edit') {
      toggle();
    }
  };
  const menu = (
    <Menu onClick={handleClick}>
      {mode === 'confirm' && (
        <Menu.Item icon={<EditOutlined />} key="Edit">
          Edit
        </Menu.Item>
      )}
      {mode !== 'confirm' && (
        <Menu.Item icon={<DeleteOutlined />} key="Delete">
          Delete
        </Menu.Item>
      )}
    </Menu>
  );
  React.useEffect(() => {
    if (openModal === false) reset();
  }, [reset, openModal]);
  return (
    <React.Fragment>
      <Dropdown.Button
        disabled={isDisabledDropdown}
        onClick={mode === 'confirm' ? handleConfirmClicked : () => toggle()}
        overlay={menu}
        size="small"
      >
        {mode === 'confirm' ? 'Confirm' : 'Edit'}
      </Dropdown.Button>
      <Modal style={{ top: 20 }} onCancel={() => toggle()} visible={openModal} destroyOnClose footer={null} title="Edit">
        {form}
        <Space>
          <Button icon={<RollbackOutlined />} onClick={() => toggle()}>
            Back
          </Button>
          <Button icon={<SaveOutlined />} onClick={handleSubmit(handleSave)} type="primary">
            Save Changes
          </Button>
        </Space>
      </Modal>
    </React.Fragment>
  );
};

interface Props extends WithDataProps {}

const ItemAddEditList = (props: Props) => {
  const { warehouses } = props;
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data: transferItemList, isFetching } = useGetGoodsTransferItemsQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const transferItemAddEditList = useAppSelector(s => s.goodsTransfer.transferItemAddEditList);
  const columns: ColumnsType<GoodsTransferItemAddEditType> = [
    {
      title: 'Issue',
      children: [
        {
          title: 'Item Name',
          dataIndex: 'itemName',
          ellipsis: true,
        },
        {
          title: 'Batch',
          dataIndex: 'batchNo',
          ellipsis: true,
        },
        {
          title: 'Wh Issue',
          dataIndex: 'warehouseNameIssue',
          ellipsis: true,
        },
        {
          title: 'Qty Issue',
          dataIndex: 'quantityIssue',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Receipt',
      children: [
        {
          title: 'Item Name',
          dataIndex: 'itemName',
          ellipsis: true,
        },
        {
          title: 'Batch',
          dataIndex: 'batchNo',
          ellipsis: true,
        },
        {
          title: 'Ws Receipt',
          dataIndex: 'warehouseNameReceipt',
          ellipsis: true,
        },
        {
          title: 'Qty Receipt',
          dataIndex: 'quantityReceipt',
          ellipsis: true,
        },
        {
          title: 'Variant',
          dataIndex: 'quantityVar',
          ellipsis: true,
        },
        {
          title: 'Action',
          ellipsis: true,
          align: 'center',
          width: 100,
          render: (v, record) => <ActionCell goodsTransfer={record} warehouses={warehouses} />,
        },
      ],
    },
  ];
  React.useEffect(() => {
    if (transferItemList !== undefined) {
      const transferItemAddEditList: GoodsTransferItemAddEditType[] = transferItemList.map(x => ({
        batchNo: x.batchNo,
        confirmById: x.confirmById,
        goodsTransferId: x.goodsTransferId,
        goodsPOReceiptId: x.goodsPOReceiptId,
        goodsPOReceiptItemId: x.goodsPOReceiptItemId,
        itemCode: x.itemCode,
        itemName: x.itemName,
        quantityIssue: x.quantityIssue,
        quantityReceipt: x.quantityReceipt,
        warehouseIdIssue: x.warehouseIdIssue,
        warehouseNameIssue: x.warehouseNameIssue,
        id: x.id,
        quantityVar: x.quantityVar,
        warehouseIdReceipt: x.warehouseIdReceipt,
        warehouseNameReceipt: x.warehouseNameReceipt,
      }));
      dispatch(addTransferItemAddEditList(transferItemAddEditList));
    }
  }, [dispatch, transferItemList]);
  return (
    <Table<GoodsTransferItemAddEditType>
      bordered
      columns={columns}
      dataSource={transferItemAddEditList}
      size="small"
      tableLayout="fixed"
      loading={isFetching}
      scroll={{ x: 1000 }}
    />
  );
};

export default withData(ItemAddEditList);

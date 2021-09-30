import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Table, TableProps, Tooltip } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { TextField } from 'components';
import { TableComponents } from 'rc-table/lib/interface';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import './EditableTable.css';

interface TableContextProps {
   validationSchema?: any;
}

const TableContext = React.createContext<TableContextProps>({ validationSchema: '' });

const EditableRow = ({ index, ...props }: any) => {
   const { validationSchema } = React.useContext(TableContext);
   const methods = useForm(
      validationSchema && {
         resolver: yupResolver(validationSchema),
      }
   );
   return (
      <FormProvider {...methods}>
         <tr {...props} />
      </FormProvider>
   );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }: any) => {
   const [editing, setEditing] = useState(false);
   console.log('dataIndex', dataIndex);
   const inputRef = useRef<any>();
   const {
      control,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useFormContext();
   const toggleEdit = () => {
      setEditing(!editing);
   };

   const save = async (data: any) => {
      try {
         toggleEdit();
         handleSave(dataIndex as string, { ...record, ...data });
      } catch (errInfo) {
         console.log('Save failed:', errInfo);
      }
   };

   let childNode = children;

   if (editable) {
      childNode = editing ? (
         <Tooltip visible={errors?.[dataIndex as string] ? true : false} title={errors?.[dataIndex as string]?.message}>
            <Form.Item
               style={{
                  margin: 0,
               }}
            >
               <TextField
                  name={dataIndex as string}
                  control={control}
                  ref={inputRef}
                  onPressEnter={handleSubmit(save)}
                  onBlur={handleSubmit(save)}
               />
            </Form.Item>
         </Tooltip>
      ) : (
         <div
            className="editable-cell-value-wrap"
            style={{
               paddingRight: 24,
               height: 32,
            }}
            onClick={toggleEdit}
         >
            {children}
         </div>
      );
   }
   useEffect(() => {
      if (dataIndex) {
         setValue(dataIndex, record[dataIndex]);
      }
   }, [dataIndex, record, setValue]);

   useEffect(() => {
      if (editing) {
         inputRef.current.focus();
      }
   }, [editing, inputRef]);
   return <td {...restProps}>{childNode}</td>;
};

interface ColumnTypeCustom<T> extends ColumnType<T> {
   editable?: boolean;
}
interface ColumnGroupTypeCustom<T> extends Omit<ColumnGroupType<T>, 'children'> {
   children: ColumnTypes<T>;
}

export type ColumnTypes<T> = (ColumnGroupTypeCustom<T> | ColumnTypeCustom<T>)[];
interface EditableTableProps<T> extends Omit<TableProps<T>, 'columns'> {
   onEditRow: (name: any, row: any) => void;
   validationSchema?: any;
   columns: ColumnTypes<T>;
   dataSource: any[];
}

const EditableTable = <T extends object>({
   dataSource,
   columns,
   onEditRow,
   validationSchema,
   ...restProps
}: EditableTableProps<T>): JSX.Element => {
   const handleSave = (name: any, row: any) => {
      onEditRow(name, row);
   };
   const components: TableComponents<any> = {
      body: {
         row: EditableRow,
         cell: EditableCell,
      },
   };
   const cols = columns!.map((col: any) => {
      if (!col.editable) {
         return col;
      }

      return {
         ...col,
         onCell: (record: any) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: handleSave,
         }),
      };
   });
   console.log('cols', cols);
   return (
      <TableContext.Provider value={{ validationSchema }}>
         <Table<T>
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={cols}
            {...restProps}
         />
      </TableContext.Provider>
   );
};

export { EditableTable };


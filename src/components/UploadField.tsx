import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useController, UseControllerProps } from 'react-hook-form';
const { Dragger } = Upload;
interface DefaultDraggerProps extends React.ComponentPropsWithRef<typeof Dragger> {}
interface DraggerProps<T> extends Omit<DefaultDraggerProps, 'name' | 'defaultValue'>, UseControllerProps<T> {}

const DraggerField = <T extends Record<string, any>>(props: DraggerProps<T>) => {
  const { name, control, ...restProps } = props;
  const { field } = useController({ name, control });
  const draggerProps = {
    name: 'image',
    multiple: true,
    beforeUpload: (file: RcFile) => {
      console.log('fil', file);
      field.onChange(file);
      return false;
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      console.log('Dropped files', e.dataTransfer.files);
      field.onChange(e.dataTransfer.files[0]);
    },
  };
  return (
    <Dragger {...draggerProps} {...restProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to image</p>
      <p className="ant-upload-hint">Support for a single or bulk upload</p>
    </Dragger>
  );
};

export { DraggerField };


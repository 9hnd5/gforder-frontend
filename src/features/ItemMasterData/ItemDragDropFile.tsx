import { InboxOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { Modal, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { useGetItemMasterDataQuery } from 'api/itemMasterDataApi';
import { useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { useParams } from 'react-router-dom';
import { selectCopyId } from './slice';
const { Dragger } = Upload;

interface ItemDragDropFileProps {
  onChange: (file: any) => void;
}
function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}
// function getBase64(file: RcFile) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }

const ItemDragDropFile = (props: ItemDragDropFileProps) => {
  const { onChange } = props;
  const { itemCode } = useParams<{ itemCode?: string }>();
  const copyId = useAppSelector(selectCopyId);
  const { item } = useGetItemMasterDataQuery(null, {
    selectFromResult: x => {
      return { item: x.data?.find(y => y.itemCode === itemCode || y.itemCode === copyId) };
    },
  });
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [preview, setPreview] = React.useState({ visible: false, image: '', title: 'Preview' });
  const handlePreviewImage = async (file: UploadFile<any>) => {
    setPreview({
      ...preview,
      image: file.thumbUrl ?? '',
      visible: true,
    });
  };
  const handleClosePreview = () => {
    setPreview({ ...preview, visible: false });
  };
  const draggerProps = {
    name: 'image',
    multiple: true,
    fileList,
    maxCount: 1,
    beforeUpload: (file: RcFile) => false,
    onChange: (info: UploadChangeParam<UploadFile<any>>) => {
      const { fileList, file } = info;
      setFileList(fileList);
      onChange(file);
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      const {
        dataTransfer: { files },
      } = e;
      onChange(files[0] as RcFile);
    },
    onPreview: handlePreviewImage,
  };
  React.useEffect(() => {
    async function convert() {
      if (item !== undefined && item.image) {
        const { image, imageName, imageType } = item;
        const blob = dataURItoBlob(image);
        const file = {
          uid: nanoid(),
          name: imageName,
          type: imageType,
          originFileObj: new File([blob], imageName, { type: blob.type }) as RcFile,
          percent: 100,
          preview: image,
          thumbUrl: image,
        };
        setFileList(s => [...s, file]);
      }
    }
    convert();
  }, [item]);
  return (
    <React.Fragment>
      <Dragger onRemove={f => console.log(f)} listType="picture" {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to image</p>
        <p className="ant-upload-hint">Support for a single or bulk upload</p>
      </Dragger>
      <Modal style={{ top: 20 }} visible={preview.visible} title={preview.title} footer={null} onCancel={handleClosePreview}>
        <img alt="example" style={{ width: '100%' }} src={preview.image} />
      </Modal>
    </React.Fragment>
  );
};

export default ItemDragDropFile;

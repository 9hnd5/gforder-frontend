import { Tag } from 'antd';
import React from 'react';

interface Props {
   id?: number;
   name?: string;
}
const PurchaseStatus: React.FC<Props> = ({ id, name }) => {
   if (id === 1)
      return (
         <Tag style={{ width: 80 }} color="gold">
            {name}
         </Tag>
      );
   else if (id === 2)
      return (
         <Tag style={{ width: 80 }} color="lime">
            {name}
         </Tag>
      );
   else if (id === 3)
      return (
         <Tag style={{ width: 80 }} color="green">
            {name}
         </Tag>
      );
   else if (id === 4)
      return (
         <Tag style={{ width: 80 }} color="red">
            {name}
         </Tag>
      );
   else return <Tag color="purple">{name}</Tag>;
};

export default PurchaseStatus;

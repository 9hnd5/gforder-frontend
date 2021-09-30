import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

interface UserOrderStatusProps {
  userOrderStatus: UserOrderStatus;
}
enum STATUS_COLOR {
  DRAFT = 'default',
  WAITING = 'processing',
  SUCCESS = 'success',
  CANCEL = 'error',
}
const UserOrderStatus = (props: UserOrderStatusProps) => {
  const { id, name } = props.userOrderStatus;
  let color = '';
  let icon = null;
  const renderStatus = () => {
    switch (id) {
      case 1:
        color = STATUS_COLOR.DRAFT;
        icon = <ExclamationCircleOutlined />;
        break;
      case 2:
        color = STATUS_COLOR.WAITING;
        icon = <ClockCircleOutlined />;
        break;
      case 3:
        color = STATUS_COLOR.SUCCESS;
        icon = <CheckCircleOutlined />;
        break;
      default:
        color = STATUS_COLOR.CANCEL;
        icon = <CloseCircleOutlined />;
        break;
    }
    return (
      <Tag style={{ width: '100%' }} icon={icon} color={color}>
        {name}
      </Tag>
    );
  };
  return renderStatus();
};
export default UserOrderStatus;

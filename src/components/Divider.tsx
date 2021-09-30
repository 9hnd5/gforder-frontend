import styled from 'styled-components';
import { Divider as D, DividerProps } from 'antd';

const DividerStyle = styled(D)`
   margin: 0px 4px !important;
`;

interface Props extends DividerProps {}

const Divider = (props: Props) => {
   return <DividerStyle {...props} />;
};
export { Divider };

import { Avatar, Col, Row, Select, Space, Spin, Typography } from 'antd';
import { useLazyGetItemsForUserQuery } from 'api/userApi';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch } from 'hooks/reduxHooks';
import { debounce } from 'lodash';
import React from 'react';
import { addedUserOrderItem } from './slice';

const { Option } = Select;

const UserOrderItemListSearchBar = () => {
  const { user } = React.useContext(AuthContext);
  const dispatch = useAppDispatch();
  const [fetch, { data, isFetching }] = useLazyGetItemsForUserQuery();

  const debounceSearch = React.useRef(
    debounce(value => {
      if (value) {
        const params = { itemCode: { eq: value } };
        fetch({ id: user.id, params });
      }
    }, 1000)
  );

  const renderOptions = data?.map(x => (
    <Option label={x.item.itemName} key={x.id} value={x.id}>
      <Space>
        <Avatar src={x.item.image} />
        <Space direction="vertical">
          <Typography.Text strong>{x.item.itemName}</Typography.Text>
          <Typography.Text type="secondary">
            {x.unitPrice}/{x.item.uoMName}
          </Typography.Text>
        </Space>
      </Space>
    </Option>
  ));

  const handleSelected = (value: any) => {
    const userPriceItem = data?.find(x => x.id === value);
    if (userPriceItem !== undefined) {
      const { item, unitPrice } = userPriceItem;
      const userOrderItem = {
        key: item.itemCode,
        item: item,
        unitPrice: unitPrice,
        quantity: 1,
        totalPrice: unitPrice,
      };
      dispatch(addedUserOrderItem(userOrderItem as UserOrderItemType));
    }
  };

  const handleSearch = (value: string) => debounceSearch.current(value);

  return (
    <Row gutter={[2, 2]}>
      <Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
        <Select
          onSearch={handleSearch}
          onSelect={handleSelected}
          showSearch
          placeholder="Search Item"
          optionLabelProp="label"
          style={{ width: '100%' }}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
        >
          {renderOptions}
        </Select>
      </Col>
    </Row>
  );
};
export default UserOrderItemListSearchBar;

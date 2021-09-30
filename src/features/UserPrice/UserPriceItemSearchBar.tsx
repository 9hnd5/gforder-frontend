import { Avatar, Col, Row, Select, Space, Spin, Typography } from 'antd';
import { useLazyGetItemMasterDataQuery } from 'api/itemMasterDataApi';
import { AuthContext } from 'Hocs/withAuthorize';
import { useAppDispatch } from 'hooks/reduxHooks';
import { debounce } from 'lodash';
import React from 'react';
import { addedUserPriceItem } from './slice';

const { Option } = Select;

const UserPriceItemSearchBar = () => {
  const { user } = React.useContext(AuthContext);
  const dispatch = useAppDispatch();
  const [fetch, { data, isFetching }] = useLazyGetItemMasterDataQuery();

  const debounceSearch = React.useRef(
    debounce(value => {
      if (value) {
        const params = { itemCode: { eq: value } };
        fetch({ id: user.id, params });
      }
    }, 1000)
  );

  const renderOptions = data?.map(x => (
    <Option label={x.itemName} key={x.itemCode} value={x.itemCode}>
      <Space>
        <Avatar src={x.image} />
        <Space direction="vertical">
          <Typography.Text strong>{x.itemName}</Typography.Text>
          <Typography.Text type="secondary">{x.uoMName}</Typography.Text>
        </Space>
      </Space>
    </Option>
  ));

  const handleSelected = (value: any) => {
    const item = data?.find(x => x.itemCode === value);
    if (item !== undefined) {
      const userPriceItem = {
        item,
        unitPrice: 1,
      } as UserPriceItemType;
      dispatch(addedUserPriceItem(userPriceItem));
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
export default UserPriceItemSearchBar;

import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import UserPriceAddEdit from './UserPriceAddEdit';
import UserPriceList from './UserPriceList';

const UserPrice = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/price-list`} exact render={props => <UserPriceList basePath={path} {...props} />} />
      <Route path={`${path}/price-list/add-edit/:id?`} exact render={props => <UserPriceAddEdit basePath={path} {...props} />} />
    </Switch>
  );
};
export default withAuthorize(MENU.USER_PRICE)(UserPrice);

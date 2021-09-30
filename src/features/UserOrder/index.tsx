import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { Route, Switch, useRouteMatch } from 'react-router';
import UserOrderList from './UserOrderList';
import UserOrderAddEdit from './UserOrderAddEdit';
import UserOrderDetail from './UserOrderDetail';

const Order = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}/list`} render={props => <UserOrderList basePath={path} {...props} />} />
      <Route exact path={`${path}/add-edit/:id?`} render={props => <UserOrderAddEdit {...props} />} />
      <Route exact path={`${path}/detail/:id`} render={props => <UserOrderDetail {...props} />} />
    </Switch>
  );
};

export default withAuthorize(MENU.ORDER)(Order);

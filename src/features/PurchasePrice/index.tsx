import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AddEdit from './AddEdit';
import Detail from './Detail';
import List from './List';

const PurchasePrice = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/list`} exact render={props => <List basePath={path} {...props} mode="list" />} />
      <Route path={`${path}/approve-list`} exact render={props => <List basePath={path} {...props} mode="approve-list" />} />
      <Route path={`${path}/add-edit/:id?`} exact component={AddEdit} />
      <Route path={`${path}/detail/:id`} exact component={Detail} />
    </Switch>
  );
};
export default withAuthorize(MENU.PURCHASE_PRICE)(PurchasePrice);

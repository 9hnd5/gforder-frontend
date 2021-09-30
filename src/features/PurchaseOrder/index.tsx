import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import PurchaseOrderAddEdit from './PurchaseOrderAddEdit';
import PurchaseOrderDetail from './PurchaseOrderDetail';
import PurchaseOrderList from './PurchaseOrderList';

const PurchaseOrder = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/list`} exact render={props => <PurchaseOrderList {...props} mode="list" basePath={path} />} />
      <Route path={`${path}/detail/:id`} exact render={props => <PurchaseOrderDetail {...props} basePath={path} />} />
      <Route path={`${path}/add-edit/:id?`} exact render={props => <PurchaseOrderAddEdit {...props} basePath={path} />} />
      <Route
        path={`${path}/approved-list`}
        exact
        render={props => <PurchaseOrderList {...props} mode="approve-list" basePath={path} />}
      />
    </Switch>
  );
};
export default withAuthorize(MENU.PURCHASE_ORDER)(PurchaseOrder);

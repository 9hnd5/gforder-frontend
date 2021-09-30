import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import PurchaseRequestAddEdit from './PurchaseRequestAddEdit';
import PurchaseRequestDetail from './PurchaseRequestDetail';
import PurchaseRequestList from './PurchaseRequestList';

const PurchaseRequest = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/list`} exact render={props => <PurchaseRequestList {...props} mode="list" basePath={path} />} />
      <Route path={`${path}/detail/:id`} exact render={props => <PurchaseRequestDetail {...props} basePath={path} />} />
      <Route path={`${path}/add-edit/:id?`} exact render={props => <PurchaseRequestAddEdit {...props} basePath={path} />} />
      <Route
        path={`${path}/approved-list`}
        exact
        render={props => <PurchaseRequestList {...props} mode="approve-list" basePath={path} />}
      />
    </Switch>
  );
};
export default withAuthorize(MENU.PURCHASE_REQUEST)(PurchaseRequest);

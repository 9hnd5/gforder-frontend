import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AddEdit from './AddEdit';
import Detail from './Detail';
import List from './List';

const GoodsPOReceipt = () => {
   const { path } = useRouteMatch();
   return (
      <Switch>
         <Route path={path} exact render={props => <List {...props} basePath={path} />} />
         <Route path={`${path}/add-edit/:id?`} exact render={props => <AddEdit {...props} basePath={path} />} />
         <Route path={`${path}/Detail/:id`} exact render = {props => <Detail {...props} basePath={path} />} />
      </Switch>
   );
};
export default withAuthorize(MENU.GOODS_PO_RECEIPT)(GoodsPOReceipt);

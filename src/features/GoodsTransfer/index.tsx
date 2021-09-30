import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AddEdit from './AddEdit';
import Detail from './Detail';
import List from './List';

const GoodsTransfer = () => {
   const { path } = useRouteMatch();
   return (
      <Switch>
         <Route exact path={`${path}/list`} render={props => <List {...props} mode="list" basePath={path} />} />
         <Route
            exact
            path={`${path}/confirm-list`}
            render={props => <List {...props} basePath={path} mode="confirm" />}
         />
         <Route exact path={`${path}/add-edit/:id?/:mode?`} component={AddEdit} />
         <Route exact path={`${path}/detail/:id`} component={Detail} />
      </Switch>
   );
};
export default withAuthorize(MENU.GOODS_TRANSFER)(GoodsTransfer);

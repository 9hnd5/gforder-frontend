import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import ItemAddEdit from './ItemAddEdit';
import ItemDetail from './ItemDetail';
import ItemList from './Itemlist';
const Item = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/list`} exact render={props => <ItemList {...props} basePath={path} />} />
      <Route path={`${path}/add-edit/:itemCode?`} exact render={props => <ItemAddEdit {...props} basePath={path} />} />
      <Route path={`${path}/detail/:itemCode?`} exact render={props => <ItemDetail {...props} basePath={path} />} />
    </Switch>
  );
};
export default withAuthorize(MENU.ITEM)(Item);

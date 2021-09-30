import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import UserList from './UserList';
import UserAddEdit from './UserAddEdit';
import UserDetail from './UserDetail';
const User = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/list`} exact render={props => <UserList {...props} basePath={path} />} />
      <Route path={`${path}/detail/:id`} exact render={props => <UserDetail {...props} basePath={path} />} />
      <Route path={`${path}/add-edit/:id?`} render={props => <UserAddEdit {...props} basePath={path} />} />
    </Switch>
  );
};

export default withAuthorize(MENU.USER)(User);

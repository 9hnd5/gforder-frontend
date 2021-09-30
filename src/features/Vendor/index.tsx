import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import List from './List';
import AddEdit from './AddEdit';

const Vendor: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} exact render={props => <List {...props} basePath={path} />} />
      <Route path={`${path}/add-edit/:id?`} exact render={props => <AddEdit {...props} basePath={path} />} />
      <Route path={`${path}/detail/:id`} exact render={props => <List {...props} basePath={path} />} />
    </Switch>
  );
};

export default withAuthorize(MENU.VENDOR)(Vendor);

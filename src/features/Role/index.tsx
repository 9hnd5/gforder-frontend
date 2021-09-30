import { MENU } from 'constants/menu';
import withAuthorize from 'Hocs/withAuthorize';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Roles from './Roles';
const Role = () => {
   const match = useRouteMatch();
   return (
      <Switch>
         <Route path={match?.path} exact component={Roles} />
      </Switch>
   );
};

export default withAuthorize(MENU.ROLE)(Role);

import { Route, Switch, useRouteMatch } from 'react-router-dom';
import LoginForm from './LoginForm';

export default function Authentication() {
   const match = useRouteMatch();
   return (
      <Switch>
         <Route path={match?.path} exact component={LoginForm} />
      </Switch>
   );
}

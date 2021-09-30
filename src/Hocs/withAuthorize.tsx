import { PERMISSION_TYPE } from 'constants/permission';
import { Permission, User } from 'features/Authentication/type';
import hasPermission from 'helpers/hasPermission';
import { useAppSelector } from 'hooks/reduxHooks';
import React from 'react';

type Auth = {
  user: User;
  permissions: Permission[];
};

export const AuthContext = React.createContext<Auth>({} as Auth);

const withAuthorize = (menuName: string) => {
  return function (Component: any) {
    return function (props: any) {
      const { user, permissions: totalPermissions } = useAppSelector(s => s.authentication.auth);
      const permissions = totalPermissions?.filter(p => {
        return p.name.startsWith(menuName);
      });
      const viewPermission = permissions?.find(p => p.name.includes(PERMISSION_TYPE.VIEW));
      const fullPermission = permissions?.find(p => p.name.includes(PERMISSION_TYPE.FULL));
      return (
        (hasPermission(fullPermission, permissions) || hasPermission(viewPermission, permissions)) && (
          <AuthContext.Provider value={{ user: user, permissions: permissions }}>
            <Component {...props} />
          </AuthContext.Provider>
        )
      );
    };
  };
};

export default withAuthorize;

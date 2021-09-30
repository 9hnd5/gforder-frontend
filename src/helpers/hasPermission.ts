import { Permission } from 'features/Authentication/type';
import { find } from 'lodash';

export default function hasPermission(permission: Permission | string | undefined, permissions: Permission[]) {
   if (typeof permission === 'object') {
      return find(permissions, item => item === permission) ? true : false;
   }
   if (typeof permission === 'string') {
      for (const p of permissions) {
         if (p.name.includes(permission)) return true;
      }
   }
   return false;
}

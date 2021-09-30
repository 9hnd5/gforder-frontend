import { Select } from 'antd';
import { useController, UseControllerProps } from 'react-hook-form';

type DefaultSelectProps = React.ComponentPropsWithRef<typeof Select>;
type SelectFieldProps<T> = Omit<DefaultSelectProps, 'name' | 'defaultValue'> & UseControllerProps<T>;

const SelectField = <T extends Record<string, any>>(props: SelectFieldProps<T>) => {
   const { name, control, defaultValue, children, ...restProps } = props;
   const { field } = useController({ control, name, defaultValue });
   return (
      <Select {...field} {...restProps}>
         {children}
      </Select>
   );
};
export { SelectField };

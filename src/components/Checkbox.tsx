import { Checkbox } from 'antd';
import { useController, UseControllerProps } from 'react-hook-form';
const { Group } = Checkbox;

interface DefaultCheckboxProps extends React.ComponentPropsWithoutRef<typeof Checkbox> {}
interface CheckboxFieldProps<T> extends Omit<DefaultCheckboxProps, 'name'>, UseControllerProps<T> {}

const CheckboxField = <T extends Record<string, any>>(props: CheckboxFieldProps<T>) => {
  const { name, control, children, defaultValue, ...restProps } = props;
  const {
    field: { value, ...rest },
  } = useController({ name, control, defaultValue });
  return (
    <Checkbox checked={value} {...rest} {...restProps}>
      {children}
    </Checkbox>
  );
};

interface DefaultCheckboxGroupProps extends React.ComponentPropsWithoutRef<typeof Group> {}
interface CheckboxGroupFieldProps<T> extends Omit<DefaultCheckboxGroupProps, 'name' | 'defaultValue'>, UseControllerProps<T> {}

const CheckboxGroupField = <T extends Record<string, any>>(props: CheckboxGroupFieldProps<T>) => {
  const { name, control, defaultValue, ...restProps } = props;
  const { field } = useController({ name, control, defaultValue });
  return <Group {...field} {...restProps} />;
};

export { CheckboxField, CheckboxGroupField };

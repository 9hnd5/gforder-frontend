import { Input } from 'antd';
import { useController, UseControllerProps } from 'react-hook-form';
const { Password, TextArea } = Input;

interface DefaultInputProps extends React.ComponentPropsWithRef<typeof Input> {}
interface TextFieldProps<T> extends Omit<DefaultInputProps, 'name' | 'defaultValue'>, UseControllerProps<T> {}
const TextField = <T extends Record<string, any>>(props: TextFieldProps<T>) => {
   const { name, control, defaultValue, ...restProps } = props;
   const { field } = useController({ name, control, defaultValue });
   return <Input {...field} {...restProps} />;
};

interface DefaultPasswordFieldProps extends React.ComponentPropsWithRef<typeof Password> {}
interface PasswordProps<T> extends Omit<DefaultPasswordFieldProps, 'name' | 'defaultValue'>, UseControllerProps<T> {}
const PasswordField = <T extends Record<string, any>>(props: PasswordProps<T>) => {
   const { name, control, defaultValue, ...restProps } = props;
   const { field } = useController({ name, control, defaultValue });
   return <Input.Password {...field} {...restProps} />;
};

interface DefaultTextAreaFielProps extends React.ComponentPropsWithRef<typeof TextArea> {}
interface TextAreaFieldProps<T>
   extends Omit<DefaultTextAreaFielProps, 'name' | 'defaultValue'>,
      UseControllerProps<T> {}

const TextAreaField = <T extends Record<string, any>>(props: TextAreaFieldProps<T>) => {
   const { name, control, defaultValue, ...restProps } = props;
   const { field } = useController({ name, control, defaultValue });
   return <Input.TextArea {...field} {...restProps} />;
};

export { TextField, PasswordField, TextAreaField };

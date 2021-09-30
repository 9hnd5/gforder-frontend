import { Radio } from 'antd';
import { useController, UseControllerProps } from 'react-hook-form';
const { Group } = Radio;

interface DefaultRadioProps extends React.ComponentPropsWithoutRef<typeof Radio> {}
interface RadioProps<T> extends Omit<DefaultRadioProps, 'name' | 'defaultValue'>, UseControllerProps<T> {}

const RadioField = <T extends Record<string, any>>(props: RadioProps<T>) => {
   const { name, control, defaultValue, ...restProps } = props;
   const { field } = useController({ name, control, defaultValue });
   return <Radio {...field} {...restProps} />;
};

interface DefaultRadioGroupProps extends React.ComponentPropsWithoutRef<typeof Group> {}
interface RadioGroupProps<T> extends Omit<DefaultRadioGroupProps, 'name' | 'defaultValue'>, UseControllerProps<T> {}

const RadioGroupField = <T extends Record<string, any>>(props: RadioGroupProps<T>) => {
   const { name, control, defaultValue, ...restProps } = props;
   const { field } = useController({ control, name, defaultValue });
   return <Group {...field} {...restProps} />;
};

export { RadioField, RadioGroupField };


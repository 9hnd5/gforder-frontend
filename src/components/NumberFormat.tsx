import { Input } from 'antd';
import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import NumberFormat from 'react-number-format';

interface DefaultInputProps extends React.ComponentPropsWithRef<typeof Input> {}
const TextField = (props: DefaultInputProps) => {
  return <Input {...props} />;
};

interface DefaultNumberFormatProps extends React.ComponentPropsWithRef<typeof NumberFormat> {}
interface NumberFormatProps<T> extends Omit<DefaultNumberFormatProps, 'name' | 'defaultValue'>, UseControllerProps<T> {}
const NumberFormatField = <T extends Record<string, any>>(props: NumberFormatProps<T>) => {
  const { control, name, defaultValue, ...restProps } = props;
  const { field } = useController({ control, name, defaultValue });
  return (
    <NumberFormat
      onValueChange={value => field.onChange(value.floatValue)}
      value={field.value}
      customInput={TextField}
      {...restProps}
    />
  );
};

export { NumberFormatField };

import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useMemo } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

type DefaultDatePickerProps = React.ComponentPropsWithRef<typeof DatePicker>;
type DatePickerFieldProps<T> = Omit<DefaultDatePickerProps, 'name' | 'defaultValue'> & UseControllerProps<T>;

const DatePickerField = <T extends Record<string, any>>(props: DatePickerFieldProps<T>) => {
  const { name, control, defaultValue, ...restProps } = props;
  const {
    field: { onChange, value, ...restFields },
  } = useController({
    name,
    control,
    defaultValue,
  });
  const transform = useMemo(() => {
    return {
      input: (value: any) => {
        return value && moment(value, 'YYYY-MM-DD');
      },
      output: (value: any) => {
        return value?.isValid() && value.format('YYYY-MM-DD');
      },
    };
  }, []);
  return (
    <DatePicker
      onChange={value => onChange(transform.output(value))}
      value={transform.input(value)}
      style={{ width: '100%' }}
      {...restFields}
      {...restProps}
    />
  );
};

const { RangePicker } = DatePicker;
type DefaultRangePickerProps = React.ComponentPropsWithRef<typeof RangePicker>;
type RangePickerFieldProps<T> = Omit<DefaultRangePickerProps, 'name' | 'defaultValue'> & UseControllerProps<T>;

const RangePickerField = <T extends Record<string, any>>(props: RangePickerFieldProps<T>) => {
  const { name, control, defaultValue, ...restProps } = props;
  const {
    field: { onChange, value, ...restFields },
  } = useController({
    name,
    control,
    defaultValue,
  });
  const transform = useMemo(() => {
    return {
      input: (values: [string, string]): [Moment, Moment] => {
        return values ? [moment(values[0], 'YYYY-MM-DD'), moment(values[1], 'YYYY-MM-DD')] : [moment(), moment()];
      },
      output: (values: [Moment, Moment]): [string, string] => {
        return values[0]?.isValid() && values[1]?.isValid()
          ? [values[0].format('YYYY-MM-DD'), values[1].format('YYYY-MM-DD')]
          : ['', ''];
      },
    };
  }, []);
  return (
    <RangePicker
      value={transform.input(value as [string, string])}
      onChange={dates => onChange(transform.output(dates as [Moment, Moment]))}
      {...restFields}
      {...restProps}
    />
  );
};
export { DatePickerField, RangePickerField };

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { useLocalStorageState } from 'ahooks';
import { Button, Form, Divider, Typography } from 'antd';
import { useLoginMutation } from 'api/authenticationApi';
import { CheckboxField, PasswordField, TextField } from 'components';
import { LOCAL_STORAGE } from 'constants/localStorage';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setAuth } from './slice';
import { Authentication } from './type';

export default function LoginForm() {
  const { control, handleSubmit } = useForm();
  const history = useHistory();
  const [, setUserToLocalStorage] = useLocalStorageState<Authentication>(LOCAL_STORAGE.USER);
  const dispatch = useDispatch();
  const [login, { isLoading, data, error }] = useLoginMutation();

  const handleLogin = async (data: any) => {
    await login(data).unwrap();
    history.push('/');
  };
  useEffect(() => {
    if (data) {
      setUserToLocalStorage(data);
      dispatch(setAuth(data));
    }
    if (error) {
      alert(JSON.stringify(error));
    }
  }, [data, setUserToLocalStorage, dispatch, error]);
  return (
    <PageContainer>
      <ProCard layout="center" size="small" ghost>
        <ProCard size="small" bordered colSpan={{ xs: 24, sm: 20, md: 16, lg: 12, xl: 8 }}>
          <Divider>LOGIN</Divider>
          <Form layout="vertical">
            <Form.Item required label="Email">
              <TextField prefix={<MailOutlined />} control={control} name="email" placeholder="Enter Email" />
            </Form.Item>
            <Form.Item required label="Password">
              <PasswordField prefix={<LockOutlined />} control={control} name="password" placeholder="Enter Password" />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <CheckboxField control={control} name="isRemember">
                  Remember me
                </CheckboxField>
              </Form.Item>
              <Typography.Link>Forgot password</Typography.Link>
            </Form.Item>
            <Form.Item style={{ width: '100%' }}>
              <Button block loading={isLoading} onClick={handleSubmit(handleLogin)} type="primary">
                Login
              </Button>
            </Form.Item>
          </Form>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}

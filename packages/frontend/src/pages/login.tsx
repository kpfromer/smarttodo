import { Checkbox, Input, Label } from '@rebass/forms';
import { navigate } from 'gatsby';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Text } from 'rebass';
import { Layout } from '../components/layout/layout';
import { useLoginMutation } from '../generated/types-and-hooks';
import { login } from '../utils/auth';

interface Inputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const [loginBackend, { error }] = useLoginMutation({ errorPolicy: 'all' });

  const onSubmit = async (details: Inputs) => {
    const { data } = await loginBackend({ variables: details });
    if (data) {
      login(data.login, details.rememberMe);

      navigate('/app/');
    }
  };

  return (
    <Layout>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3}>
        {!!error && <Text color="red">{error.message}</Text>}
        <Box>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" ref={register({ required: true })} />
        </Box>
        {!!errors.email && <Text color="red">Email is required.</Text>}

        <Box mt={2}>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" ref={register({ required: true })} />
        </Box>
        {!!errors.password && <Text color="red">Password is required.</Text>}

        <Label my={2}>
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            ref={register({ required: true })}
            defaultChecked
          />
          Remember Me
        </Label>
        <Box mt={2}>
          <Button type="submit">Login</Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default Login;

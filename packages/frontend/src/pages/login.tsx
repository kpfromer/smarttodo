import React from 'react';
import { Layout } from '../components/layout/layout';
import { Label, Input, Checkbox } from '@rebass/forms';
import { Box, Text, Button } from 'rebass';
import { useForm } from 'react-hook-form';
import { navigate } from 'gatsby';
import { useLoginMutation } from '../generated/types-and-hooks';
import { token } from '../store/cache';

interface Inputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const [login, { error }] = useLoginMutation({ errorPolicy: 'all' });

  const onSubmit = async (details: Inputs) => {
    const { data } = await login({ variables: details });
    if (data) {
      token(data?.login);
      if (details.rememberMe) {
        localStorage.setItem('loggedIn', 'true');
      } else {
        localStorage.setItem('loggedIn', 'false');
      }
      navigate('/app/');
    }
  };

  return (
    <Layout>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3}>
        {!!error && <Text color="red">{error.message}</Text>}
        <Box>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            ref={register({ required: true })}
          />
        </Box>
        {!!errors.email && <Text color="red">Email is required.</Text>}

        <Box mt={2}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            ref={register({ required: true })}
          />
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

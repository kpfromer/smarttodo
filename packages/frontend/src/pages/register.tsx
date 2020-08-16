import React from 'react';
import { Heading, Box, Button, Text } from 'rebass';
import { useForm } from 'react-hook-form';
import { useRegisterMutation } from '../generated/types-and-hooks';
import { token } from '../store/cache';
import { navigate } from 'gatsby';
import { Layout } from '../components/layout/layout';
import { Label, Input } from '@rebass/forms';

interface Inputs {
  email: string;
  password: string;
  passwordConfirm: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, setError, errors } = useForm<Inputs>();

  const [registerUser, { error }] = useRegisterMutation({ errorPolicy: 'all' });

  const onSubmit = async (details: Inputs) => {
    if (details.password !== details.passwordConfirm) {
      setError('passwordConfirm', {
        type: 'manual',
        message: 'Passwords must match!'
      });
      return;
    }
    const { data } = await registerUser({
      variables: { email: details.email, password: details.password }
    });
    if (data) {
      token(data.createUser);
      localStorage.setItem('loggedIn', 'true');
      navigate('/app/');
    }
  };

  return (
    <Layout>
      <Heading variant="title">Register</Heading>
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

        <Box mt={2}>
          <Label htmlFor="passwordConfirm">Confirm Password</Label>
          <Input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            ref={register({ required: 'Confirm password is required.' })}
          />
        </Box>
        {!!errors.passwordConfirm && (
          <Text color="red">{errors.passwordConfirm.message}</Text>
        )}
        <Box mt={2}>
          <Button type="submit">Register</Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { history } from '../../router/history';
import { Template } from '../../sharedComponents/Template';
import { LoadingButton } from '../../sharedComponents/LoadingButton';
import { userActions } from '../../state/actions/user';
import { alertActions } from '../../state/actions/alert';
import { useGetValidMunicipalities } from '../../sharedComponents/hooks';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  background-color: #f5f5f5;
  height: 100%;
  width: 100%;
`;

const Form = styled.form`
  max-width: 30em;
  min-width: 15em;
  display: flex;
  flex-direction: column;
  padding: 1em;
  background-color: white;
  border-radius: 0.3em;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
`;

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-right: auto;
  margin-bottom: 5px;
`;

const CheckboxTypeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ChecboxLabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const RadioText = styled.span`
  margin-left: 4px;
`;

const Input = styled.input`
  padding: 0.3em;
  font-size:1.1em;
  border-radius: 0.3em;
  border: solid 0.1em lightgrey;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 0.3em 0 0.3em 0;
`;

const Register = () => {
  // Redux state
  const userSelector = useSelector((state) => state.user);

  // State
  const municipalities = useGetValidMunicipalities();
  const domains = municipalities ? municipalities.map((mun) => mun.mailDomain) : [];
  const [email, setEmail] = useState('');
  const [type, setType] = useState(1);
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redux
  const dispatch = useDispatch();

  const validMunicipalityEmail = (_email) => {
    for (const domain of domains) { // eslint-disable-line no-restricted-syntax
      if (_email.endsWith(`@${domain}`)) {
        return true;
      }
    }
    return false;
  };

  const validEmailFormat = (_email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
    return re.test(_email);
  };

  const validPasswordFormat = (_password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/; // eslint-disable-line no-useless-escape
    return re.test(_password);
  };

  // check if the logging in is initalized or loggedIn is initilized
  // if they arent then the button is set back to loading
  // Essentially this means the loading will stop on logging error
  useEffect(() => {
    if (userSelector && !userSelector.registering) {
      setLoading(false);
    }
    if (userSelector && userSelector.registered) {
      // Clear the user object to remove "registered" as the user wont be able to register a new
      // profile as they'll just be redirected back to "/login" until "registered" is removed.
      dispatch(userActions.clearUserObject());
      // Display feedback to the user that the registration was successful
      dispatch(alertActions.success('Registration successful, redirecting in 3 seconds.'));
      // Redirect user to login after 3 seconds
      setTimeout(() => history.push('/login'),
        3000);
    }
  }, [userSelector]);

  const onChange = (e) => {
    switch (e.target.name) {
      case 'email': {
        setEmail(e.target.value);
        break;
      }
      case 'password': {
        setPassword(e.target.value);
        break;
      }
      case 'verifyPassword': {
        setVerifyPassword(e.target.value);
        break;
      }
      case 'type': {
        setType(e.target.value === 'municipality' ? 1 : 0);
        break;
      }
      default: {
        break;
      }
    }
  };

  const register = (e) => {
    e.preventDefault();

    if (type === 1 && !validMunicipalityEmail(email)) {
      dispatch(alertActions.error('Not a valid municipality email. The email must end with <your-kommune>.kommune.no (or mgk.no).'));
      return;
    }
    if (!validEmailFormat(email)) {
      dispatch(alertActions.error('The email format is incorrect, please try again.'));
      return;
    }
    if (!validPasswordFormat(password)) {
      dispatch(alertActions.error('Your password is invalid, it should consists of one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long'));
      return;
    }
    if (password !== verifyPassword) {
      dispatch(alertActions.error('Your verify password does not match your password.'));
      return;
    }

    setLoading(true);
    dispatch(userActions.register(email, password, type));
  };

  return (
    <Template>
      <Wrapper>
        <Form onSubmit={register}>
          <h1>Sign up</h1>
          <Input type="email" placeholder="Email" name="email" value={email} onChange={onChange} />
          <RadioWrapper>
            <Label htmlFor="type">Account Type:</Label>
            <CheckboxTypeWrapper>
              <ChecboxLabelWrapper>
                <input type="radio" name="type" value="municipality" checked={type === 1} onChange={onChange} />
                <RadioText>Municipality</RadioText>
              </ChecboxLabelWrapper>
              <ChecboxLabelWrapper>
                <input type="radio" name="type" value="standard" checked={type === 0} onChange={onChange} />
                <RadioText>Standard</RadioText>
              </ChecboxLabelWrapper>
            </CheckboxTypeWrapper>
          </RadioWrapper>
          <Input type="password" placeholder="Password" name="password" value={password} onChange={onChange} />
          <Input type="password" placeholder="Verify password" name="verifyPassword" value={verifyPassword} onChange={onChange} />
          <LoadingButton text="Create account" onClick={register} loading={loading} />
        </Form>
      </Wrapper>
    </Template>
  );
};

export {
  Register,
};

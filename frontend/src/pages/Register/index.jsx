import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

// import { userActions } from '../../state/actions/user';
import { alertActions } from '../../state/actions/alert';
import { domener } from '../../sharedComponents/utilities/Kommuner';

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
  display: flex;
  flex-direction: column;
  padding: 1em;
  background-color: white;
  border-radius: 0.3em;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
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

const Button = styled.button`
  padding: 0.3em;
  font-size:1.1em;
  border-radius: 0.3em;
  color: #7e6dad;
  background-color: #dcd8ff;
  border: solid 0.1em #9a85d3;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 1em 0 0.8em 0;
  cursor: pointer
`;

const Register = () => {
  // State
  const [email, setEmail] = useState('');
  const [typeIsKommune, setTypeIsKommune] = useState(true);
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  // Redux
  const dispatch = useDispatch();

  const onChange = (e) => {
    switch (e.target.name) {
      case 'email': {
        setEmail(e.target.value);
        break;
      }
      case 'type': {
        setTypeIsKommune(e.target.value === 'Kommune');
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
      default: {
        break;
      }
    }
  };

  const validKommuneEmail = (_email) => {
    for (const domene of domener) { // eslint-disable-line no-restricted-syntax
      if (_email.endsWith(domene)) {
        return true;
      }
    }
    return false;
  };

  const validEmailFormat = (_email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
    return re.test(_email.toLowerCase());
  };

  const validPasswordFormat = (_password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/; // eslint-disable-line no-useless-escape
    return re.test(_password);
  };

  const register = (e) => {
    e.preventDefault();
    if (typeIsKommune && !validKommuneEmail(email)) {
      dispatch(alertActions.error('Not a valid kommune email. The email must end with <your-kommune>.kommune.no (or mgk.no).'));
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
      // return; // fuck linting
    }
    // dispatch(userActions.register(email, password))
  };

  return (
    <Wrapper>
      <Form onSubmit={register}>
        <h1>Sign up</h1>
        <Input type="email" placeholder="Email" name="email" value={email} onChange={onChange} />
        <RadioWrapper>
          <Label htmlFor="type">Account Type:</Label>
          <CheckboxTypeWrapper>
            <ChecboxLabelWrapper>
              <input type="radio" name="type" value="Kommune" checked={typeIsKommune} onChange={onChange} />
              <RadioText>Kommune</RadioText>
            </ChecboxLabelWrapper>
            <ChecboxLabelWrapper>
              <input type="radio" name="type" value="Other" checked={!typeIsKommune} onChange={onChange} />
              <RadioText>Other</RadioText>
            </ChecboxLabelWrapper>
          </CheckboxTypeWrapper>
        </RadioWrapper>
        <Input type="password" placeholder="Password" name="password" value={password} onChange={onChange} />
        <Input type="password" placeholder="Verify password" name="verifyPassword" value={verifyPassword} onChange={onChange} />
        <Button type="submit">Create account</Button>
      </Form>
    </Wrapper>
  );
};

export {
  Register,
};

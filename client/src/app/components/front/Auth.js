import React from 'react';
import mui from 'material-ui';
import _ from 'lodash';
import {login, logout, _fetch, constants} from '../../helpers';
import Formsy from 'formsy-react'
import fui from 'formsy-material-ui';
import Error from '../Error';
import update from 'react-addons-update';
const {AUTH_ACTIONS} = constants;

class Login extends React.Component {
  constructor(){
    super();
    this.state = {
      error: null,
      canSubmit: false
    };
  }

  render(){
    return (
      <div>
        <Formsy.Form
          ref="form"
          onValid={() => this.setState({canSubmit: true})}
          onInvalid={() => this.setState({canSubmit: false})}
          onValidSubmit={this.submitForm}>
          <Error error={this.state.error} />
          <fui.FormsyText
            name='email'
            required
            hintText="Email Address"
            fullWidth={true}
            validations="isEmail"
            validationError="Please enter a valid email address"
            type="email"/>
          <fui.FormsyText
            name="password"
            required
            hintText="Password"
            fullWidth={true}
            type="password"/>
          <mui.RaisedButton type="submit" label="Submit" primary={true} disabled={!this.state.canSubmit}/>
        </Formsy.Form>
        <div style={{marginTop: 10}}>
          <a onClick={() => this.setState({forgotPass: !this.state.forgotPass})} style={{cursor: 'pointer'}}>Forgot Password</a>
          { !this.state.forgotPass ? null :
            <form onSubmit={this.forgotPassword}>
              <input value={this.state.forgotEmail} onChange={e => this.setState({forgotEmail: e.target.value})} placeholder="Enter email address" />
              <input type="submit" value="Send" />
            </form>
          }
        </div>
      </div>
    );
  }

  forgotPassword = e => {
    e.preventDefault();
    _fetch('user/forgot-password', {method: "POST", body: {email: this.state.forgotEmail}})
      .then(json => {
        global.jobpig.alerts.alert("Email sent.");
        this.setState({forgotEmail: ''});
      })
      .catch(global.jobpig.alerts.alert);
  }

  submitForm = (body) => {
    _fetch(`login`, {method:"POST", body})
      .then(json => login(json.token))
      .catch(error => this.setState({error}))
  }
}

class Register extends React.Component{
  constructor(){
    super();
    this.state = {
      error: null,
      canSubmit: false
    };
  }
  render(){
    return (
      <Formsy.Form
        ref="form"
        onValid={() => this.setState({canSubmit: true})}
        onInvalid={() => this.setState({canSubmit: false})}
        onValidSubmit={this.submitForm}>

        {this.props.action === AUTH_ACTIONS.POST_JOB && (
          <p>Register first (required for listing management, and for candidates to contact you). You'll be redirected post your job after.</p>
        )}

        <Error error={this.state.error} />
        <fui.FormsyText
          name='email'
          required
          hintText="Email Address"
          fullWidth={true}
          validations="isEmail"
          validationError="Please enter an email address"
          type="email"/>
        <fui.FormsyText
          name="password"
          required
          hintText="Password"
          validations="minLength:8"
          validationError="Password must be at least 8 characters"
          fullWidth={true}
          type="password"/>
        <fui.FormsyText
          name="confirmPassword"
          required
          validations="equalsField:password"
          validationError="Passwords don't match"
          hintText="Confirm Password"
          fullWidth={true}
          type="password"/>
        <mui.RaisedButton primary={true} label='Submit' type='submit' disabled={!this.state.canSubmit}/>
      </Formsy.Form>
    )
  }

  submitForm = (body) => {
    _fetch('register', {method:"POST", body})
      .then(json => {
        let {action} = this.props;
        action = action === AUTH_ACTIONS.POST_JOB ? action : AUTH_ACTIONS.REGISTER;
        login(json.token, action);
      })
      .catch(error => this.setState({error}))
  }
}

export default class Auth extends React.Component {
  constructor(){
    super();
    this.state = {
      open: false,
      action: AUTH_ACTIONS.LOGIN
    };
  }

  render() {
    const actions = [
      <mui.FlatButton label="Cancel" secondary={true} onTouchTap={this.close} />,
    ];
    const initialTab = {
      [AUTH_ACTIONS.LOGIN]: 0,
      [AUTH_ACTIONS.REGISTER]: 1,
      [AUTH_ACTIONS.POST_JOB]: 1
    }[this.state.action];
    return (
      <mui.Dialog actions={actions} modal={true} open={this.state.open} >
        <mui.Tabs initialSelectedIndex={initialTab}>
          <mui.Tab label="Login">
            <Login />
          </mui.Tab>
          <mui.Tab label="Register">
            <Register action={this.state.action}/>
          </mui.Tab>
        </mui.Tabs>
      </mui.Dialog>
    );

  }

  open = (action=AUTH_ACTIONS.LOGIN) => this.setState({action, open: true});
  close = () => this.setState({open: false});

}

import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux'
import { Link } from "react-router"
import { getLoginStatusAsync, getMailAsync } from './lib/actions'
import { browserHistory } from 'react-router'

import $ from "jquery"

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {name: '', password: ''}
    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onSigninSubmit = this.onSigninSubmit.bind(this)
  }
  onUsernameChange(event) {
    this.setState({name: event.target.value})
  }
  onPasswordChange(event) {
    this.setState({password: event.target.value})
  }
  onSigninSubmit(event) {
    if(!this.state.name || !this.state.password){
      return
    }
    $.ajax({
      type: "POST",
      url: "/auth/login",
      contentType: "application/json",
      dataType: 'json',
      data: JSON.stringify({"user": this.state})
    })
    .done( res=> {
      this.props.dispatch(getMailAsync())
      this.props.dispatch(getLoginStatusAsync())
      browserHistory.push("/")
    })
  }
  render() {
    return (
      <div className="container">
        <h1>Sign In</h1>
        <form onSubmit={(e) => e.preventDefault()} className="form-horizontal">
          <TextField
            hintText="Username"
            value={this.state.name}
            onChange={this.onUsernameChange}
            fullWidth
            /><br />
          <TextField
            hintText="Password"
            type="password"
            value={this.state.password}
            onChange={this.onPasswordChange}
            fullWidth
            /><br />
          <RaisedButton
            type="submit"
            label="Sign In"
            onClick={this.onSigninSubmit}
            />
          <Link to="/reg"><FlatButton label="Sign Up" secondary={true} /></Link>
        </form>
      </div>
    )
  }
}

Login = connect()(Login)
export default Login

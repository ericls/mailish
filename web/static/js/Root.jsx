import React from 'react'
import { Router, Route, Link, browserHistory, IndexRoute, hashHistory } from 'react-router'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import FontIcon from 'material-ui/FontIcon'
import {Tabs, Tab} from 'material-ui/Tabs'
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import $ from "jquery"

import Inbox from "./Inbox"
import Login from "./Login"
import Mail from "./Mail"
import Send from "./Send"
import Sent from "./Sent"
import Reg from "./Reg"

import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import rootApp from './lib/reducers'
import { getLoginStatusAsync, getMailAsync } from './lib/actions'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()
const loggerMiddleware = createLogger()

const store = createStore(
  rootApp,
  applyMiddleware(
    thunk, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.goHome = this.goHome.bind(this)
    this.logout = this.logout.bind(this)
    this.goSend = this.goSend.bind(this)
    this.goSent = this.goSent.bind(this)
  }
  goHome() {
    if(!this.props.loginStatus){
      return
    }
    browserHistory.push("/")
  }
  goSend() {
    browserHistory.push("/send")
  }
  goSent() {
    browserHistory.push("/sent")
  }
  logout() {
    $.ajax({
      type: "POST",
      url: "/auth/logout"
    }).done( res => {
      this.props.dispatch(getLoginStatusAsync())
      browserHistory.push("/login")
    })
  }
  componentWillMount() {
    this.props.dispatch(getLoginStatusAsync())
    .then(() => {
      this.props.dispatch(getMailAsync())
    })
  }
  render() {
    return (
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <main>
          <AppBar
            title="Mailish"
            iconElementLeft={
              <IconButton>
                <FontIcon className="material-icons" onClick={this.goHome}>home</FontIcon>
              </IconButton>
            }
            iconElementRight={
              this.props.loginStatus?
              <IconButton>
                <FontIcon className="material-icons" onClick={this.logout}>power_settings_new</FontIcon>
              </IconButton>
              :
              null
            }
            />
          <div style={{"marginBottom": "72px"}}>
            {this.props.children}
          </div>
          <Tabs
            style={{
              'position': 'fixed',
              'width': '100%',
              'bottom': 0,
              'display': !this.props.loginStatus ? 'none' : 'block'
            }}
            >
            <Tab
              icon={<FontIcon className="material-icons">mail</FontIcon>}
              label="Incoming"
              onActive={this.goHome}
              />
            <Tab
              icon={<FontIcon className="material-icons">add</FontIcon>}
              label="Compose"
              onActive={this.goSend}
              />
            <Tab
              icon={<FontIcon className="material-icons">send</FontIcon>}
              label="Sent"
              onActive={this.goSent}
              />
          </Tabs>
          <Snackbar
            open={this.props.snackBar.open}
            message={this.props.snackBar.message}
            autoHideDuration={4000}
            />
        </main>
        </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    loginStatus: state.loginStatus,
    snackBar: state.snackBar
  }
}

App = connect(mapStateToProps)(App)

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Inbox} />
            <Route path="/login" component={Login}/>
            <Route path="/reg" component={Reg}/>
            <Route path="/mail/:mail_id" component={Mail} />
            <Route path="/send(/:to)" component={Send} />
            <Route path="/sent" component={Sent} />
            <Route path="/sent/:mail_id" component={Mail} />
          </Route>
        </Router>
      </Provider>
    )
  }
}

export default Root

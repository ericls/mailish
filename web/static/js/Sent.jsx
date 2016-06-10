import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { getSentAsync } from './lib/actions'

import MD5 from './lib/MD5';

import { getMailAsync, setLoginStatus} from './lib/actions'

class Sent extends React.Component {
  constructor(props) {
    super(props)
    this.goToMail = this.goToMail.bind(this)
  }
  componentDidMount() {
    this.props.dispatch(getSentAsync())
  }
  goToMail(mailId) {
    return () => {browserHistory.push(`/sent/${mailId}`)}
  }
  render() {
    if(this.props.sent.length === 0) {
      return <Paper zDepth={1} style={{"height": "300px", "textAlign": "center"}}>
        <p style={{"lineHeight": "300px"}}>You have no sent emails</p>
      </Paper>
    }
    let self = this
    let mapMailToItem = function(mail) {
      return (
        <div key={mail.inserted_at}>
          <ListItem
            onClick={self.goToMail(mail.id)}
            leftAvatar={<Avatar src={`https://www.gravatar.com/avatar/${MD5(mail.to[0])}?d=mm`} />}
            primaryText={mail.subject}
            secondaryText={
              <p>
                <span style={{color: darkBlack}}>{mail.to}</span> --
                  {mail.content}
                </p>
              }
              secondaryTextLines={2}
              />
            <Divider inset />
        </div>
        )
    }
    return (
      <div className="container">
        <List>
          {this.props.sent.map(mapMailToItem)}
        </List>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    sent: state.sent,
    loginStatus: state.loginStatus
  }
}

Sent = connect(mapStateToProps)(Sent)

export default Sent

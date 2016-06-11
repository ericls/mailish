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
import FlatButton from 'material-ui/FlatButton';

import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import MD5 from './lib/MD5';

import { getMailAsync, setLoginStatus} from './lib/actions'

class Inbox extends React.Component {
  constructor(props) {
    super(props)
    this.goToMail = this.goToMail.bind(this)
    this.changePage = this.changePage.bind(this)
  }
  changePage(page) {
    return () => {this.props.dispatch(getMailAsync(page))}
  }
  goToMail(mailId) {
    return () => {browserHistory.push(`/mail/${mailId}`)}
  }
  render() {
    if(this.props.mails.length === 0) {
      return <Paper zDepth={1} style={{"height": "300px", "textAlign": "center"}}>
        <p style={{"lineHeight": "300px"}}>You have no incomming emails</p>
      </Paper>
    }
    let self = this
    let mapMailToItem = function(mail) {
      return (
        <div key={mail.id}>
          <ListItem
            onClick={self.goToMail(mail.id)}
            leftAvatar={<Avatar src={`https://www.gravatar.com/avatar/${MD5(mail.from)}?d=mm`} />}
            primaryText={mail.subject}
            secondaryText={
              <p>
                <span style={{color: darkBlack}}>{mail.from}</span> --
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
          {this.props.mails.entries.map(mapMailToItem)}
        </List>
        {
          this.props.mails.page_number > 1 ?
            <FlatButton label="Previous" primary={true} onClick={this.changePage(this.props.mails.page_number - 1)}/>
          : null
        }
        {
          this.props.mails.page_number < this.props.mails.total_page ?
            <FlatButton className="pull-right" label="Next" primary={true} onClick={this.changePage(this.props.mails.page_number + 1)} />
          : null
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    mails: state.mails,
    loginStatus: state.loginStatus
  }
}

Inbox = connect(mapStateToProps)(Inbox)

export default Inbox

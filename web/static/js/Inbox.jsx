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
import Gravatar from './lib/Gravatar';

import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import MD5 from './lib/MD5';

import { getMailAsync, setLoginStatus} from './lib/actions'

class Inbox extends React.Component {
  componentDidMount() {
  }
  render() {
    let mapMailToItem = function(mail) {
      return (
        <div key={mail.inserted_at}>
          <ListItem
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
          {this.props.mails.map(mapMailToItem)}
        </List>
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

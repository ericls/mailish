import React from 'react';
import { connect } from 'react-redux'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { getMailItemAsync } from './lib/actions'
import { browserHistory } from 'react-router'
import MD5 from './lib/MD5';

class Mail extends React.Component {
  constructor(props) {
    super(props)
    this.reply = this.reply.bind(this)
  }
  componentDidMount() {
    let type
    if(this.props.location.pathname.startsWith('/mail/')) {
      type = "mail"
    } else {
      type = "sent"
    }
    this.props.dispatch(
      getMailItemAsync(type, this.props.params.mail_id)
    )
  }
  reply() {
    browserHistory.push(`/send/${this.props.mailItem.from || this.props.mailItem.to[0] }`)
  }
  render() {
    let type
    if(this.props.location.pathname.startsWith('/mail/')) {
      type = "mail"
    } else {
      type = "sent"
    }
    let mailItem = this.props.mailItem
    let dateTime = new Date(mailItem.inserted_at)
    let avatarEmail = mailItem.from ? mailItem.from : mailItem.to[0]
    let dateTimeString = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`
    return (
      <Card>
        <CardHeader
          title={this.props.mailItem.subject}
          subtitle={[`${mailItem.from || mailItem.to[0]}`, <br key={mailItem.id}/> ,`${dateTimeString}`]}
          avatar={`https://www.gravatar.com/avatar/${MD5(avatarEmail)}?d=mm&s=39`}
          />
        <CardText>
          {
            mailItem.content
            ? mailItem.content.split('\n').map(function(s){return [s, <br />]})
            : ''
          }
        </CardText>
        <CardActions>
          <FlatButton label="Back" onClick={browserHistory.goBack} primary/>
          <FlatButton label={type === 'mail' ? 'Reply' : 'Send Another'} secondary onClick={this.reply}/>
        </CardActions>
      </Card>
    )
  }
}

function mapStateToProps(state) {
  return {
    mailItem: state.mailItem
  }
}

Mail = connect(mapStateToProps)(Mail)

export default Mail

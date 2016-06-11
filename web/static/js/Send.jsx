import React from 'react';
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router'
import { setSnackBar } from './lib/actions'

import $ from "jquery"

class Send extends React.Component {
  constructor(props) {
    super(props)
    this.state = {to: '', content: '', subject: ''}
    this.onToChange = this.onToChange.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
    this.onSubjectChange = this.onSubjectChange.bind(this)
    this.onSendSubmit = this.onSendSubmit.bind(this)
  }
  componentDidMount() {
    if(this.props.params.to){
      this.setState({to: this.props.params.to})
    }
  }
  onToChange(event) {
    this.setState({to: event.target.value})
  }
  onContentChange(event) {
    this.setState({content: event.target.value})
  }
  onSubjectChange(event) {
    this.setState({subject: event.target.value})
  }
  onSendSubmit(event) {
    if(!this.state.content || !this.state.to){
      return
    }
    $.ajax({
      type: "POST",
      url: "/api/send",
      contentType: "application/json",
      dataType: 'json',
      data: JSON.stringify(
        {"mail": {
          recipients: this.state.to.split(','),
          subject: this.state.subject || '',
          body: this.state.content
        }}
      )
    })
    .done( res=> {
      this.props.dispatch(setSnackBar(true, "Email sucessfully sent."))
      setTimeout(
        () => {this.props.dispatch(setSnackBar(false))}, 2000
      )
      browserHistory.goBack()
    })
  }
  render() {
    return (
      <div className="container">
        <h1>Send Mail</h1>
        <form onSubmit={(e) => e.preventDefault()} className="form-horizontal">
          <TextField
            hintText="Recepients (comma seperated)"
            value={this.state.to}
            onChange={this.onToChange}
            fullWidth
            /><br />
          <TextField
            hintText="Subject"
            value={this.state.subject}
            onChange={this.onSubjectChange}
            fullWidth
            /><br />
          <TextField
            hintText="Content"
            value={this.state.content}
            onChange={this.onContentChange}
            rows={3}
            multiLine={true}
            fullWidth
            /><br />
          <RaisedButton
            type="submit"
            label="Send"
            onClick={this.onSendSubmit}
            />
          <FlatButton label="Cancel" secondary onClick={browserHistory.goBack} />
        </form>
      </div>

    )
  }
}

Send = connect()(Send)

export default Send

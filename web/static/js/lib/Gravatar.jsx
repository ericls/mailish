import React from 'react';
import Avatar from 'material-ui/Avatar';
import MD5 from './MD5';

class Gravatar extends React.Component{
  render() {
    let hash = MD5(this.props.email)
    return (
      <Avatar src={`https://www.gravatar.com/avatar/${hash}?d=mm`}/>
    )
  }
}

export default Gravatar

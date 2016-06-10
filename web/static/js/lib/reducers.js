import { combineReducers } from 'redux'
import {
    SET_MAILS,
    SET_LOGIN_STATUS,
    SET_MAIL,
    SET_SENT
} from './actions'


function mails(state=[], action) {
  switch (action.type) {
    case SET_MAILS:
      return action.entries
    default:
      return state
  }
}

function loginStatus(state=false, action) {
  switch (action.type) {
    case SET_LOGIN_STATUS:
      return action.status
    default:
      return state
  }
}

function mailItem(state={from: 'dustet@gmail.com', content: ''}, action){
  switch (action.type) {
    case SET_MAIL:
      return action.mailItem
    default:
      return state
  }
}

function sent(state=[], action){
  switch (action.type) {
    case SET_SENT:
      return action.entries
    default:
      return state
  }
}

let rootApp = combineReducers({
  mails,
  loginStatus,
  mailItem,
  sent
})

export default rootApp

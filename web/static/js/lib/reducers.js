import { combineReducers } from 'redux'
import {
    SET_MAILS,
    SET_LOGIN_STATUS,
    SET_MAIL,
    SET_SENT,
    SET_SNACKBAR
} from './actions'


function mails(state={entries: [], page_number: 1, total_page: 1}, action) {
  switch (action.type) {
    case SET_MAILS:
      return action.mails
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

function sent(state={entries:[], page_number: 1, total_page: 1}, action){
  switch (action.type) {
    case SET_SENT:
      return action.sent
    default:
      return state
  }
}

function snackBar(state={open: false, message: ''}, action){
  switch (action.type) {
    case SET_SNACKBAR:
      return {open: action.open, message: action.message}
    default:
      return state
  }
}

let rootApp = combineReducers({
  mails,
  loginStatus,
  mailItem,
  sent,
  snackBar
})

export default rootApp

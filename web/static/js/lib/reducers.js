import { combineReducers } from 'redux'
import {
    SET_MAILS,
    SET_LOGIN_STATUS
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

let rootApp = combineReducers({
  mails,
  loginStatus
})

export default rootApp

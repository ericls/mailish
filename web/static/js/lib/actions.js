import $ from "jquery";
import { browserHistory } from "react-router"

export const SET_MAILS = "SET_MAILS"
export const SET_NEED_LOGIN = "SEET_NEED_LOGIN"
export const SET_LOGIN_STATUS = "SET_LOGIN_STATUS"

export function setMails(entries) {
  return { type: SET_MAILS, entries: entries}
}

export function setLoginStatus(status) {
  return { type: SET_LOGIN_STATUS, status: status}
}

export function getMailAsync() {
  return (dispatch) => {
    return $.ajax({
      type: "GET",
      url: "/api/mails",
      contentType: "application/json",
      dataType: "json"
    })
    .done( res => {
      dispatch(setMails(res["entries"]))
    })
  }
}

export function getLoginStatusAsync() {
  return dispatch => {
    return $.ajax({
      type: "GET",
      url: "/api/login_status",
    })
    .done( res => {
      dispatch(setLoginStatus(true))
    })
    .fail( res => {
      dispatch(setLoginStatus(false))
      browserHistory.push("/login")
    })
  }
}

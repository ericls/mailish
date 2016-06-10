import $ from "jquery";
import { browserHistory } from "react-router"

export const SET_MAILS = "SET_MAILS"
export const SET_LOGIN_STATUS = "SET_LOGIN_STATUS"
export const SET_MAIL = "SET_MAIL"

export function setMails(entries) {
  return { type: SET_MAILS, entries: entries }
}

export function setLoginStatus(status) {
  return { type: SET_LOGIN_STATUS, status: status }
}

export function setMail(mailItem) {
  return { type: SET_MAIL, mailItem: mailItem }
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

export function getMailItemAsync(type, id) {
  return (dispatch) => {
    return $.ajax({
      type: "GET",
      url: "/api/mail",
      contentType: "application/json",
      dataType: "json",
      data: {type: type, id, id}
    })
    .done( res => {
      dispatch(setMail(res))
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

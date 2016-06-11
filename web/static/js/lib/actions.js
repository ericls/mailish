import $ from "jquery";
import { browserHistory } from "react-router"

export const SET_MAILS = "SET_MAILS"
export const SET_LOGIN_STATUS = "SET_LOGIN_STATUS"
export const SET_MAIL = "SET_MAIL"
export const SET_SENT = "SET_SENT"
export const SET_SNACKBAR = "SET_SNAKEBAR"

export function setMails(mails) {
  return { type: SET_MAILS, mails: mails }
}

export function setSnackBar(open, message='') {
  return { type: SET_SNACKBAR, open: open, message: message}
}

export function setLoginStatus(status) {
  return { type: SET_LOGIN_STATUS, status: status }
}

export function setMail(mailItem) {
  return { type: SET_MAIL, mailItem: mailItem }
}

export function setSent(sent) {
  return { type: SET_SENT, sent: sent}
}

export function setSnackBarAsync(open, message){
  return (dispatch) => {
    dispatch(setSnackBar(open, message))
  }
}

export function getMailAsync(page=1) {
  return (dispatch) => {
    return $.ajax({
      type: "GET",
      url: "/api/mails",
      contentType: "application/json",
      dataType: "json",
      data: {page: page}
    })
    .done( res => {
      dispatch(setMails(res))
    })
  }
}

export function getSentAsync(page=1) {
  return dispatch => {
    return $.ajax({
      type: "GET",
      url: "/api/sent",
      contentType: "application/json",
      dataType: "json",
      data: {page: page}
    })
    .done( (res, testStatus, jqXHR) => {
      console.dir(jqXHR.getAllResponseHeaders())
      dispatch(setSent(res))
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

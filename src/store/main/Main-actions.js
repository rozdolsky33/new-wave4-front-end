import * as actionType from './Main-types';
import { history } from "../../components/App";
import { host, getParams } from "../utils";
import Cookies from 'universal-cookie';

const checkForFailure = (response, dispatch) => {
  if (!response.ok) {
    let errorMessage = response.error ? response.error: '';
    errorMessage = !response.message ? errorMessage :
        (!!errorMessage ? errorMessage + '. ' + response.message : response.message);
    errorMessage = !!errorMessage ? errorMessage : 'error.common';
    dispatch({ type: actionType.requestFailedType, errorCode: response.status, errorMessage });
  }
}
const cookies = new Cookies();

export const actionCreators = {
  clearErrors: () => async (dispatch) => {
    dispatch({ type: actionType.clearErrorsType });
  },
  login: (email, password) => async (dispatch) => {
    const url = `${host}/v1/api/users/login`;
    const params = getParams('POST');
    params.body = JSON.stringify({ email, password });

    dispatch({ type: actionType.requestType });
    let response = await fetch(url, params);
    if (response.ok) {
      response.headers.forEach((h, k) => console.log(k, h));
      const token = response.headers.get('Authorization');
      const userId = response.headers.get('UserID');
      let userRolesAndRights = response.headers.get('ROLES_AND_AUTHORITIES');
      userRolesAndRights = userRolesAndRights.slice(1, userRolesAndRights.length - 1).split(", ");
      let role = userRolesAndRights[userRolesAndRights.length - 1];
      let rights = userRolesAndRights.slice(0, userRolesAndRights.length - 1);
      let expires = new Date();
      expires.setDate(expires.getDate() + 4);
      cookies.set('token', token, { expires });
      localStorage.setItem('role', role);
      localStorage.setItem('rights', rights.toString());
      localStorage.setItem('userId', userId);
      dispatch({ type: actionType.loginPassedType, user: {token, role, rights} });
      if (role.indexOf("ADMIN") > -1) {
        history.push("/admin");
      } else {
        history.push("/");
      }
    } else {
      dispatch({
        type: actionType.requestFailedType,
        errorMessage: response.status === 403 ? 'error.wrong-creds' : 'error.common'
      });
    }
  },
  logout: () => async (dispatch) => {
    cookies.remove('token');
    localStorage.removeItem('role');
    localStorage.removeItem('rights');
    localStorage.removeItem('userId');
    dispatch({ type: actionType.logoutType });
    history.push("/");
  },
  register: (email, firstName, lastName, password) => async (dispatch) => {
    const url = `${host}/v1/api/users`;
    const params = getParams('POST');
    params.body = JSON.stringify({ email, firstName, lastName, password });

    dispatch({ type: actionType.requestType });
    let response = await fetch(url, params);
    if (response.ok) {
      return dispatch({
        type: actionType.requestPassedType,
        successMessage: 'message.registration-success',
      });
    } else {
      checkForFailure(response, dispatch);
    }
  },
  checkToken: (token) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v1/api/users/email-verification?token=${token}`;
    let response = await fetch(url, getParams('GET'));
    if (response.ok) {
      response = await response.json();
      if (response.operationResult === 'ERROR') {
        dispatch({
          type: actionType.requestFailedType,
          errorMessage: 'error.invalid-url',
        });
      } else {
        dispatch({
          type: actionType.requestPassedType,
          successMessage: 'message.action-approved',
        });
      }
    } else {
      checkForFailure(response, dispatch);
    }
  },
  sendPassResetRequest: (email) => async (dispatch) => {
    let url = `${host}/v1/api/users/password-reset-request`;
    const params = getParams('POST');
    params.body = JSON.stringify({ email });

    dispatch({ type: actionType.requestType });
    let response = await fetch(url, params);
    if (response.ok) {
      return dispatch({
        type: actionType.requestPassedType,
        successMessage: 'message.reset-password-request',
      });
    } else checkForFailure(response, dispatch);
  },
  sendAdminRoleRequest: (email) => async (dispatch) => {
    let url = `${host}/v1/api/users/role-admin-request`;
    const params = getParams('POST', true);
    params.body = JSON.stringify({ email });

    dispatch({ type: actionType.requestType });
    let response = await fetch(url, params);
    if (response.ok) {
      return dispatch({
        type: actionType.requestPassedType,
        successMessage: 'message.admin-role-email-sent',
      });
    } else checkForFailure(response, dispatch);
  },
  resetPassword: (password, token, passwordReset) => async (dispatch) => {
    let url = `${host}/v1/api/users/${passwordReset ? 'password-reset' : 'role-admin-reset'}`;
    const params = getParams('POST');
    params.body = JSON.stringify({ password, token });

    dispatch({ type: actionType.requestType });
    let response = await fetch(url, params);
    if (response.ok) {
      return dispatch({
        type: actionType.requestPassedType,
        successMessage: 'message.reset-password-success',
      });
    } else checkForFailure(response, dispatch);
  },
  getItemsList: (activeItems, pageNumber, pageSize, addResToList, filterEntity, filterValue) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = '';
    if (activeItems === 'users') {
      url = `${host}/v1/api/users?limit=${pageSize}&page=${pageNumber}`;
    } else {
      url = `${host}/v2/api/${activeItems}`;
      switch (filterEntity) {
        case 'category': {
          url += `/categories/${filterValue}?`;
          break;
        }
        case 'date': {
          url += `/date/year/month/${filterValue.year}/${filterValue.month}`;
          break;
        }
        case 'author': {
          url += `/author/name?name=${filterValue}&`;
          break;
        }
        default: {
          url += '/date?'
        }
      }
      url += !filterEntity || filterEntity !== 'date' ? `pageNumber=${pageNumber}&numberOfElementsPerPage=${pageSize}` : '';
    }

    let response = await fetch(url, getParams('GET', true));
    if (response.ok) {
      response = await response.json();
      response = activeItems === 'users' || (filterEntity && filterEntity === 'date') ? {
        content: activeItems === 'users' ? response.userRest : response,
        totalPages: Math.ceil((response.totalElements || 999) / pageSize),
        totalElements: response.totalElements || 999,
        numberOfElements: pageSize,
        size: pageSize,
        number: pageNumber
      } : response;
      dispatch({ type: actionType.receivedItemsType, addResToList, response });
    } else checkForFailure(response, dispatch);
  },
  getArticles: (pageNumber, pageSize) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/blog/date?pageNumber=${pageNumber}&numberOfElementsPerPage=${pageSize}`;
    let response = await fetch(url, getParams('GET'));
    if (response.ok) {
      response = await response.json();
      dispatch({ type: actionType.receivedArticlesType, response });
    } else checkForFailure(response, dispatch);
  },
  getProjects: (pageNumber, pageSize) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/project/date?pageNumber=${pageNumber}&numberOfElementsPerPage=${pageSize}`;
    let response = await fetch(url, getParams('GET'));
    if (response.ok) {
      response = await response.json();
      dispatch({ type: actionType.receivedProjectsType, response });
    } else checkForFailure(response, dispatch);
  },
  getCategories: (entityName) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/${entityName}/categories`;
    let response = await fetch(url, getParams('GET'));
    if (response.ok) {
      response = await response.json();
      dispatch({ type: actionType.receivedCategoriesType, entityName, response });
    } else checkForFailure(response, dispatch);
  },
  getItemsDates: (itemType) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/${itemType}/date/${itemType === "blog" ? 'postIfExists' : 'projectIfExists'}`;
    let response = await fetch(url, getParams('GET'));
    if (response.ok) {
      response = await response.json();
      dispatch({ type: actionType.receivedFilterDates, response });
    } else checkForFailure(response, dispatch);
  },
  deleteItem: (activeItems, id) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v1/api/${activeItems}/${id}`;
    const response = await fetch(url, getParams('DELETE', true));

    if (response.ok) {
      dispatch({ type: actionType.itemDeletedType });
    } else checkForFailure(response, dispatch);
  },
  addEditItem: (activeItems, itemParams, editMode) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    const url =
      `${host}/v1/api/${activeItems}` + (editMode ? `/${itemParams.id}` : '');
    const params = getParams(editMode ? 'PUT' : 'POST', true);
    params.body = { ...itemParams };
    params.body.date = typeof params.body.date === 'string' ? params.body.date : params.body.date.toGMTString();
    params.body = JSON.stringify(params.body);
    let response = await fetch(url, params);

    if (response.ok) {
      dispatch({ type: actionType.addEditItemPassedType });
      dispatch({ type: actionType.toggleAddEditModalType, shown: false });
    } else checkForFailure(response, dispatch);
  },
  changeActiveItems: (activeItems) => (dispatch) => {
    dispatch({ type: actionType.changeActiveItemsType, activeItems });
  },
  toggleAddEditModal: (shown, selectedItem) => (dispatch) => {
    dispatch({ type: actionType.toggleAddEditModalType, shown, selectedItem });
  },
  uploadImage: (file) => async (dispatch) => {
    const url = `${host}/v1/api/images/uploadFile`;
    const params = getParams('POST', true);
    const formData = new FormData();
    formData.append('file', file, file.name);
    delete params.headers['Content-Type'];
    params.body = formData;
    await fetch(url, params);
  },
  getAuthor: (adminId) => async (dispatch) => {
    const url = `${host}/v1/api/users/${adminId}`;
    const params = getParams('GET', true);
    let response = await fetch(url, params);

    if (response.ok) {
      response = await response.json();
      dispatch({ type: actionType.receivedAuthor, author: response});
    } else checkForFailure(response, dispatch);
  },
  sendContactUsEmail: (subject, from, content) => async (dispatch) => {
    const url = `${host}/v2/api/send/contact-us`;
    const params = getParams('POST');
    params.body = JSON.stringify({ subject, from, content });

    dispatch({ type: actionType.requestType });
    let response = await fetch(url, params);
    checkForFailure(response, dispatch);
  },
  donate: (fullName, email, amount, cardNumber, expMonth, expYear, cvc) => async (dispatch) => {
    const url = `${host}/v2/api/card-donation`;
    const params = getParams('POST');
    params.body = JSON.stringify({ fullName, email, amount: Math.round((parseInt(amount) * 1.029 + 0.3) * 100),
      cardNumber, expMonth, expYear, cvc });

    dispatch({ type: actionType.requestType });
    let response = await fetch(url, params);
    if (response.ok) {
      return dispatch({
        type: actionType.requestPassedType,
        successMessage: 'message.donation-success',
      });
    } else checkForFailure(response, dispatch);
  }
};

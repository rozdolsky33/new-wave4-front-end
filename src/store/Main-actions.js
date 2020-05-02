import * as actionType from './Main-types';
import { history } from "../components/App";

const host = 'http://162.212.158.14:8080';
const getParams = (methodType, useAuth) => {
  const params = {
    method: methodType,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': methodType,
      'Access-Control-Request-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    },
  };
  const token = localStorage.getItem('token');
  if (!!token && !!useAuth) {
    params.headers.Authorization = token;
  }
  return params;
};

export const actionCreators = {
  login: (email, password) => async (dispatch) => {
    const url = `${host}/v1/api/users/login`;
    const params = getParams('POST');
    params.body = JSON.stringify({ email, password });

    dispatch({ type: actionType.requestType });
    let response = await fetch(url, params);
    if (response.ok) {
      const token = response.headers.get('Authorization');
      let userRolesAndRights = response.headers.get('ROLES_AND_AUTHORITIES');
      userRolesAndRights = userRolesAndRights.slice(1, userRolesAndRights.length - 1).split(", ");
      let role = userRolesAndRights[userRolesAndRights.length - 1];
      let rights = userRolesAndRights.slice(0, userRolesAndRights.length - 1);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('rights', rights.toString());
      dispatch({ type: actionType.loginPassedType, user: {token, role, rights} });
      if (role.indexOf("ADMIN") > -1) {
        history.push("/admin");
      } else {
        history.push("/");
      }
    } else {
      dispatch({ type: actionType.requestFailedType, error: response.status });
    }
  },
  logout: () => async (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('rights');
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
        successMessage:
          'Реєстрація пройшла успішно. Перевірте свою пошту для підтвердження',
      });
    } else {
      return dispatch({
        type: actionType.requestFailedType,
        error: response.status,
      });
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
          errorMessage: 'Дане посилання вже недійсне',
        });
      } else {
        dispatch({
          type: actionType.requestPassedType,
          successMessage: 'Підтвердження пройшло успішно',
        });
      }
    } else {
      dispatch({ type: actionType.requestFailedType, error: response.status });
    }
  },
  sendPassResetRequest: (email) => async (dispatch) => {
    dispatch({
      type: actionType.requestFailedType,
      error: 'This functionality is under development.',
    });
  },
  resetPassword: (password) => async (dispatch) => {
    dispatch({
      type: actionType.requestFailedType,
      error: 'This functionality is under development.',
    });
  },
  getItemsList: (activeItems, pageNumber, pageSize, addResToList) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/${activeItems}/date?pageNumber=${pageNumber}&numberOfElementsPerPage=${pageSize}`;
    let response = await fetch(url, getParams('GET'));
    if (response.ok) {
      response = await response.json();
      dispatch({ type: actionType.receivedItemsType, addResToList, response });
    } else {
      dispatch({ type: actionType.requestFailedType, error: response.status });
    }
  },
  getFilteredList: (activeItems, filter) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/${activeItems}/${filter.entityName}/`;
    url += filter.entityName === 'date' ? `year/month/${filter.year}/${filter.month}` : filter.value;
    let response = await fetch(url, getParams('GET'));
    if (response.ok) {
      response = await response.json();
      dispatch({ type: actionType.receivedFilteredItemsType, response });
    } else {
      dispatch({ type: actionType.requestFailedType, error: response.status });
    }
  },
  getArticles: (pageNumber, pageSize) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/blog/date?pageNumber=${pageNumber}&numberOfElementsPerPage=${pageSize}`;
    let response = await fetch(url, getParams('GET'));
    if (response.ok) {
      response = await response.json();
      dispatch({ type: actionType.receivedArticlesType, response });
    } else {
      dispatch({ type: actionType.requestFailedType, error: response.status });
    }
  },
  getProjects: (pageNumber, pageSize) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/project/date?pageNumber=${pageNumber}&numberOfElementsPerPage=${pageSize}`;
    let response = await fetch(url, getParams('GET'));
    if (response.ok) {
      response = await response.json();
      dispatch({ type: actionType.receivedProjectsType, response });
    }
  },
  getItem: (type, id) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/${type}/${id}`;
    let response = await fetch(url, getParams('GET', true));
    if (!response.ok) {
      dispatch({ type: actionType.requestFailedType, error: response.status });
    } else {
      response = await response.json();
      dispatch({ type: actionType.receivedItemType, response });
    }
  },
  getItemsDates: (itemType) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v2/api/${itemType}/date/postIfExists`;
    let response = await fetch(url, getParams('GET'));
    if (!response.ok) {
      dispatch({ type: actionType.requestFailedType, error: response.status });
    } else {
      response = await response.json();
      dispatch({ type: actionType.receivedBlogDates, response });
    }
  },
  deleteItem: (activeItems, id) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    let url = `${host}/v1/api/${activeItems}/${id}`;
    const response = await fetch(url, getParams('DELETE', true));

    if (response.ok) {
      dispatch({ type: actionType.itemDeletedType });
    } else {
      dispatch({ type: actionType.requestFailedType, error: response.status });
    }
  },
  addEditItem: (activeItems, itemParams, editMode) => async (dispatch) => {
    dispatch({ type: actionType.requestType });
    const url =
      `${host}/v1/api/${activeItems}` + (editMode ? `/${itemParams.id}` : '');
    const params = getParams(editMode ? 'PUT' : 'POST', true);
    params.body = {
      ...itemParams,
      active: true,
    };
    params.body.date = params.body.date.toGMTString();
    params.body = JSON.stringify(params.body);
    let response = await fetch(url, params);

    if (response.ok) {
      dispatch({ type: actionType.addEditItemPassedType });
      dispatch({ type: actionType.toggleAddEditModalType, shown: false });
    } else {
      dispatch({ type: actionType.requestFailedType, error: response.status });
    }
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
};

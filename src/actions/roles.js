import {
  ROLES_REQUEST, ROLES_SUCCESS, ROLES_FAILURE, ABILITIES_REQUEST, ABILITIES_SUCCESS, ABILITIES_FAILURE
} from './../constants/actionTypes';
import yFetch from './../utils/yFetch';
import { message } from 'antd';

import { API_CONFIG } from './../config/api';

function requestRoles() {
  return {
    type: ROLES_REQUEST,
    isFetching: true
  };
}

function requestAbilities() {
  return {
    type: ABILITIES_REQUEST,
    isFetching: true
  };
}

function receiveRoles(roles) {
  return {
    type: ROLES_SUCCESS,
    isFetching: false,
    roles
  };
}

function receiveAbilities(abilities) {
  return {
    type: ABILITIES_SUCCESS,
    isFetching: false,
    abilities
  };
}

function rolesError(message) {
  return {
    type: ROLES_FAILURE,
    isFetching: false,
    message
  };
}

function AbilitiesError(message) {
  return {
    type: ABILITIES_FAILURE,
    isFetching: false,
    message
  };
}

export function fetchRoles(condition = {page: 1, per_page: 10}) {
  return dispatch => {
    dispatch(requestRoles());
    yFetch(API_CONFIG.roles, { method: "GET", params: condition }).then((response) => {
      if (response.jsonResult.error_code === 4001) {
        dispatch(rolesError(response.jsonResult.error_message));
      } else {
        dispatch(receiveRoles(response.jsonResult));
      }
    });
  };
}

export function fetchAbilities() {
  return dispatch => {
    dispatch(requestAbilities());
    yFetch(API_CONFIG.abilities, { method: "GET" }).then((response) => {
      if (response.jsonResult.error_code === 4001) {
        dispatch(AbilitiesError(response.jsonResult.error_message));
      } else {
        dispatch(receiveAbilities(response.jsonResult));
      }
    });
  };
}

export function createRole(role, success, fail) {
  return dispatch => {
    yFetch(API_CONFIG.roles, { method: "POST", body: JSON.stringify(role) }).then((response) => {
      if (response.jsonResult.error_code === 4001) {
        dispatch(rolesError(response.jsonResult.error_message));
        fail(role.name, response.jsonResult.error_message);
      } else {
        dispatch(fetchRoles());
        message.success("添加成功");
        success();
      }
    });
  };
}

export function deleteRoles(ids) {
  return dispatch => {
    yFetch(API_CONFIG.roles, { method: "DELETE", body: JSON.stringify({ids: ids}) }).then((response) => {
      if (response.jsonResult.error_code === 4001) {
        dispatch(rolesError(response.jsonResult.error_message));
        message.error(response.jsonResult.error_message);
      } else {
        dispatch(fetchRoles());
        message.success("删除成功");
      }
    });
  };
}

export function updateRole(role, success, fail) {
  return dispatch => {
    yFetch(`${API_CONFIG.roles}/${role.id}`, { method: "PUT", body: JSON.stringify(role) }).then((response) => {
      if (response.jsonResult.error_code === 4001) {
        dispatch(rolesError(response.jsonResult.error_message));
        fail(role.name, response.jsonResult.error_message);
      } else {
        dispatch(fetchRoles());
        message.success("更新成功");
        success();
      }
    });
  };
}

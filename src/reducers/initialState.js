// 统一声明默认State
import cookie from 'js-cookie';

export default {
  auth: {
    isFetching: false,
    isAuthenticated: cookie.get('access_token') ? true : false
  },
  menus: {
    isFetching: false,
    data: []
  },
  purchaseOrders: {
    isFetching: false,
    meta: {
      total: 0,
      perPage: 10,
      page: 1
    },
    data: []
  },
  purchaseOrderItems: {
    isFetching: false,
    data: []
  },
  roles: {
    isFetching: false,
    meta: {
      total: 0,
      perPage: 10,
      page: 1
    },
    data: []
  },
  abilities: {
    isFetching: false,
    data: []
  }
};

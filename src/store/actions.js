import * as types from './mutations-types';
import Vue from 'vue';

const ajaxHandle = () => {
  const buildUrl = (url, params) => {
    let str = '?'
    for (const key in params) {
      url += str + key + '=' + params[key];
      str = '&';
    }
    return url;
  };

  const ajaxGet = (url, fn) => {
    let results = null;
    Vue.http.get(url).then((response) => {
      if (response.ok) {
        results = response.body;
        fn(1, results);
      } else {
        fn(0, results);
      }
    }, (error) => {
      if (error) {
        fn(0, results);
      }
    });
  };

  const ajaxPost = (url, params, options, fn) => {
    let results = null;

    if (typeof options === 'function' && arguments.length <= 3) {
      fn = options;
      options = {};
    }

    Vue.http.post(url, params, options).then((response) => {
      if (response.ok) {
        results = response.body;
        fn(1, results);
      } else {
        fn(0, results);
      }
    }, (error) => {
      if (error) {
        fn(0, results);
      }
    })
  };
  const normalAjax = (url, fn, originResult) => {
    var ort;
    if (originResult) {
      ort = originResult;
    } else {
      ort = [];
    }
    ajaxGet(url, function (state, results) {
      if (state) {
        let back = ort;
        if (results.status === 0) {
          if (results.data) {
            back = results.data;
          }
        }
        fn(state, back);
      } else {
        fn(state, ort);
      }
    });
  };

  const normalAjaxPost = (url, params, fn, originResult) => {
    var ort;
    if (originResult) {
      ort = originResult;
    } else {
      ort = [];
    }
    ajaxPost(url, params, function (state, results) {
      if (state) {
        let back = ort;
        if (results.status === 0) {
          if (results.data) {
            back = results.data;
          }
        }
        fn(state, back);
      } else {
        fn(state, ort);
      }
    });
  };

  return {
    buildUrl: buildUrl,
    ajaxGet: ajaxGet,
    ajaxPost: ajaxPost,
    normalAjax: normalAjax,
    normalAjaxPost: normalAjaxPost
  }
};
const ah = ajaxHandle();
const apiObj = {
  API_POST_DEPOSIT_QUERY: '/api/deposit/query', // 代扣流水查询
  API_POST_WITHDRAY_QUERY: '/api/withdraw/query', // 代付流水查询
  API_POST_TEST_URL: '/api/error_code/inner_query' // 内部错误码查询
};
export default {
  // 内部错误码查询
  testUrl ({ commit }, param) {
    var params;
    if (param) {
      params = param;
    } else {
      params = {};
    }
    return new Promise((reslove, reject) => {
      ah.ajaxPost(apiObj.API_POST_TEST_URL, params, (state, results) => {
        if (state) {
          commit(types.SET_INNER_CODE_QUERY, results);
          reslove(results);
        } else {
          commit(types.SET_INNER_CODE_QUERY, results);
          reject(results);
        }
      });
    });
  },
  // 代付流水查询
  withdary ({ commit }, param) {
    var params;
    if (param) {
      params = param;
    } else {
      params = {};
    }
    return new Promise((reslove, reject) => {
      ah.ajaxPost(apiObj.API_POST_WITHDRAY_QUERY, params, (state, results) => {
        if (state) {
          commit(types.SET_WITHDRAY_QUERY, results);
          reslove(results);
        } else {
          commit(types.SET_WITHDRAY_QUERY, results);
          reject(results);
        }
      });
    });
  },
  // 代扣流水查询
  deposit ({ commit }, param) {
    var params;
    if (param) {
      params = param;
    } else {
      params = {};
    }
    return new Promise((reslove, reject) => {
      ah.ajaxPost(apiObj.API_POST_DEPOSIT_QUERY, params, (state, results) => {
        if (state) {
          commit(types.SET_DEPOSIT_QUERY, results);
          reslove(results);
        } else {
          commit(types.SET_DEPOSIT_QUERY, results);
          reject(results);
        }
      });
    });
  }
}
import * as types from './mutations-types';
export default {
  [types.SET_INNER_CODE_QUERY] (state, payload) {
    state.userIfms = payload;
  },
  [types.SET_WITHDRAY_QUERY] (state, payload) {
    state.userIfms2 = payload;
  },
  [types.SET_DEPOSIT_QUERY] (state, payload) {
    state.userIfms3 = payload;
  }
}
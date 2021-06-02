/* eslint no-param-reassign: ["error", { "props": false }] */

export default (validationError, state) => {
  if (validationError.type === 'required') {
    state.formProcess.error = 'validation_required_error';
  } else if (validationError.type === 'url') {
    state.formProcess.error = 'validation_url_error';
  } else if (validationError.type === 'notOneOf') {
    state.formProcess.error = 'validation_double_error';
  } else {
    state.formProcess.error = 'validation_unknown_error';
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */

export default (validationError, state) => {
  if (validationError.type === 'required') {
    state.formProcess.status = 'finished';
    state.formProcess.error = 'validation_required_error';
  } else if (validationError.type === 'url') {
    state.formProcess.status = 'finished';
    state.formProcess.error = 'validation_url_error';
  } else if (validationError.type === 'notOneOf') {
    state.formProcess.status = 'finished';
    state.formProcess.error = 'validation_double_error';
  } else {
    state.formProcess.status = 'finished';
    state.formProcess.error = 'validation_unknown_error';
  }
};

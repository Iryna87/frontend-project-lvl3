/* eslint no-param-reassign: ["error", { "props": false }] */

export default (validationError, state) => {
  if (validationError.type === 'required') {
    state.form.error = 'validation_required_error';
  } else if (validationError.type === 'url') {
    state.form.error = 'validation_url_error';
  } else if (validationError.type === 'notOneOf') {
    state.form.error = 'validation_double_error';
  } else {
    state.form.error = 'validation_unknown_error';
  }
};

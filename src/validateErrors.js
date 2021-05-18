/* eslint no-param-reassign: ["error", { "props": false }] */

export default (validationError, watchedState) => {
  if (validationError.type === 'required') {
    watchedState.loadingProcess.status = 'finished';
    watchedState.formProcess.error = 'validation_required_error';
  } else if (validationError.type === 'url') {
    watchedState.loadingProcess.status = 'finished';
    watchedState.formProcess.error = 'validation_url_error';
  } else if (validationError.type === 'notOneOf') {
    watchedState.loadingProcess.status = 'finished';
    watchedState.formProcess.error = 'validation_double_error';
  } else {
    watchedState.loadingProcess.status = 'finished';
    watchedState.formProcess.error = 'validation_unknown_error';
  }
};

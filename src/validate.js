import * as yup from 'yup';

export default (url, urls, translate) => {
  yup.setLocale({
    mixed: {
      notOneOf: translate('validation_double_error'),
      required: translate('validation_required_error'),
      default: translate('validation_unknown_error'),
    },
    string: {
      url: translate('validation_url_error'),
    },
  });

  const schema = yup.string()
    .required()
    .url()
    .notOneOf(urls);
  try {
    schema.validateSync(url);
    return null;
  } catch (err) {
    return err.errors[0];
  }
};

import * as yup from 'yup';

export default (url, urls) => {
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

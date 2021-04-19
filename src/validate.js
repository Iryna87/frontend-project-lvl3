import * as yup from 'yup';

export default (str, urls) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(urls);
  try {
    schema.validateSync(str);
    return {};
  } catch (err) {
    return err;
  }
};

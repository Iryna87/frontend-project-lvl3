import * as yup from 'yup';

export default (str, arr) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(arr);
  try {
    schema.validateSync(str);
    return {};
  } catch (err) {
    return err;
  }
};

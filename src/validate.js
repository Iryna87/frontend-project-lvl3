import * as yup from 'yup';

export default (str, urls) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(urls);
  try {
    schema.validateSync(str);
    return null;
  } catch (err) {
    console.log(err);
    return err;
  }
};

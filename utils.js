function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

function error(message) {
  return {
    status: false,
    message,
  };
}

module.exports = {
  isEmpty,
  error,
};

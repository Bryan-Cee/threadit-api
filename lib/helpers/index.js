// TODO: make this method more robust and reusable by checking for the fields to
// be changed i.e. createdAt

function convertTimeToString(obj) {
  return {
    ...obj,
    createdAt: obj.createdAt.toLocaleString(),
    updatedAt: obj.updatedAt.toLocaleString(),
  };
}

module.exports = {
  convertTimeToString
};

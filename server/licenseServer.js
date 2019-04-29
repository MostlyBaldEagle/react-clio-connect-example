const Store = require("data-store");
const uuid = require('uuidv4');

let LicenseType = {
  Individual: "Individual",
};
const createLicense = () => {
  return uuid();
};

const findLicense = (user) => {
  let license = null;
  if (LicenseServer.store.has(user)) {
    license = LicenseServer.store.get(user);
  }
  return license;
};

const storeLicense = (user, license) => {
  LicenseServer.store.set(user, license);
}; ``

const LicenseServer = {
  store: new Store({ path: "license.json" }),
  getLicense: function (user) {
    let license = findLicense(user);
    if (!license) {
      license = {
        license: {
          uuid: createLicense(),
          type: LicenseType.Individual,
          discountPercent: 0,
          licenseSince: Date.now(),
        },
        username: "",
        password: "",
      };
      console.log("License created:", license);
      storeLicense(user, license);
    }
    console.log("License returned:", license);
    return license;
  },
};

module.exports = LicenseServer;

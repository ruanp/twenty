const { version } = require('../package.json');
import { version as platformVersion } from 'zapier-platform-core';
import createRecord from './creates/create_record';
import findObjects, { findObjectKey } from './triggers/find_objects'
import company, {companyKey} from './triggers/company';
import authentication from './authentication';
import 'dotenv/config';

export default {
  version,
  platformVersion,
  authentication: authentication,
  triggers: {
    [findObjectKey]: findObjects,
    [companyKey]: company,
  },
  creates: {
    [createRecord.key]: createRecord,
  },
};

import findObjectNamesPlural, { findObjectNamesPluralKey } from "./triggers/find_object_names_plural";

const { version } = require('../package.json');
import { version as platformVersion } from 'zapier-platform-core';
import createRecord, { createRecordKey } from './creates/create_record';
import findObjects, { findObjectKey } from './triggers/find_objects'
import triggerRecord, {triggerRecordKey} from './triggers/trigger_record';
import authentication from './authentication';
import 'dotenv/config';

export default {
  version,
  platformVersion,
  authentication: authentication,
  triggers: {
    [findObjectKey]: findObjects,
    [findObjectNamesPluralKey]: findObjectNamesPlural,
    [triggerRecordKey]: triggerRecord,
  },
  creates: {
    [createRecordKey]: createRecord,
  },
};

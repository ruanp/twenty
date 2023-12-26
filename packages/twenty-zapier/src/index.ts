import findObjectNamesPlural, { findObjectNamesPluralKey } from "./triggers/find_object_names_plural";

const { version } = require('../package.json');
import { version as platformVersion } from 'zapier-platform-core';
import createRecord, { createRecordKey } from './creates/create_record';
import findObjectNamesSingular, { findObjectNamesSingularKey } from './triggers/find_object_names_singular'
import triggerRecord, {triggerRecordCreatedKey} from './triggers/trigger_record_created';
import authentication from './authentication';
import 'dotenv/config';

export default {
  version,
  platformVersion,
  authentication: authentication,
  triggers: {
    [findObjectNamesSingularKey]: findObjectNamesSingular,
    [findObjectNamesPluralKey]: findObjectNamesPlural,
    [triggerRecordCreatedKey]: triggerRecord,
  },
  creates: {
    [createRecordKey]: createRecord,
  },
};

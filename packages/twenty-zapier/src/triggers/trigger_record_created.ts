import { Bundle, ZObject } from 'zapier-platform-core';
import requestDb, { requestDbViaRestApi } from '../utils/requestDb';
import handleQueryParams from '../utils/handleQueryParams';
import { findObjectNamesPluralKey } from "../triggers/find_object_names_plural";

const performSubscribe = async (z: ZObject, bundle: Bundle) => {
  const data = { targetUrl: bundle.targetUrl, operation: `create.${bundle.inputData.namePlural}` };
  const result = await requestDb(
    z,
    bundle,
    `mutation createWebhook {createWebhook(data:{${handleQueryParams(
      data,
    )}}) {id}}`,
  );
  return result.data.createWebhook;
};
const performUnsubscribe = async (z: ZObject, bundle: Bundle) => {
  const data = { id: bundle.subscribeData?.id };
  const result = await requestDb(
    z,
    bundle,
    `mutation deleteWebhook {deleteWebhook(${handleQueryParams(
      data,
    )}) {id}}`,
  );
  return result.data.deleteWebhook;
};
const perform = (z: ZObject, bundle: Bundle) => {
  return [bundle.cleanedRequest];
};
const performList = async (z: ZObject, bundle: Bundle) => {
  return await requestDbViaRestApi(
    z,
    bundle,
    bundle.inputData.namePlural
  );
};

export const triggerRecordCreatedKey = 'trigger_record_created'

export default {
  key: triggerRecordCreatedKey,
  noun: 'Record',
  display: {
    label: 'Record Trigger Created',
    description: 'Triggers when a Record is created.',
  },
  operation: {
    inputFields: [
      {
        key: 'namePlural',
        required: true,
        label: 'Record Name',
        dynamic: `${findObjectNamesPluralKey}.namePlural`,
        altersDynamicFields: true,
      },
    ],
    type: 'hook',
    performSubscribe,
    performUnsubscribe,
    perform,
    performList,
    sample: {
      id: 'f75f6b2e-9442-4c72-aa95-47d8e5ec8cb3',
      createdAt: '2023-10-19T07:37:25.306Z',
      workspaceId: 'c8b070fc-c969-4ca5-837a-e7c3735734d2',
    },
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'createdAt', label: 'Created At' },
      { key: 'workspaceId', label: 'Workspace ID' },
    ],
  },
};

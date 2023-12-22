import { Bundle, ZObject } from "zapier-platform-core";
import { requestSchema } from "../utils/requestDb";

const objectListRequest = async (z: ZObject, bundle: Bundle) => {
  const schema = await requestSchema(z, bundle)
  return Object.keys(schema.components.schemas).map((schema)=> {
    return {id: schema, nameSingular: schema}
  })
}

export const findObjectKey = 'find_objects'

export default {
  display: {
    description: 'Find objects',
    label: 'Find objects',
    hidden: true,
  },
  key: findObjectKey,
  noun: 'Object',
  operation: {
    perform: objectListRequest,
  },
}

export const getObjectOrderByField = (objectSingleName: string): string => {
  if (objectSingleName === ObjectMetadata) {
    return 'name';
  }

  if (['workspaceMember', 'person'].includes(objectSingleName)) {
    return 'name';
  }

  return 'createdAt';
};

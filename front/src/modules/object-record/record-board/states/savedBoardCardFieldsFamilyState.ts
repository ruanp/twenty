import { atomFamily } from 'recoil';

import { FieldMetadata } from '@/object-record/field/types/FieldMetadata';

import { BoardFieldDefinition } from '../types/BoardFieldDefinition';

export const savedBoardCardFieldsFamilyState = atomFamily<
  BoardFieldDefinition<FieldMetadata>[],
  string | undefined
>({
  key: 'savedBoardCardFieldsFamilyState',
  default: [],
});

import { createContext } from 'react';

import { RecoilScopeContext } from '@/types/RecoilScopeContext';
import { FieldMetadata } from '@/object-record/field/types/FieldMetadata';
import { BoardFieldDefinition } from '@/object-record/record-board/types/BoardFieldDefinition';

export const BoardContext = createContext<{
  BoardRecoilScopeContext: RecoilScopeContext;
  onFieldsChange: (fields: BoardFieldDefinition<FieldMetadata>[]) => void;
}>({
  BoardRecoilScopeContext: createContext<string | null>(null),
  onFieldsChange: () => {},
});

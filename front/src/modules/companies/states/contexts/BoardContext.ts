import { createContext } from 'react';

import { FieldMetadata } from '@/object-record/field/types/FieldMetadata';
import { BoardFieldDefinition } from '@/object-record/record-board/types/BoardFieldDefinition';
import { RecoilScopeContext } from '@/types/RecoilScopeContext';

export const BoardContext = createContext<{
  BoardRecoilScopeContext: RecoilScopeContext;
  onFieldsChange: (fields: BoardFieldDefinition<FieldMetadata>[]) => void;
}>({
  BoardRecoilScopeContext: createContext<string | null>(null),
  onFieldsChange: () => {},
});

import { useCallback } from 'react';

import { FieldMetadata } from '@/object-record/field/types/FieldMetadata';
import { savedBoardCardFieldsFamilyState } from '@/object-record/record-board/states/savedBoardCardFieldsFamilyState';
import { BoardFieldDefinition } from '@/object-record/record-board/types/BoardFieldDefinition';
import { ColumnDefinition } from '@/object-record/record-table/types/ColumnDefinition';
import { useRecoilScopedState } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopedState';

import { boardCardFieldsScopedState } from '../states/boardCardFieldsScopedState';

import { useBoardContext } from './useBoardContext';

export const useBoardCardFields = () => {
  const { BoardRecoilScopeContext, onFieldsChange } = useBoardContext();

  const [, setBoardCardFields] = useRecoilScopedState(
    boardCardFieldsScopedState,
    BoardRecoilScopeContext,
  );

  const [, setSavedBoardCardFields] = useRecoilScopedState(
    savedBoardCardFieldsFamilyState,
    BoardRecoilScopeContext,
  );

  const handleFieldVisibilityChange = (
    field: Omit<ColumnDefinition<FieldMetadata>, 'size' | 'position'>,
  ) => {
    setBoardCardFields((previousFields) =>
      previousFields.map((previousField) =>
        previousField.fieldMetadataId === field.fieldMetadataId
          ? { ...previousField, isVisible: !field.isVisible }
          : previousField,
      ),
    );
  };

  const handleFieldsChange = useCallback(
    async (fields: BoardFieldDefinition<FieldMetadata>[]) => {
      setSavedBoardCardFields(fields);
      setBoardCardFields(fields);

      await onFieldsChange?.(fields);
    },
    [setBoardCardFields, setSavedBoardCardFields, onFieldsChange],
  );

  const handleFieldsReorder = useCallback(
    async (fields: BoardFieldDefinition<FieldMetadata>[]) => {
      const updatedFields = fields.map((column, index) => ({
        ...column,
        position: index,
      }));

      await handleFieldsChange(updatedFields);
    },
    [handleFieldsChange],
  );

  return { handleFieldVisibilityChange, handleFieldsReorder };
};

import { atom } from 'recoil';

import { BoardColumnDefinition } from '@/object-record/record-board/types/BoardColumnDefinition';

export const boardColumnsState = atom<BoardColumnDefinition[]>({
  key: 'boardColumnsState',
  default: [],
});

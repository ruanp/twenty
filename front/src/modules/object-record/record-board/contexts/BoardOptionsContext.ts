import { createContext } from 'react';

import { BoardOptions } from '@/object-record/record-board/types/BoardOptions';

export const BoardOptionsContext = createContext<BoardOptions | null>(null);

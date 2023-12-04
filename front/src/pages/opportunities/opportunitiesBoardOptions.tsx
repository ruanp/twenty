import { CompanyBoardCard } from '@/companies/components/CompanyBoardCard';
import { NewOpportunityButton } from '@/companies/components/NewOpportunityButton';
import { BoardOptions } from '@/object-record/record-board/types/BoardOptions';

export const opportunitiesBoardOptions: BoardOptions = {
  newCardComponent: <NewOpportunityButton />,
  CardComponent: CompanyBoardCard,
};

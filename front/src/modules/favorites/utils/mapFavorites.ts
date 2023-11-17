import { getLogoUrlFromDomainName } from '~/utils';
import { assertNotNull } from '~/utils/assert';

export const mapFavorites = (
  favorites: any,
  records: {
    [key: string]: any;
  },
) => {
  return favorites
    .map(({ node: favorite }: any) => {
      const recordInformation = favorite.person
        ? {
            id: favorite.person.id,
            labelIdentifier:
              records[favorite.person.id].firstName +
              ' ' +
              records[favorite.person.id].lastName,
            avatarUrl: records[favorite.person.id].avatarUrl,
            avatarType: 'rounded',
            link: `/object/personV2/${favorite.person.id}`,
          }
        : favorite.company
        ? {
            id: favorite.company.id,
            labelIdentifier: records[favorite.company.id].name,
            avatarUrl: getLogoUrlFromDomainName(
              records[favorite.company.id].domainName ?? '',
            ),
            avatarType: 'squared',
            link: `/object/companyV2/${favorite.company.id}`,
          }
        : undefined;

      return {
        ...recordInformation,
        recordId: recordInformation?.id,
        id: favorite.id,
        position: favorite.position,
      };
    })
    .filter(assertNotNull)
    .sort((a: any, b: any) => a.position - b.position);
};

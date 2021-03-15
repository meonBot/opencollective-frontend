import { getFilteredSectionsForCollective, getSectionsNames } from '../../../lib/collective-sections';
import { CollectiveType } from '../../../lib/constants/collectives';
import { API_V2_CONTEXT } from '../../../lib/graphql/helpers';

import { recurringContributionsQuery } from '../../recurring-contributions/graphql/queries';
import {
  getTotalCollectiveContributionsQueryVariables,
  totalCollectiveContributionsQuery,
} from '../hero/HeroTotalCollectiveContributionsWithData';
import { budgetSectionQuery, getBudgetSectionQueryVariables } from '../sections/Budget';
import { contributionsSectionQuery, getContributionsSectionQueryVariables } from '../sections/Contributions';
import { conversationsSectionQuery, getConversationsSectionQueryVariables } from '../sections/Conversations';
import { getRecurringContributionsSectionQueryVariables } from '../sections/RecurringContributions';
import { getTransactionsSectionQueryVariables, transactionsSectionQuery } from '../sections/Transactions';
import { getUpdatesSectionQueryVariables, updatesSectionQuery } from '../sections/Updates';

import { collectivePageQuery, getCollectivePageQueryVariables } from './queries';

export const preloadCollectivePageGraphlQueries = async (slug, client) => {
  const result = await client.query({
    query: collectivePageQuery,
    variables: getCollectivePageQueryVariables(slug),
  });
  const collective = result?.data?.Collective;
  if (collective) {
    const sections = getFilteredSectionsForCollective(collective);
    const sectionsNames = getSectionsNames(sections);
    const queries = [];
    if (sectionsNames.includes('budget')) {
      queries.push(
        client.query({
          query: budgetSectionQuery,
          variables: getBudgetSectionQueryVariables(slug),
          context: API_V2_CONTEXT,
        }),
      );
    }
    if (sectionsNames.includes('contributions')) {
      queries.push(
        client.query({
          query: contributionsSectionQuery,
          variables: getContributionsSectionQueryVariables(slug),
        }),
      );
    }
    if (sectionsNames.includes('transactions')) {
      queries.push(
        client.query({
          query: transactionsSectionQuery,
          variables: getTransactionsSectionQueryVariables(slug),
          context: API_V2_CONTEXT,
        }),
      );
    }
    if (sectionsNames.includes('recurring-contributions')) {
      queries.push(
        client.query({
          query: recurringContributionsQuery,
          variables: getRecurringContributionsSectionQueryVariables(slug),
          context: API_V2_CONTEXT,
        }),
      );
    }
    if (sectionsNames.includes('updates')) {
      queries.push(
        client.query({
          query: updatesSectionQuery,
          variables: getUpdatesSectionQueryVariables(slug),
        }),
      );
    }
    if (sectionsNames.includes('conversations')) {
      queries.push(
        client.query({
          query: conversationsSectionQuery,
          variables: getConversationsSectionQueryVariables(slug),
          context: API_V2_CONTEXT,
        }),
      );
    }
    const isCollective = collective.type === CollectiveType.COLLECTIVE;
    const isEvent = collective.type === CollectiveType.EVENT;
    if (!isCollective && !isEvent && !collective.isHost) {
      queries.push(
        client.query({
          query: totalCollectiveContributionsQuery,
          variables: getTotalCollectiveContributionsQueryVariables(slug),
        }),
      );
    }
    await Promise.all(queries);
  }
};

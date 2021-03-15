import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import styled, { css } from 'styled-components';

import { ContributionTypes } from '../../lib/constants/contribution-types';

import { ContributorAvatar } from '../Avatar';
import Container from '../Container';
import { Box, Flex } from '../Grid';
import Link from '../Link';
import StyledButton from '../StyledButton';
import StyledHr from '../StyledHr';
import StyledTag from '../StyledTag';
import { P } from '../Text';

/** Max number of contributors on each tier card */
export const MAX_CONTRIBUTORS_PER_CONTRIBUTE_CARD = 4;
export const CONTRIBUTE_CARD_WIDTH = 280;
export const CONTRIBUTE_CARD_BORDER_RADIUS = 16;

/** The main container */
const StyledContributeCard = styled.div`
  display: flex;
  flex-direction: column;
  width: ${CONTRIBUTE_CARD_WIDTH}px;
  flex: 0 0 ${CONTRIBUTE_CARD_WIDTH}px;
  height: 100%;
  border-radius: ${CONTRIBUTE_CARD_BORDER_RADIUS}px;
  border: 1px solid #dcdee0;
  background: white;
`;

/** Tier card banner */
const CoverImage = styled.div`
  height: 104px;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 16px;
  position: relative;
  border-radius: 16px 16px 0 0;

  ${props => {
    const primary = props.theme.colors.primary;
    const radial = `radial-gradient(circle, ${primary[300]} 0%, ${primary[800]} 100%), `;
    const image = props.image ? `url(${props.image}), ` : '';
    return css`
      background: ${image} ${radial} ${primary[500]};
      ${props.isDisabled && `filter: grayscale(0.75);`}
    `;
  }};
`;

/** Tier's description */
const Description = styled.div`
  overflow-wrap: break-word;
  margin: 8px 0;
  font-size: 14px;
  letter-spacing: -0.2px;
  line-height: 20px;
  height: 100%;
  flex: 1 1;
`;

/** Translations */
const I18nContributionType = defineMessages({
  [ContributionTypes.FINANCIAL_CUSTOM]: {
    id: 'ContributionType.Custom',
    defaultMessage: 'Custom contribution',
  },
  [ContributionTypes.FINANCIAL_ONE_TIME]: {
    id: 'ContributionType.OneTime',
    defaultMessage: 'One-time contribution',
  },
  [ContributionTypes.FINANCIAL_RECURRING]: {
    id: 'ContributionType.Recurring',
    defaultMessage: 'Recurring contribution',
  },
  [ContributionTypes.FINANCIAL_GOAL]: {
    id: 'ContributionType.Goal',
    defaultMessage: 'Goal',
  },
  [ContributionTypes.EVENT_PARTICIPATE]: {
    id: 'ContributionType.Event',
    defaultMessage: 'Event',
  },
  [ContributionTypes.EVENT_PASSED]: {
    id: 'ContributionType.EventPassed',
    defaultMessage: 'Past event',
  },
  [ContributionTypes.TIER_PASSED]: {
    id: 'ContributionType.TierPassed',
    defaultMessage: 'Past tier',
  },
  [ContributionTypes.PRODUCT]: {
    id: 'ContributionType.Product',
    defaultMessage: 'Product',
  },
  [ContributionTypes.TICKET]: {
    id: 'ContributionType.Ticket',
    defaultMessage: 'Ticket',
  },
  [ContributionTypes.MEMBERSHIP]: {
    id: 'ContributionType.Membership',
    defaultMessage: 'Membership',
  },
  [ContributionTypes.CHILD_COLLECTIVE]: {
    id: 'ContributionType.ChildCollective',
    defaultMessage: 'Connected Collective',
  },
  [ContributionTypes.PROJECT]: {
    id: 'ContributionType.Project',
    defaultMessage: 'Project',
  },
});

const getContributeCTA = type => {
  switch (type) {
    case ContributionTypes.FINANCIAL_GOAL:
      return <FormattedMessage id="ContributeCard.BtnGoal" defaultMessage="Contribute to this goal" />;
    case ContributionTypes.TICKET:
      return <FormattedMessage id="ContributeCard.BtnEvent" defaultMessage="RVSP" />;
    case ContributionTypes.EVENT_PARTICIPATE:
    case ContributionTypes.EVENT_PASSED:
      return <FormattedMessage id="ContributeCard.BtnViewEvent" defaultMessage="View Event" />;
    case ContributionTypes.CHILD_COLLECTIVE:
      return <FormattedMessage id="ContributeCard.SeeCollective" defaultMessage="View Collective" />;
    case ContributionTypes.PROJECT:
      return <FormattedMessage id="ContributeCard.SeeMore" defaultMessage="See More" />;
    default:
      return <FormattedMessage id="Contribute" defaultMessage="Contribute" />;
  }
};

const getFooterHeading = type => {
  switch (type) {
    case ContributionTypes.TICKET:
    case ContributionTypes.EVENT_PARTICIPATE:
      return <FormattedMessage id="ContributeCard.footer.ticket" defaultMessage="Attending" />;
    case ContributionTypes.EVENT_PASSED:
      return <FormattedMessage id="ContributeCard.footer.pastEvent" defaultMessage="Attended by" />;
    default:
      return <FormattedMessage id="ContributeCard.contributionsBy" defaultMessage="Contributions by" />;
  }
};

const getCTAButtonStyle = type => {
  if (type === ContributionTypes.TICKET) {
    return 'secondary';
  } else {
    return 'primary';
  }
};

/**
 * A contribute card with a "Contribute" call to action
 */
const ContributeCard = ({
  intl,
  title,
  type,
  route,
  buttonText,
  children,
  contributors,
  stats,
  hideContributors,
  image,
  disableCTA,
  ...props
}) => {
  const totalContributors = (stats && stats.all) || (contributors && contributors.length) || 0;

  return (
    <StyledContributeCard {...props}>
      <CoverImage image={image} isDisabled={disableCTA}>
        <StyledTag
          position="absolute"
          bottom="8px"
          left="8px"
          background="white"
          color="black.700"
          fontWeight="600"
          letterSpacing="0.5px"
          textTransform="uppercase"
        >
          {intl.formatMessage(I18nContributionType[type])}
        </StyledTag>
      </CoverImage>
      <Flex px={3} py={3} flexDirection="column" justifyContent="space-between" flex="1">
        <Flex flexDirection="column" flex="1 1">
          <P fontSize="20px" mt={1} mb={2} fontWeight="bold" data-cy="contribute-title">
            {title}
          </P>
          <Description data-cy="contribute-description">{children}</Description>
        </Flex>
        <Box>
          {!disableCTA && (
            <Link href={route}>
              <StyledButton buttonStyle={getCTAButtonStyle(type)} width={1} mb={2} mt={3} data-cy="contribute-btn">
                {buttonText || getContributeCTA(type)}
              </StyledButton>
            </Link>
          )}
          {!hideContributors && (
            <Box mt={3} height={60}>
              {contributors && contributors.length > 0 && (
                <React.Fragment>
                  <Flex alignItems="center" mt={3} mb={2}>
                    <P
                      color="black.700"
                      fontSize="9px"
                      fontWeight="500"
                      letterSpacing="0.06em"
                      pr={2}
                      textTransform="uppercase"
                      whiteSpace="nowrap"
                    >
                      {getFooterHeading(type)}
                    </P>
                    <StyledHr flex="1" borderStyle="solid" borderColor="#DCDEE0" />
                  </Flex>
                  <Flex>
                    {contributors.slice(0, MAX_CONTRIBUTORS_PER_CONTRIBUTE_CARD).map(contributor => (
                      <Box key={contributor.id} mx={1}>
                        {contributor.collectiveSlug ? (
                          <Link href={`/${contributor.collectiveSlug}`} title={contributor.name}>
                            <ContributorAvatar contributor={contributor} radius={32} />
                          </Link>
                        ) : (
                          <ContributorAvatar contributor={contributor} radius={32} title={contributor.name} />
                        )}
                      </Box>
                    ))}
                    {totalContributors > MAX_CONTRIBUTORS_PER_CONTRIBUTE_CARD && (
                      <Container ml={2} pt="0.7em" fontSize="11px" fontWeight="bold" color="black.600">
                        + {totalContributors - MAX_CONTRIBUTORS_PER_CONTRIBUTE_CARD}
                      </Container>
                    )}
                  </Flex>
                </React.Fragment>
              )}
            </Box>
          )}
        </Box>
      </Flex>
    </StyledContributeCard>
  );
};

ContributeCard.propTypes = {
  /** Contribution title */
  title: PropTypes.node.isRequired,
  /** Type of the contribution */
  type: PropTypes.oneOf(Object.values(ContributionTypes)).isRequired,
  /** Route for the contribute button */
  route: PropTypes.string.isRequired,
  /** A custom button text to override the default one */
  buttonText: PropTypes.string,
  /** An image to display on the card hero */
  image: PropTypes.string,
  /** The card body */
  children: PropTypes.node,
  /** If true, the call to action will not be displayed */
  disableCTA: PropTypes.bool,
  /** Contributors */
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      collectiveSlug: PropTypes.string,
    }),
  ),
  /** Contributors stats */
  stats: PropTypes.shape({
    all: PropTypes.number,
    users: PropTypes.number,
    organizations: PropTypes.number,
  }),
  /** If true, contributors will not be displayed */
  hideContributors: PropTypes.bool,
  /** @ignore from injectIntl */
  intl: PropTypes.object.isRequired,
  router: PropTypes.object,
};

export default injectIntl(ContributeCard);

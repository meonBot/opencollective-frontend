import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import Container from './Container';
import { Flex } from './Grid';
import Link from './Link';
import StyledButton from './StyledButton';
import StyledInput from './StyledInput';

const Pagination = ({ route, limit, offset, total, scrollToTopOnChange, isDisabled, ignoredQueryParams }) => {
  const router = useRouter();
  const totalPages = Math.ceil(total / limit);
  const currentPage = offset / limit + 1;
  const queryParams = ignoredQueryParams ? omit(router.query, ignoredQueryParams) : router.query;
  route = route || router.asPath.split('?')[0];
  isDisabled = isDisabled || totalPages <= 1;

  if (!router) {
    return null;
  }

  const changePage = async ({ target, key }) => {
    if (key && key !== 'Enter') {
      return;
    }

    const { value } = target;
    if (!value || !parseInt(value) || parseInt(value) === currentPage) {
      return;
    }
    await router.push({ pathname: route, query: { ...queryParams, offset: (value - 1) * limit } });

    if (scrollToTopOnChange) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <Flex alignItems="center">
      {currentPage > 1 && (
        <Link
          href={{ pathname: route, query: { ...queryParams, offset: offset - limit } }}
          scroll={scrollToTopOnChange}
        >
          <StyledButton buttonSize="small" disabled={isDisabled}>
            <FormattedMessage id="Pagination.Prev" defaultMessage="Previous" />
          </StyledButton>
        </Link>
      )}
      <Container display="inline-block" mx={2}>
        <FormattedMessage
          id="Pagination.Count"
          defaultMessage="Page {current} of {total}"
          values={{
            current: (
              <StyledInput
                key={offset}
                defaultValue={currentPage}
                onBlur={changePage}
                onKeyPress={changePage}
                textAlign="center"
                mx={1}
                px={1}
                py={1}
                width={30}
                disabled={isDisabled}
                type="text"
                pattern="[0-9]+"
                inputMode="numeric"
                data-cy="pagination-current"
              />
            ),
            total: <span data-cy="pagination-total">{totalPages || 1}</span>,
          }}
        />
      </Container>
      {currentPage < totalPages && (
        <Link
          href={{ pathname: route, query: { ...queryParams, offset: offset + limit } }}
          scroll={scrollToTopOnChange}
        >
          <StyledButton buttonSize="small" disabled={isDisabled}>
            <FormattedMessage id="Pagination.Next" defaultMessage="Next" />
          </StyledButton>
        </Link>
      )}
    </Flex>
  );
};

Pagination.propTypes = {
  limit: PropTypes.number,
  offset: PropTypes.number,
  total: PropTypes.number,
  isDisabled: PropTypes.bool,
  route: PropTypes.string,
  /** By default, all query params will be transferred in the paginated link. This prop is useful to filter query params that are part of the URL. */
  ignoredQueryParams: PropTypes.arrayOf(PropTypes.string),
  /** Use this to scroll back on top when pagination changes */
  scrollToTopOnChange: PropTypes.bool,
};

Pagination.defaultProps = {
  scrollToTopOnChange: false,
};

export default Pagination;

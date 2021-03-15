import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatCurrency } from '../../../lib/currency-utils';

import Container from '../../Container';
import SendMoneyToCollectiveBtn from '../../SendMoneyToCollectiveBtn';
import StyledButton from '../../StyledButton';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../StyledModal';
import { P } from '../../Text';
import SettingsSectionTitle from '../sections/SettingsSectionTitle';

const EmptyBalance = ({ collective, LoggedInUser }) => {
  const [modal, setModal] = useState({ type: 'Transfer', show: false, isApproved: false });

  if (!collective.host || collective.host.id === collective.id) {
    return null;
  }

  const confirmTransfer = () => {
    setModal({ ...modal, show: true, isApproved: false });
  };

  const closeModal = () => setModal({ ...modal, show: false, isApproved: false });

  return (
    <Container display="flex" flexDirection="column" width={1} alignItems="flex-start" mb={50}>
      <SettingsSectionTitle>
        <FormattedMessage
          id="collective.balance.title"
          defaultMessage={
            'Empty {type, select, EVENT {Event} PROJECT {Project} FUND {Fund} COLLECTIVE {Collective} other {account}} balance'
          }
          values={{ type: collective.type }}
        />
      </SettingsSectionTitle>
      <P mb={2} lineHeight="16px" fontSize="14px">
        <FormattedMessage
          id="collective.balance.description"
          defaultMessage={
            'Transfer remaining balance to the Fiscal Host. {type, select, EVENT {Event} PROJECT {Project} FUND {Fund} COLLECTIVE {Collective} other {account}} balance must be zero to archive or change Hosts. Alternatively, you can submit an expense or donate to another Collective to zero the balance.'
          }
          values={{ type: collective.type }}
        />
      </P>
      {!collective.host.hostCollective && (
        <P color="rgb(224, 183, 0)" my={2}>
          <FormattedMessage
            id="collective.balance.notAvailable"
            defaultMessage={
              "The Host doesn't support this feature. Submit an expense, donate to another Collective, or contact support if you're blocked."
            }
          />
        </P>
      )}
      {collective.host.hostCollective && (
        <Fragment>
          {collective.stats.balance > 0 && (
            <SendMoneyToCollectiveBtn
              fromCollective={collective}
              toCollective={collective.host.hostCollective}
              LoggedInUser={LoggedInUser}
              amount={collective.stats.balance}
              currency={collective.currency}
              confirmTransfer={confirmTransfer}
              isTransferApproved={modal.isApproved}
            />
          )}
          {collective.stats.balance === 0 && (
            <StyledButton disabled={true}>
              <FormattedMessage
                id="SendMoneyToCollective.btn"
                defaultMessage="Send {amount} to {collective}"
                values={{
                  amount: formatCurrency(0, collective.currency),
                  collective: collective.host.hostCollective.name,
                }}
              />
            </StyledButton>
          )}
          <Modal show={modal.show} width="570px" onClose={closeModal}>
            <ModalHeader onClose={closeModal}>
              <FormattedMessage
                id="collective.emptyBalance.header"
                values={{ action: modal.type }}
                defaultMessage={'{action} Balance'}
              />
            </ModalHeader>
            <ModalBody>
              <P>
                <FormattedMessage
                  id="collective.emptyBalance.body"
                  values={{ collective: collective.host.hostCollective.name, action: modal.type.toLowerCase() }}
                  defaultMessage={'Are you sure you want to {action} to {collective}?'}
                />
              </P>
            </ModalBody>
            <ModalFooter>
              <Container display="flex" justifyContent="flex-end">
                <StyledButton mx={20} onClick={() => setModal({ ...modal, show: false, isApproved: false })}>
                  <FormattedMessage id="actions.cancel" defaultMessage={'Cancel'} />
                </StyledButton>
                <StyledButton
                  buttonStyle="primary"
                  data-cy="action"
                  onClick={() => setModal({ ...modal, show: false, isApproved: true })}
                >
                  <FormattedMessage id="confirm" defaultMessage={'Confirm'} />
                </StyledButton>
              </Container>
            </ModalFooter>
          </Modal>
        </Fragment>
      )}
    </Container>
  );
};

EmptyBalance.propTypes = {
  collective: PropTypes.object.isRequired,
  LoggedInUser: PropTypes.object.isRequired,
};

export default EmptyBalance;

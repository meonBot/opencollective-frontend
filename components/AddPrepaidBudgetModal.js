import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { pick } from 'lodash';
import { Col, Modal, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import AddPrepaidBudget from './AddPrepaidBudget';
import Button from './Button';
import { withUser } from './UserProvider';

const addPrepaidBudgetMutation = gql`
  mutation AddPrepaidBudget($totalAmount: Int!, $CollectiveId: Int!, $HostCollectiveId: Int!, $description: String) {
    addFundsToOrg(
      totalAmount: $totalAmount
      CollectiveId: $CollectiveId
      HostCollectiveId: $HostCollectiveId
      description: $description
    ) {
      id
    }
  }
`;

const AddPrepaidBudgetModal = ({ LoggedInUser, show, setShow, collective, host }) => {
  const [loading, setLoading] = React.useState(false);
  const [prepaidBudgetAdded, setPrepaidBudgetAdded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const close = () => {
    setShow(false);
    setError(null);
    setPrepaidBudgetAdded(null);
  };

  if (!LoggedInUser) {
    return null;
  }

  return (
    <Modal show={show} onHide={close}>
      <Modal.Body>
        <Row>
          <Col sm={12}>
            {prepaidBudgetAdded && (
              <div>
                <h1>
                  <FormattedMessage id="AddPrepaidBudget.Success" defaultMessage="Prepaid budget added successfully" />
                </h1>
                <center>
                  <Button className="blue" onClick={close}>
                    Ok
                  </Button>
                </center>
              </div>
            )}
            {!prepaidBudgetAdded && (
              <Mutation mutation={addPrepaidBudgetMutation}>
                {addFunds => (
                  <AddPrepaidBudget
                    LoggedInUser={LoggedInUser}
                    collective={collective}
                    host={host}
                    loading={loading}
                    onCancel={close}
                    onSubmit={async form => {
                      const finalizeWithError = error => {
                        setError(error);
                        setLoading(false);
                      };

                      if (form.totalAmount === 0) {
                        return finalizeWithError('Total amount must be > 0');
                      } else if (!form.FromCollectiveId) {
                        return finalizeWithError('No host selected');
                      }

                      setLoading(true);
                      try {
                        await addFunds({
                          variables: {
                            ...pick(form, ['totalAmount', 'description']),
                            CollectiveId: collective.legacyId || collective.id,
                            HostCollectiveId: Number(form.FromCollectiveId),
                          },
                        });
                        setPrepaidBudgetAdded(true);
                        setLoading(false);
                        setError(null);
                        return null;
                      } catch (e) {
                        return finalizeWithError(e.message);
                      }
                    }}
                  />
                )}
              </Mutation>
            )}
          </Col>
        </Row>
        <Row>
          <Col sm={2} />
          <Col sm={10}>{error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}</Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

AddPrepaidBudgetModal.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
  collective: PropTypes.object,
  host: PropTypes.object,
  /** @ignore from withUser */
  LoggedInUser: PropTypes.object,
};

AddPrepaidBudgetModal.defaultProps = {
  show: false,
};

export default withUser(AddPrepaidBudgetModal);

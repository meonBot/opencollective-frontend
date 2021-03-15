import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';

import hasFeature, { FEATURES } from '../../../lib/allowed-features';
import { CollectiveType } from '../../../lib/constants/collectives';

import SettingsTitle from '../SettingsTitle';

import BankTransfer from './BankTransfer';
import ConnectedAccounts from './ConnectedAccounts';

const { USER } = CollectiveType;

class ReceivingMoney extends React.Component {
  static propTypes = {
    collective: PropTypes.object.isRequired,
  };

  state = {
    hideTopsection: false,
  };

  hideTopsection = value => {
    this.setState({ hideTopsection: value });
  };

  render() {
    const services = ['stripe'];

    if (hasFeature(this.props.collective, FEATURES.PAYPAL_DONATIONS)) {
      services.push('paypal');
    }

    return (
      <Fragment>
        {!this.state.hideTopsection && (
          <React.Fragment>
            <SettingsTitle mb={4}>
              <FormattedMessage id="editCollective.receivingMoney" defaultMessage="Receiving Money" />
            </SettingsTitle>
            <ConnectedAccounts
              collective={this.props.collective}
              connectedAccounts={this.props.collective.connectedAccounts}
              services={services}
              variation="RECEIVING"
            />
          </React.Fragment>
        )}
        {(this.props.collective.type !== USER || has(this.props.collective, 'data.settings.paymentMethods.manual')) && (
          <BankTransfer collectiveSlug={this.props.collective.slug} hideTopsection={this.hideTopsection} />
        )}
      </Fragment>
    );
  }
}

export default injectIntl(ReceivingMoney);

import React from 'react';
import style from './style.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import animate from 'gsap-promise';

import * as ContactsActions from '../../actions/setContacts';
import * as EmailActions from '../../actions/emailTo';
import * as EmailFocus from '../../actions/emailFocus';

import contactList from '../../utils/contactList';

class EmailForm extends React.Component {
  static propTypes = {
    emailContacts: React.PropTypes.array,
    emailTo: React.PropTypes.array,
    setContacts: React.PropTypes.func,
    setEmailTo: React.PropTypes.func,
    emailFocus: React.PropTypes.bool,
    setEmailFocus: React.PropTypes.func
  }

  state = {
    emailToggle: false,
    emailEntry: ''
  }

  componentWillMount() {
    // hardcoded contact list
    this.props.setContacts(contactList);
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextState.emailToggle === true) {
      this.animateIn();
    }
    else {
      this.animateOut();
    }
  }

  animateIn = () => {
    TweenMax.killTweensOf(this.refs.emailBox);
    animate.to(this.refs.emailBox, 0.5, {height: '53vh', bottom: '50vh', opacity: 1});
    animate.to(this.refs.arrow, 0.5, {rotation: '180'});
  }

  animateOut = () => {
    TweenMax.killTweensOf(this.refs.emailBox);
    animate.to(this.refs.emailBox, 0.5, {height: '0', bottom: 0, opacity: 0 });
    animate.to(this.refs.arrow, 0.5, {rotation: 0});
  }

  onEmailClick = (email) => {
    let tempArr = [];
    if(this.props.emailTo.findIndex(x => x.name === email.name) === -1) {
      this.props.emailTo.forEach((item) => {
        tempArr.push(item);
      });
      tempArr.push(email);
    }
    else {
      this.props.emailTo.forEach((item) => {
        tempArr.push(item);
      });
      tempArr.splice(tempArr.findIndex(x => x.name === email.name), 1);

    }
    this.props.setEmailTo(tempArr);
  }

  toggleEmail = () => {
    this.setState({emailToggle: !this.state.emailToggle});
  }

  toggleFocus = () => {
    this.props.setEmailFocus(!this.props.emailFocus);
    this.updateEmail();
  }

  updateEmail = () => {
    const emailTo = this.props.emailTo;
    const entryVal = this.refs.emailEntry.value;
    const manualEntry = {
      name: 'manual',
      email: entryVal,
      manual: true
    };
    let tempArr = [];
    emailTo.forEach((item) => {
      tempArr.push(item);
    });
    let manualEmailIndex = tempArr.findIndex(x => x.manual === true);
    if(manualEmailIndex !== -1) tempArr.splice(manualEmailIndex, 1, manualEntry);
    else tempArr.push(manualEntry);

    this.props.setEmailTo(tempArr);
  }

  render() {
    const { emailContacts, emailTo } = this.props;
    const _this = this;
    const onEmailClick = this.onEmailClick;
    return (
      <div className={style.email}>
        <div className={style.inputContainer}>
          <input
            className={style.emailEntry}
            placeholder="SEND TO:"
            onFocus={this.toggleFocus.bind(this)}
            onBlur={this.toggleFocus.bind(this)}
            type="text"
            ref="emailEntry"
          />
          <div className={style.arrow} onClick={this.toggleEmail.bind(this)} ref='arrow'></div>
        </div>
        <div className={style.emailBoxWrapper} ref="emailBox">
          <div className={style.emailBox}>
            {
              emailContacts.map((item, index) => {
                const selected = emailTo.findIndex(x => x.name === item.name) !== -1;
                const listItemStyle = classnames(style.listItem, {
                  [style.listItemSelected]: selected
                });
                return (
                  <div
                    key={index}
                    className={listItemStyle}
                    onClick={onEmailClick.bind(_this, item)}
                  >
                    {item.name}
                  </div>
                );
              })
            }
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        emailContacts: state.emailContacts,
        emailTo: state.emailTo,
        emailFocus: state.emailFocus
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ContactsActions, EmailActions, EmailFocus), dispatch);
}

const EmailFormContainer = connect(mapStateToProps, mapDispatchToProps)(EmailForm);

export default EmailFormContainer;

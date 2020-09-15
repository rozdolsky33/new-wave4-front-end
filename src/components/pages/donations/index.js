import React from "react";
import {Alert, Button, Col, Form, FormControl, InputGroup} from "react-bootstrap";
import i18n from "../../../i18n";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../../store/main/Main-actions";
import {history} from "../../App";

class DonationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      email: '',
      amount: null,
      cardNumber: '',
      expMonth: null,
      expYear: null,
      cvc: null
    }
  }
  render () {
    return (
        <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
          <h2 className="p-3 text-secondary">{i18n.t("donation.title")}</h2>
          <p className="text-center">{i18n.t("donation.sub-title-1")}<br/>
            {i18n.t("donation.sub-title-2")}</p>
          <Form onSubmit={async(e) => {
            e.preventDefault();
            await this.props.donate(this.state.fullName, this.state.email, this.state.amount,
                this.state.cardNumber.replace(/\s+/g, ""), this.state.expMonth, this.state.expYear, this.state.cvc);
            if (!this.props.errorMessage) {
              history.push("/result");
            }
          }}>
            <InputGroup className="mb-3">
              <Form.Check
                  checked={true}
                  name="donate-by"
                  inline
                  label={i18n.t("donation.donate-by") + "Credit Card"}
                  type="radio"
                  id="donate-credit-card"
              />
              <Form.Check
                  name="donate-by"
                  inline
                  disabled
                  label={i18n.t("donation.donate-by") + "PayPal"}
                  type="radio"
                  id="donate-pay-pal"
              />
              <Form.Check
                  name="donate-by"
                  inline
                  disabled
                  label={i18n.t("donation.donate-by") + i18n.t("donation.check")}
                  type="radio"
                  id="donate-check"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="contact-us-name">&nbsp;&#9829;</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl required
                           value={this.state.fullName}
                           onChange={(e) => this.setState({fullName: e.target.value})}
                           placeholder={i18n.t("donation.name")}
                           aria-label="Name"
                           aria-describedby="contact-us-name"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="contact-us-email">@</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl required
                           value={this.state.email}
                           onChange={(e) => this.setState({email: e.target.value})}
                           placeholder={i18n.t("donation.email")}
                           aria-label="Email"
                           aria-describedby="contact-us-email"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="contact-us-amount">&nbsp;$&nbsp;</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl required type="number"
                           value={this.state.amount}
                           onChange={(e) => this.setState({amount: e.target.value})}
                           placeholder={i18n.t("donation.amount")}
                           aria-label="Amount"
                           aria-describedby="contact-us-amount"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl required
                           value={this.state.cardNumber}
                           onChange={(e) => {
                             const normalizedVal = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
                             let newVal = "";
                             for (let i = 0; i < Math.ceil(normalizedVal.length / 4); i++){
                               newVal += normalizedVal.slice(i * 4, (i + 1) * 4) +
                                   ((normalizedVal.length <= (i + 1) * 4) ? "" : " ");
                             }
                             e.target.value = newVal;
                             this.setState({cardNumber: newVal})
                           }}
                           placeholder={i18n.t("donation.card-number")}
                           aria-label="Card number"
                           aria-describedby="card-number"/>
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl required type="number"
                           value={this.state.expMonth}
                           onChange={(e) => this.setState({expMonth: e.target.value})}
                           placeholder={i18n.t("donation.valid-till-month")}
                           aria-label="Valid month"
                           aria-describedby="valid-month"/>
              <FormControl required type="number"
                           value={this.state.expYear}
                           onChange={(e) => this.setState({expYear: e.target.value})}
                           placeholder={i18n.t("donation.valid-till-year")}
                           aria-label="Valid year"
                           aria-describedby="valid-year"/>
              <FormControl required type="number"
                           value={this.state.cvc}
                           onChange={(e) => this.setState({cvc: e.target.value})}
                           placeholder={i18n.t("donation.cvc")}
                           aria-label="CVC code"
                           aria-describedby="cvc-code"/>
            </InputGroup>
            {!!this.props.errorMessage && (<Alert variant="danger" className="mt-3">{i18n.t(this.props.errorMessage)}</Alert>)}
            <Form.Group className="pt-3 d-flex justify-content-between">
              <h2>{!!this.state.amount &&
              (i18n.t("donation.full-amount") + ' ' + Math.round((parseInt(this.state.amount) * 1.029 + 0.3) * 100) / 100 + '$')}</h2>
              <Button variant="secondary" type="submit">{i18n.t("donation.btn-donate")}</Button>
            </Form.Group>
          </Form>
        </Col>
    );
  }
}

export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(DonationsPage));
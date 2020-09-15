import React from "react";
import { Button, Alert, Form, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../../store/main/Main-actions";
import { history } from "../../App";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

class RegistrationPage extends React.Component {
  async register(event) {
    event.preventDefault();
    await this.props.register(this.refs.email.value, this.refs.firstName.value, this.refs.lastName.value, this.refs.password.value);
    if (!this.props.errorMessage) {
      history.push("/result");
    }
  }

  render() {
    return (
      <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
        <h2 className="p-3 text-secondary">{i18n.t("registration.title")}</h2>
        <Form onSubmit={(e) => this.register(e)} className="text-left">
          <Form.Group controlId="email">
            <Form.Label>{i18n.t("common.email")}</Form.Label>
            <Form.Control type="text" placeholder={i18n.t("common.email")} ref="email" />
          </Form.Group>
          <Form.Group controlId="firstName">
            <Form.Label>{i18n.t("common.first-name")}</Form.Label>
            <Form.Control type="text" placeholder={i18n.t("common.first-name")} ref="firstName" />
          </Form.Group>
          <Form.Group controlId="lastName">
            <Form.Label>{i18n.t("common.last-name")}</Form.Label>
            <Form.Control type="text" placeholder={i18n.t("common.last-name")} ref="lastName" />
          </Form.Group>
          <Form.Group controlId="pass">
            <Form.Label>{i18n.t("registration.password")}</Form.Label>
            <Form.Control type="password" placeholder={i18n.t("registration.password")} ref="password" />
          </Form.Group>
          <Button type="submit" className="mb-1 w-100">{i18n.t("registration.btn-register")}</Button>
        </Form>
        {!!this.props.errorMessage && <Alert variant="danger" className="mt-3">{i18n.t(this.props.errorMessage)}</Alert>}
      </Col>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(RegistrationPage));

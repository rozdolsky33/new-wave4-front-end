import React from "react";
import {Button, Alert, Form, Col} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../../store/Main-actions";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }
  login(event) {
    event.preventDefault();
    this.props.login(this.refs.email.value, this.refs.password.value);
  }

  render() {
    return (
      <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
        <h2 className="p-3 text-primary">{i18n.t("login.title")}</h2>
        <Form onSubmit={(e) => this.login(e)} className="text-left">
          <Form.Group controlId="email">
            <Form.Label>{i18n.t("login.email")}</Form.Label>
            <Form.Control type="text" placeholder={i18n.t("login.email")} ref="email" />
          </Form.Group>
          <Form.Group controlId="pass">
            <Form.Label>{i18n.t("login.password")}</Form.Label>
            <Form.Control type="password" placeholder={i18n.t("login.password")} ref="password" />
          </Form.Group>
          <Button type="submit" className="mb-1 w-100">{i18n.t("login.btn-login")}</Button>
        </Form>
        {!!this.props.errorMessage && (
          <Alert variant="danger" className="mt-3">
            {this.props.errorMessage}
          </Alert>
        )}
        <div className="d-flex justify-content-between">
          <Button variant="link" href="/registration">{i18n.t("login.registration")}</Button>
          <Button variant="link" href="/forgot-password">{i18n.t("login.forgot-pass")}</Button>
        </div>
      </Col>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(LoginPage));

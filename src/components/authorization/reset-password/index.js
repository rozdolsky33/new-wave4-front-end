import React from "react";
import {Button, Alert, Form, Col} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../../store/Main-actions";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

class ResetPasswordPage extends React.Component {
  resetPassword(event) {
    event.preventDefault();
    this.props.resetPassword(this.refs.password.value);
  }

  render() {
    return (
      <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
        <h2 className="p-3 text-primary">{i18n.t("reset-password.title")}</h2>
        <Form onSubmit={(e) => this.resetPassword(e)} className="text-left">
          <Form.Group controlId="pass">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder={i18n.t("reset-password.password")} ref="password" />
          </Form.Group>
          <Form.Group controlId="pass-confirmation">
            <Form.Label>Please enter your password once again</Form.Label>
            <Form.Control type="password" placeholder={i18n.t("reset-password.password-confirm")} ref="pass-confirmation" />
          </Form.Group>
          <Button type="submit" className="mb-1 w-100">{i18n.t("reset-password.btn-submit")}</Button>
        </Form>
        {!!this.props.errorMessage && (
          <Alert variant="danger" className="mt-3">
            {this.props.errorMessage}
          </Alert>
        )}
      </Col>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(ResetPasswordPage));

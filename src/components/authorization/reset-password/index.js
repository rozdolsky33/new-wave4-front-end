import React from "react";
import {Button, Alert, Form, Col} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../../store/main/Main-actions";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";
import {history} from "../../App";

class ResetPasswordPage extends React.Component {
  async resetPassword(event) {
    event.preventDefault();
    if (this.refs.password.value === this.refs["pass-confirmation"].value) {
      await this.props.resetPassword(this.refs.password.value, this.props.token, this.props.passwordReset);
      history.push("/result");
    }
  }

  render() {
    return (
      <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
        <h2 className="p-3 text-secondary">
          {this.props.passwordReset ? i18n.t("reset-password.title") :
            i18n.t("reset-password.title-for-admin-role")}
        </h2>
        <Form onSubmit={(e) => this.resetPassword(e)} className="text-left">
          <Form.Group controlId="pass">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" required placeholder={i18n.t("reset-password.password")} ref="password" />
          </Form.Group>
          <Form.Group controlId="pass-confirmation">
            <Form.Label>Please enter your password once again</Form.Label>
            <Form.Control type="password" required placeholder={i18n.t("reset-password.password-confirm")} ref="pass-confirmation" />
          </Form.Group>
          <Button type="submit" className="mb-1 w-100">{i18n.t("reset-password.btn-submit")}</Button>
        </Form>
        {!!this.props.errorMessage && (
          <Alert variant="danger" className="mt-3">{i18n.t(this.props.errorMessage)}</Alert>
        )}
      </Col>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(ResetPasswordPage));

import React from "react";
import {Button, Alert, Form, Col} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../../store/main/Main-actions";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";
import {history} from "../../App";

class ForgotPasswordPage extends React.Component {
  async sendPassResetRequest(event) {
    event.preventDefault();
    await this.props.sendPassResetRequest(this.refs.email.value);
    history.push("/result");
  }

  render() {
    return (
      <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
        <h2 className="p-3 text-secondary">{i18n.t("forgot-password.title")}</h2>
        <Form onSubmit={(e) => this.sendPassResetRequest(e)} className="text-left">
          <Form.Group controlId="email">
            <Form.Label>{i18n.t("forgot-password.email")}</Form.Label>
            <Form.Control type="text" placeholder={i18n.t("forgot-password.email")} ref="email" />
          </Form.Group>
          <Button type="submit" className="mb-1 w-100">{i18n.t("forgot-password.btn-submit")}</Button>
        </Form>
        {!!this.props.errorMessage && (
          <Alert variant="danger" className="mt-3">
            {i18n.t(this.props.errorMessage)}</Alert>
        )}
      </Col>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(ForgotPasswordPage));

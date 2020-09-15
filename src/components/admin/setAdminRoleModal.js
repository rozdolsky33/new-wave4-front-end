import React from "react";
import {Modal, Button, Form, Alert} from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../store/main/Main-actions";
import "react-datepicker/dist/react-datepicker.css";
import { withTranslation } from "react-i18next";
import i18n from "../../i18n";

class SetAdminRoleModal extends React.Component {
  render() {
    return (
      <Modal show={true} onHide={() => this.props.closeModal()}>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.t("admin.set-admin-role")}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => {
          e.preventDefault();
          this.props.closeModal(this.refs.email.value)
        }} className="text-left">
          <Modal.Body>
            <Form.Group controlId="email">
              <Form.Label>{i18n.t("common.email")}</Form.Label>
              <Form.Control type="text" placeholder={i18n.t("common.email")} ref="email" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="mb-1 w-100">{i18n.t("common.btn-submit")}</Button>
            {!!this.props.errorMessage && (
              <Alert variant="danger" className="mt-3">
                {i18n.t(this.props.errorMessage)}
              </Alert>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(SetAdminRoleModal));

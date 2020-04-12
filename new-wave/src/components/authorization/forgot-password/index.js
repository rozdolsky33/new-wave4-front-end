import React from "react";
import {Button, Alert, Form, Col} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../../store/Main-actions";

class ForgotPasswordPage extends React.Component {
  sendPassResetRequest(event) {
    event.preventDefault();
    this.props.sendPassResetRequest(this.refs.email.value);
  }

  render() {
    return (
      <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
        <h2 className="p-3 text-primary">Login</h2>
        <Form onSubmit={(e) => this.sendPassResetRequest(e)} className="text-left">
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="Email" ref="email" />
          </Form.Group>
          <Button type="submit" className="mb-1 w-100">Submit</Button>
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
)(ForgotPasswordPage);
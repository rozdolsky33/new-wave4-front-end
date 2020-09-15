import React from "react";
import {InputGroup, Form, Button, Alert} from "react-bootstrap";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../../store/main/Main-actions";

function ContactUsForm(props) {
  const subject = React.useRef();
  const email = React.useRef();
  const message = React.useRef();
  return (
    <Form onSubmit={async(e) => {
      e.preventDefault();
      await props.sendContactUsEmail(subject.current.value, email.current.value, message.current.value);
      subject.current.value = "";
      email.current.value = "";
      message.current.value = "";
    }}>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="contact-us-subject">&nbsp;&#9829;</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control required ref={subject}
          placeholder={i18n.t("contact-us.subject")}
          aria-label="Subject"
          aria-describedby="contact-us-subject"
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="contact-us-email">@</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control required ref={email}
          placeholder={i18n.t("contact-us.email")}
          aria-label="Email"
          aria-describedby="contact-us-email"
        />
      </InputGroup>
      <Form.Group controlId="contact-us-message">
        <Form.Control as="textarea" rows="3" name="contact-us-message" required ref={message}/>
      </Form.Group>
      {!!props.errorMessage && (<Alert variant="danger" className="mt-3">{i18n.t(props.errorMessage)}</Alert>)}
      <Form.Group className="p-3">
        <Button variant="secondary" type="submit">{i18n.t("contact-us.btn-send")}</Button>
      </Form.Group>
    </Form>
  );
}

export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(ContactUsForm));

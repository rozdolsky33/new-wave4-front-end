import React from "react";
import {InputGroup, FormControl, Form, Button} from "react-bootstrap";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

function ContactUsForm() {
  return (
    <Form>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="contact-us-name">&nbsp;&#9829;</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder={i18n.t("contact-us.name")}
          aria-label="Name"
          aria-describedby="contact-us-name"
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="contact-us-email">@</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder={i18n.t("contact-us.email")}
          aria-label="Email"
          aria-describedby="contact-us-email"
        />
      </InputGroup>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text id="contact-us-message">@</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          as="textarea"
          aria-label="Message"
          aria-describedby="contact-us-message"/>
      </InputGroup>
      <Form.Group className="p-3">
        <Button variant="primary" type="submit" disabled>{i18n.t("contact-us.btn-send")}</Button>
      </Form.Group>
    </Form>
  );
}

export default withTranslation()(ContactUsForm);

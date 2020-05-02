import React from "react";
import {Button, Col, Form, FormControl, InputGroup} from "react-bootstrap";
import i18n from "../../../i18n";
import {withTranslation} from "react-i18next";

function DonationsPage() {
  return (
    <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
      <h2 className="p-3 text-primary">{i18n.t("donation.title")}</h2>
      <p className="text-center">{i18n.t("donation.sub-title-1")}<br/>
        {i18n.t("donation.sub-title-2")}</p>
      <Form>
        <InputGroup className="mb-3">
          <Form.Check
            name="donate-by"
            inline
            label={i18n.t("donation.donate-by") + "Credit Card"}
            type="radio"
            id="donate-credit-card"
          />
          <Form.Check
            name="donate-by"
            inline
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
          <FormControl
            placeholder={i18n.t("donation.name")}
            aria-label="Name"
            aria-describedby="contact-us-name"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="contact-us-email">@</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder={i18n.t("donation.email")}
            aria-label="Email"
            aria-describedby="contact-us-email"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder={i18n.t("donation.card-number")}
            aria-label="Card number"
            aria-describedby="card-number"/>
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder={i18n.t("donation.valid-till")}
            aria-label="Valid date"
            aria-describedby="valid-date"/>
          <FormControl
            placeholder={i18n.t("donation.cvc")}
            aria-label="CVC code"
            aria-describedby="cvc-code"/>
        </InputGroup>
        <Form.Group className="p-3">
          <Button variant="primary" type="submit" disabled>{i18n.t("donation.btn-donate")}</Button>
        </Form.Group>
      </Form>
    </Col>
  );
}

export default withTranslation()(DonationsPage);
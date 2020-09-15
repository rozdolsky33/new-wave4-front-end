import React from "react";
import ContactUsForm from "./contact-us-form";
import {Col, Row} from "react-bootstrap";
import i18n from "../../../i18n";
import {withTranslation} from "react-i18next";


function ContactUsPage() {
  return (
    <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
      <div>
        <Row className="justify-content-center">
          <h3 className="p-3 text-secondary">{i18n.t("contact-us.title")}</h3>
        </Row>
        <Row>
          <Col>
            <p>{i18n.t("contact-us.sub-title-1")}</p>
            <h5 className="pb-3">{i18n.t("contact-us.org-name")}</h5>
            <p>{i18n.t("contact-us.org-contact-1")}</p>
            <p>{i18n.t("contact-us.org-contact-2")}</p>
            <a href="mailto:newwaveorg4@yahoo.com?subject=New%20Wave%204&body=">{i18n.t("contact-us.org-email")}</a>
          </Col>
          <Col>
            <div className="text-center">
              <p>{i18n.t("contact-us.sub-title-2")}</p>
            </div>
            <ContactUsForm onSubmit={(e) => {e.preventDefault()}}/>
          </Col>
        </Row>
      </div>
    </Col>
  );
}

export default withTranslation()(ContactUsPage);

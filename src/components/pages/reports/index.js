import React from "react";
import {Col} from "react-bootstrap";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

function ReportsPage() {
  return (
    <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
      <h2 className="p-3 text-secondary">{i18n.t("reports.title")}</h2>
      <p>{i18n.t("error.page-is-not-ready")}</p>
    </Col>
  );
}
export default withTranslation()(ReportsPage);

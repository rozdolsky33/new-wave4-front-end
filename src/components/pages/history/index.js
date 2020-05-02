import React from "react";
import {Col} from "react-bootstrap";
import i18n from "../../../i18n";
import {withTranslation} from "react-i18next";

function HistoryPage() {
  return (
    <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
      <h2 className="p-3 text-primary">{i18n.t("history.title")}</h2>
      <p>{i18n.t("history.part-1")}</p>
      <p>{i18n.t("history.part-2")}</p>
      <p>{i18n.t("history.part-3")}</p>
      <p>{i18n.t("history.part-4")}</p>
      <p>{i18n.t("history.part-5")}</p>
      <p>{i18n.t("history.part-6")}</p>
      <p>{i18n.t("history.part-7")}</p>
      <p>{i18n.t("history.part-8")}</p>
      <p>{i18n.t("history.part-9")}</p>
      <p>{i18n.t("history.part-10")}</p>
      <p>{i18n.t("history.part-11")}</p>
      <p>{i18n.t("history.part-12")}</p>
      <p>{i18n.t("history.part-13")}</p>
      <p>{i18n.t("history.part-14")}</p>
      <p>{i18n.t("history.part-15")}</p>
    </Col>
  );
}

export default withTranslation()(HistoryPage);

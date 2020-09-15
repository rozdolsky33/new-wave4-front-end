import React from "react";
import {Card} from "react-bootstrap";
import "./team-member-card.scss";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

class TeamMemberCard extends React.Component {
  render() {
    return (
      <Card className="mb-2 text-center team-member-card" style={{flex: "0 0 25%"}}>
        <Card.Img variant="top" src={"./assets/imgs/" + this.props.teamMember + ".jpg"} className="member-img"/>
        <Card.Body className="text-center">
          <h5>{i18n.t("our-team.team-members." + this.props.teamMember + ".fullName")}</h5>
          <span className="text-secondary small">{i18n.t("our-team.team-members." + this.props.teamMember + ".location")}</span>
          <p>{i18n.t("our-team.team-members." + this.props.teamMember + ".position")}</p>
        </Card.Body>
      </Card>
    );
  }
}

export default withTranslation()(TeamMemberCard);
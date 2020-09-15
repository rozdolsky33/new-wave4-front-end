import React from "react";
import {CardDeck, Col} from "react-bootstrap";
import TeamMemberCard from "../../common/team-member-card";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

const teamMembers = ["BohdanBohonok", "MyroslavaRozdolska", "LarysaZanyk", "OlgaHrynyk", "OstapStahiv"];
function OurTeamPage() {
  return (
    <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
      <h2 className="p-3 text-secondary">{i18n.t("our-team.title")}</h2>
        <div className="text-center mb-3 pb-3">
            <CardDeck className="justify-content-center">
                {teamMembers.map((tm, key) => <TeamMemberCard key={key} teamMember={tm}/>)}
            </CardDeck>
        </div>
    </Col>
  );
}

export default withTranslation()(OurTeamPage);

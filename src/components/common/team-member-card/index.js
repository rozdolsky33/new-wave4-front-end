import React from "react";
import {Card} from "react-bootstrap";
import "./team-member-card.scss";

export default class TeamMemberCard extends React.Component {
  render() {
    return (
      <Card className="mb-2 text-center team-member-card" style={{flex: "0 0 25%"}}>
        <Card.Img variant="top" src={this.props.img || "./assets/imgs/NW_person_placeholder.png"} className="member-img"/>
        <Card.Body className="text-center">
          <h5>{this.props.fullName}</h5>
          <span className="text-secondary small">{this.props.location}</span>
          <p>{this.props.position}</p>
        </Card.Body>
      </Card>
    );
  }
}

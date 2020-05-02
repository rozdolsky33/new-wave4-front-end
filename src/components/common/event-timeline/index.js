import React from "react";
import EventCard from "./event-card"
import archive from "../../../data/archive";
import events from "../../../data/events";
import publications from "../../../data/publications";
import "./events-list.scss";

export default class eventsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { events, archive, publications };
  }

  geteventsList() {
    let eventDate = "";
    let events = this.state[this.props.type] || [];
    return events.map((event, key) => {
      if (event !== event.date) {
        eventDate = event.date;
        return (
          <div key={key}>
            <div className="pt-3 pb-1" >
              <span className="event-date-point"></span>
              <span className="text-secondary small">{event.date}</span>
            </div>
            <EventCard {...event} />
          </div>);
      } else {
        return <EventCard key={key} {...event} />;
      }
    });
  };

  render() {
    return (
      <>
        <div className="text-center">
          <h2 className="p-3 text-primary">{this.props.title}</h2>
        </div>
        <div className="events-container border-left pl-3">
          {this.geteventsList()}
        </div>
      </>
    );
  }
}

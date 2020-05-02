import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {Button, Card, Col, Row, Alert} from "react-bootstrap";
import {actionCreators} from "../../../store/Main-actions";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

class ListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: undefined
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.props.getItemsDates(this.props.type);
    this.props.getItemsList(this.props.type, 0, 5);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const newPage = this.props.paginationConfig.number + 1;
    if (!this.endOfList || this.props.paginationConfig.totalPages <= newPage || this.props.isLoading || !!this.state.filter) return;
    const top = this.endOfList.getBoundingClientRect().top - 80;
    const isEndOfListVisible = top >= 0 && top <= window.innerHeight;
    if (isEndOfListVisible) {
      this.props.getItemsList(this.props.type, newPage, this.props.paginationConfig.size, true);
    }
  }
  toggleFilter(filter) {
    this.setState({filter: filter});
    if (filter) {
      this.props.getFilteredList(this.props.type, filter);
    } else {
      this.props.getItemsList(this.props.type, 0, 5);
    }
  }

  getDates() {
    let currentYear = 0;
    let currentMonth = "";
    return this.props.blogDates.map((date, key) => {
      let result = (
        <div key={key}>
          {currentYear !== date.year && <p className="m-0">&#9675; {date.year}</p>}
          {(currentYear !== date.year || currentMonth !== date.month) && <p className="m-0 pl-2">
            <Button className="text-secondary" variant="link" size="sm"
                    onClick={() => this.toggleFilter({
                      entityName: "date",
                      value: `${date.month} ${date.year}`,
                      month: date.monthVal,
                      year: date.year})}>
              {date.month}
            </Button>
          </p>}
      </div>);
      currentMonth = date.month;
      currentYear = date.year;
      return result;
    });
  }

  getItemsList() {
    return this.props.items.map((item, key) => {
      return (
        <Card key={key} className="mb-2 d-flex flex-row justify-content-start text-left">
          {!!item.imageUri ?
            <Card.Img style={{width: "25%", objectFit: "cover"}}
                      src={this.props.host + "/v2/api/image/" + item.imageUri} /> :
            <div className="bg-secondary w-25"/>
          }
          <Card.Body className="justify-content-between flex-column d-flex w-75">
            <Card.Title>{item.title}</Card.Title>
            <div className="d-flex justify-content-between pb-3">
              <span className="text-secondary small">{new Date(item.date).toDateString()}</span>
              <Button className="text-secondary" variant="link" size="sm"
                      onClick={() => this.toggleFilter({entityName: "author", value: item.author})}>
                {item.author}
              </Button>
            </div>
            <Card.Text>{item.preview}</Card.Text>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">
                <i className="fa fa-heart mr-2"></i>
                <i className="fa fa-comment"></i>
              </span>
              <Card.Link href={`/item/blog/${item.id}`}>{i18n.t("blogs.read-more")}</Card.Link>
            </div>
          </Card.Body>
        </Card>
      );
    });
  };

  render () {
    return (
      <Col className="text-center">
        <h2 className="p-3 text-primary">{i18n.t("menu." + this.props.type)}</h2>
        <Row>
          <Col className="text-left pl-5" xs="12" md="2">
            {this.getDates()}
          </Col>
          <Col className="text-center" xs="12" md="8">
            {this.state.filter && <Row className="text-secondary p-3">
              {i18n.t("blogs.filtered-by")}&nbsp; <span>{i18n.t("blogs." + this.state.filter.entityName)}</span>:&nbsp;
              <span className="text-dark">{this.state.filter.value}</span>&nbsp;
              <Button className="p-0 text-dark font-weight-bold" variant="link" size="sm"
                      onClick={() => this.toggleFilter(undefined)}>x</Button>
            </Row>}
            {this.getItemsList()}
            <div ref={el => {this.endOfList = el;}}></div>
          </Col>
        </Row>
      </Col>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(ListPage));
import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Button, Card, Col, Row} from "react-bootstrap";
import {actionCreators} from "../../../store/main/Main-actions";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

class PostListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: undefined
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    const filter = this.props.category ? {
      entityName: "category",
      value: this.props.category
    } : undefined;
    this.toggleFilter(filter);
    this.props.getItemsDates(this.props.type);
    this.props.getCategories(this.props.type);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      const filter = this.props.category ? {
        entityName: "category",
        value: this.props.category
      } : undefined;
      this.toggleFilter(filter);
    }
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
      this.props.getItemsList(this.props.type, 0, 99, false, filter.entityName, filter.value);
    } else {
      this.props.getItemsList(this.props.type, 0, 5);
    }
  }

  getDates() {
    let currentYear = 0;
    let currentMonth = "";
    return this.props.filterDates.map((date) => {
      const dateObj = {
        year: date.substring(0, 4),
        month: i18n.t("common.months." + date.substring(5, 7)),
        monthVal: parseInt(date.substring(5, 7))
      }
      let result = (
        <>
          {currentYear !== dateObj.year && <p key={date} className="m-0 pt-2">&#9675; {dateObj.year}</p>}
          {(currentYear !== dateObj.year || currentMonth !== dateObj.month) &&
          <Button key={date} className="text-secondary" variant="link" size="sm"
                  onClick={() => this.toggleFilter({
                    entityName: "date",
                    description: `${dateObj.month} ${dateObj.year}`,
                    value: {
                      month: dateObj.monthVal,
                      year: dateObj.year
                    }
                  })}>
            {dateObj.month}
          </Button>}
        </>);
      currentMonth = dateObj.month;
      currentYear = dateObj.year;
      return result;
    });
  }

  getItemsList() {
    if (!this.props.items) return;
    return this.props.items.filter(i => i.active).map((item, key) => {
      return (
        <Card key={key} className="mb-2 d-flex flex-row justify-content-start text-left" style={{maxHeight: "180px"}}>
          <Card.Img style={{width: "25%", objectFit: "cover"}}
                    src={item.imageUri ? this.props.host + "/v2/api/image/" + item.imageUri :
                      "../../assets/imgs/NW_post_placeholder.jpg"}/>
          <Card.Body className="justify-content-between flex-column d-flex w-75">
            <Card.Title>{item.title}</Card.Title>
            <div className="d-flex justify-content-between pb-3">
              <span className="text-secondary small">{new Date(item.date).toDateString()}</span>
              <Button className="text-secondary" variant="link" size="sm"
                      onClick={() => this.props.type === "blog" && this.toggleFilter({
                        entityName: "author",
                        value: item.author
                      })}>
                {item.author}
              </Button>
            </div>
            <Card.Text>{item.preview}</Card.Text>
            <div className="d-flex justify-content-end">
              {item.externalURL ?
                <Card.Link href={item.externalURL} target="_blank">
                  {i18n.t("posts.read-more")}
                </Card.Link> :
                <Card.Link href={`/item/${this.props.type}/${item.id}`}>
                  {i18n.t("posts.read-more")}
                </Card.Link>
              }
            </div>
          </Card.Body>
        </Card>
      );
    });
  };

  render() {
    return (
      <Col className="text-center">
        <h2 className="p-3 text-secondary">{i18n.t("menu." + this.props.type)}</h2>
        <Row>
          <Col className="text-left pl-5" xs="12" md="2">
            <p className="mb-0 mt-3">{i18n.t("posts.categories")}</p>
            {this.props[`${this.props.type}Categories`].map((cat, key) => {
              return <Button key={key} className="text-secondary text-left" variant="link" size="sm"
                             onClick={() => this.toggleFilter({
                               entityName: "category",
                               value: cat
                             })}>{cat}</Button>;
            })}
            {this.getDates()}
          </Col>
          <Col className="text-center" xs="12" md="8">
            {this.state.filter && <Row className="text-secondary p-3">
              {i18n.t("posts.filtered-by")}&nbsp;<span>{i18n.t("posts." + this.state.filter.entityName)}</span>:&nbsp;
              <span className="text-dark">{this.state.filter.description || this.state.filter.value}</span>&nbsp;
              <Button className="p-0 text-dark font-weight-bold" variant="link" size="sm"
                      onClick={() => this.toggleFilter(undefined)}>x</Button>
            </Row>}
            {this.getItemsList()}
            <div ref={el => {
              this.endOfList = el;
            }}></div>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(PostListPage));
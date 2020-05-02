import React from "react";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import { Col, Row, Card } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import CarouselPhotos from "./carousel-photos";
import { history } from "../../App";
import { actionCreators } from "../../../store/Main-actions";
import i18n from "../../../i18n";
import "./main.scss";

function MainPage(props) {
  const getRecentItems = (type) => {
    const newItemsList = props[type].slice(0, Math.min(3, props[type].length)).map(p => getCard(p, type));
    return newItemsList.length > 0 ? newItemsList : undefined;
  };
  const getCard = (item, itemType) => {
    return (
      <Card className="mb-2" key={`${itemType}_${item.id}`}
            onClick={() => history.push(`/item/${itemType}/${item.id}`)}>
        {!!item.imageUri ?
          <Card.Img style={{height: "70px", objectFit: "cover"}}
                    src={props.host + "/v2/api/image/" + item.imageUri} /> :
          <div className="bg-secondary" style={{height: "50px"}}/>
        }
        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <Card.Text className="overflow-hidden" style={{height: "70px"}}>{item.preview}</Card.Text>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Col>
      <div className="main-page-cover">
        <CarouselPhotos/>
      </div>
      <Row className="main-description-block pb-3 pt-3 bg-white position-relative">
        <Col xs md={{ span: 2, offset: 2 }} className="text-center d-flex flex-column justify-content-center align-items-center">
          <img
            src="../assets/imgs/NW_logo_sm_2.jpg"
            height="130"
            alt="About Us"
          />
          <h3 className="p-4 text-primary">{i18n.t("main.title")}</h3>
        </Col>
        <Col xs md="6" className="d-flex flex-column justify-content-center">{i18n.t("main.description")}</Col>
      </Row>
      <Row className="position-relative pb-5">
        <div className="main-recent-block bg-secondary position-absolute h-100 w-100"></div>
        <Col xs md={{ span: 4, offset: 2 }}>
          <h4 className="p-4 text-white text-center">{i18n.t("main.new-projects")}</h4>
          <div className="bg-white p-1">{getRecentItems("project") ||
            <div className="p-3 text-center w-100">{i18n.t("main.no-projects")}</div>}
          </div>
        </Col>
        <Col xs md="4">
          <h4 className="p-4 text-white text-center text-nowrap">{i18n.t("main.new-articles")}</h4>
          <div className="bg-white p-1">{getRecentItems("blog") ||
            <div className="p-3 text-center w-100">{i18n.t("main.no-articles")}</div>}
          </div>
        </Col>
      </Row>
    </Col>
  );
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(MainPage));

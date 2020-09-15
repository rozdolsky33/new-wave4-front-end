import React from "react";
import {Col} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../../store/main/Main-actions";
import errorImg from "../../../assets/NW_error.png";
import successImg from "../../../assets/NW_success.png";
import {withTranslation} from "react-i18next";
import i18n from "../../../i18n";

class ResultPage extends React.Component {
  componentDidMount() {
    if (this.props.match.params.token) {
      this.props.checkToken(this.props.match.params.token);
    }
  }
  render() {
    return (
      <Col className="text-center pt-5" xs md={{ span: 8, offset: 2 }}>
        {this.props.errorMessage ?
          <>
            <img src={errorImg} style={{width:80}} alt=""/>
            <h2 className="p-3">{i18n.t("common.status-error")}</h2>
            <p>{i18n.t(this.props.errorMessage)}</p>
          </> :
          <>
            <img src={successImg} style={{width:80}} alt=""/>
            <h2 className="p-3">{i18n.t("common.status-success")}</h2>
            <p>{i18n.t(this.props.successMessage)}</p>
          </>}
      </Col>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(ResultPage));

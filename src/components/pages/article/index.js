import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Col } from "react-bootstrap";
import { actionCreators } from "../../../store/Main-actions";
import { history } from "../../App";

class ArticlePage extends React.Component {
  componentDidMount() {
    this.props.getItem(this.props.match.params.type, this.props.match.params.id);
  }
  render() {
    return (
      <Col className="text-center" xs md={{ span: 8, offset: 2 }}>
        {!this.props.selectedItem ||
          <>
            {!!this.props.selectedItem.imageUri ?
              <img style={{width: "100%", objectFit: "cover", maxHeight: "330px"}}
                   src={this.props.host + "/v2/api/image/" + this.props.selectedItem.imageUri} /> :
              <div className="bg-secondary w-100"><br/><br/><br/><br/><br/><br/><br/><br/><br/></div>
            }
            <h2 className="p-3 text-primary">{this.props.selectedItem.title}</h2>
            <div className="d-flex justify-content-between pt-5">
              <span className="text-secondary">{new Date(this.props.selectedItem.date).toDateString()}</span>
              <Button variant="link" onClick={() => {history.push("blog")}}>
                {this.props.selectedItem.author}
              </Button>
            </div>
            <p className="pt-5">{this.props.selectedItem.content}</p>
          </>
          }
      </Col>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(ArticlePage);

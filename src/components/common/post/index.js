import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Col, Modal, Alert } from "react-bootstrap";
import { actionCreators } from "../../../store/posts/posts-actions";
import { history } from "../../App";
import CommentForm from "./comment-form";
import i18n from "../../../i18n";

class ArticlePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      userId: localStorage.getItem("userId") || "",
      userRole: localStorage.getItem("role") || ""
    };
    this.scrollToComments = this.scrollToComments.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  componentDidMount() {
    this.props.getItem(this.props.match.params.type, this.props.match.params.id);
    if (this.props.match.params.type === "blog") {
      this.props.getLikes("blog", this.props.match.params.id);
      this.props.getComments("blog", this.props.match.params.id);
    }
  }
  async toggleLike() {
    let userLike = this.props.likes.find(l => l.userId === this.state.userId);
    let likeId =  userLike ? userLike.id : undefined;
    if(!this.state.userId) {
      this.setState({showAlert: true});
    } else {
      await this.props.toggleLike("blog", this.props.match.params.id, this.state.userId, likeId);
      this.props.getLikes("blog", this.props.match.params.id);
    }
  }
  async addComment(comment) {
    if(!this.state.userId) {
      this.setState({showAlert: true});
    } else {
      await this.props.addComment("blog", this.props.match.params.id, this.state.userId, comment);
      this.props.getComments("blog", this.props.match.params.id);
    }
  }
  async deleteComment(commentId) {
    await this.props.deleteComment(this.props.match.params.id, commentId, this.state.userId);
    this.props.getComments("blog", this.props.match.params.id);
  }
  scrollToComments() {
    window.scrollTo(0, this.refs.postComments.offsetTop);
  }
  render() {
    return (
      <Col xs md={{ span: 8, offset: 2 }}>
        {!this.props.selectedItem ||
          <>
            <img style={{width: "100%", objectFit: "cover", maxHeight: "330px"}} alt={this.props.selectedItem.title}
                 src={this.props.selectedItem.imageUri ? this.props.host + "/v2/api/image/" + this.props.selectedItem.imageUri :
                   "../../assets/imgs/NW_post_placeholder.jpg"} />
            <h2 className="p-3 text-center text-secondary">{this.props.selectedItem.title}</h2>
            <div className="d-flex justify-content-between pt-5 flex-column flex-md-row">
              {this.props.match.params.type === "blog" ? <div className="text-secondary order-2 order-md-1">
                <span className="mr-2">{new Date(this.props.selectedItem.date).toDateString()}</span>
                <a onClick={this.toggleLike}
                   className={this.props.likes.find(l => l.userId === this.state.userId) && "text-dark"}>
                  <i className="fa fa-heart mr-1"></i>{this.props.likes.length}
                </a>
                <a onClick={this.scrollToComments}
                   className={this.props.comments.find(c => c.userId === this.state.userId) && "text-dark"}>
                  <i className="fa fa-comment mr-1 ml-2"></i>{this.props.comments.length}
                </a>
              </div> : <div></div>}
              <Button className="order-1 order-md-2" variant="link" onClick={() => {history.push("blog")}}>
                {this.props.selectedItem.author}
              </Button>
            </div>
            <div className="pt-3 content" dangerouslySetInnerHTML={{__html: this.props.selectedItem.content}}></div>
            {this.props.match.params.type === "blog" &&
              <>
                <h5 className="pt-3 text-left">{i18n.t("post.comments")}</h5>
                <div ref="postComments">
                  {this.props.comments.map((comment, key) =>
                    <Alert key={key} variant="light" className="text-left border-light">
                      {(this.state.userRole.indexOf("ADMIN") >= 0 || comment.userId === this.state.userId) &&
                      <button type="button" className="close"
                              onClick={() => this.deleteComment(comment.id)}>x</button>}
                      <b>{comment.username}</b>:&nbsp;{comment.content}
                      <p className="small text-right mb-0 mt-2">{new Date(comment.postedDate).toDateString()}</p>
                    </Alert>)}
                  {!this.props.isLoading && <CommentForm onSubmit={this.addComment}/>}
                </div>
              </>}
          </>
          }
        <Modal show={this.state.showAlert} onHide={() => this.setState({showAlert: false})}>
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t("post.action-is-disabled")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{i18n.t("post.you-should-be-logged-in")}</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => this.setState({showAlert: false})}>
              {i18n.t("common.btn-cancel")}
            </Button>
            <Button variant="success" onClick={() => history.push("/login")}>
              {i18n.t("post.nav-to-login")}
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    );
  }
}
export default connect(
  state => state.postsReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(ArticlePage);

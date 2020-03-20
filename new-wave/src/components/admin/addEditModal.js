import React from "react";
import {Modal, Button, Form, Col, Row, Alert} from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DatePicker from "react-datepicker";
import { actionCreators } from "../../store/Main";
import "react-datepicker/dist/react-datepicker.css";

class AddEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.editMode ? {
      ...props.selectedItem,
    } : {
      date: new Date(),
      title: "",
      author: "",
      category: "",
      preview: "",
      content: "",
    };
    this.changeValue = this.changeValue.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  changeValue(event) {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.setState({ [fieldName]: fieldValue });
  }
  changeDate(newDate) {
    this.setState({date: newDate });
  }
  
  async submit(event) {
    event.preventDefault();
    await this.props.addEditItem(this.props.activeItems, this.state);
    this.props.getItemsList(this.props.activeItems, 0, this.props.paginationConfig.size);
  }
  render() {
    return (
      <Modal show={this.props.addEditModalShown} onHide={() => this.props.toggleAddEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.editMode ? "Edit " : "Add "}
            {this.props.activeItems === "blog" ? "article" : "project"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => this.submit(e)}>
          <Modal.Body>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Article title"
                            value={this.state.title}
                            name="title" onChange={this.changeValue} />
            </Form.Group>
            <Form.Group as={Row} controlId="author">
              <Form.Label column sm="2">Author</Form.Label>
              <Col sm="10">
                <Form.Control as="select" value={this.state.author}
                              name="author" onChange={this.changeValue}>
                  <option>Myroslava Rozdolska</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="category">
              <Form.Label column sm="2">Category</Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Article category" value={this.state.category}
                              name="category" onChange={this.changeValue} />
              </Col>
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label className="pr-3">Created at</Form.Label>
              <DatePicker className="form-control"
                          selected={this.state.startDate}
                          onChange={this.changeDate} />
            </Form.Group>
            <Form.Group controlId="preview">
              <Form.Label>Preview</Form.Label>
              <Form.Control as="textarea" rows="2" value={this.state.preview}
                            name="preview" onChange={this.changeValue} />
            </Form.Group>
            <Form.Group controlId="content">
              <Form.Label>Article</Form.Label>
              <Form.Control as="textarea" rows="5" value={this.state.content}
                            name="content" onChange={this.changeValue} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.props.toggleAddEditModal(false)}>Close</Button>
            <Button variant="primary" type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AddEditModal);

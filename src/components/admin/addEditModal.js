import React from "react";
import {Modal, Button, Form, Col, Row} from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DatePicker from "react-datepicker";
import { actionCreators } from "../../store/main/Main-actions";
import "react-datepicker/dist/react-datepicker.css";
import { withTranslation } from "react-i18next";
import i18n from "../../i18n";
import CKEditor from 'ckeditor4-react';

class AddEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.editMode ? {
      ...props.selectedItem,
      date: new Date(props.selectedItem.date),
      externalResource: !!props.selectedItem.externalURL
    } : {
      date: new Date(),
      externalResource: false,
      externalURL: "",
      title: "",
      author: this.props.author,
      category: "",
      preview: "",
      content: "",
      imageUri: "",
      active: true
    };
    this.changeValue = this.changeValue.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  changeValue(event) {
    let fieldName = event.target ? event.target.name : "content";
    let fieldValue = event.target ? event.target.value : event.editor.getData();
    this.setState({ [fieldName]: fieldValue });
  }
  changeDate(newDate) {
    this.setState({date: newDate });
  }
  uploadFile(e) {
   this.setState({imageUri: e.target.files[0].name});
   this.props.uploadImage(e.target.files[0]);
  }
  
  async submit(event) {
    event.preventDefault();
    if (this.state.externalResource) {
      this.setState({content: ""});
    } else {
      this.setState({externalURL: ""});
    }
    await this.props.addEditItem(this.props.activeItems, this.state, this.props.editMode);
    this.props.getItemsList(this.props.activeItems, 0, this.props.paginationConfig.size);
    this.props.getCategories("project");
  }
  render() {
    return (
      <div className="modal d-block bg-white text-left overflow-auto">
        <Modal.Header>
          <Modal.Title>
            {this.props.editMode ? i18n.t("admin.edit") : i18n.t("admin.add")}
            {this.props.activeItems === "blog" ? i18n.t("admin.article") : i18n.t("admin.project")}
          </Modal.Title>
          <Button variant="outline-danger" onClick={() => this.props.toggleAddEditModal(false)}>X</Button>

        </Modal.Header>
        <Form onSubmit={(e) => this.submit(e)}>
          <Col xs md={{ span: 10, offset: 1 }} xl={{ span: 8, offset: 2 }}>
            <Modal.Body>
              <Form.Group as={Row} controlId="title">
                <Form.Label column sm="2">{i18n.t("admin.title")}</Form.Label>
                <Col sm="10">
                  <Form.Control type="text" placeholder={i18n.t("admin.title")}
                                value={this.state.title}
                                name="title" onChange={this.changeValue} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="pic">
                <Form.Label column sm="2">{i18n.t("admin.picture")}</Form.Label>
                <Col sm="10">
                  <div className="custom-file">
                    <input type="file" multiple={false}
                           className="custom-file-input"
                           id="pictureInput"
                           onChange={this.uploadFile}/>
                    <label className="custom-file-label" htmlFor="pictureInput">
                      {this.state.imageUri || "Choose file"}
                    </label>
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="category">
                <Form.Label column sm="2">{i18n.t("admin.category")}</Form.Label>
                <Col sm="10">
                  <Form.Control type="text" placeholder={i18n.t("admin.category")} value={this.state.category}
                                name="category" onChange={this.changeValue} />
                </Col>
              </Form.Group>
              <Form.Group  as={Row} controlId="date">
                <Form.Label column sm="2">{i18n.t("admin.date")}</Form.Label>
                <Col sm="10">
                  <DatePicker className="form-control"
                              selected={this.state.date}
                              onChange={this.changeDate} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="preview">
                <Form.Label column sm="2">{i18n.t("admin.preview")}</Form.Label>
                <Col sm="10">
                  <Form.Control as="textarea" rows="2" value={this.state.preview}
                                name="preview" onChange={this.changeValue} />
                </Col>
              </Form.Group>
              <Form.Group controlId="externalКesource">
                <Form.Check type="checkbox" label={i18n.t("admin.external-resource")}
                            checked={this.state.externalResource}
                            onChange={(e) => {
                              this.setState({externalResource: e.target.checked});
                            }} />
              </Form.Group>
              { this.state.externalResource ?
                  <Form.Group as={Row} controlId="url">
                    <Form.Label column sm="2">{i18n.t("admin.external-url")}</Form.Label>
                    <Col sm="10">
                      <Form.Control type="text" placeholder={i18n.t("admin.external-url")}
                                    value={this.state.externalURL}
                                    name="externalURL" onChange={this.changeValue} />
                    </Col>
                  </Form.Group> :
                  <>
                    <label>{i18n.t("admin.content")}</label>
                    <CKEditor data={this.state.content} type="classic"
                              config={ {
                                toolbar: [
                                  { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-' ] },
                                  { name: 'links', items: [ 'Link', 'Unlink', '-' ] },
                                  { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
                                  { name: 'styles', items: [ 'Styles', 'Format', '-' ] },
                                  { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule' ] }
                                ]
                              } }
                              onChange={this.changeValue}/>
                  </>

              }
            </Modal.Body>
          </Col>
          <Modal.Footer>
            <Button variant="danger" onClick={() => this.props.toggleAddEditModal(false)}>{i18n.t("common.btn-close")}</Button>
            <Button variant="success" type="submit">{i18n.t("common.btn-submit")}</Button>
          </Modal.Footer>
        </Form>
      </div>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(AddEditModal));

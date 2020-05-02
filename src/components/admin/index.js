import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {Table, Button, Col, Tab, Tabs, Alert} from "react-bootstrap";
import AddEditModal from "./addEditModal";
import PaginationPanel from "../common/pagination-panel";
import { actionCreators } from "../../store/Main-actions";
import Row from "react-bootstrap/Row";
import {withTranslation} from "react-i18next";
import i18n from "../../i18n";

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.selectPage = this.selectPage.bind(this);
    this.changeActiveTab = this.changeActiveTab.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  selectPage(pageNumber) {
    this.props.getItemsList(this.props.activeItems, pageNumber, this.props.paginationConfig.size);
  }

  changeActiveTab(newTab) {
    this.props.changeActiveItems(newTab);
    this.props.getItemsList(newTab, 0, this.props.paginationConfig.size);
  }

  getContentTable() {
    return (
      <Table striped bordered hover>
      <thead>
      <tr>
        <th>#</th>
        <th>{i18n.t("admin.title")}</th>
        <th>{i18n.t("admin.author")}</th>
        <th>{i18n.t("admin.date")}</th>
        <th>X</th>
      </tr>
      </thead>
      <tbody>
      {
        this.props.items.map((item) => {
          return (
            <tr key={item.id} onClick={() => {
              this.props.toggleAddEditModal(true, item)
            }}>
              <td>{item.id}</td>
              <td className="text-left">{item.title}</td>
              <td>{item.author}</td>
              <td>{new Date(item.date).toDateString()}</td>
              <td>
                <Button variant="danger" size="sm" onClick={(e) => this.deleteItem(e, item)}>
                  X</Button>
              </td>
            </tr>);
        })
      }
      </tbody>
    </Table>);
  }

  async deleteItem(e, item) {
    e.stopPropagation();
    await this.props.deleteItem(this.props.activeItems, item.id);
    this.props.getItemsList(this.props.activeItems, 0, this.props.paginationConfig.size);
  }

  componentWillMount() {
    this.props.getItemsList(this.props.activeItems, 0, this.props.paginationConfig.size);
  }

  render() {
    return (
      <Col className="text-center" xs md={{ span: 10, offset: 1 }}>
        <Row className="pt-3 d-flex justify-content-end">
          <Col>
            {!!this.props.errorMessage && (
              <Alert variant="danger" className="mt-3">
                {this.props.errorMessage}
              </Alert>
            )}
          </Col>
          <Col className="mt-3 d-flex justify-content-end">
            <PaginationPanel {...this.props.paginationConfig}
                                selectPage={this.selectPage}
                                currentPage={this.props.paginationConfig.number}
                                pageSize={this.props.paginationConfig.size}/>
          </Col>
        </Row>
        <Tabs id="admin-content" activeKey={this.props.activeItems} onSelect={this.changeActiveTab}>
          <Tab eventKey="blog" title={i18n.t("admin.articles")}>
            {this.getContentTable()}
          </Tab>
          <Tab eventKey="project" title={i18n.t("admin.projects")}>
            {this.getContentTable()}
          </Tab>
        </Tabs>
        <Button variant="primary" size="lg" className="fixed-bottom m-3"
                onClick={() => {this.props.toggleAddEditModal(true)}}>
          +
        </Button>
        {this.props.addEditModalShown && <AddEditModal />}
      </Col>
    );
  }
}

export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(AdminPage));

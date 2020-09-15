import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {Table, Button, Col, Tab, Tabs, Alert, Form} from "react-bootstrap";
import AddEditModal from "./addEditModal";
import PaginationPanel from "../common/pagination-panel";
import { actionCreators } from "../../store/main/Main-actions";
import Row from "react-bootstrap/Row";
import {withTranslation} from "react-i18next";
import i18n from "../../i18n";
import {history} from "../App";
import SetAdminRoleModal from "./setAdminRoleModal";

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: (this.props.user && this.props.user.role) || localStorage.getItem("role") || "",
      setAdminRoleModalShown: false
    };
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

        {this.props.activeItems === "users" ?
          <>
            <th>{i18n.t("admin.role")}</th>
            <th>{i18n.t("common.first-name")}</th>
            <th>{i18n.t("common.last-name")}</th>
            <th>{i18n.t("common.email")}</th>
          </> :
          <>
            <th>{i18n.t("admin.active")}</th>
            <th>{i18n.t("admin.title")}</th>
            <th>{i18n.t("admin.author")}</th>
            <th>{i18n.t("admin.date")}</th>
          </>
        }
        <th>{i18n.t("admin.actions")}</th>
      </tr>
      </thead>
      <tbody>
      {
        this.props.items.map((item, key) => {
          return (
            <tr key={item.id}>
              <td>{item.id || key}</td>
              {this.props.activeItems === "users" ?
                <>
                  <td>
                    {item.roleName && item.roleName.indexOf("ADMIN") > -1 &&
                    <i className="fa fa-lock ml-1"></i>}
                  </td>
                  <td className="text-left">{item.firstName}</td>
                  <td className="text-left">{item.lastName}</td>
                  <td className="text-left">{item.email}</td>
                </> :
                <>
                  <td>
                    <Form.Check type="checkbox" checked={item.active}
                                onChange={async (e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  await this.props.addEditItem(this.props.activeItems, {...item, active: e.target.checked}, true);
                                  this.props.getItemsList(this.props.activeItems, 0, this.props.paginationConfig.size);
                                }} />
                  </td>
                  <td className="text-left">{item.title}</td>
                  <td>{item.author}</td>
                  <td>{new Date(item.date).toDateString()}</td>
                </>
              }
              <td className="d-flex justify-content-center align-items-stretch">
                {this.props.activeItems === "users" ||
                <Button variant="success" size="sm" className="mr-2"
                        onClick={(e) => this.props.toggleAddEditModal(true, item)}>
                  <i className="fa fa-edit"></i></Button>}
                <Button variant="danger" size="sm" onClick={(e) => this.deleteItem(e, item)}>
                  <i className="fa fa-trash"></i></Button>

              </td>
            </tr>);
        })
      }
      </tbody>
    </Table>);
  }

  async deleteItem(e, item) {
    e.stopPropagation();
    await this.props.deleteItem(this.props.activeItems, item.id || item.userId);
    this.props.getItemsList(this.props.activeItems, 0, this.props.paginationConfig.size);
  }

  componentWillMount() {
    this.props.getItemsList(this.props.activeItems, 0, this.props.paginationConfig.size);
    this.props.getAuthor(localStorage.getItem("userId"));
  }

  render() {
    return (
      <Col className="text-center" xs md={{ span: 10, offset: 1 }}>
        {!!this.props.errorMessage && <Row className="pt-3">
          <Col>
            <Alert variant="danger" className="mt-3">
              {i18n.t(this.props.errorMessage)}
            </Alert>
          </Col>
        </Row>}
        <Row className="pt-3 mb-3">
          <Col className="mt-3 d-flex justify-content-start">
            <Button variant="secondary"
                    disabled={this.state.role.indexOf("SUPER_ADMIN") < 0 }
                    onClick={()=> this.setState({setAdminRoleModalShown: true})}>{i18n.t("admin.btn-set-admin-role")}</Button>
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
          {this.state.role.indexOf("SUPER_ADMIN") >= 0 &&
          <Tab eventKey="users" title={i18n.t("admin.users")}>
            {this.getContentTable()}
          </Tab>}
        </Tabs>
        {this.props.activeItems !== "users" &&
          <Button variant="secondary" size="lg" className="fixed-bottom m-3"
                  onClick={() => {this.props.toggleAddEditModal(true)}}>+</Button>
        }
        {this.props.addEditModalShown && <AddEditModal />}
        {this.state.setAdminRoleModalShown && <SetAdminRoleModal closeModal={async(email) => {
          this.setState({setAdminRoleModalShown: false});
          if (email) {
            await this.props.sendAdminRoleRequest(email);
            history.push("/result");
          }
        }}/>}
      </Col>
    );
  }
}

export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(AdminPage));

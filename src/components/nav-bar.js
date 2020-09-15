import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Navbar, Nav, NavDropdown, Button} from "react-bootstrap";
import {withTranslation} from "react-i18next";
import {history} from '../components/App';
import {actionCreators} from "../store/main/Main-actions";
import logo from "../assets/NW_logo_sm.png";
import facebookIcon from "../assets/facebook.png";
import uaIcon from "../assets/ua.png";
import enIcon from "../assets/en.png";
import i18n from "../i18n";

class NavBarBlock extends React.Component {
  componentDidMount() {
    this.props.getProjects(0, 5);
    this.props.getArticles(0, 5);
    this.props.getCategories("project");
  }
  navigateTo(menuItemLink) {
    history.push(menuItemLink);
  }

  isNavItemActive(navItem) {
    if (!navItem.subItems) {
      return this.props.history.location.pathname === navItem.link;
    }
    let result = false;
    navItem.subItems.forEach(subItem => {
      if (this.props.history.location.pathname === subItem.link) {
        result = true;
      }
    });
    return result;
  }

  getNavItems() {
    let menuItems = [
      {
        description: "menu.main",
        link: "/"
      }, {
        description: "menu.about-us.title",
        subItems: [
          {
            description: "menu.about-us.our-team",
            link: "/our-team"
          },
          {
            description: "menu.about-us.history",
            link: "/history"
          },
          {
            description: "menu.about-us.reports",
            link: "/reports"
          },
          {
            description: "menu.about-us.contact-us",
            link: "/contact-us"
          }
        ]
      }];
    if (this.props.projectCategories.length > 0) {
      const categoriesMenuItem = {
        description: "menu.project",
        subItems: this.props.projectCategories.map((cat, key) => {
          return {
            description: cat,
            link: `/project/${cat}`
          }
        })
      };
      menuItems = [...menuItems, categoriesMenuItem];
    }
    const blogMenuItem = {
      description: "menu.blog",
      link: "/blog"
    };
    menuItems = [...menuItems, blogMenuItem];
    let userRole = (this.props.user && this.props.user.role) || localStorage.getItem("role") || "";
    if (userRole.indexOf("ADMIN") > -1) {
      menuItems.unshift({
        description: "menu.admin",
        link: "/admin"
      });
    }
    return menuItems;
  }

  getAuthorizationBtn() {
    return (this.props.activeSession) ?
      <Button variant="outline-secondary" onClick={(e) => this.props.logout()}>
        <i className="fa fa-sign-out mr-1"></i>{i18n.t("menu.logout")}</Button> :
      <Button variant="outline-secondary" onClick={(e) => this.navigateTo("/login")}>
        <i className="fa fa-sign-in mr-1"></i>{i18n.t("menu.login")}</Button>;
  }

  render() {
    this.props.history.listen((location, action) => {
      this.props.clearErrors();
    });
    return (
      <Navbar expand="sm" sticky="top" bg="light" variant="light" className="d-flex">
        <Navbar.Brand>
          <a onClick={(e) => this.navigateTo("/")}>
            <img src={logo} style={{width: 80, marginTop: -7}} alt=""/>
          </a>
          <div className="d-none d-sm-inline ml-3 mr-1">{this.getAuthorizationBtn()}</div>
          <a onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ua" : "en")} className="mr-1">
            <img src={i18n.language === "en" ? uaIcon : enIcon} style={{height: "28px"}}
                 alt={i18n.language === "en" ? "ua" : "en"}/>
          </a>
          <a href="https://www.facebook.com/New-Ukrainian-Wave-134781923303336/">
            <img src={facebookIcon} style={{height: "26px"}} alt="facebook"/>
          </a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {this.getNavItems().map((menuItem, key) => {
              if (!!menuItem.subItems) {
                return (<NavDropdown title={i18n.t(menuItem.description)} key={key}
                                     className={"font-weight-bold h5" + (this.isNavItemActive(menuItem) ? " active" : "")}>
                  {menuItem.subItems.map((item, key) => {
                    return (<NavDropdown.Item key={key}
                                              onClick={(e) => this.navigateTo(item.link)}>{i18n.t(item.description)}</NavDropdown.Item>);
                  })}
                </NavDropdown>);
              }
              return (<Nav.Link key={key} onClick={(e) => this.navigateTo(menuItem.link)}
                                className={"font-weight-bold h5" + (this.isNavItemActive(menuItem) ? " active" : "")}>
                {i18n.t(menuItem.description)}
              </Nav.Link>);
            })}
            <Nav.Link key="donations" onClick={(e) => this.navigateTo("/donations")}
                      className={"font-weight-bold h5 d-inline d-sm-none" + (this.isNavItemActive("donations") ? " active" : "")}>
              {i18n.t("menu.donate")}
            </Nav.Link>
            <div className="d-inline d-sm-none">{this.getAuthorizationBtn()}</div>
          </Nav>
        </Navbar.Collapse>
        <div className="d-none d-sm-inline">
          <Button variant="outline-secondary" className="ml-md-4"
                  onClick={(e) => this.navigateTo("/donations")}>
            {i18n.t("menu.donate")}</Button>
        </div>
      </Navbar>
    );
  }
}

export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(NavBarBlock));

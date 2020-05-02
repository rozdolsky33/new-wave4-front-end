import React, { Suspense } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { history } from '../components/App';
import {actionCreators} from "../store/Main-actions";
import logo from "../assets/NW_logo_sm.png";
import i18n from "../i18n";

class NavBarBlock extends React.Component {
  componentDidMount() {
    this.props.getProjects(0, 5);
    this.props.getArticles(0, 5);
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
    let blogMenuItem = {
      description: "menu.activities",
      subItems: []
    };
    if (this.props.blog.length > 0 ) {
      blogMenuItem.subItems.push({
        description: "menu.blog",
        link: "/blog"
      });
    }
    if (this.props.project.length > 0 ) {
      blogMenuItem.subItems.push({
        description: "menu.project",
        link: "/project"
      });
    }
    if (this.props.project.length + this.props.blog.length > 0 ) {
      menuItems = [...menuItems, blogMenuItem];
    }
    let userRole = (this.props.user && this.props.user.role) ||localStorage.getItem("role") || "";
    if (userRole.indexOf("ADMIN") > -1) {
      menuItems.unshift({
        description: "menu.admin",
        link: "/admin"
      });
    }
    return menuItems;
  }

  render() {
    return (
      <Navbar expand="sm" sticky="top" bg="light" variant="light" className="d-flex">
        <Navbar.Brand className="order-1">
          <a onClick={(e) => this.navigateTo("/")} >
            <img src={logo} style={{width:80, marginTop: -7}} alt=""/>
          </a>
          {!!(this.props.user && this.props.user.token) || !!localStorage.getItem("token") ?
            <span onClick={(e) => this.props.logout()} >
              <img src={`../assets/imgs/logout.png`} style={{height:"29px"}} alt={i18n.t("menu.logout")}/>
            </span>:
            <span onClick={(e) => this.navigateTo("/login")} className="mr-1">
              <img src={`../assets/imgs/login.png`} style={{height:"27px"}} alt={i18n.t("menu.login")}/>
            </span>}
          <span onClick={() => i18n.changeLanguage( i18n.language === "en" ? "ua" : "en")} className="mr-1">
            <img src={`../assets/imgs/${i18n.language === "en" ? "ua" : "en"}.png`} style={{height:"28px"}}
                 alt={i18n.language === "en" ? "ua" : "en"}/>
          </span>
          <a href="https://www.facebook.com/New-Ukrainian-Wave-134781923303336/" >
            <img src={`../assets/imgs/facebook.png`} style={{height:"26px"}} alt="facebook"/>
          </a>
        </Navbar.Brand>
        <Navbar.Toggle className="order-3 order-sm-2" aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end order-3 order-sm-2">
          <Nav>
            {this.getNavItems().map((menuItem, key) => {
              if (!!menuItem.subItems) {
                return (<NavDropdown title={i18n.t(menuItem.description)} key={key} className={ this.isNavItemActive(menuItem) ? "active" : ""}>
                  {menuItem.subItems.map((item, key) => {
                    return (<NavDropdown.Item key={key} onClick={(e) => this.navigateTo(item.link)}>{i18n.t(item.description)}</NavDropdown.Item>);
                  })}
                </NavDropdown>);
              }
              return (<Nav.Link key={key} onClick={(e) => this.navigateTo(menuItem.link)} className={ this.isNavItemActive(menuItem) ? "active" : ""}>
                {i18n.t(menuItem.description)}
              </Nav.Link>);
            })}
          </Nav>
        </Navbar.Collapse>
        <div className="order-2 order-sm-3">
          <Button onClick={(e) => this.navigateTo("/donations")} className="ml-md-4">{i18n.t("menu.donate")}</Button>
        </div>
      </Navbar>
    );
  }
}
export default connect(
  state => state.mainReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withTranslation()(NavBarBlock));

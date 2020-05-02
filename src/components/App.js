import React, {Suspense} from "react";
import {Navbar, Row} from "react-bootstrap";
import {Route, Router} from "react-router-dom";
import NavBarBlock from "./nav-bar";
import MainPage from "./pages/main";
import ReportsPage from "./pages/reports";
import SocialPage from "./pages/projects/social";
import CultureAndArtPage from "./pages/projects/cultureAndArt";
import PublicationsPage from "./pages/projects/publications";
import EducationalPage from "./pages/projects/educational";
import DonationsPage from "./pages/donations";
import HistoryPage from "./pages/history";
import ArticlePage from "./pages/article";
import ListPage from "./common/list";
import OurTeamPage from "./pages/our-team";
import ContactUsPage from "./pages/contact-us";
import AdminPage from "./admin";
import LoginPage from "./authorization/login";
import RegistrationPage from "./authorization/registration";
import ForgotPasswordPage from "./authorization/forgot-password";
import ResetPasswordPage from "./authorization/reset-password";
import ResultPage from "./pages/result";
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
export default class App extends React.Component {
  render() {
    return (
      <Suspense className="App" fallback={null}>
        <NavBarBlock history={this.props.history} />
        <Row className="m-0 overflow-hidden">
          <Router history={this.props.history}>
            <Route path="/" exact={true} component={MainPage} />
            <Route path="/reports" component={ReportsPage} />
            <Route path="/our-team" component={OurTeamPage} />
            <Route path="/contact-us" component={ContactUsPage} />
            <Route path="/history" component={HistoryPage} />
            <Route path="/social" component={SocialPage} />
            <Route path="/educational" component={EducationalPage} />
            <Route path="/publications" component={PublicationsPage} />
            <Route path="/culture-and-art" component={CultureAndArtPage} />
            <Route path="/donations" component={DonationsPage} />
            <Route path="/project" component={() => <ListPage type="project"/>} />
            <Route path="/blog" component={() => <ListPage type="blog"/>} />
            <Route path="/item/:type/:id" component={ArticlePage} />

            <Route path="/admin" component={AdminPage} />

            <Route path="/login" component={LoginPage} />
            <Route path="/registration" component={RegistrationPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/password-reset" component={ResetPasswordPage} />

            <Route path="/result/:token?" component={ResultPage} />
          </Router>
        </Row>
      </Suspense>
    );
  }
}

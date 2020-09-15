import React, { Suspense } from "react";
import { Row } from "react-bootstrap";
import { Route, Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import NavBarBlock from "./nav-bar";
import MainPage from "./pages/main";
import ReportsPage from "./pages/reports";
import DonationsPage from "./pages/donations";
import HistoryPage from "./pages/history";
import PostPage from "./common/post";
import PostListPage from "./common/post-list";
import OurTeamPage from "./pages/our-team";
import ContactUsPage from "./pages/contact-us";
import AdminPage from "./admin";
import LoginPage from "./authorization/login";
import RegistrationPage from "./authorization/registration";
import ForgotPasswordPage from "./authorization/forgot-password";
import ResetPasswordPage from "./authorization/reset-password";
import ResultPage from "./pages/result";
import './app.css';

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
            <Route path="/donations" component={DonationsPage} />
            <Route path="/project/:category"
                   component={(props) => <PostListPage type="project" category={props.match.params.category}/>} />
            <Route path="/blog" component={() => <PostListPage type="blog"/>} />
            <Route path="/item/:type/:id" component={PostPage} />

            <Route path="/admin" component={AdminPage} />

            <Route path="/login" component={LoginPage} />
            <Route path="/registration" component={RegistrationPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/password-reset/:token"
                   component={(props) => <ResetPasswordPage passwordReset={true} token={props.match.params.token} />} />
            <Route path="/assign-admin/:token"
                   component={(props) => <ResetPasswordPage passwordReset={false} token={props.match.params.token} />} />

            <Route path="/result/:token?" component={ResultPage} />
          </Router>
        </Row>
      </Suspense>
    );
  }
}

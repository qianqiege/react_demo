import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Aside from './layout/Aside';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Login from './Login';
import { currentUser } from './../actions/auth';
import { push } from 'react-router-redux';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.onCollapseChanged = this.onCollapseChanged.bind(this);
    this.renderAuthenticatedPage = this.renderAuthenticatedPage.bind(this);
    this.checkMenuAbility = this.checkMenuAbility.bind(this);

    this.state = {
      collapse: false
    };
  }

  componentDidMount() {
    const { user, isAuthenticated, dispatch } = this.props;
    if(!user && isAuthenticated){
      dispatch(currentUser(this.checkMenuAbility));
    }
  }

  checkMenuAbility(data) {
    const { dispatch, routing } = this.props;
    if(!data.accessible_menus.includes(routing.locationBeforeTransitions.pathname)){
      dispatch(push(data.accessible_menus[0]));
    }
  }

  onCollapseChanged() {
    let newState = !this.state.collapse;

    /* eslint-disable react/no-set-state */
    this.setState({
      collapse: newState
    });
  }

  renderAuthenticatedPage() {
    const collapse = this.state.collapse;
    return (
      <div className={collapse ? "ant-layout-aside ant-layout-aside-collapse" : "ant-layout-aside"}>
        <Aside
          collapse={this.state.collapse}
          callbackParent={this.onCollapseChanged} />
        <div className="ant-layout-main">
          <Header />

          <div className="ant-layout-container">
            <div className="ant-layout-content">
              <div>
                {this.props.children}
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    );
  }

  render() {
    const { isAuthenticated } = this.props;
    return (
      <div>
        {isAuthenticated? this.renderAuthenticatedPage() : <Login/>}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  isAuthenticated: React.PropTypes.bool,
  user: PropTypes.object,
  routing: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { routing, auth: { isAuthenticated, user } } = state;
  return {
    isAuthenticated, user,routing
  };
}

export default connect(mapStateToProps)(App);

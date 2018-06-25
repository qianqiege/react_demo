import React, { Component, PropTypes } from 'react';
import { Row, Col, Menu, Dropdown, Icon } from 'antd';
import { connect } from 'react-redux';

import { logoutUser } from './../../actions/auth';

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(e) {
    const { dispatch } = this.props;
    e.preventDefault();
    dispatch(logoutUser());
  }

  render(){
    const { user } = this.props;
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a onClick={this.handleLogout} href="#">退出</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <header className="ant-layout-header">
        <Row>
          <Col span={11} offset={1}>
            <h3 style={{lineHeight: '64px'}}>欢迎来到慢病健康管理系统</h3>
          </Col>
          <Col span={11} style={{textAlign: 'right'}}>
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#" style={{lineHeight: '64px'}}>
                {user && user.name}  <Icon type="down" />
              </a>
            </Dropdown>
          </Col>
        </Row>
      </header>
    );
  }
}

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object
};

function mapStateToProps(state) {
  const { auth: { user } } = state;
  return {
    user
  };
}

export default connect(mapStateToProps)(Header);


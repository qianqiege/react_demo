import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router';
import { fetchMenus } from './../../actions/menus';

const SubMenu = Menu.SubMenu;
const logo = require('./logo.png');

class Aside extends Component {
  constructor(props) {
    super(props);
    this.onCollapseChange = this.onCollapseChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.onToggle = this.onToggle.bind(this);

    this.state = {
      currentSelectedKey: ['/'],
      openKeys: []
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchMenus());
  }

  componentWillReceiveProps(nextProps) {
    let subMenuParentId = null;
    let currentMenuIdentifier = null;
    nextProps.menus.map(function(menu) {
      if(menu.children.length>0) {
        menu.children.map(function(subMenu){
          for(let key in subMenu) {
            if(subMenu[key] == location.pathname){
              subMenuParentId = subMenu.parent_id;
            }
          }
        });
      }
      if(menu.id == subMenuParentId) {
        currentMenuIdentifier = menu.url;
      }
    });
    this.setState({
      currentSelectedKey: [location.pathname],
      openKeys: [currentMenuIdentifier]
    });
  }

  handleMenuClick(e) {
    this.setState({
      currentSelectedKey: [e.key],
      openKeys: e.keyPath.slice(1)
    });
  }

  onToggle(info) {
    if(!this.props.collapse) {
      this.setState({
        openKeys: info.open ? info.keyPath : info.keyPath.slice(1)
      });
    }
  }

  onCollapseChange() {
    this.props.callbackParent();
  }

  renderSubMenu(menu){
    return menu.children.map((item) => {
      return(
        <Menu.Item key={item.url}>
          <Link to={item.url}>
            {item.name}
          </Link>
        </Menu.Item>
      );
    });
  }

  renderSubMenuTitle (menu) {
    return <span><Icon type="user" /><a className="nav-text">{menu.name}</a></span>;
  }

  renderItems() {
    const { menus } = this.props;
    return menus.map((menu) => {
      if(menu.children && menu.children.length > 0) {
        return (
          <SubMenu
            key={menu.url}
            title={this.renderSubMenuTitle(menu)}>
            {this.renderSubMenu(menu)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={menu.url}>
            <Link to={menu.url}>
              <Icon type={menu.icon} />
              <span className="nav-text">{menu.name}</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  }

  render() {
    const { collapse } = this.props;
    const { currentSelectedKey, openKeys } = this.state;
    return (
      <aside className="ant-layout-sider">
        <div className="ant-layout-logo">
          <img src={logo}></img>
        </div>
        <Menu
          onClick={this.handleMenuClick}
          mode={collapse ? "vertical" : "inline"}
          theme="dark"
          selectedKeys={currentSelectedKey}
          openKeys={openKeys}
          onOpen={this.onToggle}
          onClose={this.onToggle}
        >
          {this.renderItems()}
        </Menu>
        <div className="ant-aside-action" onClick={this.onCollapseChange}>
          {collapse ? <Icon type="right" /> : <Icon type="left" />}
        </div>
      </aside>
    );
  }
}

Aside.propTypes = {
  callbackParent: PropTypes.func,
  collapse: PropTypes.bool,
  menus: PropTypes.array,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    menus: state.menus.data
  };
}

export default connect(mapStateToProps)(Aside);

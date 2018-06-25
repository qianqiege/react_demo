import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal, Form, Input, Checkbox } from 'antd';
import { fetchRoles, fetchAbilities, createRole, deleteRoles, updateRole } from './../actions/roles';
import AccessControl from './AccessControl';
const CheckboxGroup = Checkbox.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class RolePage extends Component {
  constructor(props) {
    super(props);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.handleShowSizeChange = this.handleShowSizeChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderCheckbox = this.renderCheckbox.bind(this);
    this.createFailCallback = this.createFailCallback.bind(this);
    this.createSucceedCallback = this.createSucceedCallback.bind(this);
    this.state = {
      selectedRowKeys: [],
      visible: false, // Modal hide or show
      perPage: 10, // Default 10 items per page
      currentRole: null
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchRoles());
    dispatch(fetchAbilities());
  }

  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  showConfirm() {
    confirm({
      title: '您是否确认要删除所选内容',
      content: '删除数据不可回退！',
      onOk: this.handleDelete
    });
  }

  showModal(role) {
    const { form } = this.props;
    this.setState({
      visible: true,
      currentRole: role
    });
    if (role) {
      form.setFields({
        name: {
          name: 'name',
          value: role.name
        },
        checked_features: {
          name: 'checked_features',
          value: role.abilities.features
        }
      });
    }
  }

  hideModal() {
    const { form } = this.props;
    this.setState({
      visible: false,
      currentRole: null
    });
    form.resetFields();
  }

  handleShowSizeChange(current, pageSize) {
    const { dispatch } = this.props;
    this.setState({
      perPage: pageSize
    });
    dispatch(fetchRoles({page: current, per_page: pageSize}));
  }

  handlePageChange(current) {
    const { dispatch } = this.props;
    dispatch(fetchRoles({page: current, per_page: this.state.perPage}));
  }

  handleSubmit() {
    const { dispatch, form } = this.props;
    const { currentRole } = this.state;
    form.validateFields((errors) => {
      if (errors) {
        return false;
      }
      const formData = form.getFieldsValue();
      if (!formData.checked_features) {
        this.createFailCallback(formData.name, '请至少勾选一个权限');
        return false;
      }
      if (currentRole) {
        dispatch(updateRole(Object.assign({}, currentRole, form.getFieldsValue()), this.createSucceedCallback, this.createFailCallback));
      } else {
        dispatch(createRole(form.getFieldsValue(), this.createSucceedCallback, this.createFailCallback));
      }
    });
  }

  createSucceedCallback(){
    this.hideModal();
  }

  createFailCallback(name, message){
    const { setFields } = this.props.form;
    const newValue = {
      name: {
        name: "name",
        validating: false,
        value: name,
        errors: [message]
      }
    };
    setFields(newValue);
  }

  handleDelete() {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch(deleteRoles(selectedRowKeys));
    this.setState({ selectedRowKeys: [] });
  }

  renderCheckbox() {
    const { abilities, form: { getFieldProps } } = this.props;
    return abilities.data.map((menu) => {
      const options = menu.features.map((feature) => {
        return {
          label: feature.name,
          value: feature.value
        };
      });
      return (
        <FormItem
          label={menu.menu_name}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          key={menu.menu_identifier}
        >
          <CheckboxGroup {...getFieldProps('checked_features')} options={options} />
        </FormItem>
      );
    });
  }

  render() {
    const { roles: { data, isFetching, meta }, abilities, form: { getFieldProps }, form } = this.props;
    const { selectedRowKeys } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };

    const columns = [{
      title: '角色名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <AccessControl ability="edit_role">
          <Button disabled={!record.updatable} onClick={() => {
            this.showModal(record);
          }}>
            修改
          </Button>
        </AccessControl>
      )
    }];

    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps(record) {
        return {
          disabled: !record.deletable    // 配置无法勾选的列
        };
      }
    };
    const hasSelected = selectedRowKeys.length > 0;

    const nameProps = getFieldProps('name', {
      validate: [{
        rules: [
          { required: true, message: '角色名称不能为空' }
        ],
        trigger: 'onBlur'
      }]
    });
    const pagination = {
      total: meta.total,
      showSizeChanger: true,
      onShowSizeChange: this.handleShowSizeChange,
      onChange: this.handlePageChange
    };
    return (
      <div>
        <div style={{ marginBottom: 16, marginRight: 3 }}>
          <AccessControl ability="create_role">
            <Button type="primary" onClick={() => {
              this.showModal();
            }}
              loading={abilities.isFetching} disabled={abilities.isFetching}
            >添加角色</Button>
          </AccessControl>
          <AccessControl ability="delete_role">
            <Button type="dashed" onClick={this.showConfirm}
              disabled={!hasSelected}
            >删除角色</Button>
          </AccessControl>
        </div>
        <Table
          scroll={{x:true, y:false}}
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
          loading={isFetching}
          bordered
          pagination={pagination}
          rowKey={record => record.id}
        />
        <Modal
          title="权限序列"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          okText="保存" cancelText="取消"
        >
          <Form horizontal form={form}>
            <FormItem
              {...formItemLayout}
              label="角色名称"
              hasFeedback
            >
              <Input type="text" {...nameProps} placeholder="请输入角色名称" />
            </FormItem>
            {this.renderCheckbox()}
          </Form>
        </Modal>
      </div>
    );
  }
}

RolePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  roles: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  abilities: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { roles, abilities } = state;
  return {
    roles,
    abilities
  };
}

export default connect(mapStateToProps)(createForm()(RolePage));

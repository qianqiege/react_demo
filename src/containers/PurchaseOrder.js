import React from 'react';
import { Button, Row, Col } from 'antd';

import { connect } from 'react-redux';
import CustomTable from './../components/CustomTable';
import StringFilterDropdown from './../components/StringFilterDropdown';
import DateTimeFilterDropdown from './../components/DateTimeFilterDropdown';
import { fetchPurchaseOrders, fetchPurchaseOrderItems } from './../actions/purchaseOrders';
import { state } from './../constants/dictionary';

const ButtonGroup = Button.Group;

function mapStateToProps(state) {
  const {  purchaseOrders, purchaseOrderItems } = state;
  return {
    purchaseOrders, purchaseOrderItems
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPurchaseOrders: (params) => dispatch(fetchPurchaseOrders(params)),
    fetchPurchaseOrderItems: (id) => dispatch(fetchPurchaseOrderItems(id))
  };
}

export class PurchaseOrder extends React.Component {
  static propTypes = {
    fetchPurchaseOrders: React.PropTypes.func,
    fetchPurchaseOrderItems: React.PropTypes.func,
    purchaseOrders: React.PropTypes.object,
    purchaseOrderItems: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state={
      selectedRowIndex: null
    };
  }

  componentDidMount(){
    this.props.fetchPurchaseOrders();
  }

  // should move this method to helper
  handleTableChange = (pagination, filters = {}, sorter = {}) => {
    const pageParams = { page: pagination.current, per_page: pagination.pageSize };
    const filtersField = {};
    if(Object.keys(filters).length !== 0) {
      // enum filters
      [{
        key: "state", filterParams: "state_in"
      }].map(item => {
        if(filters[item.key]){
          filtersField[`q[${item.filterParams}]`] = filters[item.key];
        }
      });

      // date range filter
      ['apply_at'].map(item => {
        if(filters[item]){
          filtersField[`q[${item}_gteq]`] = filters[item][0];
          filtersField[`q[${item}_lteq]`] = filters[item][1];
        }
      });

      // string filter
      ['number', 'inbound_type'].map(item => {
        if(filters[item]){
          filtersField[`q[${item}_cont]`] = filters[item];
        }
      });
    }
    const sortParams = {};
    if (Object.keys(sorter).length !== 0) {
      const sortMethod = sorter.order === "descend" ? "desc" : "asc";
      sortParams['sorts'] = `${sorter.columnKey} ${sortMethod}`;
    }

    const params = Object.assign({}, pageParams, filtersField, sortParams);
    this.props.fetchPurchaseOrders(params);
  }

  // 处理表格的行点击事件
  handleTableRowClick = (record, index) => {
    this.setState({
      selectedRowIndex: index
    });
    this.props.fetchPurchaseOrderItems(record.id);
  }

  render() {
    const { purchaseOrders: { data, meta, isFetching }, purchaseOrderItems: { data:itemData, isFetching: itemIsFetching } } = this.props;
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "采购单号",
        dataIndex: "number",
        key: "number",
        sorter: true,
        filterDropdown: <StringFilterDropdown columnKey={"number"}/>
      },
      {
        title: "入库类型",
        dataIndex: "inbound_type",
        key: "inbound_type",
        sorter: true,
        filterDropdown: <StringFilterDropdown columnKey={"inbound_type"}/>
      },
      {
        title: "采购人员",
        dataIndex: "buyer_name",
        key: "buyer_name",
        sorter: true
      },
      {
        title: "申请时间",
        dataIndex: "apply_at",
        key: "apply_at",
        sorter: true,
        filterDropdown: <DateTimeFilterDropdown columnKey={"apply_at"}/>
      },
      {
        title: "采购总金额",
        dataIndex: "total",
        key: "total",
        sorter: true
      },
      {
        title: "采购单状态",
        dataIndex: "state",
        key: "state",
        sorter: true,
        filters: state
      },
      {
        title: "制单人员",
        dataIndex: "creator_name",
        key: "creator_name",
        sorter: true
      },
      {
        title: '操作',
        key: 'operation',
        render: () => (
          <ButtonGroup>
            <Button type="primary">审核</Button>
            <Button type="ghost">作废</Button>
            <Button type="ghost">修改</Button>
          </ButtonGroup>
        )
      }
    ];

    const detailColumns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "药品名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "药品单价",
        dataIndex: "price",
        key: "price",
        sorter: true
      },
      {
        title: "规格",
        dataIndex: "specification",
        key: "specification",
        sorter: true
      },
      {
        title: "厂商、产地",
        dataIndex: "manufactory_name",
        key: "manufactory_name",
        sorter: true
      },
      {
        title: "类别",
        dataIndex: "medicine_category_name",
        key: "medicine_category_name",
        sorter: true
      },
      {
        title: "申请数量",
        dataIndex: "count",
        key: "count",
        sorter: true
      },
      {
        title: "金额",
        dataIndex: "total",
        key: "total",
        sorter: true
      }
    ];

    const pagination = {
      showSizeChanger: true,
      total: meta.total,
      pageSize: meta.perPage
    };

    return (
      <div>
        <Row>
          <Col span={16}><h3>采购单列表</h3></Col>
          <Col span={8}>
            <div style={{ marginBottom: 16, float: 'right' }}>
              <Button type="primary">审核</Button>
              <Button type="ghost">作废</Button>
              <Button type="ghost">修改</Button>
              <Button type="ghost">打印</Button>
            </div>
          </Col>
        </Row>
        <CustomTable
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={isFetching}
          rowKey={(record) => record.id}
          onChange={this.handleTableChange}
          onRowClick={this.handleTableRowClick}
          rowClassName={(record, index) => index === this.state.selectedRowIndex ? 'row-actived' : ''}
          bordered
        />

        <Row><h3>采购单详情</h3></Row>
        <CustomTable
          columns={detailColumns}
          dataSource={itemData}
          loading={itemIsFetching}
          rowKey={(record) => record.id}
          pagination={false}
          bordered
        />

      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseOrder);

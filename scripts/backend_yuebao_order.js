define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'yuebao_order/index',
                    add_url: 'yuebao_order/add',
                    del_url: 'yuebao_order/del',
                    multi_url: 'yuebao_order/multi',
                    table: 'yu',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'share_id',
                sortName: 'share_id',
                sortOrder: 'desc',
                pagination: true,
                search: true,
                showRefresh: true,
                showToggle: true,
                showColumns: true,
                pageSize: 20,
                pageList: [10, 20, 50, 100],
                columns: [
                    [
                        {checkbox: true},
                        {field: 'share_id', title: 'ID', sortable: true, width: 80},
                        {field: 'user_id', title: '用户ID', sortable: true, width: 80},
                        {field: 'username', title: '用户名', sortable: true, width: 120},
                        {field: 'amount', title: '金额', sortable: true, width: 150, 
                         formatter: function(value, row, index) {
                             // 处理金额显示，移除千分位分隔符
                             if (typeof value === 'string') {
                                 return value.replace(/,/g, '');
                             }
                             return value || '0.00';
                         }
                        },
                        {field: 'create_time', title: '创建时间', sortable: true, width: 180,
                         formatter: function(value, row, index) {
                             // 直接显示时间字符串，不进行转换
                             return value || '未设置';
                         }
                        },
                        {field: 'operate', title: '操作', table: table, 
                         events: Table.api.events.operate, 
                         formatter: Table.api.formatter.operate,
                         width: 150,
                         buttons: [
                             {
                                 name: 'del',
                                 text: '删除',
                                 title: '删除这条记录',
                                 classname: 'btn btn-xs btn-danger btn-del',
                                 icon: 'fa fa-trash',
                                 url: 'yuebao_order/del',
                                 confirm: '确定删除这条记录吗？',
                                 success: function (data, ret) {
                                     table.bootstrapTable('refresh');
                                     Layer.msg(ret.msg);
                                 },
                                 error: function (data, ret) {
                                     Layer.msg(ret.msg);
                                 }
                             }
                         ]
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});

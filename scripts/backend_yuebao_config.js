define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'yuebao_config/index',
                    add_url: 'yuebao_config/add',
                    edit_url: 'yuebao_config/edit',
                    del_url: 'yuebao_config/del',
                    multi_url: 'yuebao_config/multi',
                    table: 'yueconfig',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
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
                        {field: 'id', title: 'ID', sortable: true, width: 80},
                        {field: 'title', title: '配置标题', sortable: true, width: 200},
                        {field: 'radio', title: '收益率', sortable: true, width: 100},
                        {field: 'day', title: '计算周期(天)', sortable: true, width: 120},
                        {field: 'min_money', title: '最低金额', sortable: true, width: 150,
                         formatter: function(value, row, index) {
                             // 处理金额显示
                             if (typeof value === 'string') {
                                 return value.replace(/,/g, '');
                             }
                             return value || '0.00';
                         }
                        },
                        {field: 'status', title: '状态', sortable: true, width: 100,
                         formatter: function(value, row, index) {
                             if (value == 1) {
                                 return '<span class="label label-success">启用</span>';
                             } else {
                                 return '<span class="label label-danger">禁用</span>';
                             }
                         }
                        },
                        {field: 'creat_time', title: '创建时间', sortable: true, width: 180},
                        {field: 'operate', title: '操作', table: table, 
                         events: Table.api.events.operate, 
                         formatter: Table.api.formatter.operate,
                         width: 200
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
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"), function(data, ret){
                    // 提交前验证范围格式
                    var radio = $('#c-radio').val();
                    var minMoney = $('#c-min_money').val();
                    
                    // 验证收益率
                    if (!Controller.api.validateRangeOrNumber(radio)) {
                        Layer.msg('收益率格式不正确，请输入单个数字(如：1.00)或范围(如：1.00-1.22)', {icon: 0});
                        return false;
                    }
                    
                    // 验证最低金额
                    if (!Controller.api.validateRangeOrNumber(minMoney)) {
                        Layer.msg('最低金额格式不正确，请输入单个数字(如：10000)或范围(如：10000-500000)', {icon: 0});
                        return false;
                    }
                    
                    return true;
                });
            },
            
            /**
             * 验证范围或数字格式
             * @param value 要验证的值
             * @returns {boolean}
             */
            validateRangeOrNumber: function(value) {
                value = $.trim(value);
                
                // 检查是否包含范围符号 "-"
                if (value.indexOf('-') !== -1) {
                    // 范围格式：分割并验证两个数字
                    var parts = value.split('-');
                    
                    // 必须正好是两个部分
                    if (parts.length !== 2) {
                        return false;
                    }
                    
                    var min = $.trim(parts[0]);
                    var max = $.trim(parts[1]);
                    
                    // 验证每个部分都是有效的数字
                    if (!$.isNumeric(min) || !$.isNumeric(max)) {
                        return false;
                    }
                    
                    // 验证最小值小于最大值
                    if (parseFloat(min) >= parseFloat(max)) {
                        return false;
                    }
                    
                    return true;
                } else {
                    // 单个数字：直接验证是否为数字
                    return $.isNumeric(value);
                }
            }
        }
    };
    return Controller;
});

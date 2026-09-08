define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            console.log("Controller.index 开始执行");
            
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'verify/index',
                    edit_url: 'verify/edit',
                    verify_url: 'verify/verify',
                    del_url: 'verify/del',
                    table: 'user',
                }
            });

            var table = $("#table");
            console.log("表格对象:", table);

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'), sortable: true},
                        {field: 'username', title: __('Username')},
                        {field: 'real_name', title: __('RealName')},
                        {field: 'id_card', title: __('IdCard')},
                        {field: 'profession', title: __('Profession')},
                        {field: 'id_img_1', title: __('IdImg1'), formatter: Controller.api.formatter.image},
                        {field: 'id_img_2', title: __('IdImg2'), formatter: Controller.api.formatter.image},
                        {field: 'gj', title:'证件类型', formatter: Controller.api.formatter.idType},
                        {field: 'is_auth', title: __('Status'), searchList: authStatusList, formatter: Table.api.formatter.status},
                        {field: 'id_auth_error', title: __('FailReason')},
                        {field: 'verify_time', title: __('VerifyTime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            // 检查按钮是否存在
            console.log("批量通过按钮:", $('.multi[data-status="2"]'));
            console.log("批量拒绝按钮:", $('.multi[data-status="-1"]'));

            // 批量操作按钮点击 - 简化版本
            $(document).ready(function() {
                console.log("DOM加载完成，开始绑定事件");
                
                // 绑定批量通过按钮
                $(document).on('click', '.multi[data-status="2"]', function(e) {
                    e.preventDefault();
                    console.log("批量通过按钮被点击");
                    handleBatchOperation.call(this, 2);
                });

                // 绑定批量拒绝按钮
                $(document).on('click', '.multi[data-status="-1"]', function(e) {
                    e.preventDefault();
                    console.log("批量拒绝按钮被点击");
                    handleBatchOperation.call(this, -1);
                });
            });

            // 统一的批量操作处理函数
            function handleBatchOperation(status) {
                var that = this;
                var ids = Table.api.selectedids(table);
                var url = $(that).data('url');
                
                console.log("选中的IDs:", ids);
                console.log("URL:", url);
                console.log("状态:", status);

                if (ids.length === 0) {
                    Layer.alert('请先选择要操作的记录');
                    return;
                }

                var confirmMsg = status === 2 ? '确认批量通过选中的记录?' : '确认批量拒绝选中的记录?';
                Layer.confirm(confirmMsg, function(index) {
                    Layer.close(index);
                    
                    if (status === -1) {
                        // 拒绝需要输入原因
                        Layer.prompt({
                            title: '请输入拒绝原因',
                            formType: 2
                        }, function(reason, index) {
                            Layer.close(index);
                            if (!reason.trim()) {
                                Layer.alert('请输入拒绝原因');
                                return;
                            }
                            submitBatchOperation(url, ids, status, reason);
                        });
                    } else {
                        // 通过直接提交
                        submitBatchOperation(url, ids, status);
                    }
                });
            }

            // 提交批量操作
            function submitBatchOperation(url, ids, status, reason) {
                var data = {
                    ids: ids.join(","),
                    status: status
                };
                
                if (reason) {
                    data.reason = reason;
                }

                console.log("提交数据:", data);

                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    success: function(ret) {
                        console.log("请求成功:", ret);
                        if (ret.code === 1) {
                            Layer.msg(ret.msg || '操作成功');
                            table.bootstrapTable('refresh');
                        } else {
                            Layer.alert(ret.msg || '操作失败');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.log("请求失败:", xhr, status, error);
                        Layer.alert('请求失败，请检查网络连接');
                    }
                });
            }

            console.log("事件绑定完成");
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        verify: function () {
            Form.api.bindevent($("form[role=form]"), function(data, ret){
                Fast.api.close(data);
                parent.Layer.alert("审核成功");
                parent.$("#table").bootstrapTable('refresh');
            }, function(data, ret){
                return false;
            });
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            },
            formatter: {
                image: function (value, row, index) {
                    if (value && value.trim() !== '') {
                        // 如果是完整URL，直接使用；如果是相对路径，添加域名
                        var imageUrl = value.startsWith('http') ? value : (window.location.origin + value);
                        return '<a href="' + imageUrl + '" target="_blank"><img src="' + imageUrl + '" style="width: 60px; height: 40px; object-fit: cover; border: 1px solid #ddd; border-radius: 4px;" alt="身份证图片"></a>';
                    }
                    return '<span style="color: #999;">暂无图片</span>';
                },
                idType: function (value, row, index) {
                    if (value === 'id_card') {
                        return '身份证';
                    } else if (value === 'passport') {
                        return '护照';
                    } else if (value) {
                        return value;
                    }
                    return '-';
                }
                
            }
        }
    };
    return Controller;
});

// 版本号: v1.0.1 - 强制刷新缓存 

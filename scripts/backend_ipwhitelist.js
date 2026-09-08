define(['jquery', 'bootstrap', 'backend', 'addtabs', 'adminlte', 'form'], function ($, undefined, Backend, undefined, AdminLTE, Form) {
    var Controller = {
        index: function () {
            //双击重新加载页面
            $(document).on("dblclick", ".sidebar-menu li > a", function (e) {
                $("#con_" + $(this).attr("addtabs") + " iframe").attr('src', function (i, val) {
                    return val;
                });
                e.stopPropagation();
            });

            //修复在移除窗口时下拉框不隐藏的BUG
            $(window).on("blur", function () {
                $("[data-toggle='dropdown']").parent().removeClass("open");
                if ($("body").hasClass("sidebar-open")) {
                    $(".sidebar-toggle").trigger("click");
                }
            });

            //快捷搜索
            $(".menuresult").width($("form.sidebar-form > .input-group").width());
            var searchResult = $(".menuresult");
            $("form.sidebar-form").on("blur", "input[name=q]", function () {
                searchResult.addClass("hide");
            }).on("focus", "input[name=q]", function () {
                if ($("a", searchResult).size() > 0) {
                    searchResult.removeClass("hide");
                }
            }).on("keyup", "input[name=q]", function () {
                searchResult.html('');
                var val = $(this).val();
                var html = [];
                if (val != '') {
                    $("ul.sidebar-menu li a[addtabs]:not([href^='javascript:;'])").each(function () {
                        if ($("span:first", this).text().indexOf(val) > -1 || $(this).attr("py").indexOf(val) > -1 || $(this).attr("pinyin").indexOf(val) > -1) {
                            html.push('<a data-url="' + $(this).attr("href") + '" href="javascript:;">' + $("span:first", this).text() + '</a>');
                            if (html.length >= 100) {
                                return false;
                            }
                        }
                    });
                }
                $(searchResult).append(html.join(""));
                if (html.length > 0) {
                    searchResult.removeClass("hide");
                } else {
                    searchResult.addClass("hide");
                }
            });
            //快捷搜索点击事件
            $("form.sidebar-form").on('mousedown click', '.menuresult a[data-url]', function () {
                Backend.api.addtabs($(this).data("url"));
            });


            //读取首次登录推荐插件列表
            if (localStorage.getItem("fastep") == "installed") {}

            //版本检测
            var checkupdate = function (ignoreversion, tips) {};

//            //读取版本检测信息
//            var ignoreversion = localStorage.getItem("ignoreversion");
//            if (Config.fastadmin.checkupdate && ignoreversion !== "*") {
//                checkupdate(ignoreversion, false);
//            }
//            //手动检测版本信息
//            $("a[data-toggle='checkupdate']").on('click', function () {
//                checkupdate('', true);
//            });

            //切换左侧sidebar显示隐藏
            $(document).on("click fa.event.toggleitem", ".sidebar-menu li > a", function (e) {
                $(".sidebar-menu li").removeClass("active");
                //当外部触发隐藏的a时,触发父辈a的事件
                if (!$(this).closest("ul").is(":visible")) {
                    //如果不需要左侧的菜单栏联动可以注释下面一行即可
                    $(this).closest("ul").prev().trigger("click");
                }

                var visible = $(this).next("ul").is(":visible");
                if (!visible) {
                    $(this).parents("li").addClass("active");
                } else {
                }
                e.stopPropagation();
            });

            //清除缓存
            $(document).on('click', "ul.wipecache li a", function () {
                $.ajax({
                    url: 'ajax/wipecache',
                    dataType: 'json',
                    data: {type: $(this).data("type")},
                    cache: false,
                    success: function (ret) {
                        if (ret.hasOwnProperty("code")) {
                            var msg = ret.hasOwnProperty("msg") && ret.msg != "" ? ret.msg : "";
                            if (ret.code === 1) {
                                Toastr.success(msg ? msg : __('Wipe cache completed'));
                            } else {
                                Toastr.error(msg ? msg : __('Wipe cache failed'));
                            }
                        } else {
                            Toastr.error(__('Unknown data format'));
                        }
                    }, error: function () {
                        Toastr.error(__('Network error'));
                    }
                });
            });

            //全屏事件
            $(document).on('click', "[data-toggle='fullscreen']", function () {
                var doc = document.documentElement;
                if ($(document.body).hasClass("full-screen")) {
                    $(document.body).removeClass("full-screen");
                    document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
                } else {
                    $(document.body).addClass("full-screen");
                    doc.requestFullscreen ? doc.requestFullscreen() : doc.mozRequestFullScreen ? doc.mozRequestFullScreen() : doc.webkitRequestFullscreen ? doc.webkitRequestFullscreen() : doc.msRequestFullscreen && doc.msRequestFullscreen();
                }
            });

            var multiplenav = Config.fastadmin.multiplenav;
            var firstnav = $("#firstnav .nav-addtabs");
            var nav = multiplenav ? $("#secondnav .nav-addtabs") : firstnav;

            //刷新菜单事件
            $(document).on('refresh', '.sidebar-menu', function () {
                Fast.api.ajax({
                    url: 'index/index',
                    data: {action: 'refreshmenu'}
                }, function (data) {
                    $(".sidebar-menu li:not([data-rel='external'])").remove();
                    $(".sidebar-menu").prepend(data.menulist);
                    if (multiplenav) {
                        firstnav.html(data.navlist);
                    }
                    $("li[role='presentation'].active a", nav).trigger('click');
                    return false;
                }, function () {
                    return false;
                });
            });

            if (multiplenav) {
                //一级菜单自适应
                $(window).resize(function () {
                    var siblingsWidth = 0;
                    firstnav.siblings().each(function () {
                        siblingsWidth += $(this).outerWidth();
                    });
                    firstnav.width(firstnav.parent().width() - siblingsWidth);
                    firstnav.refreshAddtabs();
                });

                //点击顶部第一级菜单栏
                firstnav.on("click", "li a", function () {
                    $("li", firstnav).removeClass("active");
                    $(this).closest("li").addClass("active");
                    $(".sidebar-menu > li.treeview").addClass("hidden");
                    if ($(this).attr("url") == "javascript:;") {
                        var sonlist = $(".sidebar-menu > li[pid='" + $(this).attr("addtabs") + "']");
                        sonlist.removeClass("hidden");
                        var sidenav;
                        var last_id = $(this).attr("last-id");
                        if (last_id) {
                            sidenav = $(".sidebar-menu > li[pid='" + $(this).attr("addtabs") + "'] a[addtabs='" + last_id + "']");
                        } else {
                            sidenav = $(".sidebar-menu > li[pid='" + $(this).attr("addtabs") + "']:first > a");
                        }
                        if (sidenav) {
                            sidenav.attr("href") != "javascript:;" && sidenav.trigger('click');
                        }
                    } else {

                    }
                });

                //点击左侧菜单栏
                $(document).on('click', '.sidebar-menu li a[addtabs]', function (e) {
                    var parents = $(this).parentsUntil("ul.sidebar-menu", "li");
                    var top = parents[parents.length - 1];
                    var pid = $(top).attr("pid");
                    if (pid) {
                        var obj = $("li a[addtabs=" + pid + "]", firstnav);
                        var last_id = obj.attr("last-id");
                        if (!last_id || last_id != pid) {
                            obj.attr("last-id", $(this).attr("addtabs"));
                            if (!obj.closest("li").hasClass("active")) {
                                obj.trigger("click");
                            }
                        }
                    }
                });

                var mobilenav = $(".mobilenav");
                $("#firstnav .nav-addtabs li a").each(function () {
                    mobilenav.append($(this).clone().addClass("btn btn-app"));
                });

                //点击移动端一级菜单
                mobilenav.on("click", "a", function () {
                    $("a", mobilenav).removeClass("active");
                    $(this).addClass("active");
                    $(".sidebar-menu > li.treeview").addClass("hidden");
                    if ($(this).attr("url") == "javascript:;") {
                        var sonlist = $(".sidebar-menu > li[pid='" + $(this).attr("addtabs") + "']");
                        sonlist.removeClass("hidden");
                    }
                });
            }

            //这一行需要放在点击左侧链接事件之前
            var addtabs = Config.referer ? localStorage.getItem("addtabs") : null;

            //绑定tabs事件,如果需要点击强制刷新iframe,则请将iframeForceRefresh置为true,iframeForceRefreshTable只强制刷新表格
            nav.addtabs({iframeHeight: "100%", iframeForceRefresh: false, iframeForceRefreshTable: true, nav: nav});

            if ($("ul.sidebar-menu li.active a").size() > 0) {
                $("ul.sidebar-menu li.active a").trigger("click");
            } else {
                if (Config.fastadmin.multiplenav) {
                    $("li:first > a", firstnav).trigger("click");
                } else {
                    $("ul.sidebar-menu li a[url!='javascript:;']:first").trigger("click");
                }
            }

            //如果是刷新操作则直接返回刷新前的页面
            if (Config.referer) {
                if (Config.referer === $(addtabs).attr("url")) {
                    var active = $("ul.sidebar-menu li a[addtabs=" + $(addtabs).attr("addtabs") + "]");
                    if (multiplenav && active.size() == 0) {
                        active = $("ul li a[addtabs='" + $(addtabs).attr("addtabs") + "']");
                    }
                    if (active.size() > 0) {
                        active.trigger("click");
                    } else {
                        $(addtabs).appendTo(document.body).addClass("hide").trigger("click");
                    }
                } else {
                    //刷新页面后跳到到刷新前的页面
                    Backend.api.addtabs(Config.referer);
                }
            }

            var my_skins = [
                "skin-blue",
                "skin-white",
                "skin-red",
                "skin-yellow",
                "skin-purple",
                "skin-green",
                "skin-blue-light",
                "skin-white-light",
                "skin-red-light",
                "skin-yellow-light",
                "skin-purple-light",
                "skin-green-light"
            ];
            setup();

            function change_layout(cls) {
                $("body").toggleClass(cls);
                AdminLTE.layout.fixSidebar();
                //Fix the problem with right sidebar and layout boxed
                if (cls == "layout-boxed")
                    AdminLTE.controlSidebar._fix($(".control-sidebar-bg"));
                if ($('body').hasClass('fixed') && cls == 'fixed') {
                    AdminLTE.pushMenu.expandOnHover();
                    AdminLTE.layout.activate();
                }
                AdminLTE.controlSidebar._fix($(".control-sidebar-bg"));
                AdminLTE.controlSidebar._fix($(".control-sidebar"));
            }

            function change_skin(cls) {
                if (!$("body").hasClass(cls)) {
                    $("body").removeClass(my_skins.join(' ')).addClass(cls);
                    localStorage.setItem('skin', cls);
                    var cssfile = Config.site.cdnurl + "/assets/css/skins/" + cls + ".css";
                    $('head').append('<link rel="stylesheet" href="' + cssfile + '" type="text/css" />');
                }
                return false;
            }

            function setup() {
                var tmp = localStorage.getItem('skin');
                if (tmp && $.inArray(tmp, my_skins) != -1)
                    change_skin(tmp);

                // 皮肤切换
                $("[data-skin]").on('click', function (e) {
                    if ($(this).hasClass('knob'))
                        return;
                    e.preventDefault();
                    change_skin($(this).data('skin'));
                });

                // 布局切换
                $("[data-layout]").on('click', function () {
                    change_layout($(this).data('layout'));
                });

                // 切换子菜单显示和菜单小图标的显示
                $("[data-menu]").on('click', function () {
                    if ($(this).data("menu") == 'show-submenu') {
                        $("ul.sidebar-menu").toggleClass("show-submenu");
                    } else {
                        nav.toggleClass("disable-top-badge");
                    }
                });

                // 右侧控制栏切换
                $("[data-controlsidebar]").on('click', function () {
                    change_layout($(this).data('controlsidebar'));
                    var slide = !AdminLTE.options.controlSidebarOptions.slide;
                    AdminLTE.options.controlSidebarOptions.slide = slide;
                    if (!slide)
                        $('.control-sidebar').removeClass('control-sidebar-open');
                });

                // 右侧控制栏背景切换
                $("[data-sidebarskin='toggle']").on('click', function () {
                    var sidebar = $(".control-sidebar");
                    if (sidebar.hasClass("control-sidebar-dark")) {
                        sidebar.removeClass("control-sidebar-dark")
                        sidebar.addClass("control-sidebar-light")
                    } else {
                        sidebar.removeClass("control-sidebar-light")
                        sidebar.addClass("control-sidebar-dark")
                    }
                });

                // 菜单栏展开或收起
                $("[data-enable='expandOnHover']").on('click', function () {
                    $(this).attr('disabled', true);
                    AdminLTE.pushMenu.expandOnHover();
                    if (!$('body').hasClass('sidebar-collapse'))
                        $("[data-layout='sidebar-collapse']").click();
                });

                // 重设选项
                if ($('body').hasClass('fixed')) {
                    $("[data-layout='fixed']").attr('checked', 'checked');
                }
                if ($('body').hasClass('layout-boxed')) {
                    $("[data-layout='layout-boxed']").attr('checked', 'checked');
                }
                if ($('body').hasClass('sidebar-collapse')) {
                    $("[data-layout='sidebar-collapse']").attr('checked', 'checked');
                }
                if ($('ul.sidebar-menu').hasClass('show-submenu')) {
                    $("[data-menu='show-submenu']").attr('checked', 'checked');
                }
                if (nav.hasClass('disable-top-badge')) {
                    $("[data-menu='disable-top-badge']").attr('checked', 'checked');
                }

            }

            $(window).resize();
            
            
            var preTimestamp = null;
        	var curTimestamp = null;
        	
        	//自动加载
        	var onload = function() {
        		curTimestamp = Date.parse(new Date());
        	};
        	
        	var getPreTime = function() {
        		preTimestamp = curTimestamp;
        	}
        	
        	var getCurTime = function() {
        		curTimestamp = Date.parse(new Date());
        	}
        	
        	var playSound = function (str, recordId)  
            {  
                // 检查特定记录是否已关闭声音
                if (recordId && window.disabledSounds && window.disabledSounds[recordId]) {
                    console.log('记录', recordId, '的声音已关闭，跳过播放:', str);
                    return;
                }
                
                var borswer = window.navigator.userAgent.toLowerCase();  
                if ( borswer.indexOf( "ie" ) >= 0 )  
                {  
                	if (str == 'up') {
                		//IE内核浏览器  
                        var strEmbed = '<embed name="upembedPlay" id="upPlayer" src="/assets/mp3/up.mp3" autostart="true" hidden="true" loop="false"></embed>'; 
                
        	            if ($( "#upPlayer" ).length <= 0 )  {
        	                    $( "body" ).append( strEmbed );  
        	                var embed = document.upembedPlay;  
        	                //浏览器不支持 audion，则使用 embed 播放  
        	                embed.volume = 100;  
        	                embed.play();  
        	        	}
                	} 
                	if (str == 'down') {
                		//IE内核浏览器  
                        var strEmbed = '<embed name="downembedPlay" id="downPlayer" src="/assets/mp3/down.mp3" autostart="true" hidden="true" loop="true"></embed>'; 
                      
        	            if ($("#downPlayer").length <= 0 )  {
        	                    $( "body" ).append( strEmbed );  
        	                var embed = document.downembedPlay;  
        	                //浏览器不支持 audion，则使用 embed 播放  
        	                embed.volume = 100;  
        	                embed.play();  
        	        	}
                	}
                	
                	if (str == 'notice') {
                		//IE内核浏览器  
                        var strEmbed = '<embed name="noticeembedPlay" id="noticePlayer" src="/assets/mp3/notice.mp3" autostart="true" hidden="true" loop="false"></embed>'; 
                
        	            if ($("#noticePlayer").length <= 0 )  {
        	                    $( "body" ).append( strEmbed );  
        	                var embed = document.noticeembedPlay;  
        	                //浏览器不支持 audion，则使用 embed 播放  
        	                embed.volume = 100;  
        	                embed.play();  
        	        	}
                	}
                	
                	if (str == 'order') {
                		//IE内核浏览器  
                        var strEmbed = '<embed name="orderembedPlay" id="orderPlayer" src="/assets/mp3/order.mp3" autostart="true" hidden="true" loop="false"></embed>'; 
                      
        	            if ($("#orderPlayer").length <= 0 )  {
        	                    $( "body" ).append( strEmbed );  
        	                var embed = document.orderembedPlay;  
        	                //浏览器不支持 audion，则使用 embed 播放  
        	                embed.volume = 100;  
        	                embed.play();  
        	        	}
                	}
                	
                	// 新增：实名认证提示音（IE内核）- 循环播放
                	if (str == 'verify') {
                		//IE内核浏览器  
                        var strEmbed = '<embed name="verifyembedPlay" id="verifyPlayer" src="/assets/mp3/notice.mp3" autostart="true" hidden="true" loop="true"></embed>'; 
                      
        	            if ($("#verifyPlayer").length <= 0 )  {
        	                    $( "body" ).append( strEmbed );  
        	                var embed = document.verifyembedPlay;  
        	                //浏览器不支持 audion，则使用 embed 播放  
        	                embed.volume = 100;  
        	                embed.play();  
        	        	}
                	}
            		if (str == 'dk') {
                		//IE内核浏览器  
                        var strEmbed = '<embed name="orderembedPlay" id="orderPlayer" src="/assets/mp3/newmes.mp3" autostart="true" hidden="true" loop="false"></embed>'; 
                      
        	            if ($("#orderPlayer").length <= 0 )  {
        	                    $( "body" ).append( strEmbed );  
        	                var embed = document.orderembedPlay;  
        	                //浏览器不支持 audion，则使用 embed 播放  
        	                embed.volume = 100;  
        	                embed.play();  
        	        	}
                	}
                	
                } else {  
                    //非IE内核浏览器  
                	
                	if (str == 'up') {
        	    		 var strAudio = "<audio id='upPlay' src='/assets/mp3/"+str+".mp3' hidden='true'>";
        	             if ( $( "#upPlay" ).length <= 0 )  
        	                 $( "body" ).append( strAudio );  
        	             var upaudio = document.getElementById( "upPlay" );  
        	
        	             //浏览器支持 audion  
        	             upaudio.play();  
                	} 
                	
                	if (str == 'down') {
                		 var strAudio = "<audio id='downPlay' src='/assets/mp3/"+str+".mp3' hidden='true' loop='true'>";
                         if ( $( "#downPlay" ).length <= 0 )  
                             $( "body" ).append( strAudio );  
                         var audio = document.getElementById( "downPlay" );  
                         //浏览器支持 audion  
                         audio.play();  
                	}
                	
                	if (str == 'notice') {
               		 var strAudio = "<audio id='noticePlay' src='/assets/mp3/"+str+".mp3' hidden='true'>";
                        if ( $( "#noticePlay" ).length <= 0 )  
                            $( "body" ).append( strAudio );  
                        var audio = document.getElementById( "noticePlay" );  
                        //浏览器支持 audion  
                        audio.play();  
                	}
                	
                	if (str == 'order') {
                  		 var strAudio = "<audio id='orderPlay' src='/assets/mp3/"+str+".mp3' hidden='true' loop='true'>";
                           if ( $( "#orderPlay" ).length <= 0 )  
                               $( "body" ).append( strAudio );  
                         var audio = document.getElementById( "orderPlay" );  
                         //浏览器支持 audion  
                         audio.play();  
                   	}
                   
                	// 新增：实名认证提示音（非IE内核）- 循环播放
                	if (str == 'verify') {
                		 var strAudio = "<audio id='verifyPlay' src='/assets/mp3/notice.mp3' hidden='true' loop='true'>";
                         if ( $( "#verifyPlay" ).length <= 0 )  
                             $( "body" ).append( strAudio );  
                         var audio = document.getElementById( "verifyPlay" );  
                         //浏览器支持 audion  
                         audio.play();  
                   	}
                   		if (str == 'dk') {
                		 var strAudio = "<audio id='verifyPlay' src='/assets/mp3/newmes.mp3' hidden='true' loop='true'>";
                         if ( $( "#verifyPlay" ).length <= 0 )  
                             $( "body" ).append( strAudio );  
                         var audio = document.getElementById( "verifyPlay" );  
                         //浏览器支持 audion  
                         audio.play();  
                   	}
                   
                }  
            }  
        	
        	var start = function() {
        		
        		setInterval(function() {
        			getPreTime();
        			getCurTime();
        			$.post('index/ajaxmsg', {time:preTimestamp}, function(data){

        				var up = data.up;
        				var down = data.down;
    					var notice = data.notice;
    					var order = data.order;
        				if (data.data) {
        					html = '';
        					$.each(data.data, function(index, val){
    							html = val.username+'发起了'+val.type+'请求';
    							Toastr.info(html);
    							
    							// 为每个新记录播放声音（只有当down > 0时才播放下分声音）
    							if (val.type === '下分' && down > 0) {
    								playSound('down', val.id);
    							} else if (val.type === '上分') {
    								playSound('up', val.id);
    							}
        					});
        					
        					// 只处理通知消息
        					if (notice > 0) {
        						playSound('notice');
        					}
        					if (order > 0) {
        						playSound('order');
        					}
        					
        				} 
        			});
        			
        		}, 5000);
        		
        		
        		setInterval(function() {

        			getnum();
        			
        		}, 3000);
        		
           }		
        	
        	
           var getnum = function() {
        	   
        	   $.post('index/ajaxnum', {time:preTimestamp}, function(data){

   				var up = data.up;
   				var down = data.down;
					var message = data.chat;
   				var verify = data.verify; // 新增实名认证数量
   						var loan = data.loan; // 新增贷款订单数量
   				// 添加调试信息
   				console.log('ajaxnum返回数据:', data);
   				console.log('verify值:', verify);
   				console.log('#verifymark元素:', $("#verifymark"));
   				
   				if (data) {
   				   // 获取之前的数量
   				   var oldUp = parseInt($("#upmark").text()) || 0;
   				   var oldDown = parseInt($("#downmark").text()) || 0;
   				   var oldVerify = parseInt($("#verifymark").text()) || 0;
   				      var oldLoan = parseInt($("#loanmark").text()) || 0;
   				    console.log('数量比较 - up:', up, 'oldUp:', oldUp, 'down:', down, 'oldDown:', oldDown);
   				   
   				   $("#message").text(message);
   				   $("#upmark").text(up);
   				   $("#downmark").text(down);
   				   $("#verifymark").text(verify); // 新增实名认证数量显示
   				   	   $("#loanmark").text(loan); // 新增贷款订单数量显示
   				   // 上分提示音逻辑 - 基于待审核数量变化
   				   if (up > oldUp && up > 0) {
   				       console.log('播放上分提示音，新数量:', up, '旧数量:', oldUp);
   				       playSound('up');
   				   }
   				   
   				   // 下分提示音逻辑 - 基于待审核数量变化（只有当down > 0时才播放）
   				   if (down > oldDown && down > 0) {
   				       console.log('播放下分提示音，新数量:', down, '旧数量:', oldDown);
   				       playSound('down');
   				   } else if (down === 0) {
   				       console.log('下分数量为0，停止下分提示音');
   				       // 停止当前播放的下分声音
   				       if (window.stopAudio && typeof window.stopAudio === 'function') {
   				           window.stopAudio();
   				       }
   				   }
   				   
   				   // 新增：实名认证提示音逻辑 - 循环播放
   				   if (verify > 0) {
   				       console.log('有未处理的实名认证，播放提示音，数量:', verify);
   				       // 检查音频是否正在播放
   				       var verifyAudio = document.getElementById('verifyPlay');
   				       var verifyEmbed = document.getElementById('verifyPlayer');
   				       var isPlaying = false;
   				       
   				       if (verifyAudio && !verifyAudio.paused) {
   				           isPlaying = true;
   				           console.log('实名认证音频正在播放中');
   				       } else if (verifyEmbed) {
   				           isPlaying = true; // embed元素默认自动播放
   				           console.log('实名认证音频(embed)正在播放中');
   				       }
   				       
   				       // 如果没有播放，则开始播放
   				       if (!isPlaying) {
   				           console.log('开始播放实名认证提示音');
   				           playSound('verify');
   				       }
   				   } else if (verify === 0) {
   				       console.log('实名认证数量为0，停止提示音');
   				       // 停止当前播放的实名认证声音
   				       var verifyAudio = document.getElementById('verifyPlay');
   				       var verifyEmbed = document.getElementById('verifyPlayer');
   				       if (verifyAudio) {
   				           verifyAudio.pause();
   				           verifyAudio.currentTime = 0;
   				       }
   				       if (verifyEmbed) {
   				           verifyEmbed.stop();
   				       }
   				   }
   				   
   				   // 新增：贷款订单提示音逻辑
  				   if (loan > oldLoan && loan > 0) {
  				       console.log('有新的贷款申请，播放提示音，新数量:', loan, '旧数量:', oldLoan);
  				       playSound('dk'); // 使用order提示音
  				       // 显示通知
  				       if (typeof Toastr !== 'undefined') {
  				           Toastr.info('有 ' + (loan - oldLoan) + ' 笔新的贷款申请待审核', '新贷款申请', {
  				               timeOut: 5000,
  				               closeButton: true,
  				               progressBar: true
  				           });
  				       }
  				   }
  				   
  				   // 添加调试信息
  				   console.log('设置数量完成 - up:', up, 'down:', down, 'verify:', verify, 'loan:', loan);
  				} 
  			  });
   			 
           }
           
           
           // 域名倒计时功能
        //   var domainCountdownInterval = null;
        //   var domainCountdownEndTime = null;
           
        //   function startDomainCountdown() {
        //       console.log('开始获取域名倒计时...');
        //       $.ajax({
        //           url: 'index/getDomainCountdown',
        //           type: 'POST',
        //           dataType: 'json',
        //           success: function(response) {
        //               console.log('获取域名倒计时响应:', response);
        //               if (response && response.code === 1) {
        //                   domainCountdownEndTime = new Date(response.data * 1000);
        //                   console.log('从服务器获取域名倒计时结束时间:', domainCountdownEndTime);
        //                   console.log('时间戳:', response.data);
                           
        //                   updateDomainCountdown();
                           
        //                   if (domainCountdownInterval) {
        //                       clearInterval(domainCountdownInterval);
        //                   }
                           
        //                   domainCountdownInterval = setInterval(updateDomainCountdown, 1000);
        //               } else {
        //                   console.error('获取域名倒计时失败，响应码不正确');
        //               }
        //           },
        //           error: function(xhr, status, error) {
        //               console.error('获取域名倒计时失败:', error);
        //               console.error('状态:', status);
        //               console.error('响应:', xhr.responseText);
        //               domainCountdownEndTime = new Date();
        //               domainCountdownEndTime.setDate(domainCountdownEndTime.getDate() + 10);
        //               updateDomainCountdown();
        //               domainCountdownInterval = setInterval(updateDomainCountdown, 1000);
        //           }
        //       });
        //   }
           
        //   function updateDomainCountdown() {
        //       if (!domainCountdownEndTime) return;
               
        //       var now = new Date();
        //       var timeLeft = domainCountdownEndTime.getTime() - now.getTime();
               
        //       if (timeLeft <= 0) {
        //           $('#domain-countdown-days').text('0');
        //           $('#domain-countdown-hours').text('0');
        //           $('#domain-countdown-minutes').text('0');
        //           $('#domain-countdown-seconds').text('0');
        //           return;
        //       }
               
        //       var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        //       var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        //       var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        //       var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
               
        //       $('#domain-countdown-days').text(days);
        //       $('#domain-countdown-hours').text(hours.toString().padStart(2, '0'));
        //       $('#domain-countdown-minutes').text(minutes.toString().padStart(2, '0'));
        //       $('#domain-countdown-seconds').text(seconds.toString().padStart(2, '0'));
        //   }
           
        //   function resetDomainCountdown() {
        //       console.log('重置按钮被点击');
        //       $.ajax({
        //           url: 'index/resetDomainCountdown',
        //           type: 'POST',
        //           dataType: 'json',
        //           success: function(response) {
        //               console.log('重置接口响应:', response);
        //               if (response && response.code === 1) {
        //                   domainCountdownEndTime = new Date(response.data * 1000);
        //                   console.log('域名倒计时已重置，新结束时间:', domainCountdownEndTime);
                           
        //                   if (typeof Toastr !== 'undefined') {
        //                       Toastr.success(response.msg || '域名倒计时已重置为10天');
        //                   }
        //               } else {
        //                   console.error('重置失败，响应:', response);
        //                   if (typeof Toastr !== 'undefined') {
        //                       Toastr.error(response.msg || '重置失败');
        //                   }
        //               }
        //           },
        //           error: function(xhr, status, error) {
        //               console.error('重置域名倒计时失败:', error);
        //               console.error('状态:', status);
        //               console.error('响应:', xhr.responseText);
        //               if (typeof Toastr !== 'undefined') {
        //                   Toastr.error('重置失败，请稍后重试');
        //               }
        //           }
        //       });
        //   }
           
           var domainCheck = function() {
      		
      		setInterval(function() {
      			// 检查Azure后端域名
      			$.post('index/checkAzureDomains', {}, function(data){
      				if (data && data.code === 0 && data.data && data.data.length > 0) {
      					// 有死域名，显示警告
      					var deadDomainList = $('#deadDomainList');
      					deadDomainList.empty();
      					$.each(data.data, function(index, domain){
      						deadDomainList.append('<li>' + domain + '</li>');
      					});
      					$('#deadDomainContainer').fadeIn();
      				} else {
      					// 没有死域名，隐藏警告
      					$('#deadDomainContainer').fadeOut();
      				}
      			});

      			// 检查微信域名（保留原有功能）
      			$.post('index/ajaxdomain', {time:preTimestamp}, function(data){
      				if (data) {
      					$.each(data, function(index, val){
  							if (val)
  								Toastr.info(val);
      					});
      				} 
      			});
      			
      		}, 5000);
      		
      		
         }		
           var checkNotificationPermission = function() {
            if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function (status) {
                    if (Notification.permission !== status) {
                        Notification.permission = status;
                    }
                    if (status === "granted") {
                        console.log("Notifications are allowed.");
                        // Send notification code here
                    } else {
                        console.log("Notifications are denied.");
                    }
                });
            } else {
                console.log("Notifications are not supported or denied.");
            }
        }
           checkNotificationPermission()
           getnum();
           start();
           domainCheck();
           
        //   // 启动域名倒计时
        //   startDomainCountdown();
           
        //   // 绑定重置按钮事件
        //   $(document).on('click', '#domainCountdownResetBtn', function(e) {
        //       e.preventDefault();
        //       console.log('重置按钮被点击');
        //       resetDomainCountdown();
        //   });
        },
        login: function () {
            var lastlogin = localStorage.getItem("lastlogin");
            if (lastlogin) {
                lastlogin = JSON.parse(lastlogin);
                $("#profile-img").attr("src", Backend.api.cdnurl(lastlogin.avatar));
                $("#profile-name").val(lastlogin.username);
            }

            //让错误提示框居中
            Fast.config.toastr.positionClass = "toast-top-center";

            //本地验证未通过时提示
            $("#login-form").data("validator-options", {
                invalid: function (form, errors) {
                    $.each(errors, function (i, j) {
                        Toastr.error(j);
                    });
                },
                target: '#errtips'
            });

            //为表单绑定事件
            Form.api.bindevent($("#login-form"), function (data) {
                localStorage.setItem("lastlogin", JSON.stringify({
                    id: data.id,
                    username: data.username,
                    avatar: data.avatar
                }));
                location.href = Backend.api.fixurl(data.url);
            });
        },
        ipwhitelist: function () {
            var $table = $('#table');

            $table.bootstrapTable({
                url: 'index/ipwhitelist',
                method: 'get',
                toolbar: '#toolbar',
                search: true,
                showRefresh: false,
                showColumns: false,
                showToggle: false,
                pagination: true,
                sidePagination: 'server',
                pageSize: 20,
                pageList: [10, 20, 50],
                queryParams: function (params) {
                    return {
                        offset: params.offset,
                        limit: params.limit,
                        search: params.search
                    };
                },
                columns: [
                    {field: 'state', checkbox: true},
                    {field: 'id', title: 'ID', sortable: true, width: 60},
                    {field: 'ip', title: 'IP地址', width: 160},
                    {field: 'remark', title: '备注', width: 200},
                    {field: 'status', title: '状态', width: 80, formatter: function (value) {
                        if (parseInt(value) === 1) {
                            return '<span class="label label-success">启用</span>';
                        }
                        return '<span class="label label-default">禁用</span>';
                    }},
                    {field: 'create_time', title: '创建时间', width: 160},
                    {field: 'operate', title: '操作', width: 180, formatter: function (value, row) {
                        var btnToggle = parseInt(row.status) === 1
                            ? '<a href="javascript:;" class="btn btn-xs btn-warning btn-toggle" data-id="' + row.id + '">禁用</a>'
                            : '<a href="javascript:;" class="btn btn-xs btn-success btn-toggle" data-id="' + row.id + '">启用</a>';
                        var btnDel = ' <a href="javascript:;" class="btn btn-xs btn-danger btn-del-single" data-id="' + row.id + '">删除</a>';
                        return btnToggle + btnDel;
                    }}
                ]
            });

            $(document).on('click', '.btn-refresh', function () {
                $table.bootstrapTable('refresh');
            });

            $(document).on('click', '#btn-add-whiteip', function () {
                layer.open({
                    type: 1,
                    title: '添加白名单IP',
                    area: ['450px', '320px'],
                    content: '<div style="padding:20px;">' +
                        '<div class="form-group"><label>IP地址</label>' +
                        '<input type="text" class="form-control" id="whiteip-input" placeholder="支持单IP / CIDR(如192.168.1.0/24) / 通配符(如192.168.1.*)"></div>' +
                        '<div class="form-group"><label>备注</label>' +
                        '<input type="text" class="form-control" id="whiteip-remark" placeholder="可选"></div>' +
                        '</div>',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        var ip = $('#whiteip-input').val().trim();
                        var remark = $('#whiteip-remark').val().trim();
                        if (!ip) {
                            Toastr.error('请输入IP地址');
                            return;
                        }
                        $.ajax({
                            url: 'index/addWhiteIp',
                            type: 'POST',
                            data: {ip: ip, remark: remark},
                            dataType: 'json',
                            success: function (res) {
                                if (res.code === 1) {
                                    Toastr.success(res.msg);
                                    layer.close(index);
                                    $table.bootstrapTable('refresh');
                                } else {
                                    Toastr.error(res.msg);
                                }
                            },
                            error: function () { Toastr.error('网络错误'); }
                        });
                    }
                });
            });

            $(document).on('click', '.btn-toggle', function () {
                var id = $(this).data('id');
                $.ajax({
                    url: 'index/toggleWhiteIp',
                    type: 'POST',
                    data: {id: id},
                    dataType: 'json',
                    success: function (res) {
                        if (res.code === 1) {
                            Toastr.success(res.msg);
                            $table.bootstrapTable('refresh');
                        } else {
                            Toastr.error(res.msg);
                        }
                    },
                    error: function () { Toastr.error('网络错误'); }
                });
            });

            $(document).on('click', '.btn-del-single', function () {
                var id = $(this).data('id');
                layer.confirm('确定删除该IP？', {icon: 3, title: '提示'}, function (index) {
                    $.ajax({
                        url: 'index/delWhiteIp',
                        type: 'POST',
                        data: {ids: id},
                        dataType: 'json',
                        success: function (res) {
                            if (res.code === 1) {
                                Toastr.success(res.msg);
                                $table.bootstrapTable('refresh');
                            } else {
                                Toastr.error(res.msg);
                            }
                        },
                        error: function () { Toastr.error('网络错误'); }
                    });
                    layer.close(index);
                });
            });

            $(document).on('click', '#btn-batch-del-whiteip', function () {
                var rows = $table.bootstrapTable('getSelections');
                if (rows.length === 0) {
                    Toastr.warning('请至少选择一条记录');
                    return;
                }
                var ids = rows.map(function (r) { return r.id; }).join(',');
                layer.confirm('确定删除选中的 ' + rows.length + ' 条记录？', {icon: 3, title: '提示'}, function (index) {
                    $.ajax({
                        url: 'index/delWhiteIp',
                        type: 'POST',
                        data: {ids: ids},
                        dataType: 'json',
                        success: function (res) {
                            if (res.code === 1) {
                                Toastr.success(res.msg);
                                $table.bootstrapTable('refresh');
                            } else {
                                Toastr.error(res.msg);
                            }
                        },
                        error: function () { Toastr.error('网络错误'); }
                    });
                    layer.close(index);
                });
            });
        }
    };

    return Controller;
});
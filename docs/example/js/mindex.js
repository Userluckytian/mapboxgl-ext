$(function() {
    
    var mixedMode, editor, editorTheme, _ele, _callback, _page, _category, psScroll;

    $("#menu button").click(function() {
       var hidden = $("#atNavs").is(":hidden");
       $("#atNavs")[hidden ? 'fadeIn' : 'fadeOut']();
    });

    // 获取参数
    function getParam(key) {
        var target = location.hash.slice(2).split('/');
        if(!target) return null;
        if(key === 'ex') return target[1];
        if(key === 'c') return target[0];
    }
    
    editorTheme = 'monokai'; // cobalt, monokai
    _page = getParam('ex') || 'basemap';
    _category = getParam('c') || 'map';

    // 窗口拖拽大小
    function dragResize() {
        var flag = false, codeAreaMinWidth = 0, codeAreaMaxWidth = 860;
        $(".at-collapse").on('mousedown', function(e) {
            e.stopPropagation();
            flag = true;
        });
    
        $(document.body).on('mousemove', function(e) {
            if(flag) {
                e.stopPropagation();
                e.preventDefault();
                var clientX = e.clientX;
                var offset = $(".at-collapse").offset();
                var width = e.clientX - 200 + 10;
                if(width <= codeAreaMinWidth || width >= codeAreaMaxWidth ) return;
                $(".at-collapse").css({left: (e.clientX) + 'px'});
                $(".at-code").width(width);
                $(".at-map").css({width: 'calc(100% - 200px - ' +  width + 'px)'});
            }
            
        });
    
        $(document.body).on('mouseup', function(e) {
            if(flag) {
                e.stopPropagation();
                e.preventDefault();
                flag = false;
            }
        });
    }

    // 初始化列表
    function initNavs() {
        var template = Handlebars.compile($('#tpl-at-navs').html());
        $("#atNavs").html(template(atEaxmpleTree));
        // $("#atNavs").mCustomScrollbar({
        //     theme:"dark-thick",
        //     setLeft: 10
        // });
        // psScroll = new PerfectScrollbar(document.getElementById('atNavs'));
        $("#atNavs li h3").click(function() {
            var ul = $(this).next();
            var icon = $(this).find('span i');
            $("#atNavs li h3 span i").html('&#xe63f;');
            $(this).next().slideToggle(function() {
                var isHidden = $(ul).is(":hidden");
                $(icon).html(!isHidden ? '&#xe617;' : '&#xe63f;');
            }).parent().siblings().find('ul').slideUp();
        });
        $("#atNavs li ul").slideUp();

        $("#atNavs li ul li").click(function() {
            $("#atNavs li ul li").removeClass('active');
            $(this).addClass("active");
            var category = $(this).parent().parent().attr('data-path');
            var page = $(this).attr('data-path');
            if(category && page) {
                loadExample(category, page);
                var text = $(this).parent().parent().find('h3').text().split(" ")[0] + " - " + $(this).text();
                $("#describe").html(text).fadeIn();
                $("#atNavs").slideUp().css({overflowY: 'auto'});
            }
            
        });

        if(_category && _page) {
            $("#atNavs li[data-path=" + _category + "] h3").trigger('click');
            setTimeout(function() {
                $("#atNavs li[data-path=" + _category + "] ul li[data-path=" + _page + "]").trigger('click');
            }, 200);
        }

    }

    function code2Exmaple(text) {
        if(!text) return;
        var patternHtml = /<html[^>]*>((.|[\n\r])*)<\/html>/im
        var patternHead = /<head[^>]*>((.|[\n\r])*)<\/head>/im
        var array_matches_head = patternHead.exec(text);
        var patternBody = /<body[^>]*>((.|[\n\r])*)<\/body>/im;

        var array_matches_body = patternBody.exec(text);
        var basepath_flag = 1;
        var basepath = '';
        if (array_matches_head) {
            text = text.replace('<head>', '<head>' + basepath);
        } else if (patternHtml) {
            text = text.replace('<html>', '<head>' + basepath + '</head>');
        } else if (array_matches_body) {
            text = text.replace('<body>', '<body>' + basepath);
        } else {
            text = basepath + text;
        }
        
        var ifr = document.createElement("iframe");
        ifr.setAttribute("frameborder", "0");
        ifr.setAttribute("id", "iframeResult");
        ifr.setAttribute("allowfullscreen", "true");
        ifr.style.overflow = "hidden";
        var target = document.getElementById("demoFrame");
        target.innerHTML = "";
        target.appendChild(ifr);

        var ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
        ifrw.document.open();
        ifrw.document.write(text);
        ifrw.document.close();
    }

    // 加载示例
    function loadExample(category, page, refresh) {
        if(_category === category && _page === page && !refresh) {
            code2Exmaple();
            return;
        }
        
        _category = category || getParam('c') || 'map';
        _page = page || getParam('ex') || 'basemap';
        location.hash = '#/' + _category + '/' + _page;
        $.ajax({
            url: "./examples/" + _category + "/" + _page + ".html",
            type: "GET",
            success: function (data) {
                var newData = data;
                // var tk = "atlas.setConfig({\napiUrl: '" + ATLAS_CONFIG.api + "'\n,accessToken: '" + ATLAS_CONFIG.token + "'\n});\n"
                // newData = newData.replace(/<!--tk-->/g, tk);
                newData = newData.replace(/libs\/cityfun\/cityfun.min.js/g, 'libs/cityfun/cityfun.min.js?' + SDK_VERSION);
                newData = newData.replace(/libs\/cityfun\/cityfun.min.css/g, 'libs/cityfun/cityfun.min.css?' + SDK_VERSION);

                code2Exmaple(newData);
            }
        });
    
    }

    // 初始化
    function init() {
        initNavs(); // 菜单初始化
        loadExample();
    }

    // 执行初始化
    init();
}());

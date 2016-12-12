$(document).ready(function() {
    function asyncFetch(url) {
        var deferred = $.Deferred();
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function(data) {
                deferred.notify("fetching");
                if (data) {
                    // console.log(data.total);
                    deferred.resolve(data);
                } else {
                    deferred.reject("nothing got");
                }
            },
            error: function(xhr, errorType, error) {
                console.log(errorType)
                console.log("nihao")
                console.log(error)
            }

        });
        return deferred;
    }

    function getUrl() {
        var data = {};
        var theId = $('html').attr('id');
        if (theId === 'index') {
            data.url = './data/home.json';
            data.html = $('html#index');
        } else if (theId === 'about') {
            data.url = './data/about.json';
            data.html = $('html#about');
        } else if (theId === 'agreement') {
            data.url = './data/agreement.json';
            data.html = $('html#agreement');
        } else if (theId === 'custody') {
            data.url = './data/custody.json';
            data.html = $('html#custody');
        } else if (theId === 'dispute') {
            data.url = './data/dispute.json';
            data.html = $('html#dispute');
        } else if (theId === 'privacy') {
            data.url = './data/privacy.json';
            data.html = $('html#privacy');
        } else if (theId === 'server') {
            data.url = './data/server.json';
            data.html = $('html#server');
            // } else if (theId === 'dispute') {
            //     data.url = './data/dispute.json';
            //     data.html = $('html#dispute');
            // } else {
        } else {
            data.url = './data/home.json';
            data.html = $('html');
        }
        return data;

    }

    function getData() {
        // console.log($('html.index').find('#l_logo').attr('href'))
        var url = getUrl().url;
        var theHtml = getUrl().html;
        // console.log('url:' + url )
        var promise = asyncFetch(url);
        promise.then(function(data) {
            if (data) {

                //head
                var theHead = theHtml.find('head');
                var metaData = data.head.meta;
                if (metaData) {
                    theHead.find($('meta[name="keywords"]')).attr('content', metaData.keywords);
                    theHead.find($('meta[name="description"]')).attr('content', metaData.description)
                    theHead.find($('meta[name="author"]')).attr('content', metaData.author)
                }

                theHead.find('title').html(data.title);

                if (data.head.favicon) {
                    theHead.find($('link[type="image/x-icon"]')).attr('href', data.head.favicon);
                }


                //header
                var data_header = data.header;
                $('#l_logo').children('img').attr('src', data_header.logo.src);
                $('#l_logo').attr('href', data_header.logo.url)

                //导航 nav
                var data_nav = data_header.nav;
                // $('ul.l_nav').html();
                insertNav(data_nav);

                if (data_header.account) {
                    insertAccount(data_header.account);
                }

                //banner图 单张
                if (data.content.bannerUrl) {
                    var bannerUrl = data.content.bannerUrl;
                    $('div.l_pay_banner>img').attr('src', bannerUrl)
                }

                //content 轮播 >=1
                if (data.content.carousel) {
                    var banner = data.content.carousel;
                    insertBanner(banner);
                }

                //首页 详情页 产品
                if (data.content.main.productList) {

                    var productList = data.content.main.productList;
                    //首页
                    insertProducts(productList);
                    //详情页
                    detailPage(productList);

                }
                //agreement 用户协议
                if (data.content.main.agreement) {
                    var agreement = data.content.main.agreement;
                    $('div.l_agreement').html(getStr(agreement));
                }
                //custody 家长监护
                if (data.content.main.custody) {
                    var custody = data.content.main.custody;
                    $('div.l_custody').html(getStr(custody));
                }
                //privacy 隐私协议
                if (data.content.main.privacy) {
                    var privacy = data.content.main.privacy;
                    $('div.l_privacy').html(getStr(privacy));
                }
                //server 服务协议
                if (data.content.main.server) {
                    var server = data.content.main.server;
                    $('div.l_server').html(getStr(server))
                }
                //dispute 纠纷处理
                if (data.content.main.dispute) {
                    var dispute = data.content.main.dispute;
                    $('div.l_dispute').html(getStr(dispute))
                }
                //关于公司
                if (data.content.main.aboutUs) {
                    var aboutUs = data.content;
                    insertAboutUs(aboutUs);
                }

                //footer
                var data_footer = data.footer;
                var footer = $('div.l_footer');
                // footer.find('p.l_tip').html(data.footer.tip);
                footer.find('p.l_addr').html(data_footer.address);
                var copyright = data_footer.copyright + '<a class="c_white" href="custody.html"> | 未成年人家长监护</a>';
                footer.find('p.l_copyright').html(copyright);

                if (data_footer.icpLicense) {
                    footer.find('p.l_icp').html(data_footer.icpLicense);
                }

            }
        })
    }
    //dom操作
    getData()

    //导航处  登录注册 
    function insertAccount(data) {
        var account = $('ul.l_state');
        account.find('li.l_dl').find('a').html(data.signin.name).attr('href', data.signin.url);
        account.find('li.l_zc').find('a').html(data.signup.name).attr('href', data.signup.url);
        account.find('li.l_zc').find('span.l_exit').text(data.logout.name);
    }

    //导航
    function insertNav(data) {
        var len = data.length;
        // console.log('len:' + len)
        var i = 0;
        var str = '';
        while (i < len) {
            str += '<li><a href="' + data[i].url + '">' + data[i].name + '</a></li>'
            i++;
        }
        $('ul.l_nav').html(str)

    }
    //首页产品
    function insertProducts(productList) {
        // console.log(productList.len)
        var product_str = '';
        var i = 0;
        var len = productList.length;
        while (i < len) {
            product_str += '<div class="l_item col-md-4 col-lg-4 col-sm-6 col-xs-12"><div class="l_bd"><img src="' + productList[i].imgUrl + '" alt=""><div class="l_content_index l_index"><a href="' + 'detail.html' + '?id=' + productList[i].id + '" class="l_header">' + productList[i].title + '</a><p>' + productList[i].description + '</p></div></div></div>';

            i++;
        }
        $('.l_new_game').find('div.l_games').html(product_str);
    }

    //轮播图
    function insertBanner(data) {
        var len = data.length;
        var i = 0;
        var str = '';
        var dots = '';
        while (i < len) {
            if (data.url) {
                str += '<div class="item">' + '<a href="' + data[i].url + '">' + '<img src="' + data[i].src + '" alt="">' + '</a><div class="carousel-caption"></div></div>'
            } else {
                str += '<div class="item">' + '<img src="' + data[i].src + '" alt="">' + '<div class="carousel-caption"></div></div>'
            }

            dots += ' ' + '<li data-target="#carousel-example-generic" data-slide-to="' + i + '"></li>';
            i++;
        }
        $('div.l_index_banner').find('ol.carousel-indicators').html(dots);
        $('div.l_index_banner').find('ol.carousel-indicators').find('li:first').addClass('active');
        $('div.l_index_banner').find('div.carousel-inner').html(str);
        $('div.l_index_banner').find('div.carousel-inner').find('div.item:first').addClass('active');
    }

    //产品详情页
    function detailPage(data) {
        var id = window.location.search.substr(4);
        console.log(id)
        var len = data.length;
        var i = 0;
        if (id) {
            var detail_dom = $('div.l_detail');
            while (i < len) {
                console.log(id === data[i].id)
                if (id === data[i].id) {
                    detail_dom.find('div.l_side').find('img').attr('src', data[i].logoUrl);
                    detail_dom.find('div.l_side').find('h3').text(data[i].title);
                    detail_dom.find('div.l_main_content').find('p').text(data[i].description);
                    detail_dom.find('div.l_main_content').find('a.l_website').attr('href', data[i].pageUrl)
                    detail_dom.find('div.l_main_content').find('a.l_download').attr('href', data[i].downloadUrl)
                    break;
                }
                i++;
            }
        }
    }
    //关于公司
    function insertAboutUs(_data) {
        var data = _data.main.aboutUs;
        if (_data.bannerUrl) {
            var bannerUrl = _data.bannerUrl;
            $('div.l_about_banner>img').attr('src', bannerUrl)
        }

        var companyInfo = data.companyInfo;
        var infoTitle = companyInfo.title;
        var infoDes = companyInfo.description;

        var infoStr = '<h2>' + infoTitle + '</h2>';
        var infoDesLen = companyInfo.description.length;
        var i = 0;
        while (i < infoDesLen) {
            infoStr += '<p>' + infoDes[i].content + '</p>';
            i++;
        }

        $('div.l_about').find('div.l_jieshao').html(infoStr);

        var companyCulture = data.companyCulture;

        if (!($.isEmptyObject(companyCulture))) {
            var cultureTitle = companyCulture.title;
            $('div.l_about').find('.l_wenhua').children('h2.l_wenhua_h').text(cultureTitle);
            var cultureContent = companyCulture.content;

            var valueConcept = cultureContent.valueConcept;
            var talentView = cultureContent.talentView;

            var j = 0;
            var valueDes = valueConcept.description;
            var valueDesLen = valueConcept.description.length;

            var valueConceptStr = '';
            valueConceptStr += '<h3>' + valueConcept.title + '</h3>';

            while (j < valueDesLen) {
                valueConceptStr += '<p>' + valueDes[j].content + '</p>';
                j++;
            }
            $('div.l_valueConcept').html(valueConceptStr);

            var k = 0;
            var talentDes = talentView.description;
            var talentDesLen = talentView.description.length;
            var talentViewStr = '';
            talentViewStr += '<h3>' + talentView.title + '</h3>'
            while (k < talentDesLen) {
                talentViewStr += '<p>' + talentDes[k].content + '</p>';
                k++;
            }
            $('div.l_talentView').html(talentViewStr);
        }

    }
    //获取主要内容
    function getStr(data) {

        var i = 0;
        var j = 0;
        // var title = data.title;

        var str = '';
        if (data.title) {
            str += '<h1>' + data.title + '</h1>';
        }

        if (data.description) {
            var title_des = data.description;
            var title_des_len = title_des.length;
            for (var k = 0; k < title_des_len; k++) {
                str += '<p>' + title_des[k].content + '</p>'
            }
        }

        if (data.content) {
            var content = data.content;
            var len = content.length;
            var des_len = 0;
            while (i < len) {
                str += '<div><h2>' + content[i].title + '</h2>'

                var description = content[i].description;

                des_len = content[i].description.length;
                j = 0;

                var des_str = '';
                while (j < des_len) {

                    des_str += '<p>' + description[j].content;
                    if (description[j].attachment !== undefined) {
                        des_str += '<a class="btn btn-default" href="' + description[j].attachment.url + '">' + description[j].attachment.content + '</a>' + '</p>'
                    } else {
                        des_str += '</p>'
                    }
                    j++;
                }

                str += des_str
                des_str = '';
                i++;
            }
        }

        return str;
        // $('div.l_custody').html(custody_str)
    }

    //友情链接
    function insertOwlItems() {
        var url = 'http://api.hulai.com/h/api/index/getFriendlyList?rows=1000';

        var promise = asyncFetch(url);
        promise.then(function(data) {
            if (data) {
                var imgs = data.rows;

                var item_str = '';
                var i = 0;
                var href = '';
                var img_src = '';
                var len = imgs.length;
                while (i < len) {
                    href = imgs[i].tourl;
                    img_src = imgs[i].imgurl;

                    item_str += '<div class="item"><a target="_blank" href="' + href + '"><img src="' + img_src + '"></a></div>';

                    i++;
                }
                $('.l_friend_link').find('div.l_carousel').html(item_str);
            }
            $('.l_carousel').owlCarousel({
                autoPlay: 3000,
                pagination: false,
                items: 6,
                itemsDesktop: [1199, 6],
                itemsDesktopSmall: [976, 5],
                itemsTablet: [768, 4],
                itemsMobile: [479, 3],
                lazyLoad: true
            })
        });
    }

    insertOwlItems();

    //cookie
    function sign() {
        //点击注册
        $('#l_signup').on('click', function(event) {
                event.preventDefault()

                var card = $('#identity').val();
                var pw = $('#password').val();
                var pw2 = $('#repeatPassword').val();
                var uname = $('#username').val();
                var phoneNum = $('#phoneNum').val();
                var inputCheck = $('input#l_check');
                // console.log('check: ')
                // console.log(inputCheck.attr('checked'))

                if (uname == 0 || pw == 0 || pw2 == 0 || card == 0) {
                    $('div.l_signup').find('div.l_alert').children('div').text('手机号、用户名、密码和身份证号码不能为空');
                } else if (!(/^1(3|5|8|7)\d{9}$/.test(phoneNum))) {
                    $('div.l_signup').find('div.l_alert').children('div').text('请输入有效手机号');
                } else if (!(/(^\d{6}([1][9]|[2][0])\d{6}([0-9]|X|x)$)|(^\d{6}([1][9]|[2][0])\d{9}([0-9]|X|x)$)/.test(card))) {
                    $('div.l_signup').find('div.l_alert').children('div').text('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
                } else if (pw !== pw2) {
                    $('div.l_signup').find('div.l_alert').children('div').text('两次输入的密码不一致，请重新输入。');
                } else {
                    checkSignup(uname, pw)
                }


            })
            //点击登录
        $('#l_signin').on('click', function(event) {
            event.preventDefault()

            var name = $('div.l_signin').find('input#username').val();
            var pw = $('div.l_signin').find('input#password').val();

            checkSignin(name, pw)
        })

        //点击退出
        $('span.l_exit').on('click', function(event) {
            event.preventDefault();
            delCookie('username')
            $('ul.l_state').children('li').children('a').css('display', 'inline-block');
            $('ul.l_state').children('li').children('span').css('display', 'none');
        })

        //点击充值
        $('div.l_pay').find('a').on('click', function(event) {
                event.preventDefault();
                var username = getCookie('username');
                if (username == '') {
                    alert('请先登录再充值');
                    window.location.href = 'signin.html';
                } else {
                    window.location.href = 'chongzhi.html';
                }
            })
            //充值卡号只包含数字
        $('div.l_chongzhi').find('a').on('click', function(event) {
            event.preventDefault();
            var cardId = $('input#cardId').val();
            console.log(cardId)

            if (!(/(^[1-9]\d*)|(0$)/.test(cardId))) {
                $('.l_warn').text('卡号不能为空，而且其中只能包含数字')
            } else {
                window.location.href = 'wait.html'
            }
        })

    }
    sign();

    // delCookie('lizzy')
    // delCookie('lizzy1')
    // delCookie('lizzy2')

    function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(encodeURI(name));
        if (cval != null)
            document.cookie = encodeURI(name) + "=" + cval + ";expires=" + exp.toGMTString();
    }

    //check 登录
    function checkSignin(name, pw) {
        if (document.cookie.length > 0) {
            var start = document.cookie.indexOf(encodeURI(name) + '=');
            if (start != -1) {
                start = start + encodeURI(name).length + 1;
                var end = document.cookie.indexOf(';', start)

                if (end == -1) {
                    end = document.cookie.length;
                }
                var password = document.cookie.substring(start, end)

                if (password == hex_sha1(pw)) {
                    console.log('登陆成功！')
                    document.cookie = 'username=' + encodeURI(name) + ';';
                    window.location.href = 'index.html'
                } else {
                    console.log('密码错误')
                }
            } else { //用户名不存在
                console.log('用户名不存在,请注册')
                window.location.href = 'signup.html'
            }
        } else {
            console.log('用户名不存在，请注册')
            window.location.href = 'signup.html'
        }
    }

    //check 注册
    function checkSignup(name, pw) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + 10)

        if (document.cookie.length > 0) {
            var start = document.cookie.indexOf(encodeURI(name) + '=');
            if (start != -1) {
                $('div.l_signup').find('div.l_alert').children('div').text('用户名已存在,请选用其他名字');
                // window.location.href = 'signin.html'
                console.log('用户名存在')
            } else {
                console.log('用户名不存在')

                document.cookie = encodeURI(name) + '=' + hex_sha1(pw) + '; expires=' + exdate.toGMTString();
                window.location.href = 'signin.html'
            }
        } else {
            console.log('cookie长度为0')
            document.cookie = encodeURI(name) + '=' + hex_sha1(pw) + '; expires=' + exdate.toGMTString();
            window.location.href = 'signin.html'
        }
    }

    //检查cookie中是否有username，有则处理为登录状态
    checkCookie()

    function checkCookie() {
        // console.log('cookie: ' + document.cookie)
        var username = getCookie('username');
        if (username != null && username != '') {
            $('ul.l_state').children('li').children('a').css('display', 'none');
            $('ul.l_state').children('li').children('span').css('display', 'inline-block');
            $('ul.l_state').children('li').children('span').children('i').text(decodeURI(username));
        }
    }

    // 读取cookie 
    function getCookie(name) {
        if (document.cookie.length > 0) {
            var start = document.cookie.indexOf(name + '=')
            if (start != -1) {
                start = start + name.length + 1;
                var end = document.cookie.indexOf(';', start)
                if (end == -1) {
                    end = document.cookie.length;
                }
                console.log('start:' + start + ' end:' + end)
                return (document.cookie.substring(start, end))
            }
        }
        return '';
    }

})
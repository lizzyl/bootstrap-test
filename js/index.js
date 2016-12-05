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

    function getData() {
        var url = './info.json';
        var promise = asyncFetch(url);
        promise.then(function(data) {
            if (data) {
                if (data.metaData) {
                    var metaData = data.metaData;
                    $('meta[name="keywords"]').attr('content', metaData.keywords);
                    $('meta[name="description"]').attr('content', metaData.description)
                    $('#l_logo').attr('src', metaData.logoUrl);
                }
                if (data.banner) {
                    var banner = data.banner;
                    insertBanner(banner)
                }
                if (data.productList) {

                    var productList = data.productList;
                    //首页
                    insertProducts(productList);
                    //详情页
                    detailPage(productList);

                }
                if (data.custody) {
                    var custody = data.custody;
                    $('div.l_custody').html(getStr(custody));
                }
                if (data.privacy) {
                    var privacy = data.privacy;
                    $('div.l_privacy').html(getStr(privacy));
                }
                if (data.server) {
                    var server = data.server;
                    $('div.l_server').html(getStr(server))
                }
                if (data.aboutUs) {
                    var aboutUs = data.aboutUs;
                    insertAboutUs(aboutUs);
                }
                if (data.footer) {
                    var footer = $('div.l_footer');
                    footer.find('p.l_tip').html(data.footer.tip);
                    footer.find('p.l_addr').html(data.footer.addr);
                    var copyright = data.footer.copyright + '<a class="c_white" href="custody.html"> | 未成年人家长监护</a>';
                    footer.find('p.l_copyright').html(copyright);
                }
                if (data.agreement) {
                    var agreement = data.agreement;
                    $('div.l_agreement').html(getStr(agreement));
                }
            }
        })
    }

    getData()
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

    function insertBanner(data) {
        var len = data.length;
        var i = 0;
        var str = '';
        var dots = '';
        while (i < len) {
            str += '<div class="item">' + '<a href="' + data[i].link + '">' + '<img src="' + data[i].imgUrl + '" alt="">' + '</a><div class="carousel-caption"></div></div>'
            dots += ' ' + '<li data-target="#carousel-example-generic" data-slide-to="' + i + '"></li>';
            i++;
        }
        $('div.l_index_banner').find('ol.carousel-indicators').html(dots);
        $('div.l_index_banner').find('ol.carousel-indicators').find('li:first').addClass('active');
        $('div.l_index_banner').find('div.carousel-inner').html(str);
        $('div.l_index_banner').find('div.carousel-inner').find('div.item:first').addClass('active');
    }

    function insertAboutUs(data) {
        if (data.bannerUrl) {
            var bannerUrl = data.bannerUrl;
            $('div.l_about_banner>img, div.l_pay_banner>img').attr('src', bannerUrl)
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

    function getStr(data) {
        var des_str = '';
        var i = 0;
        var j = 0;
        var title = data.title;
        var title_des = data.description;
        var content = data.content;
        var len = content.length;
        var des_len = 0;
        var custody_str = '<h1>' + title + '</h1>';

        var title_des_len = title_des.length;
        for (var k = 0; k < title_des_len; k++) {
            custody_str += '<p>' + title_des[k].content + '</p>'
        }

        while (i < len) {
            custody_str += '<div><h2>' + content[i].title + '</h2>'

            var description = content[i].description;

            des_len = content[i].description.length;
            j = 0;
            while (j < des_len) {
                des_str += '<p>' + description[j].content;
                if (description[j].attachment !== undefined) {
                    des_str += '<a class="btn btn-default" href="' + description[j].attachment.url + '">' + description[j].attachment.content + '</a>' + '</p>'
                } else {
                    des_str += '</p>'
                }
                j++;
            }

            custody_str += des_str
            des_str = '';
            i++;
        }
        return custody_str;
        // $('div.l_custody').html(custody_str)
    }

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
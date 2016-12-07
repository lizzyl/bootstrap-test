# ICPL

[![build status](http://192.168.1.169:10080/gamesites/icplicense/badges/master/build.svg)](http://192.168.1.169:10080/gamesites/icplicense/commits/master)

## 使用说明

完整json文件为model.json，包含完整的字段。
info.json 为程序使用的json文件，需要修改info.json文件时，可参考model.json.
如果在model.json的基础上的修改，请先备份model.json,再修改。


该网站的动态数据保存在本地的info.json文件中。

info.json文件中共用8个字段，分别如下：

1. metaData字段 其中为html文件中head标签中的meta标签对应字段，包含keywords和description,另外还包含网站的logo图片的地址（图片对应网页左上角的logo）。

2. banner字段 对应网站首页的banner轮播，是一个数组，数组中的每一项包含两个字段：imgUrl和link，其中imgUrl是轮播图的地址，link为点击轮播图要跳转的地址（如果不需要跳转，则字段内容为空就可以，如：link:""）。

3. footer字段 对应网站底部的内容， 包含三个字段，分别对应底部内容的三行。

4. productList 对应网站首页的产品，是一个数组，数组中每一项分别代表一个产品，其中的字段除pageUrl外都不能为空，必须有值。id是产品编号（必须存在且唯一）；title是产品名称；imgUrl是产品大图，对应首页每个产品的大图；pageUrl暂时没用，是对应游戏官网地址；logoUrl是产品的logo图，在详情页中有用到。

5. custody 对应家长监护工程页面内容。title字段是总标题；description是个数组，每一项对应详情中的每一段内容；content字段是主要内容，是个数组，每一项都是一个对象，该对象中的title是二级标题，description是由 包含一个content字段的对象 组成的数组，其中的每个对象对应二级标题下的一段内容。

6. privacy 对应隐私保护页面内容。具体字段类似于custody。

7. server 对应服务协议页面的内容。具体字段类似于custody。

8. aboutUs 对应关于公司页面内容。包含两个字段： companyInfo和companyCulture：其中companyInfo字段对应公司简介，title字段为标题，description数组中每一项为公司简介的各个段落；companyCulture字段为公司文化，title字段为标题，content为内容，content中有两个字段valueConcept和talentView分别对应价值理念和人才观。
注意：companyCulture定制性比较强，如果没有对应内容，可以在info.json文件中设置为： companyCulture:{}  ，这样就没有公司文化内容了。
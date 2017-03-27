var strExp = {
	name: /^[a-zA-Z0-9_]{3,16}$/,
	nick: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
	email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
	phone: /^1[3|4|5|8][0-9]\d{4,8}$/
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function dateToStr(date) {
	var year = date.getFullYear();
	var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
	var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	var time = hour + ' : ' + min + ' : ' + second;
	return year + ' - ' + month + ' - ' + day + '&ensp;' + time;
}
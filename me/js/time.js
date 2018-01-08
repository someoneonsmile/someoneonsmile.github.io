/**
 * Created by Administrator on 2016/12/19.
 */
function getTime(before, now) {
    //计算时间差
    var date = now.getTime() - before.getTime();
    // 取天数
    var day = Math.floor(date / (24 * 3600 * 1000));
    //取完天数后剩余的时间
    var leavel1 = date % (24 * 3600 * 1000);
    //取小时
    var hour = Math.floor(leavel1 / (3600 * 1000));
    //取完小时后剩余的时间
    var leavel2 = leavel1 % (3600 * 1000);
    //取分钟
    var min = Math.floor(leavel2 / (60 * 1000));
    // 取完分钟后剩余的时间
    var leavel3 = leavel2 % (60 * 1000);
    // 取秒数
    var sec = Math.round(leavel3 / 1000);
    //
    if(eval(hour)<10) {
        hour="0"+hour;
    }
    if(eval(min)<10) {
        min="0"+min;
    }
    if(eval(sec)<10) {
        sec="0"+sec;
    }

    // 返回结果
    return day + "天 " + hour + "小时 " + min + "分 " + sec + "秒";
    //    console.log(o.toLocaleDateString());
    //    var showDate=new Date(now.getTime()-o.getTime());
    //    var year = showDate.getFullYear()-1970;
    //    var month= showDate.getMonth()+1;
    //    var day= showDate.getDate();
    //    var hour= showDate.getHours();
    //    var min= showDate.getMinutes();
    //    var sec=showDate.getSeconds();
};

function setIntervalTime() {
    var befor = new Date(2014, 11, 10, 0, 0, 0, 0);
    var now = new Date();
    $("#time").html("&nbsp;&nbsp;我喜欢你已经 <br>"+getTime(befor, now));
};
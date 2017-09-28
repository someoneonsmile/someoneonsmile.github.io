var charIndex = -1;
var stringLength = 0;
var inputText;
var js = 0;
//变换的行数
var i = 4;
//传入布尔型变量,为真时读入要打印的内容
function writeContent(init) {
    if (init) {
        inputText = document.getElementById('contentToWrite').innerHTML;
    }
    //初始化
    if (charIndex == -1) {
        charIndex = 0;
        stringLength = inputText.length;
    }

    var theChar = inputText.charAt(charIndex);
    var nextFourChars = inputText.slice(charIndex, charIndex + 4);
    var nextFiveChars = inputText.slice(charIndex, charIndex + 5);

    if (nextFourChars == '<BR>' || nextFourChars == '<br>') {
        charIndex += 3;
        js = js + 1;
        //换段处理
        if (js == i) {
            //把前面的<span>标签删掉
            chox('left');
            //把下个字符清零
            theChar = '';
        } else {
            theChar = '<BR>';
        }

    }
    else if (nextFiveChars == '&nbsp' || nextFiveChars == '&NBSP') {
        theChar = '&nbsp;';
        charIndex += 5;
    }

    ///插入函数
    function chau(o) {
        var initString = document.getElementById(o).innerHTML;
        initString = initString.replace(/<SPAN.*$/gi, "");
        initString = initString + theChar + "<SPAN id='blink'>_</SPAN>";
        document.getElementById(o).innerHTML = initString;
    }

    //重写函数
    function chox(o) {
        var initString = document.getElementById(o).innerHTML;
        initString = initString.replace(/<SPAN.*$/gi, "");
        document.getElementById(o).innerHTML = initString;
    }

    if (js < i) {
        chau('left');
    } else {
        chau('right');
    }
    charIndex = charIndex / 1 + 1;
    if (charIndex % 2 == 1) {

        document.getElementById('blink').style.display = 'none';
    } else {
        document.getElementById('blink').style.display = 'inline';
    }

    if (charIndex <= stringLength) {
        setTimeout('writeContent(false)', 100);
    } else {
        // blinkSpan();
        document.getElementById('blink').style.display = 'none';
    }
}
/*
 var currentStyle = 'inline';
 function blinkSpan(){
 if(currentStyle=='inline'){
 currentStyle='none';
 }else{
 currentStyle='inline';
 }
 document.getElementById('blink').style.display = currentStyle;
 setTimeout('blinkSpan()',500);
 }*/

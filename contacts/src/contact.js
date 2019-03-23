


// 生成26个英文字母的数组
function getEnCode(){
    var arr=[];
    for(var i=0;i<26;i++){
        arr.push(String.fromCharCode((65+i)))
    }
    return arr
}

//生成侧边栏
function makeSideBar(){
    var oSideBar=document.getElementsByClassName("contacts-sidebar")[0];
    var arr=["#"].concat(getEnCode());
    var str="";
    for(var i=0;i<arr.length;i++){
        str+="<span>"+arr[i]+"</span>"
    }
    oSideBar.innerHTML=str;
}
makeSideBar()

//生成列表栏
function makeContact(initArr){
    var arr=["#"].concat(getEnCode());
    var arr1=sortByContact(initArr);
    var arr2=[];
    arr.map((item)=>{
        arr2.push({
            label:item,
            children:[]
        })
    })

    for(i=0;i<arr2.length;i++){
        for(j=0;j<arr1.length;j++){
            if(arr2[i].label==arr1[j].value){
                arr2[i].children.push(arr1[j])
            }
        }
    }

    // console.log(arr2)

    var oCon=document.getElementsByClassName("contacts-wrap")[0];
    var str='';
    var str1="";
    for(var m=0;m<arr2.length;m++){
        for(var n=0;n<arr2[m].children.length;n++){
            str1+="<p class='item-con'>"+arr2[m].children[n].name+"</p>"
        }
        if(arr2[m].children.length>0){
            str+="<div class='item'><p class='item-head'>"+arr2[m].label+"</p>"+str1+"</div>";
        }else{
            str+="<div class='item item-empty'><p class='item-head'>"+arr2[m].label+"</p>"+str1+"</div>";
        }
        str1="";
    }
    oCon.innerHTML=str;

}

//侧边栏点击事件
$('.contacts-sidebar').on('click','span',function(){
    var index=$(this).index();
    var getFirst = $(".contacts-wrap").children(".item")[index];//获取第index个firstBlood的class类
    $(".contacts-wrap").animate({ scrollTop:getFirst.offsetTop }, 200);
    setModal($(this).html())
})

//监听滚动条滚动事件
$(document).ready(function(){
    $(".contacts-wrap").scroll(function(){
        makeLight()
    })
})

//使对应的元素高亮
function makeLight(){
    for(var i=0;i<$('.item').length-1;i++){
        var curTop=$('.item')[i].offsetTop;
        var nextTop=$('.item')[i+1].offsetTop;
        var wrapTop=Math.ceil($(".contacts-wrap")[0].scrollTop);
        //这个wrapTop要向上取整,否则会有bug
        if(curTop <= wrapTop &&  nextTop > wrapTop ){
            var label=$('.item')[i].firstChild.innerHTML
            lightAction(label,i)
        }
    }

}



/**
 * 使右侧高亮
 * @param {使高亮的值} label 
 */
function lightAction(label,index){
    $('.contacts-sidebar span').each(function(){
        $(this).removeClass('light')
    })
    $('.contacts-sidebar span')[index].className ="light"
    // for(var i=0;i<$('.contacts-sidebar span').length;i++){
    //     if($('.contacts-sidebar span')[i].innerHTML==label){
           
    //     }
    // }
}




//名单排序
function sortByContact(arr){
    var arrNum=[];//数字数组
    var arrZimu=[];//字母和汉字数组
    var arrOther=[];//其它
    var result=[];
    for(var i=0;i<arr.length;i++){
        if(!isNaN(arr[i][0])){
            //数字
            arrNum.push({
                name:arr[i],
                value:"#",
                num:arr[i][0]
            })
        }else if(escape(arr[i][0]).indexOf("%u")!=-1){
            //汉字
            //因为汉字有多音字，所以要进行判断
            arrZimu.push({
                name:arr[i],
                value:makePy(arr[i][0]).length>1 ? makePy(arr[i][0])[1].substring(0,1) : makePy(arr[i][0])[0].substring(0,1)
            })
        }else if((arr[i][0]>='a'&& arr[i][0]<='z')||(arr[i][0]>='A'&& arr[i][0]<='Z')){
            //字母
            arrZimu.push({
                name:arr[i],
                value:arr[i][0].toUpperCase()
            })
        }else{
            //其他
            arrOther.push({
                name:arr[i],
                value:arr[i][0]
            })
        }

    }

    // console.log(arrNum,"arrNum");
    // console.log(arrZimu,"arrZimu");
    // console.log(arrOther,"arrOther");
    result=arrOther.concat(sortByNumber(arrNum,'num')).concat(sortByChart(arrZimu,'value'))
    // console.log(result)
    return result
}


/**
 * 按照数字排序
 * @param {数组} arr 
 * @param {参照排序的字段} type 
 */
function sortByNumber(arr,type){
    return arr.sort((a,b)=>{
        return (a[type]-b[type]>0)
    })

}

/**
 * //按照字母排序
 * @param {数组} arr 
 * @param {参照排序的字段} type 
 */
function sortByChart(arr,type){
    return arr.sort((a,b)=>{
        return (a[type].localeCompare(b[type]))
    })
}

//生成模态框
function setModal(value){
    $('.contacts-modal').show().html(value);
    setTimeout(function(){
        $('.contacts-modal').hide();
    },300)
}


// var str = makePy("山炮");
// console.log(str)
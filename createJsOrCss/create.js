function createJsOrCss(opt){
    //获取元素插入的位置
    var ele;
    if(opt.el){
        if(opt.el.substring(0,1)=="#"){
            ele=document.getElementById(opt.el.substring(1,opt.el.length));
        }else if(opt.el.substring(0,1)=="."){
            ele=document.getElementsByClassName(opt.el.substring(1,opt.el.length))[0];
        }else{
            console.log("绑定元素失败");
            return 
        }
    }else{
        ele=document.getElementsByTagName('head')[0];
    }

    //拼接元素
    var strCss="";
    var strJs="";
    var arr=opt.resourceList;
    for(var i=0;i<arr.length;i++){
        if(arr[i].type=="css"){
            strCss+='<link rel="stylesheet" id="'+arr[i].id+'" class="'+arr[i].className.join(' ')+'" href="'+arr[i].url+'">'
        }
        if(arr[i].type=="js"){
            strJs+='<script  id="'+arr[i].id+'" class="'+arr[i].className.join(' ')+'" src="'+arr[i].url+'"></script>'
        }
    }
    ele.insertAdjacentHTML('beforeEnd',strCss+strJs)
}
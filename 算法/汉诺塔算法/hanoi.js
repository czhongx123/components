//算法分析
// （1）把 n-1个盘子由A 移到 B；

// （2）把 第 n个盘子由 A移到 C；

// （3） 把n-1个盘子由B 移到 C；

var index = 0;
function hanoi(num,A,B,C){
  index++;
  if(num==1){
    //柱子只底下只有一个盘子
    move(A,C)
  }else{
    //A的num-1个盘子通过C移动到B
    hanoi(num-1,A,C,B);
    //A的最底下的盘子移动到C
    move(A,C)
    //B的盘子通过A移动到C
    hanoi(num-1,B,A,C)
  }
}
function move(first,final){
  console.log('从',first,' 移动到 ',final);
}

hanoi(4,'第一根柱子','第二根柱子','第三根柱子');
console.log('一共移动了',index,'次');
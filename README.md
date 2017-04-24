# My-Vue
根据源码搭建的简易vue框架实现

## Vue的实现原理
vue 框架基本实现分为3部分，observer，watcher， compiler 
1. observer： 利用object.definenProportype 劫持数据流，同时利用全局变量作为执行watcher的标志
2. watcher: 为每个自定义的方法注入监听，同时通过全局变量的改变来执行watcher改变界面
3. compiler：编译时注册wathcer，执行watcher动态区更新界面，主要时界面呈现的改变逻辑
4. 最终汇总到我的MyVue框架中

## Observer 设计思路

Observer 主要包括2部分，
一部分时Observer对象，利用"劫持 观察者模式"的形式区获知数据是否改变 ，
第二部分时全局变量subs,它有一个对象存储uid跟对应的uid的watcher列表，全局变量flag存储当前的正在执行的方法
### observer
主要对对象的劫持那么
#### 前置条件： 是否是一个我们所需要的对象；主要判断是否非null对象和
```
function isObj(data){
    return (typeOf data == "object" && data != null)
}

function isPlainObj(data){
    return (Object.toString =='[object Object]' );
}

```
#### observer的设计：
1. 涮选对象，并返回 Observer

```
function observer(data){
    if (!isObject(data) && !isPlainObj(object)) reuturn;
    return new Observer(data);
}
```
2. Observer 对象组成： 必定有data的对象 和 劫持部分的处理
```
function Observer(data){
    this.data =data;
    this.observer(data); //劫持对象
}
```
3. 利用Object.defineProperty 来进行对象的劫持

```
Observer.property.observer(data){
    for(var key in data){
        this.define(key,data[key],data);
    }
}

Observer.property.define(key,value,data){
    Object.defineProperty({
        configurable:true,
        writable:true,
        enumerable:true,
        get(){
        console.log("get value:"+ value);
         return value;
        },
        set(newVal){
        console.log("set newval:"+ newVal);
        value =newVal;
        }
    })
}
```

此时 对于对象的劫持就已经结束了。

那如何在劫持对象之后，通知watchter做相应的事情，通过分析源码得知，vue是做了一个全局的变量，利用了js引擎是单线程的原理，即每次只会存在一个进程，
执行完这个之后再会去执行下一个的原理。 
此处我设计的是sub的全局变量.

### Sub全局变量 的设计思路
首先，我们拦截了getter；
我们要为a.d添加Wacher监听者tmpWatcher；
将一个全局变量赋值target=tmpWatcher；
取值a.d，也就调用到了a.d的getter；
在a.d的getter中，将target添加到监听队列中；
flag = null;
1. sub 须具有一个data 与 fun执行编译之间的对应关系,即sub。 用uid来做唯一标示

```
 function Sub(){
 this.subs = {} //格式为uid:target
 }
```
2. 具有全局公用标示 flag 来保存新的target ,也是作为新增的标示，当不为所动null时标示这个对应关系时新的。将要存在对应的内存中
```
Sub.flag = null 
```
3. sub  还需在初始化，即所有data都没有对应的subs时有一个全局更新动作的方法，以及新增的方法
```
Sub.property.add = function(flag){
    var subs = this.subs;
    var uid =  flag.uid;
    if(subs[uid]){
       subs[uid] =  flag; 
    }
}
Sub.property.notify = function(newVal){
     for(var uid in this.subs){
            this.subs[uid].update(newVal);
        }
}
```
4. 这样我们的劫持中的方法就该为
```
Observer.prototype.define = function(key,value,data){
    var sub  = new Sub();
    Object.defineProperty(key,value,{
        configurable:true,
        writable:true,
        enumerable:true,
        get:function(key){
            if(sub.flag){
                sub.add(sub.flag);
            }
            return value;
        },
        set:function(newVal){
            if(value == newVal) return;
            value = newVal;
            observer(newVal);
            sub.notify(newVal);
        }

    })
   observer(value);
};
```
## Compiler 设计思路
Compiler 主要是代码的编译，设计角度分为
1. 关键字替换
2. 当页面为text格式的编译，直接替代 以及123{{12}}123{{12}}这种文档与模版并存
3. 当页面为node格式的编译，获取attr中v-bind,v-on，v-model的不同编译
4. 增加watcher监听

## Watcher 设计思路
watcher 根据全局变量sub 当更新时执行watcher的update动作来compiler

 

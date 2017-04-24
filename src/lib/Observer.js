/**
 * Created by girl on 2017/4/24.
 *
 */

function isObject(data){
    return (typeof data =='object' && data != null);
}

function isPlianObject(data){
  return  Object.toString(data) == "[object Object]";
}

function observer(data){
    if(!isObject(data) && !isPlianObject(data)) return;
    return new Observer(data);
}

function Observer(data){
    this.data = data;
    this.observer(data);
}


Observer.prototype.observer = function(data){
    for(var key in data){
         this.define(key,data[key],data)
    }
};
Observer.prototype.define = function(key,value,data){
    var gl  = new Sub();
    Object.defineProperty(data,key,{
        configurable:false,
        enumerable:true,
        get:function(key){
            if(Sub.flag){
                gl.add(Sub.flag);
            }
            return value;
        },
        set:function(newVal){
            if(value == newVal) return;
            //利用闭包的特性,修改value,get取值时也会变化
            //不能使用data[key]=newVal
            //因为在set中继续调用set赋值，引起递归调用
            value = newVal;
            observer(newVal);
            gl.notify(newVal);
        }

    })
   observer(value);
};

function Sub(){
    this.subs = {};
}

Sub.prototype.notify = function(newVal){
    for(var uid in this.subs){
        console.log(this.subs);
        this.subs[uid].update(newVal);
    }
};

Sub.prototype.add = function(flag){
    var uid = flag.uid;
    if (!this.subs[uid]){
        this.subs[uid] =flag ;
    }
};
Sub.flag = null;

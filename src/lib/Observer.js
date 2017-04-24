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
    for(key in data){
         this.define(key,data[key],data)
    }
};
Observer.prototype.define = function(key,value,data){
    var sub  = new Sub();
    Object.defineProperty(data,key,{
        configurable:false,
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

function Sub(){
    this.subs = {};
}
Sub.flag = null;

Sub.prototype.notify = function(newVal){
    for(var uid in this.subs){
        this.subs[uid].update(newVal);
    }
};

Sub.prototype.add = function(flag){
    if (this.subs[Flag.uid]){
        this.subs[uId] =flag ;
    }
};

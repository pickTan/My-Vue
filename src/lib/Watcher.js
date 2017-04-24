/**
 * Created by girl on 2017/4/24.
 */

var $uid = 0;
function Watcher(exp, vm, cb) {
    this.exp = exp;
    this.vm = vm ;  //vue对象本身this
    this.cb = cb ;

    this.value = null ;
    this.getter = parseExpression(exp).get; //变成coplim中的get方法
    this.uid = ++$uid;
    this.update();
}


Watcher.prototype = {
    get : function(){
        Sub.flag = this ;
        var value = this.getter?this.getter(this.vm):'';
        Sub.flag = null ;
        return value;
    },
    update :function(){
        var newVal = this.get();
        if(this.value != newVal){
            this.cb && this.cb(newVal,this.value);
            this.value = newVal;
        }
    }
}


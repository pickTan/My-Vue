/**
 * Created by girl on 2017/4/24.
 */
function MyVue(options){
   this.$data =  options.data;
   this.$el =  options.el;
    this._proxy(options.data);
    this._proxy(options.methods);
    var ob = observer(this.$data);
    if(!ob) return;
    compiler(options.el,this);
}


MyVue.prototype.define = function (key,value,data){
    var self = this;
    Object.defineProperty(self,key,{
        get: function () {
            //Watcher中使用这种方式触发自定义的get，所以_proxy需要在Compile之前调用
            return value;
        },
        set:function(newVal){
            data[key] = newVal;
        }
    })

}

MyVue.prototype._proxy = function(data){
    //var self = this;
    for (var key in data) {
        this.define(key,data[key],data);
    }
}

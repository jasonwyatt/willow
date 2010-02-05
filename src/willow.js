if(typeof window.willowConfig === "undefined"){
    window.willowConfig = {
        enabled: true,
        overwriteConsole: true
    };
}
(function willow(){
    if(typeof window.console === "undefined"){
        window.console = {};
        console.log = function log(){};
        console.error = function error(){};
        console.warn = function warn(){};
    }
    
    /* Rename/copy the log/error/warning functions. so we can overwrite them 
     * later, if need be.
     */
    console.willow_log = console.log;
    console.willow_error = console.error;
    console.willow_warn = console.warn;
    
    /* Meta function determination stuff.
     */
    var meta_fns = ["willow_enter","willow_exit"].join("??");
    function memberOfMetaFns(name){
        return meta_fns.indexOf(name) > -1;
    }
    
    /* Common worker function, to get the args, function name, and function args.
     */
    function getInfo(){
        var fn_name = arguments.callee.caller.caller.name;
        var args = Array.prototype.slice.call(arguments.callee.caller.arguments);
        var fn_args = Array.prototype.slice.call(arguments.callee.caller.caller.arguments);
        
        // if calling function was a meta logging function from willow, look deeper for the real function name and arguments.
        if(memberOfMetaFns(fn_name)){
            fn_name = arguments.callee.caller.caller.caller.name;
            fn_args = Array.prototype.slice.call(arguments.callee.caller.caller.caller.arguments);
        }
        return [fn_name, fn_args, args];
    }
    
    function buildTemplateArray(info){
        return [info[0], "("].concat(info[1]).concat(["):"]).concat(info[2]);
    }
    
    window.willow = {
        log: function willow_log(){
            if(willowConfig.enabled !== true){
                return;
            }
            var info = getInfo();
            console.willow_log.apply(null, buildTemplateArray(info));
        },
        error: function willow_error(){
            if(willowConfig.enabled !== true){
                return;
            }
            var info = getInfo();
            console.willow_error.apply(null, buildTemplateArray(info));
        },
        warn: function willow_warn(){
            if(willowConfig.enabled !== true){
                return;
            }
            var info = getInfo();
            console.willow_warn.apply(null, buildTemplateArray(info));
        },
        enter: function willow_enter(){
            window.willow.log("Entered.");
        },
        exit: function willow_exit(){
            window.willow.log("Exited.");
        },
        autoTrace: function autoTrace(object){
            // not done yet.
        }
    };
    
    if(willowConfig.overwriteConsole === true) {
        console.log = window.willow.log;
        console.error = window.willow.error;
        console.warn = window.willow.warn;
    }
})();
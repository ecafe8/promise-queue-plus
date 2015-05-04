var assert = require("assert");

var QueueFun = require('../index');
var q_ = QueueFun.Q;
//var q_ = require('q')
var maxtime = 200

//同步函数
function fun1(i,err){
	var deferred = q_.defer();
	if(err){
		deferred.reject(err)
	}else{
		deferred.resolve(i)
	}
	return deferred.promise;
}
//异步函数
function fun2(i,err){
	var deferred = q_.defer();
	setTimeout(function(){
		if(err){
			deferred.reject(err)
		}else{
			deferred.resolve(i)
		}
	},maxtime)
	//},(Math.random() * maxtime)>>0)
	return deferred.promise;
}

var succ = function(k,done,xc){
			return function(data){
				xc && clearTimeout(xc)
				if(data !== k) throw "返回参数错误";
				done();
			}
	}
	,err = function(done,xc){
		return function(err){
			xc && clearTimeout(xc)
			throw "回调错误";
			done();
		}
	}
	,timeout_succ = function(done,c){
		c = c ? c : 1;
		return setTimeout(function(){
				done();
			},(maxtime+100)*c)
	}
	,timeout_err = function(done,errmsg,c){
		c = c ? c : 1;
		return setTimeout(function(){
				throw errmsg;
				done();
			},(maxtime+100)*c)
	}
//普通测试
describe('测试Queue-fun内部模拟q的异步函数类', function(){
    describe('单次调用测试', function(){
		describe('#.then', function(){
			
			it('.then(succ) 同步函数执行 成功', function(done){
				var xc = timeout_err(done,"未成功调用succ");
				fun1(1).then(succ(1,done,xc))
			})
			it('.then(succ) 同步函数执行 失败', function(done){
				var xc = timeout_succ(done);
				fun1(1,2).then(err(done,xc))
			})
			it('.then(succ) 异步函数执行 成功', function(done){
				var xc = timeout_err(done,"未成功调用succ");
				fun2(1).then(succ(1,done,xc))
			})
			it('.then(succ) 异步函数执行 失败', function(done){
				var xc = timeout_succ(done);
				fun2(1,2).then(err(done,xc))
			})
			it('.then(succ,err) 同步函数执行 成功', function(done){
				var xc = timeout_err(done,"未成功调用succ");
				fun1(1).then(succ(1,done,xc),err(done,xc))
			})
			it('.then(succ,err) 同步函数执行 失败', function(done){
				var xc = timeout_err(done,'未成功调用err');
				fun1(1,2).then(err(done,xc),succ(2,done,xc))
			})
			it('.then(succ,err) 异步函数执行 成功', function(done){
				var xc = timeout_err(done,"未成功调用succ");
				fun2(1).then(succ(1,done,xc),err(done,xc))
			})
			it('.then(succ,err) 异步函数执行 失败', function(done){
				var xc = timeout_err(done,'未成功调用err');
				fun2(1,2).then(err(done,xc),succ(2,done,xc))
			})

		})
		describe('#.done', function(){
			
			it('.done(succ) 同步函数执行 成功', function(done){
				var xc = timeout_err(done,"未成功调用succ");
				fun1(1).done(succ(1,done,xc))
			})
			// it('.done(succ) 同步函数执行 失败', function(done){
			// 	var xc = timeout_succ(done);
			// 	fun1(1,2).done(err(done,xc))
			// })
			it('.done(succ) 异步函数执行 成功', function(done){
				var xc = timeout_err(done,"未成功调用succ");
				fun2(1).done(succ(1,done,xc))
			})
			// it('.done(succ) 异步函数执行 失败', function(done){
			// 	var xc = timeout_succ(done);
			// 	fun2(1,2).done(err(done,xc))
			// })
			it('.done(succ,err) 同步函数执行 成功', function(done){
				var xc = timeout_err(done,"未成功调用succ");
				fun1(1).done(succ(1,done,xc),err(done,xc))
			})
			it('.done(succ,err) 同步函数执行 失败', function(done){
				var xc = timeout_err(done,'未成功调用err');
				fun1(1,2).done(err(done,xc),succ(2,done,xc))
			})
			it('.done(succ,err) 异步函数执行 成功', function(done){
				var xc = timeout_err(done,'未成功调用err');
				fun2(1).done(succ(1,done,xc),err(done,xc))
			})
			it('.done(succ,err) 异步函数执行 失败', function(done){
				var xc = timeout_succ(done);
				fun2(1,2).done(err(done,xc),succ(2,done,xc))
			})

		})
		describe('#.fail', function(){
	
			it('.fail(err) 同步函数执行 成功', function(done){
				var xc = timeout_succ(done);
				fun1(1).fail(err(done,xc))
			})
			it('.fail(err) 同步函数执行 失败', function(done){
				var xc = timeout_err(done,"未成功调用err");
				fun1(1,2).fail(succ(2,done,xc))
			})
			it('.fail(err) 异步函数执行 成功', function(done){
				var xc = timeout_succ(done);
				fun2(1).fail(err(done,xc))
			})
			it('.fail(err) 异步函数执行 失败', function(done){
				var xc = timeout_err(done,"未成功调用err");
				fun2(1,2).fail(succ(2,done,xc))
			})
			
		})
    })
	describe('链式调用测试', function(){
		describe('#.then()', function(){
			it('.then(succ).then(succ) 1 > 1', function(done){
				var xc = timeout_err(done,'未成功走完流程',2);
				fun2(1).then(function(data){
					if(data !== 1) throw "返回参数错误";
					return fun2(1.1)
				}).then(succ(1.1,done,xc))
			})
			it('.then(succ).then(succ) 1 > 0', function(done){
				var xc = timeout_succ(done,2);
				fun2(2).then(function(data){
					if(data !== 2) throw "返回参数错误";
					return fun2(2.1,2.2)
				}).then(err(done,"错误调用"))
			})
			it('.then(succ).then(succ,err) 1 > 0', function(done){
				var xc = timeout_err(done,'未成功走完流程',2);
				fun2(2).then(function(data){
					if(data !== 2) throw "返回参数错误";
					return fun2(2.1,2.2)
				}).then(err(done,"错误调用"),succ(2.2,done,xc))
			})
			it('.then(succ).then(succ).fail(err) 1 > 0 > fail(err)', function(done){
				var xc = timeout_err(done,'未成功走完流程',2);
				fun2(3).then(function(data){
					if(data !== 3) throw "返回参数错误";
					return fun2(3.1,3.2)
				}).then(err(done,"错误调用")).fail(succ(3.2,done,xc))
			})
			it('.then(succ).then(succ,err).fail(err).then(succ) 1 > 0 > 1 > then()', function(done){
				var xc = timeout_err(done,'未成功走完流程',2);
				fun2(3).then(function(data){
					if(data !== 3) throw "返回参数错误";
					return fun2(3.1,3.2)
				}).then(err(done,"错误调用1"),function(err){
					if(err !== 3.2) throw "返回参数错误";
					return fun1(3.3)
				}).fail(err(done,"错误调用2")).then(succ(3.3,done,xc))
			})
			it('.then(succ).then(succ).done(succ,err) 1 > 0 > 1 > done(succ,err)', function(done){
				var xc = timeout_err(done,'未成功走完流程',2);
				fun2(3).then(function(data){
					if(data !== 3) throw "返回参数错误";
					return fun2(3.1,3.2)
				}).then(err(done,"错误调用1"),function(err){
					if(err !== 3.2) throw "返回参数错误";
					return fun1(3.3)
				}).done(succ(3.3,done,xc),err(done,"错误调用2",xc))
			})
		})
	})
});

/*

if(0){
	var P1 = testfun(1,2)
	P1.then(function(d){
		var deferred = q.defer();
		//setTimeout(function(){
			console.log('1:' + d);
			deferred.resolve(1111)
		//},100)
		return deferred.promise;
	}).then(function(d){
		console.log('1then:' + d)
	}).done(function(d){
		console.log('1done:' + d)
	},function(err){
		console.log('1doneerr:' + err)
	})
	//return;
	P1.then(function(d){
		console.log('2:' + d)
		
		return 2222;
	}).then(function(d){
		console.log('2then:' + d)
	}).done(function(d){
		console.log('2done:' + d)
	},function(err){
		console.log('2doneerr:' + err)
	})
}

function Qtest(){
	console.log('>>>> Qtest');
	_test().then(function(data){
		console.log(data)
		if('> done - succ OK' == data){
			console.log('> then OK')
		}
		_test(2).fail(function(err){
			console.log(err)
			if('> done - err OK' == err){console.log('> fail ok')}
			console.log('<<<< Qtest end')
		})
	})
}

function _test(a){
	var deferred = q_.defer();
	testfun_(1,0).then(function(data){
		console.log(data)
		return testfun_(2,a || 0)
	}).then(function(data){
		console.log(data)
		return testfun_(3,0)
	}).done(function(data){
		console.log(data);
		if(!a && data == 3){
			deferred.resolve('> done - succ OK');
		}else{
			deferred.resolve('> done - succ Err');
		}
	},function(err){
		console.log(err + " -- err")
		if(a && err == 2){
			deferred.reject('> done - err OK')
		}else{
			deferred.reject('> done - err Err')
		}
	})
	return deferred.promise;
}

Qtest();  //正常工作测试

*/

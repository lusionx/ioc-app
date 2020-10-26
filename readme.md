### 设计思路
利用ioc思路组装实例, 把程序当成机器, 长期运行, 启动是建立唯一的app实例, 把各种工具挂载上, 可以理解为手术室+床+设备

数据从外部输入(api/队列消费/时间驱动/无限循环), 不改变原始输入, 而是包装起来, 处理完成后, 数据连同包装一起销毁, 类似手术耗材

#### lib/conf.ts
基于`NODE_ENV`读取json配置生成顶部零依赖的实例AppConfig, 增加配置项时, 需要修改ConfigItem来支持

#### lib/app.ts(HanderApp)
HanderApp注入svc等下层服务, 并根据config做异步init, 并提供`reg*`业务注册

### lib/svc
svc区分重业务与重io, 各个svc本身是平行且能互相调用, 单个svc.method要专注于读/写

eg. | biz | io
---|---|---|
底层 | cem | wx-proxy
上层 | consumer | odata

> 没有明显区分,

### lib/tool
业务无关的工具, 无依赖, 通过import使用

#### lib/app.ts(AppCtx)
AppCtx业务父类, 作用域是Prototype, 向app注册时填写方法, 而不是实例; ctx注入config和app联系上层, 通过app间接访问svc

#### worker
默认按kue的worker实现, 继承AppCtx作用域, 并且兼容简单api模式

### 作用域说明
有3种, Singleton是进程级别, 在多核模式下才有意义

Request: 由于全局共享container, 看起来效果和Singleton相同, 默认都是这种

Prototype: 每次请求都重新创建, 包装外部数据, 用完销毁, AppCtx系是这种

### 异常
重点处理io异常, 在svc里catch到, 将error做包装后继续抛出, 最外层根据包装, 做分类记录
- 将axios的简化
- 或者做成无限等待

> 包装约定: 利用error.message, ERR{$code}{$txt}:{$txt} 使用这个约定,/^Err(\d+)(\w+):(.+)$/`

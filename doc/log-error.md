日志与异常
==================
日志本质就是写文件, 学问在于低延迟, 低消耗

## 日志部署基础

### 原始机器

主机上跑个程序, 日志利用框架写到本地文件, 按大小/时间做个切割

### docker 时代

把目录挂出来, 与之前无异

### k8s 少副本

利用网络磁盘挂出来

### k8s 多副本

利用 filebeat 转出来

## 异常

需要统一的入口处理 error

### 流出

异常流应该参考 dom 的冒泡机制, 自己抛异常; 并赋上更内层的 error

但当自身内部循环里应 catch 住后处理


### 拼接

设计统一相似的 error 格式, 支持 inner, 简化3方的错误

在什么情况下一个技术可以取代另外一个技术，当然是一个技术干了另外一个技术干不了的事情，或干起来比较别扭的事情。

相对于Object.defineProperty来说Proxy解决了
- 不能监听数组的变化（vue中可以监听是修改了数组push等方法）
- 只能劫持对象的属性（需要循环对象属性对属性进行监听）,如果添加和删除一个属性需要重新调用vue的 api
- 对于对象属性的监听需要循环遍历其属性，这也是一笔不小的性能开销



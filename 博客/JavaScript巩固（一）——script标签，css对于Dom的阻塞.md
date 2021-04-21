## 前言
由于之前对于原生js的学习知识，知识学习了一些基础再加上之后一直使用Vue框架导致现在我对于原生js有很多盲点，因此我开始阅读《Javascript高级程序设计》来加强我对于JS的理解

##  < script>元素
- async属性：
立即开始下载脚本，但不能阻止其他页面动作（下载资源，等待其他脚本加载）。并且不一定按照script顺序触发。

	async js下载完，但html没有解析完，所以html会去执行下载好的js，这个时候就阻塞了dom解析。

	如果html和阻塞的其他资源都解析完了，这个时候async js还没有下载完，那么async js就不会阻塞dom解析

	这种方式加载的 JavaScript 依然==会阻塞 load 事件==。换句话说，async可能在 DOMContentLoaded 触发之前或之后执行，但一定会在 load 触发之前执行。

- defer属性：
  表示在文档解析和显示完成后再执行脚本是没问题的，它会告诉浏览器应该立即开始下载脚本，但执行应该推迟，执行阶段被放到 HTML 标签解析完成之后。按照顺序执行script。
	
	所有 defer-script 加载的 JavaScript 代码在 DOMContentLoaded 事件之前执行。

**共同点**：下载不会阻塞Dom，都只适用于外部脚本。

## 阻塞dom
1.内联css 2.内联js 3.普通外联js 
4.js之前的外联css
Dom解析遇到script标签时，会查找之前是否有外联css，如果有就加载，这是因为这种情况下的js有可能会用到这个外联css的样式（比如说那个计算最终样式的getComputedStyle），所以这时dom解析也会被外联css阻塞。
## 不阻塞dom
1.script标签之后的外联css
在上面讲阻塞的时候，讲到js之前的外联css会阻塞dom解析，所以现在讲script标签之后的外联css是不会阻塞dom解析的，只要外联css后面没有script标签就不会阻塞dom解析

2.image
下面的多张图片加载就表明图片加载是异步的，不阻塞dom解析
	
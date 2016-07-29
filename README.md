# chihuahua
search something in git repositories

## gitty不能全部满足我们的需求
gitty是git的管理模块，有好多功能可以借用。
而我们的 chihuahua 脚本在gitlab/gerrit等git管理服务器上运行，这这些设备上，每个仓库只存放了 XXX.git 目录，因此是不包含work directory的。
gitty 模块里面的 'lib/repository' 其中定义的 Repository 类，它的构造函数要求检查路径的合法性，这个检查要求在带有work directory的路径下使用。
因此，我们需要借用 Repository 这个类的实例方法，但却要改造它的构造函数。

## 设计
现在能想到的方法是使用 prototype 继承：
var WithWorkpathRepository = require('gitty');
Repository.prototype = new WithWorkpathRepository('../data');
我们定义的 Repository，其 prototype 是来自 gitty 模块的创建的对象，为了使new不报错，只好创建了一个data文件夹，并在里面创建了 .git 文件夹。
这样也能工作，但代码却有点恶心。

## 请教
除了构造函数不同，其他实例方法基本能公用的两个类，该怎么设计？

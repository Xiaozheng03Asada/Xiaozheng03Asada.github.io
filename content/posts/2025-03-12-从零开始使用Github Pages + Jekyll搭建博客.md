---
title: "从零开始使用Github Pages + Jekyll搭建博客"
date:   "2025-03-12"
summary: "本篇其实是课程作业 —— 上一篇博客的初始化"
tags:   ["随笔"]
showTags: true
toc: true
readTime: true
math: false
---

几经折腾下来终于做好了一个用着舒服的个人博客，采用`Github Pages`和`Jekyll`来搭建博客，样式美观也很简洁，在follow大佬的教程过程中也萌生了写一篇记录博文的想法，就简单做一个记录。

### GitHub Pages 和Jekyll是什么

GitHub Pages是由GitHub提供的静态网站托管服务，直接通过Git仓库自动部署，完全免费且支持自定义域名。通过它可以实现零成本搭建个人站点或者项目主页，也能很好地与Git工作流进行整合，自动支持HTTPS加密，非常适合我们部署静态博客。

而Jekyll，根据官网的描述，则是一个简单的博客形态的静态站点生产机器，它有一个模版目录，其中包含原始文本格式的文档，通过一个转换器（如 [Markdown](http://daringfireball.net/projects/markdown/)）和内置的 [Liquid](https://github.com/Shopify/liquid/wiki) 渲染器转化成一个完整的可发布的静态网站，并且完全免费。

Jekyll的官网文档十分详细，遇到的几乎所有问题都能找到对应的解决方案。

### Github侧的操作

点击`New repository`新建一个仓库，仓库的名称要设置为`github用户名.github.io`，选择仓库为`Public`，新建一个README file.

进入仓库，点击仓库的`Settings`，在左侧边栏`Code and automation`选择项`Pages`，(请先设置好Default branch)

此时如果一切正常，将会在`GitHub Pages`看到对应的url：

![](https://blogxiaozheng.oss-cn-beijing.aliyuncs.com/images/20250312171751542.png)

我在这里设置了自定义的域名，如果你也有一个闲置的域名，可以在本栏下面的`Custom domaoin`填写，等待一会就可以用指定域名访问了。

### 本地的操作

笔者的老电脑搭载的是macOS Monterey系统，可以直接使用命令行来进行相应依赖的安装，就是因为版本太老，可能会在中途遇到一些问题，比如其中一项依赖`openssl@3`

#### 低版本macOS系统如何安装`openssl@3`

根据Homebrew上面的版本支持信息，我所使用的老系统已经不支持安装最新的`openssl@3`了

![](https://blogxiaozheng.oss-cn-beijing.aliyuncs.com/images/20250312172224657.png)

执行`brew install openssl@3`会在`make test`环节出错，如果遇到同样的问题，可以参考[这个问题]( https://github.com/openssl/openssl/issues/22467 )进行解决，如果没有rb模板文件需要先生成一下。

具体来说，分为以下几步：

1. 打开对应`openssl@3`的db模版文件，笔者电脑的文件在路径`/opt/homebrew/Library/Taps/homebrew/homebrew-core/Formula/o/openssl@3.rb` 下。
2. 打开编辑这个文件，找到有关`test TESTS=`的行，将其注释掉，就不会进行测试了。
3. 运行`brew install --build-from-source --formula /path/to/openssl@3.rb`，确定路径正确，即可完成安装。

不少`C++`的第三方依赖也要利用`openssl@3`，弄好这个就可以更顺利的进行以后的开发。现在可以打开终端继续之后的安装：

```bash
brew install ruby
sudo gem install jekyll
sudo gem install jekyll bundler
```

如果没有错误爆出，恭喜你，现在已经成功安装，可以使用`Jekyll`了～

#### 本地使用Jekyll

在想要存放博客文件夹的目录打开终端，执行：

```bash
jekyll new myblog
cd myblog/
sudo bundle install
```

执行以下命令可以本地运行博客网站：

```bash
bundle exec jekyll serve
```

查看`Server address: http://127.0.0.1:4000`，就是本地访问的地址。

打开之后，能看到自动生成的第一篇博文：

> *Title: Welcome to Jekyll!*
>
> You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your  changes. You can rebuild the site in many different ways, but the most  common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.
>
> ... ...

文件夹`_posts`用来存放md格式的文档，新建成要渲染的博文需要满足相应的命名格式`YEAR-MONTH-DAY-title.MARKUP`，其中`YEAR`是一个四位数，`MONTH`和`DAY`都是两位数，`MARKUP`是文件后缀拓展名。

在新建的博文中，需要包含必要的序言部分

```markdown
layout: post
title: 从零开始使用Github Pages + Jekyll搭建博客
author: Asada
header-style: text
catalog: true
tags:
    - Web
    - Jekyll
    - Github Pages
```

添加在文档的首页，可以查看自动生成的文档的源代码研究研究。

后续详细的基础配置信息都可以在Jekyll上看到对应的帮助文档。

### 部署到Github仓库上

在博客目录下打开终端，执行：

```bash
git init
git add .
git commit -m "<commit message>"
git remote add origin git@github.com:<github-username>/<github-username>.github.io.git
git push origin main
```

等待5分钟，就能在你自定义的域名上看到刚刚的博客主页啦～



参考博文与教程：

[Github Pages + Jekyll搭建极简博客](https://lanzhou-j.github.io/2021/03/17/build-jekyll-blog/)

[huxpro.github.io/README.md](https://github.com/Huxpro/huxpro.github.io/blob/master/README.md)
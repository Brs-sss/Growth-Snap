# Growth-Snap
THU软件学院 大三课程 软件工程 大作业

本项目目的是实现一个成长记录微信小程序，帮助家长更好的记录孩子成长的点点滴滴

## 项目开发规则
### 分支管理
- master分支为主分支，dev为开发分支，不允许直接对两个分支进行更改；
- 开发新的功能模块时，应从dev下创建新的分支。新分支开发结束后，合并至dev分支；
- 合并前，应预先拉取最新的dev分支

### 具体操作方式
- 创建及切换分支
```
git checkout dev
git checkout -b <branch_name>
``` 
- 在分支下开发新功能
- 合并
```
// 省略对于更改内容的add与commit
git pull origin dev
git checkout dev
git merge <branch_name>
// 发生冲突时，手动更改后add与commit即可
git branch -d <branch_name> // 不再需要该分支时，删除
git push origin dev
```

### commit信息
**格式：`<type>(<scope>): <subject>`**

#### type表示改动种类，可以是：
1. feat：添加新功能或者更改已有功能（feature）；
2. fix：修复了已有bug；
3. perf：对性能的优化；
4. refactor：重构代码结构（不改变功能）；
5. merge：代码合并；
6. revert：回滚到过去版本;
7. doc：对文档内容的更改；
8. res：对图片、音频等资源信息的更改；
9. other：其他。

#### scope表示改动范围，可以是：
1. front：对前端的更改；
2. back：对后端的更改；
3. other：其他。

#### subject是对改动的描述，要求：
1. 使用英文；
2. 词数在30个词以内；
3. 若涉及多个内容（如多个新功能），使用分号隔开。

## 项目框架
前端使用微信小程序提供框架，后端使用django

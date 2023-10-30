# Growth-Snap
THU软件学院 大三课程 软件工程 大作业

本项目目的是实现一个成长记录微信小程序，帮助家长更好的记录孩子成长的点点滴滴

## 公告区
### <span style="color:red;">孩子成长传输协议GSTP v1.0发布！！详见md最下面</span>


## 项目开发规则
### 分支管理
- master分支为主分支，不允许直接更改，项目创建者定期从dev合并；dev为开发分支，只允许通过分支的合并进行更改。
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
git add <modified file>
git commit -m "msg"
git push origin <branch_name>
// 进入仓库页面，提交merge申请
// 进入pull request页面，确认申请（可能需要处理冲突）
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

## 使用方式
可以用vs打开整个项目，进入```backend```，输入
```python manage.py runserver 8090```
之后用微信开发者工具打开```frontend```，进行模拟。

## <span style="color:blue;">GSTP(Growth Snap Transfer Protocol) 1.0</span>
#### 本协议的目的在于规定一些前后端会用到的变量的标准，方便大家统一
1. 前端向后端传递tags标签时，前端在data段传入tags数组（例如[{蓝天,true},{小明,true},{爸爸,false},{妈妈,true}]），后端需要首先把tags转为选中的标签的数组（例如[蓝天,小明,妈妈]），然后调用/user/utils里的ListToString函数将其转换为以逗号(,)分隔的string（变成蓝天,小明,妈妈），这是为了便于数据库的管理（数据库不善于存放数组）。需要取用时在调用/user/utils的StringToList函数返回tags数组。以下是一个示例：
<pre>
```#后端views.py
from .utils import ListToString,StringToList

#tags从前端传过来，形如[{'info':'蓝天','checked':true},{小明,true},{爸爸,false},{妈妈,true}]
tags=ListToString([tag['info'] for tag in tags if tag['checked']])
```
</pre>


2. 数据库接受的日期的形式为YYYY-MM-DD，时间的形式为hh:mm:ss，与js中获取到的并不一样（js直接获取日期是Oct 30 2023，时间是18:49:30 GMT+8），所以需要转换日期时间格式才能存入数据库。这个转换目前是日期由前端做（前端相对好做一些），时间由后端做。之后可以再商量。



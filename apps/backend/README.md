# 06.17

实现了配置抽离、基于 jwt 登录、鉴权功能。

配置抽离使用 `@nestjs/config` 包，把配置放在 src 下的 .env 文件里，然后代码里从 configService 读取配置。

配置 nest-cli.json 的 assets 和 watchAssets 来自动把 env 文件复制到 dist 目录下。

使用代码做的数据初始化，线上要删掉这个接口，用导出的 sql 文件来初始化。

登录成功之后，返回 access_token、refresh_token 还有用户信息、roles、permissions 等。

并支持使用 refreshToken 来刷新 token。

之后使用 LoginGuard、PermissionGuard 来做登录和权限的鉴权，根据 handler 上的 metadata 来确定要不要做鉴权、需要什么权限。

我们还封装了几个自定义装饰器，用于方便的设置 metadata，从 request 取数据注入 handler。

# 6.18

API, Function, Workflow 都可以对 item 进行文件式分类，方便后续管理

### 数据模型设计

- 1. 文件源数据: 存储 item 基本信息，如创建时间， 修改时间，类型等等。
- 2. 目录结构。 为了支持层级结构，设计目录表来表示文件和文件夹之前的关系。
- 3. item 内容。
- 4. （可选）涉及用户和 item 的权限关系。

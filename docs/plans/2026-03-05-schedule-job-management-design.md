# 定时任务管理设计

## 1. 背景

`sephy-app` 已提供 `SysScheduleJobController`，覆盖定时任务管理和执行日志分页查询能力。`apps/web-ele` 当前已有用户、角色、菜单、部门、字典等系统管理模块，页面结构主要采用：

- `views/system/<module>/list.vue` 承载主列表
- `views/system/<module>/data.ts` 维护表单与表格配置
- `views/system/<module>/modules/*.vue` 承载表单弹窗、抽屉等局部交互
- `api/system/*.ts` 封装接口
- `router/routes/modules/system.ts` 注册菜单路由

本次设计在保持该模式一致的前提下，为 `apps/web-ele` 增加定时任务管理功能。

## 2. 目标

- 在系统管理菜单下新增“定时任务管理”页面
- 支持任务分页查询、筛选、新增、编辑、删除、启用、禁用、立即执行
- 支持从任务列表操作列打开执行日志抽屉，查看当前任务的执行日志分页数据
- 前后端统一使用字符串状态码 `ENABLED` / `DISABLED`
- 前端只暴露后端真实支持的编辑能力，避免无效字段编辑

## 3. 范围

### 3.1 包含

- 任务管理主页面
- 任务新增/编辑弹窗
- 任务执行日志抽屉
- 系统菜单路由
- 中英文国际化文案
- 前端 API 类型与接口封装
- 后端 `jobStatus` 字段改为字符串 code 的接口契约调整

### 3.2 不包含

- 独立的“任务日志”菜单页
- 日志导出
- Cron 可视化构建器
- Bean 名称下拉发现
- 日志详情后端单条接口接入

## 4. 后端接口契约

基于 `SysScheduleJobController`：

### 4.1 任务管理

- `POST /admin-api/schedule/job/list`
- `GET /admin-api/schedule/job/{id}`
- `POST /admin-api/schedule/job/create`
- `POST /admin-api/schedule/job/update`
- `POST /admin-api/schedule/job/delete?id=<id>`
- `POST /admin-api/schedule/job/enable?id=<id>`
- `POST /admin-api/schedule/job/disable?id=<id>`
- `POST /admin-api/schedule/job/execute?id=<id>`

### 4.2 日志管理

- `POST /admin-api/schedule/job/log/list`

日志抽屉只依赖日志分页接口，不增加单独日志菜单页。

## 5. 状态模型

`jobStatus` 前后端统一为字符串：

- `ENABLED`
- `DISABLED`

约束：

- 创建任务默认 `ENABLED`
- 列表中按 code 映射中文文案
- 启停操作继续走独立 `/enable`、`/disable` 接口，不合并为通用状态更新
- 若前端收到未知状态，按“未知状态”降级展示，并禁用状态切换按钮

## 6. 页面结构

### 6.1 菜单与路由

在 `apps/web-ele/src/router/routes/modules/system.ts` 下新增路由：

- 路径：`/system/schedule-job`
- 名称：`SystemScheduleJob`
- 标题：`定时任务管理`
- 权限建议：`system:schedule-job:view`

### 6.2 主页面

页面采用单列表结构，布局与现有系统模块一致：

- 搜索区
- 工具栏
- 任务列表表格
- 新增/编辑弹窗
- 执行日志抽屉

### 6.3 日志查看方式

日志入口放在任务列表操作列中，点击“日志”后打开右侧抽屉，仅查看当前任务的执行日志，不单独新增菜单页。

## 7. 数据模型

### 7.1 ScheduleJob

- `id: number`
- `jobName: string`
- `jobDescription?: string`
- `beanName: string`
- `cronExpression: string`
- `jobParams?: Record<string, any>`
- `jobStatus: 'ENABLED' | 'DISABLED' | string`
- `lastExecuteTime?: string`
- `nextExecuteTime?: string`
- `createdTime?: string`
- `updatedTime?: string`

### 7.2 ScheduleJobLog

- `id: number`
- `jobId: number`
- `jobName: string`
- `executeTime?: string`
- `finishTime?: string`
- `durationMs?: number`
- `executeStatus: number`
- `executeResult?: string`
- `errorMessage?: string`
- `createdTime?: string`

### 7.3 查询与提交参数

- `QueryScheduleJobParams`
  - `jobName?: string`
  - `beanName?: string`
  - `jobStatus?: string`
- `CreateScheduleJobParams`
  - `jobName: string`
  - `jobDescription?: string`
  - `beanName: string`
  - `cronExpression: string`
  - `jobParams?: Record<string, any>`
  - `jobStatus?: string`
- `UpdateScheduleJobParams`
  - `id: number`
  - `jobDescription?: string`
  - `cronExpression?: string`
  - `jobParams?: Record<string, any>`

## 8. 交互设计

### 8.1 搜索区

搜索字段：

- 任务名称 `jobName`
- Bean 名称 `beanName`
- 任务状态 `jobStatus`

状态下拉选项：

- 启用：`ENABLED`
- 禁用：`DISABLED`

### 8.2 列表表格

建议列：

- 任务名称
- 任务描述
- Bean 名称
- Cron 表达式
- 状态
- 最后执行时间
- 下次执行时间
- 创建时间
- 操作

操作列包含：

- 编辑
- 启用/禁用
- 立即执行
- 日志
- 删除

### 8.3 新增任务

新增表单字段：

- `jobName` 必填
- `jobDescription` 可选
- `beanName` 必填
- `cronExpression` 必填
- `jobParams` 可选
- `jobStatus` 默认 `ENABLED`

### 8.4 编辑任务

编辑时只允许修改后端支持的字段：

- `jobDescription`
- `cronExpression`
- `jobParams`

只读展示字段：

- `jobName`
- `beanName`
- `jobStatus`

这样与后端 `UpdateScheduleJobCmd` 保持一致，避免前端暴露无法生效的编辑字段。

### 8.5 jobParams 输入策略

`jobParams` 使用 JSON 文本输入，而不是动态键值对表单。

原因：

- 后端类型为 `Map<String, Object>`
- 任务参数结构不固定
- JSON 文本兼容性最好，前后端契约最稳定

校验规则：

- 允许空值
- 非空时必须是合法 JSON
- 解析结果必须是对象，不能是数组、字符串、数字或布尔值

### 8.6 状态操作

- 当前为 `ENABLED` 时显示“禁用”
- 当前为 `DISABLED` 时显示“启用”
- 未知状态时禁用状态切换按钮

### 8.7 立即执行

- 点击后弹确认框
- 成功后刷新主表
- 不自动打开日志抽屉，避免打断主操作流

### 8.8 删除

- 点击后弹确认框
- 删除成功刷新主表

## 9. 日志抽屉设计

### 9.1 打开方式

从任务列表操作列点击“日志”打开抽屉。

### 9.2 抽屉内容

- 标题中带任务名称
- 内部展示当前任务的日志分页表格
- 查询参数固定包含 `jobId`

### 9.3 日志表格列

- 执行时间
- 完成时间
- 执行耗时
- 执行状态
- 执行结果摘要
- 错误信息摘要
- 操作

### 9.4 详情查看

对于 `executeResult` 和 `errorMessage`：

- 表格中用省略形式展示摘要
- 提供“详情”按钮
- 点击后打开只读详情弹窗，展示完整文本

### 9.5 状态与分页

- 每次打开新任务日志时重置到第一页
- 抽屉关闭后清空当前任务上下文
- 不额外开放其他筛选项，保证职责单一

## 10. 错误处理

- `jobParams` JSON 非法时阻止提交并显示明确提示
- 时间字段为空时统一显示 `-`
- 启用/禁用/执行/删除失败时，依赖全局请求错误处理提示
- 未知 `jobStatus` 时降级展示并禁用切换操作

## 11. 前端改动范围

### 11.1 新增文件

- `apps/web-ele/src/api/system/schedule-job.ts`
- `apps/web-ele/src/views/system/schedule-job/list.vue`
- `apps/web-ele/src/views/system/schedule-job/data.ts`
- `apps/web-ele/src/views/system/schedule-job/modules/form.vue`
- `apps/web-ele/src/views/system/schedule-job/modules/log-drawer.vue`
- `apps/web-ele/src/views/system/schedule-job/modules/log-detail-modal.vue`（如抽屉内需要详情弹窗）

### 11.2 修改文件

- `apps/web-ele/src/api/system/index.ts`
- `apps/web-ele/src/router/routes/modules/system.ts`
- `apps/web-ele/src/locales/langs/zh-CN/system.json`
- `apps/web-ele/src/locales/langs/en-US/system.json`

## 12. 后端同步改动要求

为了前后端契约一致，后端需同步调整：

- `SysScheduleJobDTO.jobStatus` 改为字符串
- `CreateScheduleJobCmd.jobStatus` 改为字符串，默认值 `ENABLED`
- `ScheduleJobQuery.jobStatus` 改为字符串
- 持久层枚举/字段映射统一为 `ENABLED` / `DISABLED`
- `/enable`、`/disable` 接口保持不变

## 13. 验证范围

- 任务列表分页查询
- 按任务名称、Bean 名称、状态筛选
- 新增任务
- 编辑任务
- 启用任务
- 禁用任务
- 立即执行
- 删除任务
- 日志抽屉分页查看
- 非法 `jobParams` 拦截
- 未知状态降级展示

## 14. 结论

采用与现有系统模块一致的实现模式，以最小结构增量接入定时任务管理。日志查看通过任务列表操作列抽屉完成，状态模型统一为 `ENABLED` / `DISABLED`，编辑能力严格对齐后端真实支持范围，降低前后端契约偏差和交互歧义。

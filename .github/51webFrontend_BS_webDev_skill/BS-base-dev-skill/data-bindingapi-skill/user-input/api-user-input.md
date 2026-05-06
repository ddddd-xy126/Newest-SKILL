# 园区综合数据接口文档

请帮我在 `src/utils/api/data.js` 中生成以下接口代码。

**生成要求**：请在生成的代码中，根据不同的模块名称（园区概览、智能生产等）添加明显的注释分隔符。

## 全局配置更新 (可选)
- **baseURL**: `http://47.100.67.0:3300/jeecg-boot`
- **token**: 无

---

## 接口说明

### 模块一：园区概览

#### 1. 获取综合年收入
- **路径**: `/screen/main/queryTotalYearIncome`
- **方法**: `GET`
- **描述**: 获取综合年收入
- **请求参数 (Query)**:
  - `year` (Number): 年份

#### 2. 获取实时在园人数
- **路径**: `/screen/main/peopleNum`
- **方法**: `GET`
- **描述**: 获取实时在园人数
- **请求参数 (Query)**: 无

#### 3. 获取基础信息（静态数据）
- **路径**: `/screen/main/peopleNum`
- **方法**: `GET`
- **描述**: 获取基础信息（静态数据）
- **请求参数 (Query)**: 无


### 模块二：智能生产

#### 1. 获取基础信息（静态数据）
- **路径**: `/screen/prod/base`
- **方法**: `GET`
- **描述**: 获取基础信息（静态数据）
- **请求参数 (Query)**: 无

#### 2. 水肥监测
- **路径**: `/screen/prod/waterFertilizer/{placeId}`
- **方法**: `GET`
- **描述**: 获取水肥监测数据
- **请求参数 (Path)**:
  - `placeId` (string): 监测点位ID


#### 3. 历史土壤墒情
- **路径**: `/screen/prod/soilMoistureHistory/{placeId}/{factorType}/{level}`
- **方法**: `GET`
- **描述**: 获取历史土壤墒情
- **请求参数 (Path)**:
  - `placeId` (string): 地点ID
  - `factorType` (string): 因子类型（温度T,湿度H）
  - `level` (integer): 等级（1,2,3,4）

#### 4. 实时土壤墒情
- **路径**: `/screen/prod/soilMoisture/{placeId}`
- **方法**: `GET`
- **描述**: 获取实时土壤墒情
- **请求参数 (Path)**:
  - `placeId` (string): 地点ID

#### 5. 服务业统计
- **路径**: `/screen/prod/serviceStat/{statType}`
- **方法**: `GET`
- **描述**: 获取服务业统计数据
- **请求参数 (Path)**:
  - `statType` (string): 统计类型（从业人数job,年龄分布age）


#### 6. 产量统计
- **路径**: `/screen/prod/grainOutput/{year}`
- **方法**: `GET`
- **描述**: 获取产量统计数据
- **请求参数 (Path)**:
  - `year` (string): 年份



### 模块三：优智生活

#### 1. 智慧步道排行榜
- **路径**: `/screen/live/walkRankList`
- **方法**: `GET`
- **描述**: 获取智慧步道排行榜
- **请求参数 (Query)**: 无

#### 2. 用户画像
- **路径**: `/screen/live/userPortrait/{portraitType}`
- **方法**: `GET`
- **描述**: 获取用户画像
- **请求参数 (Query)**: 
  - `portraitType` (string): 画像类型


#### 3. 照片墙
- **路径**: `/screen/live/userPhotoList`
- **方法**: `GET`
- **描述**: 获取照片墙
- **请求参数 (Query)**: 无


#### 4. 留言板
- **路径**: `/screen/live/userMessageList`
- **方法**: `GET`
- **描述**: 获取留言板
- **请求参数 (Query)**: 无

#### 5. 实时人数
- **路径**: `/screen/live/peopleNum`
- **方法**: `GET`
- **描述**: 获取实时人数
- **请求参数 (Query)**: 无

#### 6. 历史人数
- **路径**: `/screen/live/peopleNumHistory/{placeId}/{timeType}`
- **方法**: `GET`
- **描述**: 获取历史人数
- **请求参数 (Query)**: 
    - `placeId` (string): 地点Id
    - `timeType`(string): 时间类型


#### 7. 实时人流量列表
- **路径**: `/screen/live/peopleFlowList`
- **方法**: `GET`
- **描述**: 获取实时人流量列表
- **请求参数 (Query)**: 无

#### 8. 历史人流量
- **路径**: `/screen/live/peopleFlowHistory/{placeId}/{timeType}`
- **方法**: `GET`
- **描述**: 获取历史人流量
- **请求参数 (Query)**: 
    - `placeId` (string): 地点Id
    - `timeType`(string): 时间类型


#### 9. 获取基础信息（静态数据）
- **路径**: `/screen/live/base`
- **方法**: `GET`
- **描述**: 获取基础信息（静态数据）
- **请求参数 (Query)**: 无


### 模块四：智慧生态


#### 1. 历史数据查询
- **路径**: `/screen/ecology/realHistoryQuery`
- **方法**: `POST`
- **描述**: 历史数据查询
- **请求参数 (Body - JSON)**:
  - `type` (String): 站点类型
  - `pointid` (string): 站点id
  - `pointids` (string): 站点id列表
  - `startTime` (string): 开始时间
  - `endTime` (string): 结束时间

#### 2. 获取站点实时数据
- **路径**: `/screen/ecology/realTimeQuery`
- **方法**: `GET`
- **描述**: 获取站点实时数据
- **请求参数 (Query)**: 
    - `pointType` (string): 点位类型

#### 3. 获取设备在线状态
- **路径**: `/screen/ecology/equipmentStatusQuery`
- **方法**: `GET`
- **描述**: 获获取设备在线状态
- **请求参数 (Query)**: 无


#### 4. 获取基础信息（静态数据）
- **路径**: `/screen/ecology/base`
- **方法**: `GET`
- **描述**: 获取基础信息（静态数据）
- **请求参数 (Query)**: 无


#### 5. 获取设备报警信息
- **路径**: `/screen/ecology/alarmQuery`
- **方法**: `GET`
- **描述**: 获取设备报警信息
- **请求参数 (Query)**: 无
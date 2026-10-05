import type { ProductVideo } from "@/types";

/**
 * 产品页视频演示数据（B 站，UP 主 space.bilibili.com/241980240）。
 * 标题为 UP 主原始标题（中文），中英文站点共用；分节文案在 messages 的 `<product>.video` 命名空间。
 * 视频内嵌地址由 VideoSection 按 bvid 拼接，无需 cid。
 */
export const productVideos: Record<"wms" | "lims" | "icms", ProductVideo[]> = {
  wms: [{ bvid: "BV1KX7hzFE5f", title: "wms2.0 智能仓储管理系统" }],
  lims: [
    // 001–011 教程系列（按集数排序）
    { bvid: "BV1wDgF6vEnj", title: "环境检测 LIMS 整体功能介绍" },
    { bvid: "BV1xCgF6gEEs", title: "LIMS 检测方案设计演示教程" },
    { bvid: "BV14xgA6EE3v", title: "LIMS 电脑端采样功能演示教程" },
    { bvid: "BV1nzgA6zEHw", title: "LIMS 手机端采样功能演示教程" },
    { bvid: "BV1zkgA6qEE3", title: "LIMS 交样、分样质控演示教程" },
    { bvid: "BV1EkgA6qEQo", title: "LIMS 实验室分析演示教程" },
    { bvid: "BV1zrgA6MEmh", title: "LIMS 报告生成签发演示教程" },
    { bvid: "BV1T9YN67Eyf", title: "LIMS 编号规则管理教程" },
    { bvid: "BV1NZYN6yEGr", title: "LIMS 后台 AI 助手和自动化机器人简介" },
    { bvid: "BV1uUYN6DERM", title: "LIMS 原始记录模板引擎填充和豆包自动导出教程" },
    { bvid: "BV1D9a26eErU", title: "LIMS 电子记录和报告在线编辑功能介绍" },
    // 补充演示
    { bvid: "BV1z49NBmEnc", title: "LIMS 实验室信息管理系统 AI Agent 功能演示" },
    { bvid: "BV14GbY6LETY", title: "LIMS 环境检测数字化改造" },
    { bvid: "BV1ibaS6EEFZ", title: "LIMS 电子标签码打印和扫描" },
  ],
  icms: [{ bvid: "BV1uSnbzNEVy", title: "icms 智慧社区软硬件解决方案" }],
};

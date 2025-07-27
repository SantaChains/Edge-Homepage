import { format, addDays, differenceInDays, isValid, parse } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期时间
 * @param {Date|number} date - 日期对象或时间戳
 * @param {string} formatStr - 格式化字符串
 * @param {Object} options - 选项
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDateTime = (date, formatStr = 'yyyy-MM-dd HH:mm:ss', options = {}) => {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, formatStr, {
      locale: zhCN,
      ...options
    });
  } catch (error) {
    console.error('格式化日期时间失败:', error);
    return '';
  }
};

/**
 * 获取当前日期时间
 * @param {string} formatStr - 格式化字符串
 * @returns {string} 格式化后的当前日期时间字符串
 */
export const getCurrentDateTime = (formatStr = 'yyyy-MM-dd HH:mm:ss') => {
  return formatDateTime(new Date(), formatStr);
};

/**
 * 计算两个日期之间的天数差
 * @param {Date|number|string} startDate - 开始日期
 * @param {Date|number|string} endDate - 结束日期
 * @returns {number} 天数差
 */
export const getDaysDifference = (startDate, endDate) => {
  try {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    return differenceInDays(end, start);
  } catch (error) {
    console.error('计算日期差异失败:', error);
    return 0;
  }
};

/**
 * 添加天数到日期
 * @param {Date|number|string} date - 日期
 * @param {number} days - 天数
 * @returns {Date} 新日期
 */
export const addDaysToDate = (date, days) => {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return addDays(dateObj, days);
  } catch (error) {
    console.error('添加天数到日期失败:', error);
    return new Date();
  }
};

/**
 * 解析日期字符串
 * @param {string} dateStr - 日期字符串
 * @param {string} formatStr - 格式化字符串
 * @returns {Date|null} 解析后的日期对象，如果解析失败则返回null
 */
export const parseDate = (dateStr, formatStr = 'yyyy-MM-dd') => {
  try {
    const parsedDate = parse(dateStr, formatStr, new Date());
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    console.error('解析日期失败:', error);
    return null;
  }
};

/**
 * 获取农历日期（简化版，仅用于示例）
 * @param {Date|number|string} date - 日期
 * @returns {string} 农历日期字符串
 */
export const getLunarDate = (date) => {
  // 这里应该使用专门的农历计算库，这里仅作为示例返回固定值
  return '农历日期计算需要专门的库';
};

/**
 * 获取竺纪笠历法日期（示例）
 * @param {Date|number|string} date - 日期
 * @returns {string} 竺纪笠历法日期字符串
 */
export const getZhuJiLiDate = (date) => {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 这里是一个简化的竺纪笠历法计算示例
    // 实际应用中应该使用更复杂的算法
    const year = dateObj.getFullYear() + 2698; // 假设竺纪笠纪元比公元早2698年
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    
    return `竺纪笠 ${year}年 ${month}月 ${day}日`;
  } catch (error) {
    console.error('计算竺纪笠日期失败:', error);
    return '';
  }
};

/**
 * 获取一周的日期范围
 * @param {Date} date - 日期
 * @returns {Array} 一周的日期数组
 */
export const getWeekDates = (date = new Date()) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 调整周日
  
  const monday = new Date(date.setDate(diff));
  const weekDates = [];
  
  for (let i = 0; i < 7; i++) {
    weekDates.push(addDaysToDate(monday, i));
  }
  
  return weekDates;
};

/**
 * 获取月份的天数
 * @param {number} year - 年份
 * @param {number} month - 月份（1-12）
 * @returns {number} 天数
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

/**
 * 获取月份的第一天是星期几
 * @param {number} year - 年份
 * @param {number} month - 月份（1-12）
 * @returns {number} 星期几（0-6，0表示星期日）
 */
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month - 1, 1).getDay();
};

/**
 * 生成月历数据
 * @param {number} year - 年份
 * @param {number} month - 月份（1-12）
 * @returns {Array} 月历数据
 */
export const generateCalendarData = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // 调整星期日为一周的第一天
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  
  const calendarData = [];
  let week = [];
  
  // 填充月初的空白
  for (let i = 0; i < adjustedFirstDay; i++) {
    week.push(null);
  }
  
  // 填充日期
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    
    if (week.length === 7) {
      calendarData.push(week);
      week = [];
    }
  }
  
  // 填充月末的空白
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    calendarData.push(week);
  }
  
  return calendarData;
};
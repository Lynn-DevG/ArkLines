/**
 * 模拟器配置参数
 */

// 帧率配置：每秒帧数
export const FPS = 30;

// 每帧的时间长度（秒）
export const FRAME_DURATION = 1 / FPS;

// 模拟时长（秒）
export const DEFAULT_SIMULATION_DURATION = 30;

/**
 * 将秒数转换为帧数
 * @param {number} seconds - 秒数
 * @returns {number} 帧数
 */
export function secondsToFrames(seconds) {
    return Math.round(seconds * FPS);
}

/**
 * 将帧数转换为秒数
 * @param {number} frames - 帧数
 * @returns {number} 秒数
 */
export function framesToSeconds(frames) {
    return frames / FPS;
}

/**
 * 格式化时间显示（秒 + 帧）
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串，如 "2.50秒 (75帧)"
 */
export function formatTimeWithFrames(seconds) {
    const totalFrames = secondsToFrames(seconds);
    return `${seconds.toFixed(2)}秒 (${totalFrames}帧)`;
}

/**
 * 格式化时间显示（仅帧数）
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的帧数字符串
 */
export function formatFrames(seconds) {
    return `${secondsToFrames(seconds)}帧`;
}

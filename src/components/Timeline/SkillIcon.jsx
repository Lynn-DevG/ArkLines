import React from 'react';
import { getSkillIcon, getElementColor } from '../../utils/skillIconUtils';
import { SKILLS } from '../../data/skills';

/**
 * 圆形技能图标组件
 * 
 * 样式结构：
 * - 外框：白色圆环
 * - 主背景：浅灰色
 * - 下方扇形：元素色（根据 element 属性）
 * - 内部：技能图标
 */
export const SkillIcon = ({
    charId,
    skillType,
    element,
    weaponType,
    nameEn,
    size = 64,
    iconScale = 1.25, // 图标相对于内圈的缩放比例
    isActive = false,
    disabled = false,
    onClick,
    title,
}) => {
    const iconSrc = getSkillIcon(charId, skillType, weaponType, nameEn);
    const elementColor = getElementColor(element);
    
    // 计算各层尺寸
    const ringWidth = Math.max(1.5, size * 0.03); // 更细的外环
    const gapWidth = Math.max(2, size * 0.04);    // 圆环与内圈之间的间距
    const innerSize = size - (ringWidth + gapWidth) * 2;
    const iconSize = innerSize * iconScale; // 图标可以比内圈大
    
    const containerStyle = {
        width: size,
        height: size,
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        filter: disabled ? 'grayscale(100%)' : 'none',
        transition: 'all 0.2s ease',
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
    };

    // 白色细圆环（使用 border 实现）
    const ringStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: `${ringWidth}px solid #ffffff`,
        boxSizing: 'border-box',
        boxShadow: isActive 
            ? '0 0 0 2px #ffffff, 0 0 12px rgba(255,255,255,0.6)' 
            : '0 2px 4px rgba(0,0,0,0.3)',
    };

    // 内圈容器（带间距）
    const innerWrapperStyle = {
        position: 'absolute',
        top: ringWidth + gapWidth,
        left: ringWidth + gapWidth,
        width: innerSize,
        height: innerSize,
        borderRadius: '50%',
        overflow: 'hidden',
    };

    const innerCircleStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: '#a0a0a0', // 浅灰色主背景
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    // 下方扇形区域样式（约120度）
    // 使用 conic-gradient 实现精确的扇形角度
    // 120度扇形，底部中心是180度，左右各60度（从120度到240度）
    const sectorStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            transparent 120deg,
            ${elementColor} 120deg,
            ${elementColor} 240deg,
            transparent 240deg,
            transparent 360deg
        )`,
        top: 0,
        left: 0,
    };

    const iconContainerStyle = {
        position: 'relative',
        zIndex: 1,
        width: iconSize,
        height: iconSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const iconImgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
    };

    const handleClick = () => {
        if (!disabled && onClick) {
            onClick();
        }
    };

    return (
        <div 
            style={containerStyle} 
            onClick={handleClick}
            title={title}
            className="skill-icon-container"
        >
            {/* 白色细圆环 */}
            <div style={ringStyle} />
            {/* 内圈（与圆环有间距） */}
            <div style={innerWrapperStyle}>
                <div style={innerCircleStyle}>
                    {/* 元素色扇形区域 */}
                    <div style={sectorStyle} />
                    {/* 技能图标 */}
                    <div style={iconContainerStyle}>
                        <img 
                            src={iconSrc} 
                            alt={title || skillType}
                            style={iconImgStyle}
                            onError={(e) => {
                                // 图标加载失败时使用默认图标
                                e.target.src = 'dist/assets/icons/default_icon.png';
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * 角色技能图标组（横向排列）
 * 从左到右：普攻、战技、连携技、终结技
 * 
 * 参数说明：
 * - size: 图标整体尺寸（包括圆环和间隙），在 SkillMatrix.jsx 中设置
 * - iconScale: 技能图标相对于内圈的缩放比例（1 = 填满内圈，>1 可以溢出）
 * - gap: 图标之间的间距
 */
export const CharacterSkillIcons = ({
    character,
    selectedSkillId,
    onSelectSkill,
    mainCharId,
    size = 72,
    iconScale = 1.25,
    gap = 8,
}) => {
    if (!character) return null;

    const { id: charId, skills, weaponType, nameEn, element: charElement } = character;
    
    // 技能类型顺序：普攻、战技、连携技、终结技
    const skillOrder = ['basic', 'tactical', 'chain', 'ultimate'];
    
    // 从 SKILLS 数据获取技能的 element，如果没有则使用角色的 element
    const getSkillElement = (skillId) => {
        const skill = SKILLS[skillId];
        if (skill?.element) {
            return skill.element;
        }
        return charElement;
    };

    // 获取技能名称
    const getSkillName = (skillId) => {
        const skill = SKILLS[skillId];
        return skill?.name || '';
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: gap,
    };

    return (
        <div style={containerStyle}>
            {skillOrder.map((skillType) => {
                const skillId = skills?.[skillType];
                if (!skillId) return null;

                const isActive = selectedSkillId === skillId;
                // 只有主控角色可以放置普攻
                const disabled = skillType === 'basic' && mainCharId && charId !== mainCharId;
                const skillName = getSkillName(skillId);

                return (
                    <SkillIcon
                        key={skillType}
                        charId={charId}
                        skillType={skillType}
                        element={getSkillElement(skillId)}
                        weaponType={weaponType}
                        nameEn={nameEn}
                        size={size}
                        iconScale={iconScale}
                        isActive={isActive}
                        disabled={disabled}
                        onClick={() => onSelectSkill(charId, skillId)}
                        title={disabled ? '仅主控角色可放置普攻' : skillName}
                    />
                );
            })}
        </div>
    );
};

export default SkillIcon;

/**
 * Skills Data - 技能数据
 * 
 * 新格式：使用 actions 数组来定义技能行为
 * 
 * 行为类型：
 * - damage: 造成伤害
 * - add_stagger: 增加失衡值
 * - recover_usp_self: 回复自身终结技能量
 * - recover_usp_team: 回复全队终结技能量
 * - recover_atb: 回复技力
 * - add_buff: 添加buff
 * - consume_buff: 消耗buff
 */

export const SKILLS = {
    "chr_0003_endminf_attack": {
        "id": "chr_0003_endminf_attack",
        "name": "毁伤序列",
        "type": "BASIC",
        "duration": 0.5,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0.2,
                "element": "physical",
                "scalingKey": "atk_scale",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        variants: [
            {
                "id": "chr_0003_endminf_attack2",
                "name": "毁伤序列[2]",
                "condition": [{"type": "combo", "value": 2}],
                "duration": 0.6,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.1,
                        "element": "physical",
                        "scalingKey": "atk_scale",
                        "atb": 0,
                        "poise": 0,
                        "index": 1
                    }
                ]
            },
            {
                "id": "chr_0003_endminf_attack3",
                "name": "毁伤序列[3]",
                "condition": [{"type": "combo", "value": 3}],
                "duration": 0.6,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.2,
                        "element": "physical",
                        "scalingKey": "atk_scale",
                        "atb": 0,
                        "poise": 0,
                        "index": 1
                    }
                ]
            },
            {
                "id": "chr_0003_endminf_attack4",
                "name": "毁伤序列[4]",
                "condition": [{"type": "combo", "value": 4}],
                "duration": 1.2,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.2,
                        "element": "physical",
                        "scalingKey": "atk_scale",
                        "atb": 0,
                        "poise": 0,
                        "index": 1
                    },
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.6,
                        "element": "physical",
                        "scalingKey": "atk_scale",
                        "atb": 0,
                        "poise": 0,
                        "index": 1
                    }
                ]
            },
            {
                "id": "chr_0003_endminf_attack5",
                "name": "毁伤序列[重击]",
                "variantType": "heavy",
                "condition": [{"type": "combo", "value": "heavy"}],
                "duration": 1.2,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.6,
                        "element": "physical",
                        "scalingKey": "atk_scale",
                        "atbKey": "atb",
                        "poiseKey": "poise",
                        "index": 1
                    }
                ]
            }
        ],
        "uspGain": 0
    },
    "chr_0003_endminf_normal_skill": {
        "id": "chr_0003_endminf_normal_skill",
        "name": "构成序列",
        "type": "TACTICAL",
        "duration": 0.8,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0.4,
                "element": "physical",
                "atb": 0,
                "poise": 10,
                "index": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0003_endminf_combo_skill": {
        "id": "chr_0003_endminf_combo_skill",
        "name": "锁闭序列",
        "type": "CHAIN",
        "duration": 1.2,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0.8,
                "element": "physical",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0.8,
                "buffId": "status_conduct",
                "stacks": 1,
                "durationKey": "duration",
            }
        ],
        "cooldown": 16,
        "uspGain": 10
    },
    "chr_0003_endminf_ultimate_skill": {
        "id": "chr_0003_endminf_ultimate_skill",
        "name": "轰击序列",
        "type": "ULTIMATE",
        "duration": 1.5,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 25,
                "index": 1
            }
        ],
        "uspCost": 80,
        "uspReply": 0,
        "animationTime": 1.5
    },
    "chr_0004_pelica_attack": {
        "id": "chr_0004_pelica_attack",
        "name": "协议α·突破",
        "type": "BASIC",
        "duration": 3.3,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 15,
                "poise": 15,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0004_pelica_normal_skill": {
        "id": "chr_0004_pelica_normal_skill",
        "name": "协议ω·雷击",
        "type": "TACTICAL",
        "duration": 0.8,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "emag_attach",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0004_pelica_combo_skill": {
        "id": "chr_0004_pelica_combo_skill",
        "name": "即时协议·闪链",
        "type": "CHAIN",
        "duration": 1.2,
        "element": "emag",
        "condition": [{"type": "action_history", "actionType": "cast_skill", "timeWindow": 4, "target": "ally", "params": {"skillType": "BASIC", "variantType": "heavy"}}],
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "status_conduct",
                "stacks": 1,
                "duration": 5
            }
        ],
        "cooldown": 20,
        "uspGain": 10
    },
    "chr_0004_pelica_ultimate_skill": {
        "id": "chr_0004_pelica_ultimate_skill",
        "name": "协议ε·70.41κ",
        "type": "ULTIMATE",
        "duration": 1.6,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 68,
        "uspReply": 0,
        "animationTime": 1.6
    },
    "chr_0005_chen_attack": {
        "id": "chr_0005_chen_attack",
        "name": "破飞霞",
        "type": "BASIC",
        "duration": 3.2,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 3.2,
                "element": "physical",
                "atb": 18,
                "poise": 16,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0005_chen_normal_skill": {
        "id": "chr_0005_chen_normal_skill",
        "name": "归穹宇",
        "type": "TACTICAL",
        "duration": 0.8,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0.4,
                "element": "physical",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0.4,
                "buffId": "knockup",
                "stacks": 2
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0005_chen_combo_skill": {
        "id": "chr_0005_chen_combo_skill",
        "name": "见天河",
        "type": "CHAIN",
        "duration": 0.9,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0.56,
                "element": "physical",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0.56,
                "buffId": "knockup",
                "stacks": 2
            }
        ],
        "cooldown": 16,
        "uspGain": 10
    },
    "chr_0005_chen_ultimate_skill": {
        "id": "chr_0005_chen_ultimate_skill",
        "name": "冽风霜",
        "type": "ULTIMATE",
        "duration": 2,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 59.5,
        "uspReply": 0,
        "animationTime": 1.6
    },
    "chr_0006_wolfgd_attack": {
        "id": "chr_0006_wolfgd_attack",
        "name": "多重连射",
        "type": "BASIC",
        "duration": 4,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 18,
                "poise": 18,
                "index": 1
            }
        ],
        "uspGain": 0,
        "variants": [
            {
                "id": "v_1765344273644",
                "name": "[追击]灼热弹痕",
                "skillType": "normal_skill",
                "duration": 2,
                "uspGain": 6.5,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "blaze",
                        "atb": 0,
                        "poise": 10,
                        "index": 1
                    }
                ]
            }
        ]
    },
    "chr_0006_wolfgd_normal_skill": {
        "id": "chr_0006_wolfgd_normal_skill",
        "name": "灼热弹痕",
        "type": "TACTICAL",
        "duration": 1.2,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 5,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "blaze_attach",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0006_wolfgd_combo_skill": {
        "id": "chr_0006_wolfgd_combo_skill",
        "name": "爆裂手雷·β型",
        "type": "CHAIN",
        "duration": 1.2,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "blaze_attach",
                "stacks": 1
            }
        ],
        "cooldown": 20,
        "uspGain": 10
    },
    "chr_0006_wolfgd_ultimate_skill": {
        "id": "chr_0006_wolfgd_ultimate_skill",
        "name": "狼之怒",
        "type": "ULTIMATE",
        "duration": 1.5,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "burning",
                "stacks": 1
            }
        ],
        "uspCost": 76.5,
        "uspReply": 0,
        "animationTime": 1.5
    },
    "chr_0007_ikut_attack": {
        "id": "chr_0007_ikut_attack",
        "name": "循迹逐猎",
        "type": "BASIC",
        "duration": 3,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 17,
                "poise": 16,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0007_ikut_normal_skill": {
        "id": "chr_0007_ikut_normal_skill",
        "name": "疾风迅雷",
        "type": "TACTICAL",
        "duration": 1,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 10,
                "index": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5,
        "variants": [
            {
                "id": "v_1767273184428",
                "name": "[追加攻击]疾风迅雷",
                "skillType": "normal_skill",
                "duration": 1,
                "uspGain": 6.5,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "emag",
                        "atb": 0,
                        "poise": 10,
                        "index": 1
                    },
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.5,
                        "element": "emag",
                        "atb": 30,
                        "poise": 10,
                        "index": 2
                    }
                ]
            }
        ]
    },
    "chr_0007_ikut_combo_skill": {
        "id": "chr_0007_ikut_combo_skill",
        "name": "鸣雷",
        "type": "CHAIN",
        "duration": 1,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 5,
                "index": 1
            }
        ],
        "cooldown": 3,
        "uspGain": 5
    },
    "chr_0007_ikut_ultimate_skill": {
        "id": "chr_0007_ikut_ultimate_skill",
        "name": "轰雷掣电",
        "type": "ULTIMATE",
        "duration": 1.9,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 2.1,
                "buffId": "emag_attach",
                "stacks": 1,
                "duration": 1.9
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 4,
                "buffId": "conductive",
                "stacks": 1
            }
        ],
        "uspCost": 76.5,
        "uspReply": 0,
        "animationTime": 1.9
    },
    "chr_0009_azrila_attack": {
        "id": "chr_0009_azrila_attack",
        "name": "陷阵剑术",
        "type": "BASIC",
        "duration": 4.2,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 28,
                "poise": 25,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0009_azrila_normal_skill": {
        "id": "chr_0009_azrila_normal_skill",
        "name": "进军",
        "type": "TACTICAL",
        "duration": 2,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "knockdown",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0009_azrila_combo_skill": {
        "id": "chr_0009_azrila_combo_skill",
        "name": "前线援护",
        "type": "CHAIN",
        "duration": 1.1,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "knockdown",
                "stacks": 1
            }
        ],
        "cooldown": 19,
        "uspGain": 10
    },
    "chr_0009_azrila_ultimate_skill": {
        "id": "chr_0009_azrila_ultimate_skill",
        "name": "重燃誓约",
        "type": "ULTIMATE",
        "duration": 1.7,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 100,
        "uspReply": 0,
        "animationTime": 1.7
    },
    "chr_0011_seraph_attack": {
        "id": "chr_0011_seraph_attack",
        "name": "冷却",
        "type": "BASIC",
        "duration": 3.3,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 15,
                "poise": 15,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0011_seraph_normal_skill": {
        "id": "chr_0011_seraph_normal_skill",
        "name": "分布式拒绝服务",
        "type": "TACTICAL",
        "duration": 0.5,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0011_seraph_combo_skill": {
        "id": "chr_0011_seraph_combo_skill",
        "name": "压力测试",
        "type": "CHAIN",
        "duration": 1.2,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "cold_attach",
                "stacks": 1
            }
        ],
        "cooldown": 8,
        "uspGain": 10
    },
    "chr_0011_seraph_ultimate_skill": {
        "id": "chr_0011_seraph_ultimate_skill",
        "name": "栈溢出",
        "type": "ULTIMATE",
        "duration": 1.5,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 72,
        "uspReply": 0,
        "animationTime": 1.5
    },
    "chr_0012_avywen_attack": {
        "id": "chr_0012_avywen_attack",
        "name": "雷枪·疾袭",
        "type": "BASIC",
        "duration": 3.2,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 19,
                "poise": 17,
                "index": 1
            }
        ],
        "uspGain": 0,
        "variants": [
            {
                "id": "v_1767273720814",
                "name": "战技-回收雷枪",
                "skillType": "normal_skill",
                "duration": 0.5,
                "uspGain": 6.5,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "emag",
                        "atb": 0,
                        "poise": 30,
                        "index": 1
                    }
                ]
            }
        ]
    },
    "chr_0012_avywen_normal_skill": {
        "id": "chr_0012_avywen_normal_skill",
        "name": "雷枪·截回",
        "type": "TACTICAL",
        "duration": 0.5,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 30,
                "index": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0012_avywen_combo_skill": {
        "id": "chr_0012_avywen_combo_skill",
        "name": "雷枪·掣击",
        "type": "CHAIN",
        "duration": 2.5,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "Thunderlances",
                "stacks": 3
            }
        ],
        "cooldown": 13,
        "uspGain": 10
    },
    "chr_0012_avywen_ultimate_skill": {
        "id": "chr_0012_avywen_ultimate_skill",
        "name": "雷枪·决颤",
        "type": "ULTIMATE",
        "duration": 1.5,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "Thunderlances EX",
                "stacks": 1
            }
        ],
        "uspCost": 85,
        "uspReply": 0,
        "animationTime": 1.5
    },
    "chr_0013_aglina_attack": {
        "id": "chr_0013_aglina_attack",
        "name": "秘杖·束能技艺",
        "type": "BASIC",
        "duration": 3.5,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "nature",
                "atb": 16,
                "poise": 16,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0013_aglina_normal_skill": {
        "id": "chr_0013_aglina_normal_skill",
        "name": "秘杖·引力模式",
        "type": "TACTICAL",
        "duration": 4,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "nature",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "nature_attach",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0013_aglina_combo_skill": {
        "id": "chr_0013_aglina_combo_skill",
        "name": "秘杖·矩阵位移",
        "type": "CHAIN",
        "duration": 2,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "nature",
                "atb": 0,
                "poise": 5,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "knockup",
                "stacks": 2
            }
        ],
        "cooldown": 20,
        "uspGain": 10
    },
    "chr_0013_aglina_ultimate_skill": {
        "id": "chr_0013_aglina_ultimate_skill",
        "name": "秘杖·重力场",
        "type": "ULTIMATE",
        "duration": 0.5,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "nature",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "affix_slow",
                "stacks": 1,
                "duration": 5
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "spell_vulnerable",
                "stacks": 1,
                "duration": 5
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "nature_attach",
                "stacks": 1
            }
        ],
        "uspCost": 90,
        "uspReply": 0,
        "animationTime": 0.5
    },
    "chr_0014_aurora_attack": {
        "id": "chr_0014_aurora_attack",
        "name": "失温猛击",
        "type": "BASIC",
        "duration": 3.8,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 25,
                "poise": 23,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0014_aurora_normal_skill": {
        "id": "chr_0014_aurora_normal_skill",
        "name": "饱和性防御",
        "type": "TACTICAL",
        "duration": 0.5,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 35,
                "poise": 20,
                "index": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0014_aurora_combo_skill": {
        "id": "chr_0014_aurora_combo_skill",
        "name": "极地救援",
        "type": "CHAIN",
        "duration": 1,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "cooldown": 25,
        "uspGain": 10
    },
    "chr_0014_aurora_ultimate_skill": {
        "id": "chr_0014_aurora_ultimate_skill",
        "name": "凛冽寒霜",
        "type": "ULTIMATE",
        "duration": 2,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "frozen",
                "stacks": 1
            }
        ],
        "uspCost": 80,
        "uspReply": 0,
        "animationTime": 2
    },
    "chr_0015_lifeng_attack": {
        "id": "chr_0015_lifeng_attack",
        "name": "摧破",
        "type": "BASIC",
        "duration": 3.2,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 3.2,
                "element": "physical",
                "atb": 21,
                "poise": 19,
                "index": 1
            }
        ],
        "uspGain": 0,
        "variants": [
            {
                "id": "v_1765344650632",
                "name": "强化大招",
                "skillType": "ultimate",
                "duration": 1.9,
                "uspGain": 0,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "physical",
                        "atb": 0,
                        "poise": 5,
                        "index": 1
                    },
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 2,
                        "element": "physical",
                        "atb": 0,
                        "poise": 5,
                        "index": 2
                    },
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 3.9,
                        "element": "physical",
                        "atb": 0,
                        "poise": 5,
                        "index": 3
                    }
                ]
            }
        ]
    },
    "chr_0015_lifeng_normal_skill": {
        "id": "chr_0015_lifeng_normal_skill",
        "name": "荡浊身",
        "type": "TACTICAL",
        "duration": 2.2,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 1.9,
                "element": "physical",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 1.9,
                "buffId": "knockdown",
                "stacks": 2
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 1.9,
                "buffId": "physical_vulnerable",
                "stacks": 1,
                "duration": 10
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0015_lifeng_combo_skill": {
        "id": "chr_0015_lifeng_combo_skill",
        "name": "忿怒相",
        "type": "CHAIN",
        "duration": 2,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 1.6,
                "element": "physical",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 1.6,
                "buffId": "combo",
                "stacks": 1,
                "duration": 20
            }
        ],
        "cooldown": 16,
        "uspGain": 10
    },
    "chr_0015_lifeng_ultimate_skill": {
        "id": "chr_0015_lifeng_ultimate_skill",
        "name": "不动心",
        "type": "ULTIMATE",
        "duration": 1.9,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 5,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "knockdown",
                "stacks": 1,
                "duration": 2,
                "hideDuration": true
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "knockdown",
                "stacks": 1,
                "duration": 1.9,
                "hideDuration": true
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 2,
                "element": "physical",
                "atb": 0,
                "poise": 5,
                "index": 2
            }
        ],
        "uspCost": 90,
        "uspReply": 0,
        "animationTime": 1.9
    },
    "chr_0016_laevat_attack": {
        "id": "chr_0016_laevat_attack",
        "name": "燃烬",
        "type": "BASIC",
        "duration": 3.3,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 20,
                "poise": 18,
                "index": 1
            }
        ],
        "uspGain": 0,
        "variants": [
            {
                "id": "v_1765344039364",
                "name": "强化重击",
                "skillType": "attack",
                "duration": 3.3,
                "uspGain": 0,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "blaze",
                        "atb": 22,
                        "poise": 24,
                        "index": 1
                    }
                ]
            },
            {
                "id": "v_1765344082644",
                "name": "强化战技",
                "skillType": "normal_skill",
                "duration": 1.9,
                "uspGain": 106.5,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "blaze",
                        "atb": 0,
                        "poise": 20,
                        "index": 1
                    }
                ]
            },
            {
                "id": "v_1767269025680",
                "name": "大招内战技",
                "skillType": "normal_skill",
                "duration": 1.9,
                "uspGain": 0,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "blaze",
                        "atb": 0,
                        "poise": 10,
                        "index": 1
                    }
                ]
            },
            {
                "id": "v_1765344189692",
                "name": "大招内强化战技",
                "skillType": "normal_skill",
                "duration": 1.9,
                "uspGain": 0,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "blaze",
                        "atb": 0,
                        "poise": 30,
                        "index": 1
                    }
                ]
            }
        ]
    },
    "chr_0016_laevat_normal_skill": {
        "id": "chr_0016_laevat_normal_skill",
        "name": "焚灭",
        "type": "TACTICAL",
        "duration": 1,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "magma_1",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 0
    },
    "chr_0016_laevat_combo_skill": {
        "id": "chr_0016_laevat_combo_skill",
        "name": "沸腾",
        "type": "CHAIN",
        "duration": 1.7,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "magma_1",
                "stacks": 1
            }
        ],
        "cooldown": 10,
        "uspGain": 30
    },
    "chr_0016_laevat_ultimate_skill": {
        "id": "chr_0016_laevat_ultimate_skill",
        "name": "黄昏",
        "type": "ULTIMATE",
        "duration": 2,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "magma_1",
                "stacks": 1,
                "duration": 3.5
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "magma_2",
                "stacks": 1,
                "duration": 3.5
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "magma_3",
                "stacks": 1,
                "duration": 3.5
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "magma_4",
                "stacks": 1
            }
        ],
        "uspCost": 300,
        "uspReply": 0,
        "animationTime": 2
    },
    "chr_0017_yvonne_attack": {
        "id": "chr_0017_yvonne_attack",
        "name": "雀跃扳机",
        "type": "BASIC",
        "duration": 3.7,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 17,
                "poise": 17,
                "index": 1
            }
        ],
        "uspGain": 0,
        "variants": [
            {
                "id": "v_1765344226962",
                "name": "强化战技",
                "skillType": "normal_skill",
                "duration": 1,
                "uspGain": 6.5,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "cold",
                        "atb": 0,
                        "poise": 10,
                        "index": 1
                    }
                ]
            }
        ]
    },
    "chr_0017_yvonne_normal_skill": {
        "id": "chr_0017_yvonne_normal_skill",
        "name": "冰冰弹·β型",
        "type": "TACTICAL",
        "duration": 1.3,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "cold_attach",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0017_yvonne_combo_skill": {
        "id": "chr_0017_yvonne_combo_skill",
        "name": "速冻仔·υ37",
        "type": "CHAIN",
        "duration": 1.1,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "cold_attach",
                "stacks": 1
            }
        ],
        "cooldown": 22,
        "uspGain": 10
    },
    "chr_0017_yvonne_ultimate_skill": {
        "id": "chr_0017_yvonne_ultimate_skill",
        "name": "冷冻射手",
        "type": "ULTIMATE",
        "duration": 2,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "cold_attach",
                "stacks": 1
            }
        ],
        "uspCost": 200,
        "uspReply": 0,
        "animationTime": 2
    },
    "chr_0018_dapan_attack": {
        "id": "chr_0018_dapan_attack",
        "name": "滚刀切！",
        "type": "BASIC",
        "duration": 3.5,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 3.5,
                "element": "physical",
                "atb": 21,
                "poise": 20,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0018_dapan_normal_skill": {
        "id": "chr_0018_dapan_normal_skill",
        "name": "颠勺！",
        "type": "TACTICAL",
        "duration": 1.8,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 1.5,
                "element": "physical",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 1.5,
                "buffId": "knockup",
                "stacks": 2
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0018_dapan_combo_skill": {
        "id": "chr_0018_dapan_combo_skill",
        "name": "加料！",
        "type": "CHAIN",
        "duration": 2.1,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 1.76,
                "element": "physical",
                "atb": 0,
                "poise": 15,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 1.76,
                "buffId": "poise",
                "stacks": 4
            }
        ],
        "cooldown": 20,
        "uspGain": 10
    },
    "chr_0018_dapan_ultimate_skill": {
        "id": "chr_0018_dapan_ultimate_skill",
        "name": "切丝入锅！",
        "type": "ULTIMATE",
        "duration": 3,
        "element": "physical",
        "actions": [
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "dapan_buff",
                "stacks": 1
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 1.5,
                "element": "physical",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 1.5,
                "buffId": "knockup",
                "stacks": 1,
                "duration": 1.1
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 2.7,
                "element": "physical",
                "atb": 0,
                "poise": 0,
                "index": 2
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 2.7,
                "buffId": "knockdown",
                "stacks": 2
            }
        ],
        "uspCost": 76.5,
        "uspReply": 0,
        "animationTime": 1.5
    },
    "chr_0019_karin_attack": {
        "id": "chr_0019_karin_attack",
        "name": "进取剑锋",
        "type": "BASIC",
        "duration": 2.5,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 19,
                "poise": 17,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0019_karin_normal_skill": {
        "id": "chr_0019_karin_normal_skill",
        "name": "热情迸发",
        "type": "TACTICAL",
        "duration": 2,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "blaze_attach",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0019_karin_combo_skill": {
        "id": "chr_0019_karin_combo_skill",
        "name": "快闪冲击",
        "type": "CHAIN",
        "duration": 1.5,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 10,
                "index": 1
            }
        ],
        "cooldown": 15,
        "uspGain": 10
    },
    "chr_0019_karin_ultimate_skill": {
        "id": "chr_0019_karin_ultimate_skill",
        "name": "小队，集结！",
        "type": "ULTIMATE",
        "duration": 3,
        "element": "blaze",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "blaze",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 90,
        "uspReply": 0,
        "animationTime": 1.7
    },
    "chr_0020_meurs_attack": {
        "id": "chr_0020_meurs_attack",
        "name": "基础战术",
        "type": "BASIC",
        "duration": 2.5,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 25,
                "poise": 22,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0020_meurs_normal_skill": {
        "id": "chr_0020_meurs_normal_skill",
        "name": "刚性阻击",
        "type": "TACTICAL",
        "duration": 2,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 20,
                "index": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0020_meurs_combo_skill": {
        "id": "chr_0020_meurs_combo_skill",
        "name": "即时压制",
        "type": "CHAIN",
        "duration": 1.5,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 10,
                "index": 1
            }
        ],
        "cooldown": 15,
        "uspGain": 10
    },
    "chr_0020_meurs_ultimate_skill": {
        "id": "chr_0020_meurs_ultimate_skill",
        "name": "教科书式猛攻",
        "type": "ULTIMATE",
        "duration": 3,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 72,
        "uspReply": 0,
        "animationTime": 1.3
    },
    "chr_0021_whiten_attack": {
        "id": "chr_0021_whiten_attack",
        "name": "噪点",
        "type": "BASIC",
        "duration": 2.5,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 19,
                "poise": 17,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0021_whiten_normal_skill": {
        "id": "chr_0021_whiten_normal_skill",
        "name": "凝声",
        "type": "TACTICAL",
        "duration": 2,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "cold_attach",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0021_whiten_combo_skill": {
        "id": "chr_0021_whiten_combo_skill",
        "name": "失真",
        "type": "CHAIN",
        "duration": 1.5,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "knockup",
                "stacks": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "ice_shatter",
                "stacks": 1
            }
        ],
        "cooldown": 15,
        "uspGain": 10
    },
    "chr_0021_whiten_ultimate_skill": {
        "id": "chr_0021_whiten_ultimate_skill",
        "name": "震音",
        "type": "ULTIMATE",
        "duration": 3,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 63,
        "uspReply": 0,
        "animationTime": 1.8
    },
    "chr_0022_bounda_attack": {
        "id": "chr_0022_bounda_attack",
        "name": "独门射击法",
        "type": "BASIC",
        "duration": 2.5,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "nature",
                "atb": 15,
                "poise": 15,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0022_bounda_normal_skill": {
        "id": "chr_0022_bounda_normal_skill",
        "name": "小惊喜",
        "type": "TACTICAL",
        "duration": 2,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "nature",
                "atb": 0,
                "poise": 10,
                "index": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0022_bounda_combo_skill": {
        "id": "chr_0022_bounda_combo_skill",
        "name": "免费赠礼",
        "type": "CHAIN",
        "duration": 1.5,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "nature",
                "atb": 0,
                "poise": 10,
                "index": 1
            }
        ],
        "cooldown": 25,
        "uspGain": 10
    },
    "chr_0022_bounda_ultimate_skill": {
        "id": "chr_0022_bounda_ultimate_skill",
        "name": "巅峰闹剧",
        "type": "ULTIMATE",
        "duration": 3,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "nature",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 72,
        "uspReply": 0,
        "animationTime": 0.5
    },
    "chr_0023_antal_attack": {
        "id": "chr_0023_antal_attack",
        "name": "交换电流",
        "type": "BASIC",
        "duration": 2.5,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 15,
                "poise": 15,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0023_antal_normal_skill": {
        "id": "chr_0023_antal_normal_skill",
        "name": "指定研究对象",
        "type": "TACTICAL",
        "duration": 2,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 2,
                "buffId": "antal_buff",
                "stacks": 1,
                "duration": 60
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0023_antal_combo_skill": {
        "id": "chr_0023_antal_combo_skill",
        "name": "磁暴试验场",
        "type": "CHAIN",
        "duration": 1.5,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 10,
                "index": 1
            }
        ],
        "cooldown": 15,
        "uspGain": 10
    },
    "chr_0023_antal_ultimate_skill": {
        "id": "chr_0023_antal_ultimate_skill",
        "name": "超频时刻",
        "type": "ULTIMATE",
        "duration": 1.4,
        "element": "emag",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "emag",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 1.4,
                "buffId": "pulse_enhance",
                "stacks": 1,
                "duration": 12
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 1.4,
                "buffId": "fire_enhance",
                "stacks": 1,
                "duration": 12
            }
        ],
        "uspCost": 90,
        "uspReply": 0,
        "animationTime": 1.4
    },
    "chr_0024_deepfin_attack": {
        "id": "chr_0024_deepfin_attack",
        "name": "基本挥竿法",
        "type": "BASIC",
        "duration": 3.2,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 19,
                "poise": 17,
                "index": 1
            }
        ],
        "uspGain": 0,
        "variants": [
            {
                "id": "v_1767274880488",
                "name": "强化战技",
                "skillType": "normal_skill",
                "duration": 1.3,
                "uspGain": 17,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0,
                        "element": "cold",
                        "atb": 30,
                        "poise": 10,
                        "index": 1
                    }
                ]
            }
        ]
    },
    "chr_0024_deepfin_normal_skill": {
        "id": "chr_0024_deepfin_normal_skill",
        "name": "非常规路亚",
        "type": "TACTICAL",
        "duration": 1.3,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 30,
                "poise": 10,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "frozen",
                "stacks": 1,
                "duration": 5
            }
        ],
        "atbCost": 100,
        "uspGain": 17
    },
    "chr_0024_deepfin_combo_skill": {
        "id": "chr_0024_deepfin_combo_skill",
        "name": "凿孔底钓术",
        "type": "CHAIN",
        "duration": 1.5,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 10,
                "poise": 10,
                "index": 1
            }
        ],
        "cooldown": 9,
        "uspGain": 10
    },
    "chr_0024_deepfin_ultimate_skill": {
        "id": "chr_0024_deepfin_ultimate_skill",
        "name": "大鳞，上钩！",
        "type": "ULTIMATE",
        "duration": 1.6,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 30,
                "poise": 0,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "cold_attach",
                "stacks": 1
            }
        ],
        "uspCost": 85,
        "uspReply": 0,
        "animationTime": 1.6
    },
    "chr_0025_ardelia_attack": {
        "id": "chr_0025_ardelia_attack",
        "name": "岩石的轻语",
        "type": "BASIC",
        "duration": 4.3,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 4.3,
                "element": "nature",
                "atb": 18,
                "poise": 18,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0025_ardelia_normal_skill": {
        "id": "chr_0025_ardelia_normal_skill",
        "name": "奔腾的多利",
        "type": "TACTICAL",
        "duration": 1.3,
        "element": "nature",
        "actions": [
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "spell_vulnerable",
                "stacks": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "physical_vulnerable",
                "stacks": 1
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 1.3,
                "element": "nature",
                "atb": 0,
                "poise": 10,
                "index": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0025_ardelia_combo_skill": {
        "id": "chr_0025_ardelia_combo_skill",
        "name": "火山蘑菇云",
        "type": "CHAIN",
        "duration": 1.2,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0.8,
                "element": "nature",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 2.6,
                "element": "nature",
                "atb": 0,
                "poise": 10,
                "index": 2
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 2.6,
                "buffId": "corrosion",
                "stacks": 1,
                "duration": 10
            }
        ],
        "cooldown": 18,
        "uspGain": 10
    },
    "chr_0025_ardelia_ultimate_skill": {
        "id": "chr_0025_ardelia_ultimate_skill",
        "name": "毛茸茸派对",
        "type": "ULTIMATE",
        "duration": 2.7,
        "element": "nature",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "nature",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 90,
        "uspReply": 0,
        "animationTime": 2.7
    },
    "chr_0026_lastrite_attack": {
        "id": "chr_0026_lastrite_attack",
        "name": "严霜之舞",
        "type": "BASIC",
        "duration": 4.3,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 20,
                "poise": 25,
                "index": 1
            }
        ],
        "uspGain": 0
    },
    "chr_0026_lastrite_normal_skill": {
        "id": "chr_0026_lastrite_normal_skill",
        "name": "塞什卡的秘传",
        "type": "TACTICAL",
        "duration": 0.5,
        "element": "cold",
        "actions": [
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "lastrite_buff",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 16
    },
    "chr_0026_lastrite_combo_skill": {
        "id": "chr_0026_lastrite_combo_skill",
        "name": "噬冬",
        "type": "CHAIN",
        "duration": 0.8,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 15,
                "index": 1
            }
        ],
        "cooldown": 9,
        "uspGain": 85
    },
    "chr_0026_lastrite_ultimate_skill": {
        "id": "chr_0026_lastrite_ultimate_skill",
        "name": "临终别礼",
        "type": "ULTIMATE",
        "duration": 2.9,
        "element": "cold",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "cold",
                "atb": 0,
                "poise": 0,
                "index": 1
            }
        ],
        "uspCost": 240,
        "uspReply": 0,
        "animationTime": 2.9
    },
    "chr_0029_pograni_attack": {
        "id": "chr_0029_pograni_attack",
        "name": "全面攻势",
        "type": "BASIC",
        "duration": 3.3,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 3.3,
                "element": "physical",
                "atb": 20,
                "poise": 18,
                "index": 1
            }
        ],
        "uspGain": 0,
        "variants": [
            {
                "id": "v_1765344369190",
                "name": "连携1",
                "condition": [
                    {
                        "type": "combo",
                        "value": 1
                    }
                ],
                "skillType": "combo",
                "duration": 0.8,
                "uspGain": 10,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.76,
                        "element": "physical",
                        "atb": 5,
                        "poise": 3,
                        "index": 1
                    }
                ]
            },
            {
                "id": "v_1765344406616",
                "name": "连携2",
                "condition": [
                    {
                        "type": "combo",
                        "value": 2
                    }
                ],
                "skillType": "combo",
                "duration": 1.4,
                "uspGain": 10,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.76,
                        "element": "physical",
                        "atb": 5,
                        "poise": 3,
                        "index": 1
                    },
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 1.38,
                        "element": "physical",
                        "atb": 7,
                        "poise": 4,
                        "index": 2
                    }
                ]
            },
            {
                "id": "v_1765344414601",
                "name": "连携3",
                "condition": [
                    {
                        "type": "combo",
                        "value": 3
                    }
                ],
                "skillType": "combo",
                "duration": 2.4,
                "uspGain": 10,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.76,
                        "element": "physical",
                        "atb": 5,
                        "poise": 3,
                        "index": 1
                    },
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 1.38,
                        "element": "physical",
                        "atb": 7,
                        "poise": 4,
                        "index": 2
                    },
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 2.3,
                        "element": "physical",
                        "atb": 13,
                        "poise": 9,
                        "index": 3
                    }
                ]
            },
            {
                "id": "v_1766424867630",
                "name": "连携4",
                "condition": [
                    {
                        "type": "combo",
                        "value": 4
                    }
                ],
                "skillType": "combo",
                "duration": 2.4,
                "uspGain": 10,
                "actions": [
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 0.76,
                        "element": "physical",
                        "atb": 5,
                        "poise": 3,
                        "index": 1
                    },
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 1.38,
                        "element": "physical",
                        "atb": 7,
                        "poise": 4,
                        "index": 2
                    },
                    {
                        "type": "damage",
                        "target": "enemy",
                        "offset": 2.3,
                        "element": "physical",
                        "atb": 23,
                        "poise": 9,
                        "index": 3
                    }
                ]
            }
        ]
    },
    "chr_0029_pograni_normal_skill": {
        "id": "chr_0029_pograni_normal_skill",
        "name": "粉碎阵线",
        "type": "TACTICAL",
        "duration": 1.7,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 1.4,
                "element": "physical",
                "atb": 5,
                "poise": 5,
                "index": 1
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 1.4,
                "buffId": "armor_break",
                "stacks": 1
            }
        ],
        "atbCost": 100,
        "uspGain": 6.5
    },
    "chr_0029_pograni_combo_skill": {
        "id": "chr_0029_pograni_combo_skill",
        "name": "盈月邀击",
        "type": "CHAIN",
        "duration": 2.7,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0.76,
                "element": "physical",
                "atb": 5,
                "poise": 3,
                "index": 1
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 1.38,
                "element": "physical",
                "atb": 7,
                "poise": 4,
                "index": 2
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 2.3,
                "element": "physical",
                "atb": 13,
                "poise": 9,
                "index": 3
            }
        ],
        "cooldown": 18,
        "uspGain": 10
    },
    "chr_0029_pograni_ultimate_skill": {
        "id": "chr_0029_pograni_ultimate_skill",
        "name": "盾卫旗队，上前",
        "type": "ULTIMATE",
        "duration": 2.5,
        "element": "physical",
        "actions": [
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 0,
                "index": 1
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 0,
                "index": 2
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 0,
                "index": 3
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 0,
                "index": 4
            },
            {
                "type": "damage",
                "target": "enemy",
                "offset": 0,
                "element": "physical",
                "atb": 0,
                "poise": 0,
                "index": 5
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "pograni_buff",
                "stacks": 5
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "pograni_buff",
                "stacks": 4
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "pograni_buff",
                "stacks": 3
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "pograni_buff",
                "stacks": 2
            },
            {
                "type": "add_buff",
                "target": "enemy",
                "offset": 0,
                "buffId": "pograni_buff",
                "stacks": 1
            }
        ],
        "uspCost": 90,
        "uspReply": 0,
        "animationTime": 2.5
    }
};

// 技能类型配置
export const SKILL_TYPES = {
    'BASIC': {
        name: '普通攻击',
        color: 'bg-slate-600',
        icon: 'Swords'
    },
    'TACTICAL': {
        name: '战技',
        color: 'bg-blue-600',
        icon: 'Zap'
    },
    'CHAIN': {
        name: '连携技',
        color: 'bg-purple-600',
        icon: 'Hexagon'
    },
    'ULTIMATE': {
        name: '终结技',
        color: 'bg-amber-600',
        icon: 'Sparkles'
    }
};

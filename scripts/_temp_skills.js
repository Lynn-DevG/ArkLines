module.exports = {
    "chr_0003_endminf_attack": {
        "id": "chr_0003_endminf_attack",
        "name": "毁伤序列",
        "type": "BASIC",
        "duration": 3.7,
        "damage_ticks": [
            {
                "offset": 3.7,
                "atb": 20,
                "poise": 18
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "physical"
    },
    "chr_0003_endminf_normal_skill": {
        "id": "chr_0003_endminf_normal_skill",
        "name": "构成序列",
        "type": "TACTICAL",
        "duration": 0.8,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0.4,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "poise",
                    "stacks": 2,
                    "duration": 0,
                    "offset": 0.4
                }
            ]
        ],
        "element": "physical"
    },
    "chr_0003_endminf_combo_skill": {
        "id": "chr_0003_endminf_combo_skill",
        "name": "锁闭序列",
        "type": "CHAIN",
        "duration": 1.2,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 16,
        "damage_ticks": [
            {
                "offset": 0.8,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "endmin_debuff",
                    "stacks": 1,
                    "duration": 4,
                    "offset": 0.8
                }
            ]
        ],
        "element": "physical"
    },
    "chr_0003_endminf_ultimate_skill": {
        "id": "chr_0003_endminf_ultimate_skill",
        "name": "轰击序列",
        "type": "ULTIMATE",
        "duration": 1.5,
        "uspCost": 80,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 25
            }
        ],
        "anomalies": [],
        "element": "physical",
        "animationTime": 1.5
    },
    "chr_0004_pelica_attack": {
        "id": "chr_0004_pelica_attack",
        "name": "协议α·突破",
        "type": "BASIC",
        "duration": 3.3,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 15,
                "poise": 15
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "emag"
    },
    "chr_0004_pelica_normal_skill": {
        "id": "chr_0004_pelica_normal_skill",
        "name": "协议ω·雷击",
        "type": "TACTICAL",
        "duration": 0.8,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "emag_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "emag"
    },
    "chr_0004_pelica_combo_skill": {
        "id": "chr_0004_pelica_combo_skill",
        "name": "即时协议·闪链",
        "type": "CHAIN",
        "duration": 1.2,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 20,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "status_conduct",
                    "stacks": 1,
                    "duration": 5,
                    "offset": 0
                }
            ]
        ],
        "element": "emag"
    },
    "chr_0004_pelica_ultimate_skill": {
        "id": "chr_0004_pelica_ultimate_skill",
        "name": "协议ε·70.41κ",
        "type": "ULTIMATE",
        "duration": 1.6,
        "uspCost": 68,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "emag",
        "animationTime": 1.6
    },
    "chr_0005_chen_attack": {
        "id": "chr_0005_chen_attack",
        "name": "破飞霞",
        "type": "BASIC",
        "duration": 3.2,
        "damage_ticks": [
            {
                "offset": 3.2,
                "atb": 18,
                "poise": 16
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "physical"
    },
    "chr_0005_chen_normal_skill": {
        "id": "chr_0005_chen_normal_skill",
        "name": "归穹宇",
        "type": "TACTICAL",
        "duration": 0.8,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0.4,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockup",
                    "stacks": 2,
                    "duration": 0,
                    "offset": 0.4
                }
            ]
        ],
        "element": "physical"
    },
    "chr_0005_chen_combo_skill": {
        "id": "chr_0005_chen_combo_skill",
        "name": "见天河",
        "type": "CHAIN",
        "duration": 0.9,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 16,
        "damage_ticks": [
            {
                "offset": 0.56,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockup",
                    "stacks": 2,
                    "duration": 0,
                    "offset": 0.56
                }
            ]
        ],
        "element": "physical"
    },
    "chr_0005_chen_ultimate_skill": {
        "id": "chr_0005_chen_ultimate_skill",
        "name": "冽风霜",
        "type": "ULTIMATE",
        "duration": 2,
        "uspCost": 59.5,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "physical",
        "animationTime": 1.6
    },
    "chr_0006_wolfgd_attack": {
        "id": "chr_0006_wolfgd_attack",
        "name": "多重连射",
        "type": "BASIC",
        "duration": 4,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 18,
                "poise": 18
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "blaze",
        "variants": [
            {
                "id": "v_1765344273644",
                "name": "[追击]灼热弹痕",
                "type": "normal_skill",
                "duration": 2,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 0,
                        "poise": 10
                    }
                ],
                "uspGain": 6.5,
                "condition": null
            }
        ]
    },
    "chr_0006_wolfgd_normal_skill": {
        "id": "chr_0006_wolfgd_normal_skill",
        "name": "灼热弹痕",
        "type": "TACTICAL",
        "duration": 1.2,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 5
            }
        ],
        "anomalies": [
            [
                {
                    "type": "blaze_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "blaze"
    },
    "chr_0006_wolfgd_combo_skill": {
        "id": "chr_0006_wolfgd_combo_skill",
        "name": "爆裂手雷·β型",
        "type": "CHAIN",
        "duration": 1.2,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 20,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "blaze_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "blaze"
    },
    "chr_0006_wolfgd_ultimate_skill": {
        "id": "chr_0006_wolfgd_ultimate_skill",
        "name": "狼之怒",
        "type": "ULTIMATE",
        "duration": 1.5,
        "uspCost": 76.5,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "burning",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "blaze",
        "animationTime": 1.5
    },
    "chr_0007_ikut_attack": {
        "id": "chr_0007_ikut_attack",
        "name": "循迹逐猎",
        "type": "BASIC",
        "duration": 3,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 17,
                "poise": 16
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "emag"
    },
    "chr_0007_ikut_normal_skill": {
        "id": "chr_0007_ikut_normal_skill",
        "name": "疾风迅雷",
        "type": "TACTICAL",
        "duration": 1,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [],
        "element": "emag",
        "variants": [
            {
                "id": "v_1767273184428",
                "name": "[追加攻击]疾风迅雷",
                "type": "normal_skill",
                "duration": 1,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 0,
                        "poise": 10
                    },
                    {
                        "offset": 0.5,
                        "atb": 30,
                        "poise": 10
                    }
                ],
                "uspGain": 6.5,
                "condition": null
            }
        ]
    },
    "chr_0007_ikut_combo_skill": {
        "id": "chr_0007_ikut_combo_skill",
        "name": "鸣雷",
        "type": "CHAIN",
        "duration": 1,
        "atbCost": 0,
        "uspGain": 5,
        "cooldown": 3,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 5
            }
        ],
        "anomalies": [],
        "element": "emag"
    },
    "chr_0007_ikut_ultimate_skill": {
        "id": "chr_0007_ikut_ultimate_skill",
        "name": "轰雷掣电",
        "type": "ULTIMATE",
        "duration": 1.9,
        "uspCost": 76.5,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "emag_attach",
                    "stacks": 1,
                    "duration": 1.9,
                    "offset": 2.1
                },
                {
                    "type": "conductive",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 4
                }
            ]
        ],
        "element": "emag",
        "animationTime": 1.9
    },
    "chr_0009_azrila_attack": {
        "id": "chr_0009_azrila_attack",
        "name": "陷阵剑术",
        "type": "BASIC",
        "duration": 4.2,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 28,
                "poise": 25
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "blaze"
    },
    "chr_0009_azrila_normal_skill": {
        "id": "chr_0009_azrila_normal_skill",
        "name": "进军",
        "type": "TACTICAL",
        "duration": 2,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockdown",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "blaze"
    },
    "chr_0009_azrila_combo_skill": {
        "id": "chr_0009_azrila_combo_skill",
        "name": "前线援护",
        "type": "CHAIN",
        "duration": 1.1,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 19,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockdown",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "blaze"
    },
    "chr_0009_azrila_ultimate_skill": {
        "id": "chr_0009_azrila_ultimate_skill",
        "name": "重燃誓约",
        "type": "ULTIMATE",
        "duration": 1.7,
        "uspCost": 100,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "blaze",
        "animationTime": 1.7
    },
    "chr_0011_seraph_attack": {
        "id": "chr_0011_seraph_attack",
        "name": "冷却",
        "type": "BASIC",
        "duration": 3.3,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 15,
                "poise": 15
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "cold"
    },
    "chr_0011_seraph_normal_skill": {
        "id": "chr_0011_seraph_normal_skill",
        "name": "分布式拒绝服务",
        "type": "TACTICAL",
        "duration": 0.5,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "cold"
    },
    "chr_0011_seraph_combo_skill": {
        "id": "chr_0011_seraph_combo_skill",
        "name": "压力测试",
        "type": "CHAIN",
        "duration": 1.2,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 8,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "cold_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "cold"
    },
    "chr_0011_seraph_ultimate_skill": {
        "id": "chr_0011_seraph_ultimate_skill",
        "name": "栈溢出",
        "type": "ULTIMATE",
        "duration": 1.5,
        "uspCost": 72,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "cold",
        "animationTime": 1.5
    },
    "chr_0012_avywen_attack": {
        "id": "chr_0012_avywen_attack",
        "name": "雷枪·疾袭",
        "type": "BASIC",
        "duration": 3.2,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 19,
                "poise": 17
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "emag",
        "variants": [
            {
                "id": "v_1767273720814",
                "name": "战技-回收雷枪",
                "type": "normal_skill",
                "duration": 0.5,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 0,
                        "poise": 30
                    }
                ],
                "uspGain": 6.5,
                "condition": null
            }
        ]
    },
    "chr_0012_avywen_normal_skill": {
        "id": "chr_0012_avywen_normal_skill",
        "name": "雷枪·截回",
        "type": "TACTICAL",
        "duration": 0.5,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 30
            }
        ],
        "anomalies": [],
        "element": "emag"
    },
    "chr_0012_avywen_combo_skill": {
        "id": "chr_0012_avywen_combo_skill",
        "name": "雷枪·掣击",
        "type": "CHAIN",
        "duration": 2.5,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 13,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "Thunderlances",
                    "stacks": 3,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "emag"
    },
    "chr_0012_avywen_ultimate_skill": {
        "id": "chr_0012_avywen_ultimate_skill",
        "name": "雷枪·决颤",
        "type": "ULTIMATE",
        "duration": 1.5,
        "uspCost": 85,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "Thunderlances EX",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "emag",
        "animationTime": 1.5
    },
    "chr_0013_aglina_attack": {
        "id": "chr_0013_aglina_attack",
        "name": "秘杖·束能技艺",
        "type": "BASIC",
        "duration": 3.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 16,
                "poise": 16
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "nature"
    },
    "chr_0013_aglina_normal_skill": {
        "id": "chr_0013_aglina_normal_skill",
        "name": "秘杖·引力模式",
        "type": "TACTICAL",
        "duration": 4,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "nature_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "nature"
    },
    "chr_0013_aglina_combo_skill": {
        "id": "chr_0013_aglina_combo_skill",
        "name": "秘杖·矩阵位移",
        "type": "CHAIN",
        "duration": 2,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 20,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 5
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockup",
                    "stacks": 2,
                    "duration": 0
                }
            ]
        ],
        "element": "nature"
    },
    "chr_0013_aglina_ultimate_skill": {
        "id": "chr_0013_aglina_ultimate_skill",
        "name": "秘杖·重力场",
        "type": "ULTIMATE",
        "duration": 0.5,
        "uspCost": 90,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "affix_slow",
                    "stacks": 1,
                    "duration": 5,
                    "offset": 0
                }
            ],
            [
                {
                    "type": "spell_vulnerable",
                    "stacks": 1,
                    "duration": 5,
                    "offset": 0
                }
            ],
            [
                {
                    "type": "nature_attach",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "nature",
        "animationTime": 0.5
    },
    "chr_0014_aurora_attack": {
        "id": "chr_0014_aurora_attack",
        "name": "失温猛击",
        "type": "BASIC",
        "duration": 3.8,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 25,
                "poise": 23
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "cold"
    },
    "chr_0014_aurora_normal_skill": {
        "id": "chr_0014_aurora_normal_skill",
        "name": "饱和性防御",
        "type": "TACTICAL",
        "duration": 0.5,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 35,
                "poise": 20
            }
        ],
        "anomalies": [],
        "element": "cold"
    },
    "chr_0014_aurora_combo_skill": {
        "id": "chr_0014_aurora_combo_skill",
        "name": "极地救援",
        "type": "CHAIN",
        "duration": 1,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 25,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "cold"
    },
    "chr_0014_aurora_ultimate_skill": {
        "id": "chr_0014_aurora_ultimate_skill",
        "name": "凛冽寒霜",
        "type": "ULTIMATE",
        "duration": 2,
        "uspCost": 80,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "frozen",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "cold",
        "animationTime": 2
    },
    "chr_0015_lifeng_attack": {
        "id": "chr_0015_lifeng_attack",
        "name": "摧破",
        "type": "BASIC",
        "duration": 3.2,
        "damage_ticks": [
            {
                "offset": 3.2,
                "atb": 21,
                "poise": 19
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "physical",
        "variants": [
            {
                "id": "v_1765344650632",
                "name": "强化大招",
                "type": "ultimate",
                "duration": 1.9,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 0,
                        "poise": 5
                    },
                    {
                        "offset": 2,
                        "poise": 5,
                        "atb": 0
                    },
                    {
                        "offset": 3.9,
                        "poise": 5,
                        "atb": 0
                    }
                ],
                "uspGain": 0,
                "condition": null
            }
        ]
    },
    "chr_0015_lifeng_normal_skill": {
        "id": "chr_0015_lifeng_normal_skill",
        "name": "荡浊身",
        "type": "TACTICAL",
        "duration": 2.2,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 1.9,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockdown",
                    "stacks": 2,
                    "duration": 0,
                    "offset": 1.9
                }
            ],
            [
                {
                    "type": "physical_vulnerable",
                    "stacks": 1,
                    "duration": 10,
                    "offset": 1.9
                }
            ]
        ],
        "element": "physical"
    },
    "chr_0015_lifeng_combo_skill": {
        "id": "chr_0015_lifeng_combo_skill",
        "name": "忿怒相",
        "type": "CHAIN",
        "duration": 2,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 16,
        "damage_ticks": [
            {
                "offset": 1.6,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "combo",
                    "stacks": 1,
                    "duration": 20,
                    "offset": 1.6
                }
            ]
        ],
        "element": "physical"
    },
    "chr_0015_lifeng_ultimate_skill": {
        "id": "chr_0015_lifeng_ultimate_skill",
        "name": "不动心",
        "type": "ULTIMATE",
        "duration": 1.9,
        "uspCost": 90,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 5
            },
            {
                "offset": 2,
                "poise": 5,
                "atb": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockdown",
                    "stacks": 1,
                    "duration": 2,
                    "hideDuration": true
                },
                {
                    "type": "knockdown",
                    "stacks": 1,
                    "duration": 1.9,
                    "hideDuration": true
                }
            ]
        ],
        "element": "physical",
        "animationTime": 1.9
    },
    "chr_0016_laevat_attack": {
        "id": "chr_0016_laevat_attack",
        "name": "燃烬",
        "type": "BASIC",
        "duration": 3.3,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 20,
                "poise": 18
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "blaze",
        "variants": [
            {
                "id": "v_1765344039364",
                "name": "强化重击",
                "type": "attack",
                "duration": 3.3,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 22,
                        "poise": 24
                    }
                ],
                "uspGain": 0,
                "condition": null
            },
            {
                "id": "v_1765344082644",
                "name": "强化战技",
                "type": "normal_skill",
                "duration": 1.9,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 0,
                        "poise": 20
                    }
                ],
                "uspGain": 106.5,
                "condition": null
            },
            {
                "id": "v_1767269025680",
                "name": "大招内战技",
                "type": "normal_skill",
                "duration": 1.9,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 0,
                        "poise": 10
                    }
                ],
                "uspGain": 0,
                "condition": null
            },
            {
                "id": "v_1765344189692",
                "name": "大招内强化战技",
                "type": "normal_skill",
                "duration": 1.9,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 0,
                        "poise": 30
                    }
                ],
                "uspGain": 0,
                "condition": null
            }
        ]
    },
    "chr_0016_laevat_normal_skill": {
        "id": "chr_0016_laevat_normal_skill",
        "name": "焚灭",
        "type": "TACTICAL",
        "duration": 1,
        "atbCost": 100,
        "uspGain": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "magma_1",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "blaze"
    },
    "chr_0016_laevat_combo_skill": {
        "id": "chr_0016_laevat_combo_skill",
        "name": "沸腾",
        "type": "CHAIN",
        "duration": 1.7,
        "atbCost": 0,
        "uspGain": 30,
        "cooldown": 10,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "magma_1",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "blaze"
    },
    "chr_0016_laevat_ultimate_skill": {
        "id": "chr_0016_laevat_ultimate_skill",
        "name": "黄昏",
        "type": "ULTIMATE",
        "duration": 2,
        "uspCost": 300,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "magma_1",
                    "stacks": 1,
                    "duration": 3.5,
                    "offset": 0
                },
                {
                    "type": "magma_2",
                    "stacks": 1,
                    "duration": 3.5,
                    "offset": 0
                },
                {
                    "type": "magma_3",
                    "stacks": 1,
                    "duration": 3.5,
                    "offset": 0
                },
                {
                    "type": "magma_4",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "blaze",
        "animationTime": 2
    },
    "chr_0017_yvonne_attack": {
        "id": "chr_0017_yvonne_attack",
        "name": "雀跃扳机",
        "type": "BASIC",
        "duration": 3.7,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 17,
                "poise": 17
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "cold",
        "variants": [
            {
                "id": "v_1765344226962",
                "name": "强化战技",
                "type": "normal_skill",
                "duration": 1,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 0,
                        "poise": 10
                    }
                ],
                "uspGain": 6.5,
                "condition": null
            }
        ]
    },
    "chr_0017_yvonne_normal_skill": {
        "id": "chr_0017_yvonne_normal_skill",
        "name": "冰冰弹·β型",
        "type": "TACTICAL",
        "duration": 1.3,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "cold_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "cold"
    },
    "chr_0017_yvonne_combo_skill": {
        "id": "chr_0017_yvonne_combo_skill",
        "name": "速冻仔·υ37",
        "type": "CHAIN",
        "duration": 1.1,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 22,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "cold_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "cold"
    },
    "chr_0017_yvonne_ultimate_skill": {
        "id": "chr_0017_yvonne_ultimate_skill",
        "name": "冷冻射手",
        "type": "ULTIMATE",
        "duration": 2,
        "uspCost": 200,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "cold_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "cold",
        "animationTime": 2
    },
    "chr_0018_dapan_attack": {
        "id": "chr_0018_dapan_attack",
        "name": "滚刀切！",
        "type": "BASIC",
        "duration": 3.5,
        "damage_ticks": [
            {
                "offset": 3.5,
                "atb": 21,
                "poise": 20
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "physical"
    },
    "chr_0018_dapan_normal_skill": {
        "id": "chr_0018_dapan_normal_skill",
        "name": "颠勺！",
        "type": "TACTICAL",
        "duration": 1.8,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 1.5,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockup",
                    "stacks": 2,
                    "duration": 0,
                    "offset": 1.5
                }
            ]
        ],
        "element": "physical"
    },
    "chr_0018_dapan_combo_skill": {
        "id": "chr_0018_dapan_combo_skill",
        "name": "加料！",
        "type": "CHAIN",
        "duration": 2.1,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 20,
        "damage_ticks": [
            {
                "offset": 1.76,
                "atb": 0,
                "poise": 15
            }
        ],
        "anomalies": [
            [
                {
                    "type": "poise",
                    "stacks": 4,
                    "duration": 0,
                    "offset": 1.76
                }
            ]
        ],
        "element": "physical"
    },
    "chr_0018_dapan_ultimate_skill": {
        "id": "chr_0018_dapan_ultimate_skill",
        "name": "切丝入锅！",
        "type": "ULTIMATE",
        "duration": 3,
        "uspCost": 76.5,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 1.5,
                "atb": 0,
                "poise": 0
            },
            {
                "offset": 2.7,
                "poise": 0,
                "atb": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockup",
                    "stacks": 1,
                    "duration": 1.1,
                    "offset": 1.5
                },
                {
                    "type": "knockdown",
                    "stacks": 2,
                    "duration": 0,
                    "offset": 2.7
                }
            ],
            [
                {
                    "type": "dapan_buff",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "physical",
        "animationTime": 1.5
    },
    "chr_0019_karin_attack": {
        "id": "chr_0019_karin_attack",
        "name": "进取剑锋",
        "type": "BASIC",
        "duration": 2.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 19,
                "poise": 17
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "blaze"
    },
    "chr_0019_karin_normal_skill": {
        "id": "chr_0019_karin_normal_skill",
        "name": "热情迸发",
        "type": "TACTICAL",
        "duration": 2,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "blaze_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "blaze"
    },
    "chr_0019_karin_combo_skill": {
        "id": "chr_0019_karin_combo_skill",
        "name": "快闪冲击",
        "type": "CHAIN",
        "duration": 1.5,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 15,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [],
        "element": "blaze"
    },
    "chr_0019_karin_ultimate_skill": {
        "id": "chr_0019_karin_ultimate_skill",
        "name": "小队，集结！",
        "type": "ULTIMATE",
        "duration": 3,
        "uspCost": 90,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "blaze",
        "animationTime": 1.7
    },
    "chr_0020_meurs_attack": {
        "id": "chr_0020_meurs_attack",
        "name": "基础战术",
        "type": "BASIC",
        "duration": 2.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 25,
                "poise": 22
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "physical"
    },
    "chr_0020_meurs_normal_skill": {
        "id": "chr_0020_meurs_normal_skill",
        "name": "刚性阻击",
        "type": "TACTICAL",
        "duration": 2,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 20
            }
        ],
        "anomalies": [],
        "element": "physical"
    },
    "chr_0020_meurs_combo_skill": {
        "id": "chr_0020_meurs_combo_skill",
        "name": "即时压制",
        "type": "CHAIN",
        "duration": 1.5,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 15,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [],
        "element": "physical"
    },
    "chr_0020_meurs_ultimate_skill": {
        "id": "chr_0020_meurs_ultimate_skill",
        "name": "教科书式猛攻",
        "type": "ULTIMATE",
        "duration": 3,
        "uspCost": 72,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "physical",
        "animationTime": 1.3
    },
    "chr_0021_whiten_attack": {
        "id": "chr_0021_whiten_attack",
        "name": "噪点",
        "type": "BASIC",
        "duration": 2.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 19,
                "poise": 17
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "cold"
    },
    "chr_0021_whiten_normal_skill": {
        "id": "chr_0021_whiten_normal_skill",
        "name": "凝声",
        "type": "TACTICAL",
        "duration": 2,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "cold_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "cold"
    },
    "chr_0021_whiten_combo_skill": {
        "id": "chr_0021_whiten_combo_skill",
        "name": "失真",
        "type": "CHAIN",
        "duration": 1.5,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 15,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "knockup",
                    "stacks": 1,
                    "duration": 0
                },
                {
                    "type": "ice_shatter",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "cold"
    },
    "chr_0021_whiten_ultimate_skill": {
        "id": "chr_0021_whiten_ultimate_skill",
        "name": "震音",
        "type": "ULTIMATE",
        "duration": 3,
        "uspCost": 63,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "cold",
        "animationTime": 1.8
    },
    "chr_0022_bounda_attack": {
        "id": "chr_0022_bounda_attack",
        "name": "独门射击法",
        "type": "BASIC",
        "duration": 2.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 15,
                "poise": 15
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "nature"
    },
    "chr_0022_bounda_normal_skill": {
        "id": "chr_0022_bounda_normal_skill",
        "name": "小惊喜",
        "type": "TACTICAL",
        "duration": 2,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [],
        "element": "nature"
    },
    "chr_0022_bounda_combo_skill": {
        "id": "chr_0022_bounda_combo_skill",
        "name": "免费赠礼",
        "type": "CHAIN",
        "duration": 1.5,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 25,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [],
        "element": "nature"
    },
    "chr_0022_bounda_ultimate_skill": {
        "id": "chr_0022_bounda_ultimate_skill",
        "name": "巅峰闹剧",
        "type": "ULTIMATE",
        "duration": 3,
        "uspCost": 72,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "nature",
        "animationTime": 0.5
    },
    "chr_0023_antal_attack": {
        "id": "chr_0023_antal_attack",
        "name": "交换电流",
        "type": "BASIC",
        "duration": 2.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 15,
                "poise": 15
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "emag"
    },
    "chr_0023_antal_normal_skill": {
        "id": "chr_0023_antal_normal_skill",
        "name": "指定研究对象",
        "type": "TACTICAL",
        "duration": 2,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "antal_buff",
                    "stacks": 1,
                    "duration": 60,
                    "offset": 2
                }
            ]
        ],
        "element": "emag"
    },
    "chr_0023_antal_combo_skill": {
        "id": "chr_0023_antal_combo_skill",
        "name": "磁暴试验场",
        "type": "CHAIN",
        "duration": 1.5,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 15,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [],
        "element": "emag"
    },
    "chr_0023_antal_ultimate_skill": {
        "id": "chr_0023_antal_ultimate_skill",
        "name": "超频时刻",
        "type": "ULTIMATE",
        "duration": 1.4,
        "uspCost": 90,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "pulse_enhance",
                    "stacks": 1,
                    "duration": 12,
                    "offset": 1.4
                }
            ],
            [
                {
                    "type": "fire_enhance",
                    "stacks": 1,
                    "duration": 12,
                    "offset": 1.4
                }
            ]
        ],
        "element": "emag",
        "animationTime": 1.4
    },
    "chr_0024_deepfin_attack": {
        "id": "chr_0024_deepfin_attack",
        "name": "基本挥竿法",
        "type": "BASIC",
        "duration": 3.2,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 19,
                "poise": 17
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "cold",
        "variants": [
            {
                "id": "v_1767274880488",
                "name": "强化战技",
                "type": "normal_skill",
                "duration": 1.3,
                "damage_ticks": [
                    {
                        "offset": 0,
                        "atb": 30,
                        "poise": 10
                    }
                ],
                "uspGain": 17,
                "condition": null
            }
        ]
    },
    "chr_0024_deepfin_normal_skill": {
        "id": "chr_0024_deepfin_normal_skill",
        "name": "非常规路亚",
        "type": "TACTICAL",
        "duration": 1.3,
        "atbCost": 100,
        "uspGain": 17,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 30,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "frozen",
                    "stacks": 1,
                    "duration": 5
                }
            ]
        ],
        "element": "cold"
    },
    "chr_0024_deepfin_combo_skill": {
        "id": "chr_0024_deepfin_combo_skill",
        "name": "凿孔底钓术",
        "type": "CHAIN",
        "duration": 1.5,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 9,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 10,
                "poise": 10
            }
        ],
        "anomalies": [],
        "element": "cold"
    },
    "chr_0024_deepfin_ultimate_skill": {
        "id": "chr_0024_deepfin_ultimate_skill",
        "name": "大鳞，上钩！",
        "type": "ULTIMATE",
        "duration": 1.6,
        "uspCost": 85,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 30,
                "poise": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "cold_attach",
                    "stacks": 1,
                    "duration": 0
                }
            ]
        ],
        "element": "cold",
        "animationTime": 1.6
    },
    "chr_0025_ardelia_attack": {
        "id": "chr_0025_ardelia_attack",
        "name": "岩石的轻语",
        "type": "BASIC",
        "duration": 4.3,
        "damage_ticks": [
            {
                "offset": 4.3,
                "atb": 18,
                "poise": 18
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "nature"
    },
    "chr_0025_ardelia_normal_skill": {
        "id": "chr_0025_ardelia_normal_skill",
        "name": "奔腾的多利",
        "type": "TACTICAL",
        "duration": 1.3,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 1.3,
                "atb": 0,
                "poise": 10
            }
        ],
        "anomalies": [
            [
                {
                    "type": "spell_vulnerable",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ],
            [
                {
                    "type": "physical_vulnerable",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "nature"
    },
    "chr_0025_ardelia_combo_skill": {
        "id": "chr_0025_ardelia_combo_skill",
        "name": "火山蘑菇云",
        "type": "CHAIN",
        "duration": 1.2,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 18,
        "damage_ticks": [
            {
                "offset": 0.8,
                "poise": 0,
                "atb": 0
            },
            {
                "offset": 2.6,
                "poise": 10,
                "atb": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "corrosion",
                    "stacks": 1,
                    "duration": 10,
                    "offset": 2.6
                }
            ]
        ],
        "element": "nature"
    },
    "chr_0025_ardelia_ultimate_skill": {
        "id": "chr_0025_ardelia_ultimate_skill",
        "name": "毛茸茸派对",
        "type": "ULTIMATE",
        "duration": 2.7,
        "uspCost": 90,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "nature",
        "animationTime": 2.7
    },
    "chr_0026_lastrite_attack": {
        "id": "chr_0026_lastrite_attack",
        "name": "严霜之舞",
        "type": "BASIC",
        "duration": 4.3,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 20,
                "poise": 25
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "cold"
    },
    "chr_0026_lastrite_normal_skill": {
        "id": "chr_0026_lastrite_normal_skill",
        "name": "塞什卡的秘传",
        "type": "TACTICAL",
        "duration": 0.5,
        "atbCost": 100,
        "uspGain": 16,
        "damage_ticks": [],
        "anomalies": [
            [
                {
                    "type": "lastrite_buff",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "cold"
    },
    "chr_0026_lastrite_combo_skill": {
        "id": "chr_0026_lastrite_combo_skill",
        "name": "噬冬",
        "type": "CHAIN",
        "duration": 0.8,
        "atbCost": 0,
        "uspGain": 85,
        "cooldown": 9,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 15
            }
        ],
        "anomalies": [],
        "element": "cold"
    },
    "chr_0026_lastrite_ultimate_skill": {
        "id": "chr_0026_lastrite_ultimate_skill",
        "name": "临终别礼",
        "type": "ULTIMATE",
        "duration": 2.9,
        "uspCost": 240,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            }
        ],
        "anomalies": [],
        "element": "cold",
        "animationTime": 2.9
    },
    "chr_0029_pograni_attack": {
        "id": "chr_0029_pograni_attack",
        "name": "全面攻势",
        "type": "BASIC",
        "duration": 3.3,
        "damage_ticks": [
            {
                "offset": 3.3,
                "atb": 20,
                "poise": 18
            }
        ],
        "anomalies": [],
        "uspGain": 0,
        "element": "physical",
        "variants": [
            {
                "id": "v_1765344369190",
                "name": "连携1",
                "type": "combo",
                "duration": 0.8,
                "damage_ticks": [
                    {
                        "offset": 0.76,
                        "atb": 5,
                        "poise": 3
                    }
                ],
                "uspGain": 10,
                "condition": {
                    "type": "combo",
                    "value": 1
                }
            },
            {
                "id": "v_1765344406616",
                "name": "连携2",
                "type": "combo",
                "duration": 1.4,
                "damage_ticks": [
                    {
                        "offset": 0.76,
                        "atb": 5,
                        "poise": 3
                    },
                    {
                        "offset": 1.38,
                        "poise": 4,
                        "atb": 7
                    }
                ],
                "uspGain": 10,
                "condition": {
                    "type": "combo",
                    "value": 2
                }
            },
            {
                "id": "v_1765344414601",
                "name": "连携3",
                "type": "combo",
                "duration": 2.4,
                "damage_ticks": [
                    {
                        "offset": 0.76,
                        "atb": 5,
                        "poise": 3
                    },
                    {
                        "offset": 1.38,
                        "poise": 4,
                        "atb": 7
                    },
                    {
                        "offset": 2.3,
                        "poise": 9,
                        "atb": 13
                    }
                ],
                "uspGain": 10,
                "condition": {
                    "type": "combo",
                    "value": 3
                }
            },
            {
                "id": "v_1766424867630",
                "name": "连携4",
                "type": "combo",
                "duration": 2.4,
                "damage_ticks": [
                    {
                        "offset": 0.76,
                        "atb": 5,
                        "poise": 3
                    },
                    {
                        "offset": 1.38,
                        "poise": 4,
                        "atb": 7
                    },
                    {
                        "offset": 2.3,
                        "poise": 9,
                        "atb": 23
                    }
                ],
                "uspGain": 10,
                "condition": {
                    "type": "combo",
                    "value": 4
                }
            }
        ]
    },
    "chr_0029_pograni_normal_skill": {
        "id": "chr_0029_pograni_normal_skill",
        "name": "粉碎阵线",
        "type": "TACTICAL",
        "duration": 1.7,
        "atbCost": 100,
        "uspGain": 6.5,
        "damage_ticks": [
            {
                "offset": 1.4,
                "atb": 5,
                "poise": 5
            }
        ],
        "anomalies": [
            [
                {
                    "type": "armor_break",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 1.4
                }
            ]
        ],
        "element": "physical"
    },
    "chr_0029_pograni_combo_skill": {
        "id": "chr_0029_pograni_combo_skill",
        "name": "盈月邀击",
        "type": "CHAIN",
        "duration": 2.7,
        "atbCost": 0,
        "uspGain": 10,
        "cooldown": 18,
        "damage_ticks": [
            {
                "offset": 0.76,
                "atb": 5,
                "poise": 3
            },
            {
                "offset": 1.38,
                "poise": 4,
                "atb": 7
            },
            {
                "offset": 2.3,
                "poise": 9,
                "atb": 13
            }
        ],
        "anomalies": [],
        "element": "physical"
    },
    "chr_0029_pograni_ultimate_skill": {
        "id": "chr_0029_pograni_ultimate_skill",
        "name": "盾卫旗队，上前",
        "type": "ULTIMATE",
        "duration": 2.5,
        "uspCost": 90,
        "uspReply": 0,
        "damage_ticks": [
            {
                "offset": 0,
                "atb": 0,
                "poise": 0
            },
            {
                "offset": 0,
                "poise": 0,
                "atb": 0
            },
            {
                "offset": 0,
                "poise": 0,
                "atb": 0
            },
            {
                "offset": 0,
                "poise": 0,
                "atb": 0
            },
            {
                "offset": 0,
                "poise": 0,
                "atb": 0
            }
        ],
        "anomalies": [
            [
                {
                    "type": "pograni_buff",
                    "stacks": 5,
                    "duration": 0,
                    "offset": 0
                },
                {
                    "type": "pograni_buff",
                    "stacks": 4,
                    "duration": 0,
                    "offset": 0
                },
                {
                    "type": "pograni_buff",
                    "stacks": 3,
                    "duration": 0,
                    "offset": 0
                },
                {
                    "type": "pograni_buff",
                    "stacks": 2,
                    "duration": 0,
                    "offset": 0
                },
                {
                    "type": "pograni_buff",
                    "stacks": 1,
                    "duration": 0,
                    "offset": 0
                }
            ]
        ],
        "element": "physical",
        "animationTime": 2.5
    }
}
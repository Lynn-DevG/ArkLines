export const SKILLS = {
    "skill_chr_0003_endminf_attack": {
        "id": "skill_chr_0003_endminf_attack",
        "name": "管理员攻击",
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
    "skill_chr_0003_endminf_normal_skill": {
        "id": "skill_chr_0003_endminf_normal_skill",
        "name": "管理员战技",
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
    "skill_chr_0003_endminf_combo_skill": {
        "id": "skill_chr_0003_endminf_combo_skill",
        "name": "管理员连携",
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
    "skill_chr_0003_endminf_ultimate_skill": {
        "id": "skill_chr_0003_endminf_ultimate_skill",
        "name": "管理员终结技",
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
    "skill_chr_0004_pelica_attack": {
        "id": "skill_chr_0004_pelica_attack",
        "name": "佩丽卡攻击",
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
    "skill_chr_0004_pelica_normal_skill": {
        "id": "skill_chr_0004_pelica_normal_skill",
        "name": "佩丽卡战技",
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
    "skill_chr_0004_pelica_combo_skill": {
        "id": "skill_chr_0004_pelica_combo_skill",
        "name": "佩丽卡连携",
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
                    "type": "conductive",
                    "stacks": 1,
                    "duration": 8.75
                }
            ]
        ],
        "element": "emag"
    },
    "skill_chr_0004_pelica_ultimate_skill": {
        "id": "skill_chr_0004_pelica_ultimate_skill",
        "name": "佩丽卡终结技",
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
    "skill_chr_0005_chen_attack": {
        "id": "skill_chr_0005_chen_attack",
        "name": "陈千语攻击",
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
    "skill_chr_0005_chen_normal_skill": {
        "id": "skill_chr_0005_chen_normal_skill",
        "name": "陈千语战技",
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
    "skill_chr_0005_chen_combo_skill": {
        "id": "skill_chr_0005_chen_combo_skill",
        "name": "陈千语连携",
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
    "skill_chr_0005_chen_ultimate_skill": {
        "id": "skill_chr_0005_chen_ultimate_skill",
        "name": "陈千语终结技",
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
    "skill_chr_0006_wolfgd_attack": {
        "id": "skill_chr_0006_wolfgd_attack",
        "name": "狼卫攻击",
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
                "name": "强化战技",
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
    "skill_chr_0006_wolfgd_normal_skill": {
        "id": "skill_chr_0006_wolfgd_normal_skill",
        "name": "狼卫战技",
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
    "skill_chr_0006_wolfgd_combo_skill": {
        "id": "skill_chr_0006_wolfgd_combo_skill",
        "name": "狼卫连携",
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
    "skill_chr_0006_wolfgd_ultimate_skill": {
        "id": "skill_chr_0006_wolfgd_ultimate_skill",
        "name": "狼卫终结技",
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
    "skill_chr_0007_ikut_attack": {
        "id": "skill_chr_0007_ikut_attack",
        "name": "弧光攻击",
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
        "element": "emag",
        "variants": [
            {
                "id": "v_1767273184428",
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
    "skill_chr_0007_ikut_normal_skill": {
        "id": "skill_chr_0007_ikut_normal_skill",
        "name": "弧光战技",
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
        "element": "emag"
    },
    "skill_chr_0007_ikut_combo_skill": {
        "id": "skill_chr_0007_ikut_combo_skill",
        "name": "弧光连携",
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
    "skill_chr_0007_ikut_ultimate_skill": {
        "id": "skill_chr_0007_ikut_ultimate_skill",
        "name": "弧光终结技",
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
    "skill_chr_0009_azrila_attack": {
        "id": "skill_chr_0009_azrila_attack",
        "name": "余烬攻击",
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
    "skill_chr_0009_azrila_normal_skill": {
        "id": "skill_chr_0009_azrila_normal_skill",
        "name": "余烬战技",
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
    "skill_chr_0009_azrila_combo_skill": {
        "id": "skill_chr_0009_azrila_combo_skill",
        "name": "余烬连携",
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
    "skill_chr_0009_azrila_ultimate_skill": {
        "id": "skill_chr_0009_azrila_ultimate_skill",
        "name": "余烬终结技",
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
    "skill_chr_0011_seraph_attack": {
        "id": "skill_chr_0011_seraph_attack",
        "name": "赛希攻击",
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
    "skill_chr_0011_seraph_normal_skill": {
        "id": "skill_chr_0011_seraph_normal_skill",
        "name": "赛希战技",
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
    "skill_chr_0011_seraph_combo_skill": {
        "id": "skill_chr_0011_seraph_combo_skill",
        "name": "赛希连携",
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
    "skill_chr_0011_seraph_ultimate_skill": {
        "id": "skill_chr_0011_seraph_ultimate_skill",
        "name": "赛希终结技",
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
    "skill_chr_0012_avywen_attack": {
        "id": "skill_chr_0012_avywen_attack",
        "name": "艾维文娜攻击",
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
    "skill_chr_0012_avywen_normal_skill": {
        "id": "skill_chr_0012_avywen_normal_skill",
        "name": "艾维文娜战技",
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
    "skill_chr_0012_avywen_combo_skill": {
        "id": "skill_chr_0012_avywen_combo_skill",
        "name": "艾维文娜连携",
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
    "skill_chr_0012_avywen_ultimate_skill": {
        "id": "skill_chr_0012_avywen_ultimate_skill",
        "name": "艾维文娜终结技",
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
    "skill_chr_0013_aglina_attack": {
        "id": "skill_chr_0013_aglina_attack",
        "name": "洁尔佩塔攻击",
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
    "skill_chr_0013_aglina_normal_skill": {
        "id": "skill_chr_0013_aglina_normal_skill",
        "name": "洁尔佩塔战技",
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
    "skill_chr_0013_aglina_combo_skill": {
        "id": "skill_chr_0013_aglina_combo_skill",
        "name": "洁尔佩塔连携",
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
    "skill_chr_0013_aglina_ultimate_skill": {
        "id": "skill_chr_0013_aglina_ultimate_skill",
        "name": "洁尔佩塔终结技",
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
    "skill_chr_0014_aurora_attack": {
        "id": "skill_chr_0014_aurora_attack",
        "name": "昼雪攻击",
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
    "skill_chr_0014_aurora_normal_skill": {
        "id": "skill_chr_0014_aurora_normal_skill",
        "name": "昼雪战技",
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
    "skill_chr_0014_aurora_combo_skill": {
        "id": "skill_chr_0014_aurora_combo_skill",
        "name": "昼雪连携",
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
    "skill_chr_0014_aurora_ultimate_skill": {
        "id": "skill_chr_0014_aurora_ultimate_skill",
        "name": "昼雪终结技",
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
    "skill_chr_0015_lifeng_attack": {
        "id": "skill_chr_0015_lifeng_attack",
        "name": "黎风攻击",
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
    "skill_chr_0015_lifeng_normal_skill": {
        "id": "skill_chr_0015_lifeng_normal_skill",
        "name": "黎风战技",
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
    "skill_chr_0015_lifeng_combo_skill": {
        "id": "skill_chr_0015_lifeng_combo_skill",
        "name": "黎风连携",
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
    "skill_chr_0015_lifeng_ultimate_skill": {
        "id": "skill_chr_0015_lifeng_ultimate_skill",
        "name": "黎风终结技",
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
    "skill_chr_0016_laevat_attack": {
        "id": "skill_chr_0016_laevat_attack",
        "name": "莱万汀攻击",
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
    "skill_chr_0016_laevat_normal_skill": {
        "id": "skill_chr_0016_laevat_normal_skill",
        "name": "莱万汀战技",
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
    "skill_chr_0016_laevat_combo_skill": {
        "id": "skill_chr_0016_laevat_combo_skill",
        "name": "莱万汀连携",
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
    "skill_chr_0016_laevat_ultimate_skill": {
        "id": "skill_chr_0016_laevat_ultimate_skill",
        "name": "莱万汀终结技",
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
    "skill_chr_0017_yvonne_attack": {
        "id": "skill_chr_0017_yvonne_attack",
        "name": "伊冯攻击",
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
    "skill_chr_0017_yvonne_normal_skill": {
        "id": "skill_chr_0017_yvonne_normal_skill",
        "name": "伊冯战技",
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
    "skill_chr_0017_yvonne_combo_skill": {
        "id": "skill_chr_0017_yvonne_combo_skill",
        "name": "伊冯连携",
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
    "skill_chr_0017_yvonne_ultimate_skill": {
        "id": "skill_chr_0017_yvonne_ultimate_skill",
        "name": "伊冯终结技",
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
    "skill_chr_0018_dapan_attack": {
        "id": "skill_chr_0018_dapan_attack",
        "name": "大潘攻击",
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
    "skill_chr_0018_dapan_normal_skill": {
        "id": "skill_chr_0018_dapan_normal_skill",
        "name": "大潘战技",
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
    "skill_chr_0018_dapan_combo_skill": {
        "id": "skill_chr_0018_dapan_combo_skill",
        "name": "大潘连携",
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
    "skill_chr_0018_dapan_ultimate_skill": {
        "id": "skill_chr_0018_dapan_ultimate_skill",
        "name": "大潘终结技",
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
    "skill_chr_0019_karin_attack": {
        "id": "skill_chr_0019_karin_attack",
        "name": "秋栗攻击",
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
    "skill_chr_0019_karin_normal_skill": {
        "id": "skill_chr_0019_karin_normal_skill",
        "name": "秋栗战技",
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
    "skill_chr_0019_karin_combo_skill": {
        "id": "skill_chr_0019_karin_combo_skill",
        "name": "秋栗连携",
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
    "skill_chr_0019_karin_ultimate_skill": {
        "id": "skill_chr_0019_karin_ultimate_skill",
        "name": "秋栗终结技",
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
    "skill_chr_0020_meurs_attack": {
        "id": "skill_chr_0020_meurs_attack",
        "name": "卡契尔攻击",
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
    "skill_chr_0020_meurs_normal_skill": {
        "id": "skill_chr_0020_meurs_normal_skill",
        "name": "卡契尔战技",
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
    "skill_chr_0020_meurs_combo_skill": {
        "id": "skill_chr_0020_meurs_combo_skill",
        "name": "卡契尔连携",
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
    "skill_chr_0020_meurs_ultimate_skill": {
        "id": "skill_chr_0020_meurs_ultimate_skill",
        "name": "卡契尔终结技",
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
    "skill_chr_0021_whiten_attack": {
        "id": "skill_chr_0021_whiten_attack",
        "name": "埃特拉攻击",
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
    "skill_chr_0021_whiten_normal_skill": {
        "id": "skill_chr_0021_whiten_normal_skill",
        "name": "埃特拉战技",
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
    "skill_chr_0021_whiten_combo_skill": {
        "id": "skill_chr_0021_whiten_combo_skill",
        "name": "埃特拉连携",
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
    "skill_chr_0021_whiten_ultimate_skill": {
        "id": "skill_chr_0021_whiten_ultimate_skill",
        "name": "埃特拉终结技",
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
    "skill_chr_0022_bounda_attack": {
        "id": "skill_chr_0022_bounda_attack",
        "name": "萤石攻击",
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
    "skill_chr_0022_bounda_normal_skill": {
        "id": "skill_chr_0022_bounda_normal_skill",
        "name": "萤石战技",
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
    "skill_chr_0022_bounda_combo_skill": {
        "id": "skill_chr_0022_bounda_combo_skill",
        "name": "萤石连携",
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
    "skill_chr_0022_bounda_ultimate_skill": {
        "id": "skill_chr_0022_bounda_ultimate_skill",
        "name": "萤石终结技",
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
    "skill_chr_0023_antal_attack": {
        "id": "skill_chr_0023_antal_attack",
        "name": "安塔尔攻击",
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
    "skill_chr_0023_antal_normal_skill": {
        "id": "skill_chr_0023_antal_normal_skill",
        "name": "安塔尔战技",
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
    "skill_chr_0023_antal_combo_skill": {
        "id": "skill_chr_0023_antal_combo_skill",
        "name": "安塔尔连携",
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
    "skill_chr_0023_antal_ultimate_skill": {
        "id": "skill_chr_0023_antal_ultimate_skill",
        "name": "安塔尔终结技",
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
    "skill_chr_0024_deepfin_attack": {
        "id": "skill_chr_0024_deepfin_attack",
        "name": "阿列什攻击",
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
    "skill_chr_0024_deepfin_normal_skill": {
        "id": "skill_chr_0024_deepfin_normal_skill",
        "name": "阿列什战技",
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
    "skill_chr_0024_deepfin_combo_skill": {
        "id": "skill_chr_0024_deepfin_combo_skill",
        "name": "阿列什连携",
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
    "skill_chr_0024_deepfin_ultimate_skill": {
        "id": "skill_chr_0024_deepfin_ultimate_skill",
        "name": "阿列什终结技",
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
    "skill_chr_0025_ardelia_attack": {
        "id": "skill_chr_0025_ardelia_attack",
        "name": "艾尔黛拉攻击",
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
    "skill_chr_0025_ardelia_normal_skill": {
        "id": "skill_chr_0025_ardelia_normal_skill",
        "name": "艾尔黛拉战技",
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
    "skill_chr_0025_ardelia_combo_skill": {
        "id": "skill_chr_0025_ardelia_combo_skill",
        "name": "艾尔黛拉连携",
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
    "skill_chr_0025_ardelia_ultimate_skill": {
        "id": "skill_chr_0025_ardelia_ultimate_skill",
        "name": "艾尔黛拉终结技",
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
    "skill_chr_0026_lastrite_attack": {
        "id": "skill_chr_0026_lastrite_attack",
        "name": "别礼攻击",
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
    "skill_chr_0026_lastrite_normal_skill": {
        "id": "skill_chr_0026_lastrite_normal_skill",
        "name": "别礼战技",
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
    "skill_chr_0026_lastrite_combo_skill": {
        "id": "skill_chr_0026_lastrite_combo_skill",
        "name": "别礼连携",
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
    "skill_chr_0026_lastrite_ultimate_skill": {
        "id": "skill_chr_0026_lastrite_ultimate_skill",
        "name": "别礼终结技",
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
    "skill_chr_0029_pograni_attack": {
        "id": "skill_chr_0029_pograni_attack",
        "name": "骏卫攻击",
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
    "skill_chr_0029_pograni_normal_skill": {
        "id": "skill_chr_0029_pograni_normal_skill",
        "name": "骏卫战技",
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
    "skill_chr_0029_pograni_combo_skill": {
        "id": "skill_chr_0029_pograni_combo_skill",
        "name": "骏卫连携",
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
    "skill_chr_0029_pograni_ultimate_skill": {
        "id": "skill_chr_0029_pograni_ultimate_skill",
        "name": "骏卫终结技",
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
};

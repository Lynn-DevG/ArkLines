export const SKILLS = {
    "skill_chr_0002_endminm_basic": {
        "id": "skill_chr_0002_endminm_basic",
        "name": "管理员攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "管理员连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "管理员连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "管理员连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "管理员连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "管理员重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0002_endminm_tactical": {
        "id": "skill_chr_0002_endminm_tactical",
        "name": "管理员战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0002_endminm_chain": {
        "id": "skill_chr_0002_endminm_chain",
        "name": "管理员连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0002_endminm_ultimate": {
        "id": "skill_chr_0002_endminm_ultimate",
        "name": "管理员终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0003_endminf_basic": {
        "id": "skill_chr_0003_endminf_basic",
        "name": "管理员攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "管理员连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "管理员连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "管理员连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "管理员连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "管理员重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0003_endminf_tactical": {
        "id": "skill_chr_0003_endminf_tactical",
        "name": "管理员战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0003_endminf_chain": {
        "id": "skill_chr_0003_endminf_chain",
        "name": "管理员连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0003_endminf_ultimate": {
        "id": "skill_chr_0003_endminf_ultimate",
        "name": "管理员终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0004_pelica_basic": {
        "id": "skill_chr_0004_pelica_basic",
        "name": "佩丽卡攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "佩丽卡连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "佩丽卡连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "佩丽卡连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "佩丽卡连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "佩丽卡重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Electric",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0004_pelica_tactical": {
        "id": "skill_chr_0004_pelica_tactical",
        "name": "佩丽卡战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 1
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "status_conduct",
                "layers": 1
            }
        ]
    },
    "skill_chr_0004_pelica_chain": {
        "id": "skill_chr_0004_pelica_chain",
        "name": "佩丽卡连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Electric",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0004_pelica_ultimate": {
        "id": "skill_chr_0004_pelica_ultimate",
        "name": "佩丽卡终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0005_chen_basic": {
        "id": "skill_chr_0005_chen_basic",
        "name": "陈千语攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "陈千语连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "陈千语连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "陈千语连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "陈千语连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "陈千语重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0005_chen_tactical": {
        "id": "skill_chr_0005_chen_tactical",
        "name": "陈千语战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "status_stun",
                "layers": 1
            }
        ]
    },
    "skill_chr_0005_chen_chain": {
        "id": "skill_chr_0005_chen_chain",
        "name": "陈千语连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0005_chen_ultimate": {
        "id": "skill_chr_0005_chen_ultimate",
        "name": "陈千语终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0006_wolfgd_basic": {
        "id": "skill_chr_0006_wolfgd_basic",
        "name": "狼卫攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "狼卫连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "狼卫连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "狼卫连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "狼卫连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "狼卫重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Fire",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0006_wolfgd_tactical": {
        "id": "skill_chr_0006_wolfgd_tactical",
        "name": "狼卫战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_fire",
                "layers": 1
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "status_burn",
                "layers": 1
            }
        ]
    },
    "skill_chr_0006_wolfgd_chain": {
        "id": "skill_chr_0006_wolfgd_chain",
        "name": "狼卫连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Fire",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0006_wolfgd_ultimate": {
        "id": "skill_chr_0006_wolfgd_ultimate",
        "name": "狼卫终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0007_ikut_basic": {
        "id": "skill_chr_0007_ikut_basic",
        "name": "弧光攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "弧光连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "弧光连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "弧光连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "弧光连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "弧光重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Electric",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0007_ikut_tactical": {
        "id": "skill_chr_0007_ikut_tactical",
        "name": "弧光战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 1
            }
        ]
    },
    "skill_chr_0007_ikut_chain": {
        "id": "skill_chr_0007_ikut_chain",
        "name": "弧光连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Electric",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0007_ikut_ultimate": {
        "id": "skill_chr_0007_ikut_ultimate",
        "name": "弧光终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0009_azrila_basic": {
        "id": "skill_chr_0009_azrila_basic",
        "name": "余烬攻击",
        "type": "BASIC",
        "duration": 1.2,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "余烬连击1",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "余烬连击2",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "余烬连击3",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "余烬重击",
                "duration": 1.8,
                "nodes": [
                    {
                        "time": 0.9,
                        "type": "damage",
                        "multiplier": 1.8,
                        "element": "Fire",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0009_azrila_tactical": {
        "id": "skill_chr_0009_azrila_tactical",
        "name": "余烬战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "heal",
                "target": "team",
                "multiplier": 1.5,
                "scaling": "willpower"
            },
            {
                "time": 0.5,
                "type": "shield",
                "target": "team",
                "multiplier": 2,
                "scaling": "strength",
                "duration": 10
            }
        ]
    },
    "skill_chr_0009_azrila_chain": {
        "id": "skill_chr_0009_azrila_chain",
        "name": "余烬连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Fire",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0009_azrila_ultimate": {
        "id": "skill_chr_0009_azrila_ultimate",
        "name": "余烬终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0011_seraph_basic": {
        "id": "skill_chr_0011_seraph_basic",
        "name": "赛希攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "赛希连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "赛希连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "赛希连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "赛希连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "赛希重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Ice",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0011_seraph_tactical": {
        "id": "skill_chr_0011_seraph_tactical",
        "name": "赛希战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "heal",
                "target": "team",
                "multiplier": 1.5,
                "scaling": "willpower"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_ice",
                "layers": 1
            }
        ]
    },
    "skill_chr_0011_seraph_chain": {
        "id": "skill_chr_0011_seraph_chain",
        "name": "赛希连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Ice",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0011_seraph_ultimate": {
        "id": "skill_chr_0011_seraph_ultimate",
        "name": "赛希终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0012_avywen_basic": {
        "id": "skill_chr_0012_avywen_basic",
        "name": "艾维文娜攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "艾维文娜连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "艾维文娜连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "艾维文娜连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "艾维文娜连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "艾维文娜重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Electric",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0012_avywen_tactical": {
        "id": "skill_chr_0012_avywen_tactical",
        "name": "艾维文娜战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Electric",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0012_avywen_chain": {
        "id": "skill_chr_0012_avywen_chain",
        "name": "艾维文娜连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Electric",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0012_avywen_ultimate": {
        "id": "skill_chr_0012_avywen_ultimate",
        "name": "艾维文娜终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0013_aglina_basic": {
        "id": "skill_chr_0013_aglina_basic",
        "name": "洁尔佩塔攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "洁尔佩塔连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "洁尔佩塔连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "洁尔佩塔连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "洁尔佩塔连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "洁尔佩塔重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Nature",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0013_aglina_tactical": {
        "id": "skill_chr_0013_aglina_tactical",
        "name": "洁尔佩塔战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_nature",
                "layers": 1
            }
        ]
    },
    "skill_chr_0013_aglina_chain": {
        "id": "skill_chr_0013_aglina_chain",
        "name": "洁尔佩塔连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Nature",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0013_aglina_ultimate": {
        "id": "skill_chr_0013_aglina_ultimate",
        "name": "洁尔佩塔终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0014_aurora_basic": {
        "id": "skill_chr_0014_aurora_basic",
        "name": "昼雪攻击",
        "type": "BASIC",
        "duration": 1.2,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "昼雪连击1",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "昼雪连击2",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "昼雪连击3",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "昼雪重击",
                "duration": 1.8,
                "nodes": [
                    {
                        "time": 0.9,
                        "type": "damage",
                        "multiplier": 1.8,
                        "element": "Ice",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0014_aurora_tactical": {
        "id": "skill_chr_0014_aurora_tactical",
        "name": "昼雪战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "heal",
                "target": "team",
                "multiplier": 1.5,
                "scaling": "willpower"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_ice",
                "layers": 1
            }
        ]
    },
    "skill_chr_0014_aurora_chain": {
        "id": "skill_chr_0014_aurora_chain",
        "name": "昼雪连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Ice",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0014_aurora_ultimate": {
        "id": "skill_chr_0014_aurora_ultimate",
        "name": "昼雪终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0015_lifeng_basic": {
        "id": "skill_chr_0015_lifeng_basic",
        "name": "黎风攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "黎风连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "黎风连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "黎风连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "黎风连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "黎风重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0015_lifeng_tactical": {
        "id": "skill_chr_0015_lifeng_tactical",
        "name": "黎风战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0015_lifeng_chain": {
        "id": "skill_chr_0015_lifeng_chain",
        "name": "黎风连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0015_lifeng_ultimate": {
        "id": "skill_chr_0015_lifeng_ultimate",
        "name": "黎风终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0016_laevat_basic": {
        "id": "skill_chr_0016_laevat_basic",
        "name": "莱万汀攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "莱万汀连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "莱万汀连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "莱万汀连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "莱万汀连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "莱万汀重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Fire",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0016_laevat_tactical": {
        "id": "skill_chr_0016_laevat_tactical",
        "name": "莱万汀战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "status_burn",
                "layers": 1
            }
        ]
    },
    "skill_chr_0016_laevat_chain": {
        "id": "skill_chr_0016_laevat_chain",
        "name": "莱万汀连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Fire",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0016_laevat_ultimate": {
        "id": "skill_chr_0016_laevat_ultimate",
        "name": "莱万汀终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0017_yvonne_basic": {
        "id": "skill_chr_0017_yvonne_basic",
        "name": "伊冯攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "伊冯连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "伊冯连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "伊冯连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "伊冯连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "伊冯重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Ice",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0017_yvonne_tactical": {
        "id": "skill_chr_0017_yvonne_tactical",
        "name": "伊冯战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_ice",
                "layers": 1
            }
        ]
    },
    "skill_chr_0017_yvonne_chain": {
        "id": "skill_chr_0017_yvonne_chain",
        "name": "伊冯连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Ice",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0017_yvonne_ultimate": {
        "id": "skill_chr_0017_yvonne_ultimate",
        "name": "伊冯终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0018_dapan_basic": {
        "id": "skill_chr_0018_dapan_basic",
        "name": "大潘攻击",
        "type": "BASIC",
        "duration": 1.2,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "大潘连击1",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "大潘连击2",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "大潘连击3",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "大潘重击",
                "duration": 1.8,
                "nodes": [
                    {
                        "time": 0.9,
                        "type": "damage",
                        "multiplier": 1.8,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0018_dapan_tactical": {
        "id": "skill_chr_0018_dapan_tactical",
        "name": "大潘战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0018_dapan_chain": {
        "id": "skill_chr_0018_dapan_chain",
        "name": "大潘连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0018_dapan_ultimate": {
        "id": "skill_chr_0018_dapan_ultimate",
        "name": "大潘终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0019_karin_basic": {
        "id": "skill_chr_0019_karin_basic",
        "name": "秋栗攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "秋栗连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "秋栗连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "秋栗连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "秋栗连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "秋栗重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Fire",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0019_karin_tactical": {
        "id": "skill_chr_0019_karin_tactical",
        "name": "秋栗战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_fire",
                "layers": 1
            }
        ]
    },
    "skill_chr_0019_karin_chain": {
        "id": "skill_chr_0019_karin_chain",
        "name": "秋栗连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Fire",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0019_karin_ultimate": {
        "id": "skill_chr_0019_karin_ultimate",
        "name": "秋栗终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Fire",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0020_meurs_basic": {
        "id": "skill_chr_0020_meurs_basic",
        "name": "卡契尔攻击",
        "type": "BASIC",
        "duration": 1.2,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "卡契尔连击1",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "卡契尔连击2",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "卡契尔连击3",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "卡契尔重击",
                "duration": 1.8,
                "nodes": [
                    {
                        "time": 0.9,
                        "type": "damage",
                        "multiplier": 1.8,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0020_meurs_tactical": {
        "id": "skill_chr_0020_meurs_tactical",
        "name": "卡契尔战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "shield",
                "target": "team",
                "multiplier": 2,
                "scaling": "strength",
                "duration": 10
            }
        ]
    },
    "skill_chr_0020_meurs_chain": {
        "id": "skill_chr_0020_meurs_chain",
        "name": "卡契尔连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0020_meurs_ultimate": {
        "id": "skill_chr_0020_meurs_ultimate",
        "name": "卡契尔终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0021_whiten_basic": {
        "id": "skill_chr_0021_whiten_basic",
        "name": "埃特拉攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "埃特拉连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "埃特拉连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "埃特拉连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "埃特拉连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "埃特拉重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Ice",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0021_whiten_tactical": {
        "id": "skill_chr_0021_whiten_tactical",
        "name": "埃特拉战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_ice",
                "layers": 1
            }
        ]
    },
    "skill_chr_0021_whiten_chain": {
        "id": "skill_chr_0021_whiten_chain",
        "name": "埃特拉连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Ice",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0021_whiten_ultimate": {
        "id": "skill_chr_0021_whiten_ultimate",
        "name": "埃特拉终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0022_bounda_basic": {
        "id": "skill_chr_0022_bounda_basic",
        "name": "萤石攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "萤石连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "萤石连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "萤石连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "萤石连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "萤石重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Nature",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0022_bounda_tactical": {
        "id": "skill_chr_0022_bounda_tactical",
        "name": "萤石战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_nature",
                "layers": 1
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_ice",
                "layers": 1
            }
        ]
    },
    "skill_chr_0022_bounda_chain": {
        "id": "skill_chr_0022_bounda_chain",
        "name": "萤石连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Nature",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0022_bounda_ultimate": {
        "id": "skill_chr_0022_bounda_ultimate",
        "name": "萤石终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0023_antal_basic": {
        "id": "skill_chr_0023_antal_basic",
        "name": "安塔尔攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "安塔尔连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "安塔尔连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "安塔尔连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "安塔尔连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "安塔尔重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Electric",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0023_antal_tactical": {
        "id": "skill_chr_0023_antal_tactical",
        "name": "安塔尔战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Electric",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0023_antal_chain": {
        "id": "skill_chr_0023_antal_chain",
        "name": "安塔尔连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Electric",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0023_antal_ultimate": {
        "id": "skill_chr_0023_antal_ultimate",
        "name": "安塔尔终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Electric",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0024_deepfin_basic": {
        "id": "skill_chr_0024_deepfin_basic",
        "name": "阿列什攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "阿列什连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "阿列什连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "阿列什连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "阿列什连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "阿列什重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Ice",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0024_deepfin_tactical": {
        "id": "skill_chr_0024_deepfin_tactical",
        "name": "阿列什战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "status_freeze",
                "layers": 1
            }
        ]
    },
    "skill_chr_0024_deepfin_chain": {
        "id": "skill_chr_0024_deepfin_chain",
        "name": "阿列什连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Ice",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0024_deepfin_ultimate": {
        "id": "skill_chr_0024_deepfin_ultimate",
        "name": "阿列什终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0025_ardelia_basic": {
        "id": "skill_chr_0025_ardelia_basic",
        "name": "艾尔黛拉攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "艾尔黛拉连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "艾尔黛拉连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "艾尔黛拉连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "艾尔黛拉连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "艾尔黛拉重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Nature",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0025_ardelia_tactical": {
        "id": "skill_chr_0025_ardelia_tactical",
        "name": "艾尔黛拉战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "heal",
                "target": "team",
                "multiplier": 1.5,
                "scaling": "willpower"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "status_corrosion",
                "layers": 1
            }
        ]
    },
    "skill_chr_0025_ardelia_chain": {
        "id": "skill_chr_0025_ardelia_chain",
        "name": "艾尔黛拉连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Nature",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0025_ardelia_ultimate": {
        "id": "skill_chr_0025_ardelia_ultimate",
        "name": "艾尔黛拉终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Nature",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0026_lastrite_basic": {
        "id": "skill_chr_0026_lastrite_basic",
        "name": "别礼攻击",
        "type": "BASIC",
        "duration": 1.2,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "别礼连击1",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "别礼连击2",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "别礼连击3",
                "duration": 1.2,
                "nodes": [
                    {
                        "time": 0.6,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "别礼重击",
                "duration": 1.8,
                "nodes": [
                    {
                        "time": 0.9,
                        "type": "damage",
                        "multiplier": 1.8,
                        "element": "Ice",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0026_lastrite_tactical": {
        "id": "skill_chr_0026_lastrite_tactical",
        "name": "别礼战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 0.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_ice",
                "layers": 1
            }
        ]
    },
    "skill_chr_0026_lastrite_chain": {
        "id": "skill_chr_0026_lastrite_chain",
        "name": "别礼连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Ice",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0026_lastrite_ultimate": {
        "id": "skill_chr_0026_lastrite_ultimate",
        "name": "别礼终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Ice",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_0029_pograni_basic": {
        "id": "skill_chr_0029_pograni_basic",
        "name": "骏卫攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "骏卫连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "骏卫连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "骏卫连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "骏卫连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "骏卫重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_0029_pograni_tactical": {
        "id": "skill_chr_0029_pograni_tactical",
        "name": "骏卫战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0029_pograni_chain": {
        "id": "skill_chr_0029_pograni_chain",
        "name": "骏卫连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_0029_pograni_ultimate": {
        "id": "skill_chr_0029_pograni_ultimate",
        "name": "骏卫终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    },
    "skill_chr_9000_endmin_basic": {
        "id": "skill_chr_9000_endmin_basic",
        "name": "管理员攻击",
        "type": "BASIC",
        "duration": 0.8,
        "nodes": [
            {
                "time": 0.4,
                "type": "damage",
                "multiplier": 1,
                "element": "Physical",
                "scaling": "atk"
            }
        ],
        "variants": [
            {
                "condition": {
                    "type": "combo",
                    "value": 1
                },
                "name": "管理员连击1",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 2
                },
                "name": "管理员连击2",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.1,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 3
                },
                "name": "管理员连击3",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.2,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": 4
                },
                "name": "管理员连击4",
                "duration": 0.8,
                "nodes": [
                    {
                        "time": 0.4,
                        "type": "damage",
                        "multiplier": 1.3,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            },
            {
                "condition": {
                    "type": "combo",
                    "value": "heavy"
                },
                "name": "管理员重击",
                "duration": 1.5,
                "nodes": [
                    {
                        "time": 0.75,
                        "type": "damage",
                        "multiplier": 1.6,
                        "element": "Physical",
                        "scaling": "atk"
                    }
                ]
            }
        ]
    },
    "skill_chr_9000_endmin_tactical": {
        "id": "skill_chr_9000_endmin_tactical",
        "name": "管理员战技",
        "type": "TACTICAL",
        "duration": 1.5,
        "cooldown": 12,
        "spCost": 100,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_9000_endmin_chain": {
        "id": "skill_chr_9000_endmin_chain",
        "name": "管理员连携",
        "type": "CHAIN",
        "duration": 1,
        "energyGain": 10,
        "condition": {
            "type": "status_on_enemy",
            "status": "break"
        },
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 3.5,
                "element": "Physical",
                "scaling": "atk"
            }
        ]
    },
    "skill_chr_9000_endmin_ultimate": {
        "id": "skill_chr_9000_endmin_ultimate",
        "name": "管理员终结技",
        "type": "ULTIMATE",
        "duration": 3.5,
        "energyCost": 120,
        "nodes": [
            {
                "time": 0.5,
                "type": "damage",
                "multiplier": 1.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 1.5,
                "type": "damage",
                "multiplier": 2.5,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "damage",
                "multiplier": 3,
                "element": "Physical",
                "scaling": "atk"
            },
            {
                "time": 2.5,
                "type": "status_apply",
                "target": "enemy",
                "status": "attachment_electric",
                "layers": 4
            }
        ]
    }
};

export const SKILL_TYPES = {
    BASIC: { name: '普通攻击', color: 'bg-slate-500' },
    TACTICAL: { name: '战技', color: 'bg-blue-500' },
    CHAIN: { name: '连携技', color: 'bg-purple-500' },
    ULTIMATE: { name: '终结技', color: 'bg-amber-500' },
};
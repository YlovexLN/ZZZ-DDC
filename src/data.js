export const Achance = 0.2011577424023155;
export const Bchance = 0.798842257597684516;
export const Atimes = 5;
export const Btimes = 4;
export const ENTRY_NAMES = ["大生命", "小生命", "大攻击", "小攻击", "穿透值", "大防御", "小防御", "暴击伤害", "暴击率", "异常精通"];
export const MAIN_ENTRY_CONFIG = {
    4: ["攻击力百分比", "生命值百分比", "防御力百分比", "暴击率", "暴击伤害", "异常精通"],
    5: ["攻击力百分比", "生命值百分比", "防御力百分比", "穿透率", "物理伤害加成", "火属性伤害加成", "冰属性伤害加成", "电属性伤害加成", "以太伤害加成", "风属性伤害加成"],
    6: ["攻击力百分比", "生命值百分比", "防御力百分比", "异常掌控", "冲击力", "能量自动回复"]
};
export const MAIN_ATTR_TO_SUB = {
    "攻击力百分比": 2,
    "生命值百分比": 0,
    "防御力百分比": 5,
    "暴击率": 8,
    "暴击伤害": 7,
    "异常精通": 9
};

export const CHARACTER_DATA = [
    { faction: "狡兔屋", roles: [
        { name: "猫宫又奈", image: "images/WEBP/猫宫又奈.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "安比·德玛拉", image: "images/WEBP/安比·德玛拉.webp", weights: [0,0,0.75,0.225,0.25,0,0,1,1,0] },
        { name: "妮可·德玛拉", image: "images/WEBP/妮可·德玛拉.webp", weights: [0,0,1,0.3,0.2,0,0,0,0,1] },
        { name: "比利·奇德", image: "images/WEBP/比利·奇德.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "星徽·比利", image: "images/WEBP/星徽·比利.webp", weights: [0.75,0.225,0.45,0.135,0,0,0,1,1,0] }
    ]},
    { faction: "白祇重工", roles: [
        { name: "珂蕾妲·贝洛伯格", image: "images/WEBP/珂蕾妲·贝洛伯格.webp", weights: [0,0,0.75,0.225,0.25,0,0,1,1,0] },
        { name: "格莉丝·霍华德", image: "images/WEBP/格莉丝·霍华德.webp", weights: [0,0,0.75,0.225,0.3,0,0,0,0,1] },
        { name: "安东·伊万诺夫", image: "images/WEBP/安东·伊万诺夫.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "本·比格", image: "images/WEBP/本·比格.webp", weights: [0,0,0.75,0.225,0.3,0.75,0.225,1,1,0] }
    ]},
    { faction: "维多利亚家政", roles: [
        { name: "艾莲·乔", image: "images/WEBP/艾莲·乔.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "丽娜", image: "images/WEBP/丽娜.webp", weights: [0,0,0.75,0.225,0.25,0,0,0,0,1] },
        { name: "冯·莱卡恩", image: "images/WEBP/冯·莱卡恩.webp", weights: [0,0,0.75,0.225,0.25,0,0,1,1,0] },
        { name: "可琳·威克斯", image: "images/WEBP/可琳·威克斯.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] }
    ]},
    { faction: "对空六课", roles: [
        { name: "星见雅", image: "images/WEBP/星见雅.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0.3] },
        { name: "浅羽悠真", image: "images/WEBP/浅羽悠真.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "苍角", image: "images/WEBP/苍角.webp", weights: [0,0,1,0.3,0.25,0,0,0.75,0.75,1] },
        { name: "月城柳", image: "images/WEBP/月城柳.webp", weights: [0,0,0.75,0.225,0.3,0,0,0,0,1] }
    ]},
    { faction: "治安局", roles: [
        { name: "简·杜", image: "images/WEBP/简·杜.webp", weights: [0,0,0.75,0.225,0.3,0,0,0,0,1] },
        { name: "青衣", image: "images/WEBP/青衣.webp", weights: [0,0,0.75,0.225,0.25,0,0,1,1,0] },
        { name: "朱鸢", image: "images/WEBP/朱鸢.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "赛斯·洛威尔", image: "images/WEBP/赛斯·洛威尔.webp", weights: [0,0,1,0.3,0.25,0,0,0,0,0.75] },
        { name: "希希芙", image: "images/WEBP/希希芙.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] }
    ]},
    { faction: "卡吕冬之子", roles: [
        { name: "柏妮思·怀特", image: "images/WEBP/柏妮思·怀特.webp", weights: [0,0,0.75,0.225,0.3,0,0,0,0,1] },
        { name: "凯撒·金", image: "images/WEBP/凯撒·金.webp", weights: [0,0,0.75,0.225,0.25,0,0,1,1,0] },
        { name: "露西", image: "images/WEBP/露西.webp", weights: [0,0,1,0.3,0.25,0,0,0.75,0.75,0] },
        { name: "派派·韦尔", image: "images/WEBP/派派·韦尔.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "波可娜", image: "images/WEBP/波可娜.webp", weights: [0,0,0.75,0.225,0.25,0,0,1,1,0] },
        { name: "莱特", image: "images/WEBP/莱特.webp", weights: [0,0,0.75,0.225,0.25,0,0,1,1,0] }
    ]},
    { faction: "天琴座", roles: [
        { name: "伊芙琳·舒瓦利耶", image: "images/WEBP/伊芙琳·舒瓦利耶.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "耀嘉音", image: "images/WEBP/耀嘉音.webp", weights: [0,0,1,0.3,0.25,0,0,0.75,0.75,0] }
    ]},
    { faction: "防卫军奥波勒斯小队", roles: [
        { name: "11号", image: "images/WEBP/11号.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "扳机", image: "images/WEBP/扳机.webp", weights: [0,0,0.75,0.225,0.25,0,0,0.75,1,0] },
        { name: "席德", image: "images/WEBP/席德.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "奥菲丝&鬼火", image: "images/WEBP/奥菲丝&鬼火.webp", weights: [0,0,1,0.3,0.6,0,0,1,1,0] }
    ]},
    { faction: "防卫军白银小队", roles: [
        { name: "零号·安比", image: "images/WEBP/零号·安比.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] }
    ]},
    { faction: "反舌鸟", roles: [
        { name: "雨果·维拉德", image: "images/WEBP/雨果·维拉德.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "薇薇安·班希", image: "images/WEBP/薇薇安·班希.webp", weights: [0,0,0.75,0.225,0.3,0,0,0,0,1], special: "vivian" }
    ]},
    { faction: "坎卜斯黑枝", roles: [
        { name: "照", image: "images/WEBP/照.webp", weights: [1,0.3,0,0,0,0,0,0.5,0.5,0] },
        { name: "普罗米娅", image: "images/WEBP/普罗米娅.webp", weights: [0,0,0.75,0.225,0.3,0,0,0,0,1] },
        { name: "琉音", image: "images/WEBP/琉音.webp", weights: [0,0,0.75,0.225,0.25,0,0,0.75,1,0] },
        { name: "般岳", image: "images/WEBP/般岳.webp", weights: [0.75,0.225,0.45,0.135,0,0,0,1,1,0] }
    ]},
    { faction: "妄想天使", roles: [
        { name: "南宫羽", image: "images/WEBP/南宫羽.webp", weights: [0,0,0.75,0.225,0.3,0,0,0,0,1] },
        { name: "千夏", image: "images/WEBP/千夏.webp", weights: [0,0,1,0.3,0,0,0,0.5,0.5,0] },
        { name: "爱芮", image: "images/WEBP/爱芮.webp", weights: [0,0,0.75,0.225,0.3,0,0,0,0,1] }
    ]},
    { faction: "云岿山", roles: [
        { name: "叶瞬光", image: "images/WEBP/叶瞬光.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] },
        { name: "橘福福", image: "images/WEBP/橘福福.webp", weights: [0,0,1,0.3,0.25,0,0,0.75,1,0] },
        { name: "仪玄", image: "images/WEBP/仪玄.webp", weights: [0.75,0.225,0.45,0.135,0,0,0,1,1,0] },
        { name: "潘引壶", image: "images/WEBP/潘引壶.webp", weights: [0,0,1,0.3,0.25,0,0,0.75,0.75,0] }
    ]},
    { faction: "怪啖屋", roles: [
        { name: "爱丽丝·泰姆菲尔德", image: "images/WEBP/爱丽丝·泰姆菲尔德.webp", weights: [0,0,1,0.3,0.3,0,0,0,0,1], special: "alice" },
        { name: "伊德海莉·墨菲", image: "images/WEBP/伊德海莉·墨菲.webp", weights: [0.75,0.225,0.45,0.135,0,0,0,1,1,0] },
        { name: "卢西娅", image: "images/WEBP/卢西娅.webp", weights: [1,0.3,0,0,0,0,0,0.5,0.5,0] },
        { name: "浮波柚叶", image: "images/WEBP/浮波柚叶.webp", weights: [0,0,1,0.225,0.25,0,0,0,0,1] },
        { name: "狛野真斗", image: "images/WEBP/狛野真斗.webp", weights: [0.75,0.225,0.45,0.135,0,0,0,1,1,0] }
    ]},
    { faction: "罗斯凯利法外务筹策局", roles: [
        { name: "维琳娜·艾嘉德", image: "images/WEBP/维琳娜·艾嘉德.webp", weights: [0,0,0.75,0.225,0.3,0,0,0,0,1] },
        { name: "诺姆·霍洛维尔", image: "images/WEBP/诺姆·霍洛维尔.webp", weights: [0,0,0.75,0.225,0.25,0,0,0.75,1,0] }
    ]},
    { faction: "法厄同", roles: [
        { name: "佩洛伊斯", image: "images/WEBP/佩洛伊斯.webp", weights: [0,0,1,0.3,0.3,0,0,1,1,0] }
    ]}
];

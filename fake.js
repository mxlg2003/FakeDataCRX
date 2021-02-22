"use strict";

/**
 * 随机数生成
 * max 最大值 默认10 不包含
 * min 最小值 默认0  包含
 */

function randomNum(max, min) {
    min = min || 0;
    max = max || 10;
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 生成随机手机号
 */
function GetPhone() {
    var tow = randomNum(9, 3);
    var n = randomNum(999999999, 100000000);
    return '1' + tow + '' + n
}

/**
 * 生成随机身份证
 */
function GetIDCard() {
    var address = randomNum(999999, 100000);
    var date = new Date();
    var yearfull = date.getFullYear();
    var y = randomNum(yearfull + 1, yearfull - 70);
    var m = randomNum(13, 1);
    var d = randomNum(30, 1);
    var z = randomNum(9999, 1000);
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    return address + '' + y + '' + m + '' + d + '' + z + '';
}

/**
 * 生成随机地址
 */
function GetAddress() {
    const provinces = new Array(
        "北京市", "上海市", "天津市", "重庆市",
        "内蒙古自治区", "山西省", "河北省", "吉林省", "江苏省", "辽宁省", "黑龙江省",
        "安徽省", "山东省", "浙江省", "江西省", "福建省", "湖南省", "湖北省",
        "河南省", "广东省", "广西壮族自治区", "贵州省", "海南省", "四川省", "云南省",
        "陕西省", "甘肃省", "宁夏回族自治区", "青海省", "新疆维吾尔自治区", "西藏自治区",
        "台湾省", "香港特别行政区", "澳门特别行政区")

    const cities = new Array(
        "北京", "上海", "天津", "重庆", "哈尔滨", "长春", "沈阳", "呼和浩特",
        "石家庄", "乌鲁木齐", "兰州", "西宁", "西安", "银川", "郑州", "济南", "太原",
        "合肥", "武汉", "长沙", "南京", "成都", "贵阳", "昆明", "南宁", "拉萨",
        "杭州", "南昌", "广州", "福州", "台北", "海口", "香港", "澳门", "通辽",
        "兴安盟", "太原", "辛集", "邯郸", "沈阳", "辽阳", "兴城", "北镇", "阜新",
        "哈尔滨", "齐齐哈尔", "淮安", "张家港", "海门", "六安", "巢湖", "马鞍山",
        "永安", "宁德", "嘉禾", "荆门", "潜江", "大冶", "宜都", "佛山", "深圳",
        "潮州", "惠州", "汕尾", "东莞", "梧州", "柳州", "合山", "六盘水", "关岭")

    const districts = new Array(
        "西夏", "永川", "秀英", "高港", "清城", "兴山", "锡山", "清河",
        "龙潭", "华龙", "海陵", "滨城", "东丽", "高坪", "沙湾", "平山",
        "城北", "海港", "沙市", "双滦", "长寿", "山亭", "南湖", "浔阳",
        "南长", "友好", "安次", "翔安", "沈河", "魏都", "西峰", "萧山",
        "金平", "沈北新", "孝南", "上街", "城东", "牧野", "大东",
        "白云", "花溪", "吉区", "新城", "怀柔", "六枝特", "涪城",
        "清浦", "南溪", "淄川", "高明", "东城", "崇文", "朝阳", "大兴",
        "房山", "门头沟", "黄浦", "徐汇", "静安", "普陀", "闵行", "和平",
        "蓟州", "永川", "长寿", "璧山", "合川", "梁平", "丰都", "江北")

    var result = provinces[randomNum(provinces.length)] + cities[randomNum(cities.length)] + '市' + districts[randomNum(districts.length)] + '区' + districts[randomNum(districts.length)] + '路' + randomNum(999) + '号';
    return result
}


/**
 * storage 异步转同步的实现方案
 */
function sleep(msec, callback) {
    return () => {
        return new Promise((resolve) => setTimeout(() => {
            if (callback) {
                callback()
            }
            resolve('slept ' + msec + ' ms')
        }, msec))
    }
}

let session = {
    set: async function (key, value) {
        let result = null
        chrome.storage.sync.set({
            [key]: value,
        },
            function (res) {
                result = { [key]: value }
            }
        );
        for (let i = 0; i < 10; i++) {
            if (result) return result
            await sleep(1)()
            continue
        }
        throw '[session] set ' + key + '=' + value + ' fail'
    },
    get: async function (key) {
        let result = null
        chrome.storage.sync.get({
            [key]: null,
        },
            function (res) {
                result = res
            }
        );
        for (let i = 0; i < 10; i++) {
            if (result) return result
            await sleep(1)()
            continue
        }
        throw '[session] get ' + key + ' fail'
    },
    remove: async function (key) {
        let result = null
        chrome.storage.sync.remove(key,
            function (res) {
                result = { [key]: null }
            }
        );
        for (let i = 0; i < 10; i++) {
            if (result) return result
            await sleep(1)()
            continue
        }
        throw '[session] remove ' + key + ' fail'
    },
    clear: async function () {
        let result = null
        chrome.storage.sync.clear(function (res) {
            result = {}
        }
        );
        for (let i = 0; i < 10; i++) {
            if (result) return result
            await sleep(1)()
            continue
        }
        throw '[session] clear fail'
    }
}
/**
 * storage 异步转同步的实现方案 结束
 */



// 保存上一次录入的手机号
async function saveLastPhone(data) {
    // await session.remove('phone')
    await session.set('phone', data)
}

// 保存上一次录入的中文名
async function saveLastChineseName(data) {
    await session.set('chineseName', data)
}

// 保存上一次录入的身份证号
async function saveLastIDCard(data) {
    await session.set('IDCard', data)
}

// 保存上一次录入的地址
async function saveLastAddress(data) {
    await session.set('address', data)
}



// 填写手机号
function randomPhone(e) {
    var phone = GetPhone();
    e.target.value = phone
    saveLastPhone(phone)
    return false;
}

// 填写中文名
function randomChineseName(e) {
    var name = Mock.mock('@cname()');
    e.target.value = name
    saveLastChineseName(name)
    return false;
}

// 填写身份证号
function randomIDCard(e) {
    var IDCard = GetIDCard();
    e.target.value = IDCard
    saveLastIDCard(IDCard)
    return false;
}

// 填写地址
function randomAddress(e) {
    var Address = GetAddress();
    e.target.value = Address
    saveLastAddress(Address)
    return false;
}


/**
 * 录入上一次数据
 */
// 录入上一次手机号
async function getlastPhone(e) {
    var result =  await session.get('phone')
    e.target.value = result.phone
    return false;
}

// 录入上一次中文名
async function getlastChineseName(e) {
    var result =  await session.get('chineseName')
    e.target.value = result.chineseName
    return false;
}

// 录入上一次身份证号
async function getlastIDCard(e) {
    var result =  await session.get('IDCard')
    e.target.value = result.IDCard
    return false;
}

// 录入上一次地址
async function getlastAddress(e) {
    var result =  await session.get('address')
    e.target.value = result.address
    return false;
}


/**
 * 快捷键绑定
 */
Mousetrap.reset();

// 随机手机号
Mousetrap.bind('alt+1', randomPhone)

// 随机中文姓名
Mousetrap.bind('alt+2', randomChineseName)

// 随机身份证号
Mousetrap.bind('alt+3', randomIDCard)

// 随机地址
Mousetrap.bind('alt+4', randomAddress)


// 输入上一次的手机号
Mousetrap.bind('ctrl+alt+1', getlastPhone)

// 输入上一次的中文姓名
Mousetrap.bind('ctrl+alt+2', getlastChineseName)

// 输入上一次的身份证号
Mousetrap.bind('ctrl+alt+3', getlastIDCard)

// 输入上一次的地址
Mousetrap.bind('ctrl+alt+4', getlastAddress)
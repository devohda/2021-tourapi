const express = require('express');
const router = express.Router();
const convert = require('xml-js');
const request = require('request');

const SERVICE_KEY = '9pUkhK%2BPa14Dp9EgsapNSZCG1Sv4kcekoVaKNnHOLSgVRhfSlsOlt82EnMn2qjzYWXkkNL0pRa6cK5YUprNyTw%3D%3D'
const db = require('../database/database');
const {tourApiGetQuery, tourApiGetQueryFromPlacePk, tourApiPostQuery} = require('../models/tourApi');

function nativeType(value) {
    var nValue = Number(value);
    if (!isNaN(nValue)) {
        return nValue;
    }
    var bValue = value.toLowerCase();
    if (bValue === 'true') {
        return true;
    } else if (bValue === 'false') {
        return false;
    }
    return value;
}

var removeJsonTextAttribute = function (value, parentElement) {
    try {
        var keyNo = Object.keys(parentElement._parent).length;
        var keyName = Object.keys(parentElement._parent)[keyNo - 1];
        parentElement._parent[keyName] = nativeType(value);
    } catch (e) {
    }
}

var options = {
    compact: true,
    trim: true,
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreCdata: true,
    ignoreDoctype: true,
    space: 4,
    textFn: removeJsonTextAttribute
};

var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList';
var queryParams = '?' + encodeURIComponent('ServiceKey') + `=${SERVICE_KEY}`;
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('3166'); /* totalCount 가져오기 : 서울은 3000여개 */
// queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('2');
// 관광지(12): 557, 문화시설(14): 410, 쇼핑(38): 250, 음식(39): 1209, 축제/공연/행사(15): 190, 레포츠(28): 113, 숙박(32): 385
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('');
queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC');
queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest');
queryParams += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('O');
queryParams += '&' + encodeURIComponent('contentTypeId') + '=' + encodeURIComponent('');
queryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent('1');
queryParams += '&' + encodeURIComponent('sigunguCode') + '=' + encodeURIComponent('');
queryParams += '&' + encodeURIComponent('listYN') + '=' + encodeURIComponent('Y');
queryParams += '&' + encodeURIComponent('modifiedtime') + '=' + encodeURIComponent('');

let tourAPIArray = [];
router.get('/forPost', async (req, res) => {
    request(
        {
            url: url + queryParams,
            method: 'GET',
        },
        (error, response, body) => {
            var result = body;
            var xmlToJson = JSON.parse(convert.xml2json(result, options));
            var getTourAPI = xmlToJson.response.body.items.item;
            var array = [];
            for (var i = 0; i < getTourAPI.length; i++) {
                array.push(getTourAPI[i]);
            }
            array.forEach(o => {
                var addr = '';
                //addr1, addr2를 addr로 합치는 작업. addr1, addr2 중 하나가 없거나 하는 경우가 있어 따로 수정
                if (typeof o.addr1 == 'undefined' && typeof o.addr2 == 'undefined') addr = '';
                else if (typeof o.addr1 == 'undefined' && typeof o.addr2 != 'undefined') {
                    addr = o.addr2;
                } else if (typeof o.addr1 != 'undefined' && typeof o.addr2 == 'undefined') {
                    addr = o.addr1;
                } else {
                    addr = o.addr1 + ' ' + o.addr2;
                }

                //대분류를 넣어서 구분 해준다 : contentTypeId
                //mapx, mapy는 지도에 핀 찍기 위한 용도
                tourAPIArray.push({
                    title: o.title,
                    address: addr,
                    img1: o.firstimage,
                    img2: o.firstimage2,
                    type: o.contenttypeid,
                    mapX: o.mapx,
                    mapY: o.mapy
                })
            })
            res.send(tourAPIArray);
            //이걸로 insert, 다 넣었기에 주석처리함
            // callArray();
        }
    );
});

const callArray = async () => {
    var result = {};
    for (let i = 0; i < tourAPIArray.length; i++) {
        result = await db.query(tourApiPostQuery,
            [tourAPIArray[i].title, tourAPIArray[i].address, tourAPIArray[i].img1, tourAPIArray[i].img2, tourAPIArray[i].type, tourAPIArray[i].mapX, tourAPIArray[i].mapY]);
    }
    console.log(result)
}

router.get('/', async (req, res) => {
    //데이터가 많으면 넣는데도 시간이 걸린다..
    const rows = await db.execute(tourApiGetQuery)
    console.log(rows)
    res.send(rows);
});

router.get('/:place_pk', async (req, res) => {
    var tmp = 3; //req.body로 바꿔야지
    const rows = await db.query(tourApiGetQueryFromPlacePk, [tmp])
    console.log(tourApiGetQueryFromPlacePk)
    console.log(rows)
    res.send(rows);
});

module.exports = router;
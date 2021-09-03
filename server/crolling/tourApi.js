const express = require('express');
const router = express.Router();
const convert = require('xml-js');
const request = require('request');

const HOST = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService'
const SERVICE_KEY = '9pUkhK%2BPa14Dp9EgsapNSZCG1Sv4kcekoVaKNnHOLSgVRhfSlsOlt82EnMn2qjzYWXkkNL0pRa6cK5YUprNyTw%3D%3D'
const PAGE_NUM = encodeURIComponent('1');
const NUM_OF_ROWS = encodeURIComponent('10');
// var requestUrl = `${HOST}?serviceKey=${SERVICE_KEY}&`

const db = require('../database/database');
const {tourApiGetQuery, tourApiPostQuery} = require('../models/tourApi');


const forRegionKeyWord = `${HOST}/areaCode?serviceKey=${SERVICE_KEY}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest`

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
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC'); /* */
queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest'); /* */
queryParams += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('O'); /* */
queryParams += '&' + encodeURIComponent('contentTypeId') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent('1');
queryParams += '&' + encodeURIComponent('sigunguCode') + '=' + encodeURIComponent('');
queryParams += '&' + encodeURIComponent('listYN') + '=' + encodeURIComponent('Y'); /* */
queryParams += '&' + encodeURIComponent('modifiedtime') + '=' + encodeURIComponent(''); /* */

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
                if (typeof o.addr1 == 'undefined' && typeof o.addr2 == 'undefined') addr = '';
                else if (typeof o.addr1 == 'undefined' && typeof o.addr2 != 'undefined') {
                    addr = o.addr2;
                } else if (typeof o.addr1 != 'undefined' && typeof o.addr2 == 'undefined') {
                    addr = o.addr1;
                } else {
                    addr = o.addr1 + ' ' + o.addr2;
                }
                tourAPIArray.push({
                    title: o.title,
                    address: addr,
                    img1: o.firstimage,
                    img2: o.firstimage2
                })
            })
            res.send(getTourAPI);
            // callArray();
        }
    );
});

router.get('/', async (req, res) => {
    const rows = await db.execute(tourApiGetQuery)
    console.log(rows)
    res.send(rows);
});

const callArray = async () => {
    var result = {};
    for (let i = 0; i < tourAPIArray.length; i++) {
        result = await db.query(tourApiPostQuery, [tourAPIArray[i].title, tourAPIArray[i].address, tourAPIArray[i].img1, tourAPIArray[i].img2]);
    }
    console.log(result)
}

module.exports = router;
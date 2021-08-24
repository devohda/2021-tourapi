const express = require('express');
const router = express.Router();
const convert = require('xml-js');
const request = require('request');

const HOST = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService'
const SERVICE_KEY = '9pUkhK%2BPa14Dp9EgsapNSZCG1Sv4kcekoVaKNnHOLSgVRhfSlsOlt82EnMn2qjzYWXkkNL0pRa6cK5YUprNyTw%3D%3D'
const PAGE_NUM = encodeURIComponent('1'); const NUM_OF_ROWS = encodeURIComponent('10');
// var requestUrl = `${HOST}?serviceKey=${SERVICE_KEY}&`

const db = require('../database/database');
const { tourApiGetQuery, tourApiPostQuery } = require('../models/tourApi');


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

var removeJsonTextAttribute = function(value, parentElement) {
    try {
      var keyNo = Object.keys(parentElement._parent).length;
      var keyName = Object.keys(parentElement._parent)[keyNo - 1];
      parentElement._parent[keyName] = nativeType(value);
    } catch (e) {}
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

  var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList';
  var queryParams = '?' + encodeURIComponent('ServiceKey') + `=${SERVICE_KEY}`;
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('3517'); /* totalCount 가져오기 */
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(''); /* */
  queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC'); /* */
  queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest'); /* */
  queryParams += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('E'); /* */
  queryParams += '&' + encodeURIComponent('contentTypeId') + '=' + encodeURIComponent(''); /* */
  queryParams += '&' + encodeURIComponent('mapX') + '=' + encodeURIComponent('126.981611'); /* 현 위치 가져와야 할듯 */
  queryParams += '&' + encodeURIComponent('mapY') + '=' + encodeURIComponent('37.568477'); /* 현 위치 가져와야 할듯 */
  queryParams += '&' + encodeURIComponent('radius') + '=' + encodeURIComponent('20000'); /* */
  queryParams += '&' + encodeURIComponent('listYN') + '=' + encodeURIComponent('Y'); /* */
  queryParams += '&' + encodeURIComponent('modifiedtime') + '=' + encodeURIComponent(''); /* */

router.get('/', async (req, res) => {
    request (
        {
            url:  url + queryParams,
            method: 'GET',
        },
        (error, response, body) => {
            var result = body;
            var xmlToJson = convert.xml2json(result, options);
            res.send(xmlToJson);
        }
    );
});

router.post('/post', async (req, res) => {
    // console.log(req.body);
    // const {collection_name, collection_private, collection_keywords, collection_type} = req.body;
    // const result = await db.query(tourApiPostQuery, [collection_name, collection_private, collection_keywords, collection_type]);
    console.log(result)
})

module.exports = router;
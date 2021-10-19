const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../database/database');


const SERVICE_KEY = 'scouxj%2BrAb8KaAUIqma9S06LCqz9q0ismNz7xMbM%2FAbXt1B5av0N2reANuJD39lv%2FkZ63r9kopy2S9uDqw%2B%2BpA%3D%3D'


router.get('/forPost', async (req, res) => {
    let url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?';
    url += `ServiceKey=${SERVICE_KEY}&`;
    url += `MobileOS=ETC&`;
    url += `MobileApp=AppTest&`;
    url += `numOfRows=2000&`;
    url += `pageNo=${4}&`;
    url += `arrange=O&`;
    url += `cat1=${"A05"}&`;
    url += `_type=json`;

    request(
        {url: url, method: 'GET'},
        (error, response, body) => {
            const dataList = JSON.parse(body).response.body.items.item;

            for (data of dataList) {
                let addr = '';
                //addr1, addr2를 addr로 합치는 작업. addr1, addr2 중 하나가 없거나 하는 경우가 있어 따로 수정
                if (data.addr1) {
                    addr += data.addr1
                }
                if (data.addr2) {
                    addr += ' ' + data.addr2
                }

                const inputData = {
                    place_name: data.title,
                    place_addr: addr,
                    place_img: data.firstimage,
                    place_thumbnail: data.firstimage2,
                    place_type: data.contenttypeid,
                    place_mapx: data.mapx,
                    place_mapy: data.mapy,
                    place_tel: data.tel,
                    cat1: data.cat1,
                    cat2: data.cat2,
                    cat3: data.cat3,
                    area_code: data.areacode,
                    content_id: data.contentid,
                    sigungu_code: data.sigungucode
                }
                db.query('INSERT INTO places SET ?', inputData);
            }
        }
    );

    return res.status(200).json({
        code: 200,
        status: 'OK'
    });
});

router.get('/visitant', async (req, res) => {
    let url = 'http://api.visitkorea.or.kr/openapi/service/rest/DataLabService/locgoRegnVisitrDDList?';
    url += `ServiceKey=${SERVICE_KEY}&`;
    url += `MobileOS=ETC&`;
    url += `MobileApp=AppTest&`;
    url += `numOfRows=2000&`;
    url += `pageNo=${1}&`;
    url += `startYmd=20211001&`;
    url += `endYmd=20211030&`;
    url += `_type=json`;

    request(
        {url: url, method: 'GET'},
        (error, response, body) => {
            const dataList = JSON.parse(body).response.body.items.item;

            for (data of dataList) {

                const inputData = {
                    sigungu_code: data.signguCode,
                    sigungu_name: data.signguNm,
                    visitant_day: data.daywkDivCd,
                    visitant_day_name: data.daywkDivNm,
                    visitant_type: data.touDivCd,
                    visitant_type_name: data.touDivNm,
                    visitant_cnt: data.touNum,
                    baseYmd: data.baseYmd,
                }
                db.query('INSERT INTO visitant SET ?', inputData);
            }
        }
    );

    return res.status(200).json({
        code: 200,
        status: 'OK'
    });
});

module.exports = router;
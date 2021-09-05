module.exports = {
    tourApiGetQuery: 'select * from places;',
    tourApiGetQueryFromPlacePk: 'select * from places where place_pk=(?);',
    tourApiPostQuery : 'insert into places(place_name, place_addr, place_pic_path_1, place_pic_path_2, place_type, place_mapx, place_mapy) values (?, ?, ?, ?, ?, ?, ?);',
};
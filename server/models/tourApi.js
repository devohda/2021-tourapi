module.exports = {
    tourApiGetQuery: 'select * from places;',
    tourApiPostQuery : 'insert into places(place_name, place_addr, place_pic_path_1, place_pic_path_2) values (?, ?, ?, ?);',
};
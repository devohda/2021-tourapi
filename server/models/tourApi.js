module.exports = {
    tourApiGetQuery: 'select * from places;',
    tourApiPostQuery : 'insert into places(place_name, place_addr, place_pic_path) values (?, ?, ?);',
};
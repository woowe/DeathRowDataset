const fs = require('fs'),
      http = require('http'),
      cheerio = require('cheerio'),
      after_load = require('after-load');

let html = after_load('http://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html');

const $ = cheerio.load(html);

let col_names = ['execution', 'link_info', 'link_last_statement', 'last_name', 'first_name', 'tdcj_number', 'age', 'date', 'race', 'county'];

let data = [];

$('tbody tr').each((i, e) => {
    if(i === 0) {
        return;
    }

    let d = {};
    $(e).find('td').each((i, e) => {
        if(i >= col_names.length) {
            return;
        }

        let val = $(e).text();

        if($(e).find('a').length) {
           val = 'http://www.tdcj.state.tx.us/death_row/' + $(e).find('a').attr('href');

           if(col_names[i] === 'link_last_statement') {
               let last_statement_html = after_load(val);

               let _$ = cheerio.load(last_statement_html);

               d['last_statement'] = _$('#body p:nth-of-type(6)').text();
           }
        }

        d[col_names[i]] = val;
    });

    data.push(d);
});

fs.writeFileSync('last_statements.texas.json', JSON.stringify(data), 'utf8');

console.log(data);
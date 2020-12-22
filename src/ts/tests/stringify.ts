
import {describe}                from 'ava-spec';
import {to_csv, quote_always} from '../to_csv';





describe('to_csv', async it => {

  it("abc/123", t => t.is(
    'a,b,c\r\n1,2,3',
    to_csv([['a','b','c'],['1','2','3']])
  ) );

  it("embedded cr", t => t.is(
    'a,"b\rc",d\r\n1,2,3',
    to_csv([['a','b\rc','d'],['1','2','3']])
  ) );

  it("embedded nl", t => t.is(
    'a,"b\nc",d\r\n1,2,3',
    to_csv([['a','b\nc','d'],['1','2','3']])
  ) );

  it("embedded crnl", t => t.is(
    'a,"b\r\nc",d\r\n1,2,3',
    to_csv([['a','b\r\nc','d'],['1','2','3']])
  ) );

  it("embedded quote", t => t.is(
    'a,"b""c",d\r\n1,2,3',
    to_csv([['a','b"c','d'],['1','2','3']])
  ) );

  it("embedded twoquote", t => t.is(
    'a,"b""""c",d\r\n1,2,3',
    to_csv([['a','b""c','d'],['1','2','3']])
  ) );

  it("with quoter", t => t.is(
    '"a","b","c"\r\n"1","2","3"',
    to_csv(
      [['a','b','c'],['1','2','3']],
      {quoter: quote_always}
    )
  ) );

  it("with headers", t => t.is(
    'X,Y,Z\r\na,b,c\r\n1,2,3',
    to_csv(
      [['a','b','c'],['1','2','3']],
      {headers:['X','Y','Z']}
    )
  ) );

  it("with custom field separator", t => t.is(
    'a;b;c\r\n1;2;3',
    to_csv(
      [['a','b','c'],['1','2','3']],
      {field_separator: ';'}
    )
  ) );

  it("with custom row separator", t => t.is(
    'a,b,c---1,2,3',
    to_csv(
      [['a','b','c'],['1','2','3']],
      {row_separator: '---'}
    )
  ) );

  it("with trailing row separator", t => t.is(
    'a,b,c\r\n1,2,3\r\n',
    to_csv(
      [['a','b','c'],['1','2','3']],
      {trailing_row_separator: true}
    )
  ) );

  it("with everything", t => t.is(
    '"X";"Y";"Z"---"a";"b";"c"---"1";"2";"3"---',
    to_csv(
      [['a','b','c'],['1','2','3']],
      { quoter                 : quote_always,
        headers                : ['X','Y','Z'],
        field_separator        : ';',
        row_separator          : '---',
        trailing_row_separator : true
      }
    )
  ) );

});
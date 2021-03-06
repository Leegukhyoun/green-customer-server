const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const mysql = require("mysql");
const fs = require("fs");

const dbinfo = fs.readFileSync('./database.json');

//받아온 json데이터를 객체형태로 바꿔줌
const conf = JSON.parse(dbinfo);

// connection mysql연결 createConnection()
// connection.connect() 연결하기
// connection.end() 연결 끊기
// connection.query('쿼리문', callback함수)
// callback(error, result, result의 field 정보)


const connection = mysql.createConnection({
    host:conf.host,
    user:conf.user,
    password:conf.password,
    port:conf.port,
    database:conf.database,
});
app.use(express.json());
app.use(cors());

app.get('/customers', async (req, res)=> {
    connection.query(
        "select * from customers_table",
        (err, rows, fields)=>{
            res.send(rows);
        }
    )
})

app.get('/customers/:no', async (req, res)=>{
    const para = req.params;
    connection.query(
        `select * from customers_table where no = ${para.no}`,
        (err, rows, fields)=>{
            res.send(rows);
        }
    )
})

app.post('/write',async (req, res)=>{
    const body = req.body;
    const { c_name, c_phone, c_birth, c_gender, c_add1, c_add2} = body;
        connection.query(
        `insert into customers_table(name, phone, birth, gender, add1, add2)
        values("${c_name}","${c_phone}","${c_birth}","${c_gender}","${c_add1}","${c_add2}")`,
        (err, rows, fields)=>{
            res.send(rows);
        }
    )
})





//서버실행
app.listen(port, ()=>{
    console.log("고객 서버가 돌아가고 있습니다.");
})
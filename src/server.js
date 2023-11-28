'use strict';

const express = require('express');
const path = require('path');
const server = express();
const spawn = require("child_process").spawn;
const fs = require('fs');

server.set('view engine', 'ejs');

const PORT = 3000;

const createPath = (page) => path.resolve(__dirname, '../ejs-views', `${page}.ejs`);

server.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});
const urlencodedParser = express.urlencoded({ extended: false });

server.use(express.static('../style'));
server.use(express.static('../img'));

server.get('/', (req, res) => {
    let outputData = '';
    res.render(createPath('index'), { outputData });
});

server.get('/info', (req, res) => {
    res.render(createPath('info'));
});

server.post('/', urlencodedParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);
    fs.writeFile('main.cpp', req.body.inputCode, (err) => {
        if(err) throw err;
        const compiler = spawn("clang++", ["main.cpp", "-o", "main"]);
        compiler.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        compiler.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        compiler.on('close', (code) => {
            if (code === 0) {
                console.log('Компиляция завершилась успешно');
                const runProgram = spawn("./main");
                let outputData = '';
                runProgram.stdout.on('data', (data) => {
                    console.log(`Программа выводит: ${data}`);
                    outputData += data.toString();
                    res.render(createPath('index'), { outputData });
                });
                runProgram.stderr.on('data', (data) => {
                    console.error(`Ошибка выполнения программы: ${data}`);
                    outputData += data.toString();
                    res.render(createPath('index'), { outputData });
                });
                runProgram.on('close', (code) => {
                    console.log(`Программа завершила выполнение с кодом ${code}`);
                });
            } 
            else {
                let outputData = '';
                outputData = 'error';
                res.render(createPath('index'), { outputData });
            }
        });
    })
});

server.use((req, res) => {
    res.status(404).render(createPath('error'));
});
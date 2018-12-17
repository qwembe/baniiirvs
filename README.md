# baniiirvs
### Rvs project



добавлены все серверы соответсвуюшие процессам (см рисунок)
каждый сервер экспресс настроен так, что все модули каждый сервер берет из корня проекта.
порты:

* экипаж самолета:                  3000            npm run plane
* диспетчер АДП:                    3001            npm run dadp
* дис-р руления(?):                 3002            npm run drulen
* дис-р старта(? что он делает):    3003            npm run dstart
* д-р АДЦ(?):                       3004            npm run dadc
* д-р РДЦ(?):                       3005            npm run drdc

Они действительно все нужны или можно упростить?

#### TODO: Настроить корс(установлен см package.json)
#### TODO: Протетстить как они будут сообщаться хоть как нибудь
#### TODO: Оформить интрфейс каждому(самый простой) чтобы были видны сообщения
#### TODO: Собстна логика

## Сразу договоримся:

* Все сообщения ввиде json {type: "", data""}
* Делай документацию блэт сразу!(типо что сделал и как использовать)(как у фирсова :/ )
* Мне кажется, что это сложный проект и поэтому надо потратить на это время
* Я не знаю как разрешать конфликты, поэтому по-аккуратней с комитами

Надеюсь на активное сотруднечество
:-)

# Дарова

важная обнова. cors переоценён. вместо него стоит использовать следующий код в index.js (в начале):

```javascript
router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    }
    else {
        //move on
        next();
    }
});
```

и в ajax запросе надо дописать

```javascript
    xhttp.setRequestHeader("Content-Type", "application/json");   // !!!important
    xhttp.send(JSON.stringify({type: "command", data: command.value}));  // !!!important
```

как то так.
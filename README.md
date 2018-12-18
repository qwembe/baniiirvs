# baniiirvs
### Rvs project

добавлены все серверы соответсвуюшие процессам (см рисунок)
каждый сервер экспресс настроен так, что все модули каждый сервер берет из корня проекта.
порты:

* экипаж самолета:                  3000            npm run plane       (Андрей)
* диспетчер АДП:                    3001            npm run dadp        (Даша,Ринат)
* дис-р руления:                    3002            npm run drulen      (Паша)
* дис-р старта:                     3003            npm run dstart      (Паша)
* д-р АДЦ:                          3004            npm run dadc        (Даша,Ринат)
* д-р РДЦ:                          3005            npm run drdc        (Даша,Ринат)


#### TODO: Оформить интрфейс каждому(самый простой) чтобы были видны сообщения


## Сразу договоримся:

* Все сообщения ввиде json {type: "", data""}
* Делай документацию блэт сразу!(типо что сделал и как использовать)(как у фирсова :/ )
* Мне кажется, что это сложный проект и поэтому надо потратить на это время
* Я не знаю как разрешать конфликты, поэтому по-аккуратней с комитами

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
отсюда - http://johnzhang.io/options-request-in-express
как то так.


# Итог к 18.12.2018

есть самолет, он посылает запроасы на другие процессы и получает их текущее состояние.
*сперва он посылает запрос к адп, если пришел true, то внутренее состояние меняется и ждет  нажатие слд кнопки
*далее он переходит к руления и спрашивает его (много раз (как ребенок)) можно ли идти дальше. Когда ответ положительный самолет переходит к дстарта
*друлеия говорит, что можно дстарта ответить самолету
*после этого дстарта говорит, что можно занять полосу
* а потом можно и взлететь
*проходит 4-10 сек (типа взлет)
*теперб адц может слать смски пилоту ;)
* когда адц надоело он говорит - а вот рдц
*тогда теперь только рдц может слать смски

коротко вот что получилось
const options = {
  accessToken:    "",           // <String> Ключ доступа
  apiVersion:     '5.68',         // <String> Версия API
  appId:          null,           // <Number> ID приложения ВКонтакте
  appSecret:      null,           // <String> Секретный ключ приложения ВКонтакте
  captchaApiKey:  null,           // <String> API ключ сервиса по распознаванию капчи
  captchaService: 'anti-captcha', // <String> Сервис по распознаванию капчи (anti-captcha, antigate, rucaptcha)
  userLogin:      "",             // <String> Логин пользователя
  userPassword:   "",             // <String> Пароль пользователя
}

module.exports = options;
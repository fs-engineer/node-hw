get contact list: GET request '/contacts'

get contact by id: GET request '/contacts:contactsId'

add contact: POST request '/contacts'

delete contact: DELETE request '/contacts/:contactId'

update contact: PATCH request '/contacts/:contactId'

registration new user: POST request '/users/auth/register'

login: GET request '/auth/login'

logout: POST request 'auth/logout'

get current user: 'users/current'

pagination: GET request '/contacts/?page=1&limit=5', default: page=1, limit=10

sorting contacts by subscription: GET /contacts?sortBy or /contacts?sortByDesk

filtration contact: GET /contacts?filter=name or /contacts?filter=name |
subscription

//////////////// features

random-avatar-generator

jimp for resizing image for avatar

сервер express

использованы импорты

реализованы listContacts, getContactsById, addContact, deleteContacts,
updateContacts

сделана валидация с помощью joi

можно обновлять не весь контакт

проверка email на уникальность


const menu = {
    id: 'main',
    initial: 'INITIAL',
    machine: {
        START: {
            text: 'Привет!',
            id: 'start',
            buttons: ['Цены', 'День Рождения', 'Скидки и акции', 'Забронировать'],
            exit: ['setUserInfo'],
            mapping: {
                'Цены': 'PRICES',
                'День Рождения': 'BIRTHDAY',
                'Скидки и акции': 'PROMO',
                'Забронировать': 'BOOK_TIME'
            },
            children: {
                PRICES: {
                    text: 'Хотите узнать как получить карту?',
                    id: 'prices',
                    buttons: ['Как получить карту', 'Назад'],
                    mapping: {
                        'Как получить карту': 'CARD_INFO',
                        'Назад': 'PRICES_BACK'
                    },
                    children: {
                        CARD_INFO: {
                            text: 'Infa po kate tut',
                            buttons: ['Назад'],
                            mapping: {
                                'Назад': 'PRICES_BACK'
                            }
                        }
                    },
                    on: {
                        CARD_INFO: 'CARD_INFO',
                        PRICES_BACK: 'START'
                    }
                },
                BIRTHDAY: {
                    text: 'Вот че будет в день рождения!',
                    id: 'birthday'
                },
                PROMO: {
                    text: 'Вот Скидки и акции',
                    buttons: ['Для студентов', 'Для школьников']
                }, 
                BOOK_TIME: {
                    text: 'Введите дату и время бронирования в формате ДД.ММ ЧЧ:ММ',
                    mapping: function(message) {
                        return { action: 'CHECK_BOOK_TIME' }
                    },
                    exit: ['setBookTime']
                },
                BOOK_TIME_ERROR: {
                    text: 'Неверные данные, попробуйте еще раз ДД.ММ ЧЧ:ММ',
                    mapping: function(message) {
                        return { action: 'CHECK_BOOK_TIME' }
                    },
                    exit: ['setBookTime']
                },
                LOAD_ROOMS: {
                    text: 'Грузим комнаты...',
                    invoke: {
                        src: 'loadRooms',
                        onDone: {
                            target: 'BOOK_ROOM',
                            actions: 'updateRoomsInfo'
                        },
                        onError: "GLOBAL_ERROR"
                    }
                },
                BOOK_ROOM: {
                    text: function(context){
                        return 'Выберите зал'
                    },
                    mapping: function(message) { //maybe return BOOK_PLACE and use guard functions
                        return { action: 'CHECK_ROOM_SELECTION' };
                    },
                    exit: ['setRoom']
                },
                SELECT_ROOM_ERROR: {
                    text: 'Ошибка. Выберите зал',
                    mapping: function(message) { //maybe return BOOK_PLACE and use guard functions
                        return { action: 'CHECK_ROOM_SELECTION' };
                    },
                    exit: ['setRoom']
                },
                LOAD_FREE_PLACES: {
                    text: 'Грузим свободные места...',
                    invoke: {
                        src: 'loadPlaces',
                        onDone: {
                            target: 'BOOK_PLACE',
                            actions: 'updatePlaceInfo'
                        },
                        onError: "GLOBAL_ERROR"
                    }
                },
                BOOK_PLACE: {
                    text: 'Введите место или места(через пробел)',
                    mapping: function(message) { //maybe return BOOK_PLACE and use guard functions
                        return { action: 'CHECK_PLACE_SELECTION' };
                    },
                    exit: ['setBookPlace']
                },
                BOOK_PLACE_ERROR: {
                    text: 'Неверные данные, попробуйте еще раз',
                    mapping: function(message) { //maybe return BOOK_PLACE and use guard functions
                        return { action: 'CHECK_PLACE_SELECTION' };
                    },
                    exit: ['setBookPlace']
                },
                SET_PERSON_BOOK_COUNT: {
                    text: 'Сколько человек будет?',
                    mapping: function(message) { //maybe return BOOK_PLACE and use guard functions
                        return { action: 'CHECK_PERSON_BOOK_COUNT' };
                    },
                    exit: ['setPersonCount']
                },
                PERSON_COUNT_ERROR: {
                    text: 'Неверные данные, попробуйте еще раз',
                    mapping: function(message) { //maybe return BOOK_PLACE and use guard functions
                        return { action: 'CHECK_PERSON_BOOK_COUNT' };
                    },
                    exit: ['setPersonCount']
                },
                GET_USER_DATA: {
                    invoke: {
                        src: 'loadUserInfo',
                        onDone: {
                            target: 'CONFIRM_BOOK_DATA',
                            actions: 'updateUserInfo'
                        },
                        onError: "SET_USER_INFO"
                    }
                },
                SET_USER_INFO: {
                    text: 'На кого записать бронь?',
                    mapping: function(message) { //maybe return BOOK_PLACE and use guard functions
                        return { action: 'CONFIRM_BOOK_DATA' };
                    },
                    exit: ['setPersonInfo']
                },
                CONFIRM_BOOK_DATA: {
                    text: 'Вот ваша инфа. Все верно?',
                    buttons: ['Да', 'Нет'],
                    mapping: {
                        'Да': 'CONFIRM_BOOK',
                        'Нет': 'BOOK_TIME'
                    }
                },
                CONFIRM_BOOK: {
                    invoke: {
                        src: 'book',
                        onDone: {
                            target: 'SUCCESS_BOOKED',
                        },
                        onError: "GLOBAL_ERROR"
                    }
                },
                SUCCESS_BOOKED: {
                    text: 'Есть бронь',
                    buttons: ['Назад'],
                    mapping: {
                        'Назад': 'START'
                    }
                },
                GLOBAL_ERROR: {
                    text: 'Упс, что то пошло не так',
                    buttons: ['Назад'],
                    mapping: {
                        'Назад': 'START'
                    }
                }
            },
            on: {
                PRICES: 'PRICES',
                BIRTHDAY: 'BIRTHDAY',
                PROMO: 'PROMO',
                BOOK_TIME: 'BOOK_TIME',
                BOOK_ROOM: 'BOOK_ROOM',
                BOOK_PLACE: 'BOOK_PLACE',
                BOOK_TIME_ERROR: 'BOOK_TIME_ERROR',
                BOOK_PLACE_ERROR: 'BOOK_PLACE_ERROR',
                SELECT_ROOM_ERROR: 'SELECT_ROOM_ERROR',
                LOAD_ROOMS: 'LOAD_ROOMS',
                LOAD_FREE_PLACES: 'LOAD_FREE_PLACES',
                CONFIRM_BOOK: 'CONFIRM_BOOK',
                SUCCESS_BOOKED: 'SUCCESS_BOOKED',
                CHECK_BOOK_TIME: [
                    {
                        target: 'LOAD_ROOMS',
                        cond: {
                            type: 'checkBookTime'
                        }
                    }, {
                        target: 'BOOK_TIME_ERROR'
                    }
                ],
                CHECK_ROOM_SELECTION: [
                    {
                        target: 'LOAD_FREE_PLACES',
                        cond: {
                            type: 'checkRoomSelection'
                        }
                    }, {
                        target: 'SELECT_ROOM_ERROR'
                    }
                ],
                CHECK_PLACE_SELECTION: [
                    {
                        target: 'SET_PERSON_BOOK_COUNT',
                        cond: {
                            type: 'checkPlaceSelection'
                        }
                    }, {
                        target: 'BOOK_PLACE_ERROR'
                    }
                ],
                CHECK_PERSON_BOOK_COUNT: [
                    {
                        target: 'GET_USER_DATA',
                        cond: {
                            type: 'checkPersonCount'
                        }
                    }, {
                        target: 'PERSON_COUNT_ERROR'
                    }
                ]
            }
        },
        INITIAL: {
            mapping: {
                'START': 'START'
            },
            on: {
                START: 'START'
            }
        }
    }
}


export default menu;
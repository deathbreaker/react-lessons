import indexById from '../utils/indexById';

const actions = {
    ITEM_CREATE:"ITEM_CREATE",
    ITEM_DELETE:"ITEM_DELETE",
    ITEM_TOGGLE:"ITEM_TOGGLE",
    LIST_RECEIVE:"LIST_RECEIVE",
    LIST_RECEIVE_REFRESH:"LIST_RECEIVE_REFRESH",
};

/**
 * Výchozí stav reduceru
 * @type {{list: Array}}
 */
const initialState = {
    list: [],
};

/**
 * Reducer
 * - vykonává akce dle typu
 * - vrací vždy nový objek storu pokud se něco změní
 * - jinak vrací původní objekt
 */
export default function todoStore(state = initialState, action = {}) {
    switch (action.type) {
        case actions.ITEM_CREATE:
            return {
                list:[
                    ...state.list,
                    {
                        ...action.object
                    }
                ]
            };
        case actions.LIST_RECEIVE:
            return {
                ...state,
                list: action.list,
            };
        case actions.LIST_RECEIVE_REFRESH: {
            const {list} = state;
            const newList = [...list];
            for (let item of action.newItems) {
                const index = indexById(newList, item.id);
                if (index !== null) {
                    newList.splice(index, 1, item);
                } else {
                    newList.push(item);
                }
            }

            return {
                ...state,
                list: newList,
            }
        }
        case actions.ITEM_TOGGLE: {
            const {list} = state;
            const index = indexById(list, action.id);
            return {
                list:[
                    ...list.slice(0, index),
                    {
                        ...list[index],
                        done: parseInt(list[index].done) === 1 ? 0 : 1,
                    },
                    ...list.slice(index+1)
                ]
            };
        }
        case actions.ITEM_DELETE:
            const {list} = state;
            const index = indexById(list, action.id);
            return {
                list:[
                    ...state.list.slice(0, index),
                    ...state.list.slice(index+1),
                ]
            };
        default:
            return state
    }
}

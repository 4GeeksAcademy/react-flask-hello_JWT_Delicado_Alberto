export const initialStore = () => {
    return {
        token: localStorage.getItem("token") || null,
        user: null,
        message: null,
        todos: [
            {
                id: 1,
                title: "Make the bed",
                background: null,
            },
            {
                id: 2,
                title: "Do my homework",
                background: null,
            }
        ]
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case "set_token":
            return {
                ...store,
                token: action.payload,
            };
        case "set_user":
            return {
                ...store,
                user: action.payload,
            };
        case "set_hello":
            return {
                ...store,
                message: action.payload,
            };
        case 'add_task':
            const { id, color } = action.payload
            return {
                ...store,
                todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
            };
        default:
            throw Error("Unknown action.");
    }
}

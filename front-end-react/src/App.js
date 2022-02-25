import React, {
  useContext,
  createContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";

const HOST_API = "http://localhost:8080/api";

// Estados iniciales
const initialState = {
  list: [],
  item: {},
};

// Donde se guardan los estados
const Store = createContext(initialState);

/**
 * Componente para ver todos e ingresar uno nuevo.
 */
const Form = () => {
  const formRef = useRef(null);
  const {
    dispatch,
    state: { item },
  } = useContext(Store);
  const [state, setState] = useState(item);

  /**
   * Método para agregar un nuevo Todo
   */
  const onAdd = (event) => {
    event.preventDefault();
    const request = {
      name: state.name,
      id: null,
      isCompleted: false,
    };

    // Hace una petición POST a la API de forma asíncrona para agregar un todo
    fetch(HOST_API + "/todo", {
      // Fetch es una promesa, es decir, que solo se ejecutará cuando se resuelva
      method: "POST", // Se establece que es una petición POST
      body: JSON.stringify(request), // Se establece que la petición necesita un body
      headers: {
        "Content-Type": "application/json", // Se establece que la petición enviará un objeto de tipo JSON
      },
    })
      .then((response) => response.json()) // La respuesta se convierte en un objeto JSON
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  /**
   * Método para editar un Todo
   */
  const onEdit = (event) => {
    event.preventDefault();
    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted,
    };

    // Hace una petición PUT a la API de forma asíncrona para editar un todo
    fetch(HOST_API + "/todo", {
      // Fetch es una promesa, es decir, que solo se ejecutará cuando se resuelva
      method: "PUT", // Se establece que es una petición PUT
      body: JSON.stringify(request), // Se establece que la petición necesita un body
      headers: {
        "Content-Type": "application/json", // Se establece que la petición enviará un objeto de tipo JSON
      },
    })
      .then((response) => response.json()) // La respuesta se convierte en un objeto JSON
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  return (
    <form ref={formRef}>
      <input
        type="text"
        name="name"
        defaultValue={item.name}
        onChange={(event) => {
          setState({ ...state, name: event.target.value });
        }}
      ></input>
      {item.id && <button onClick={onEdit}>Actualizar</button>}
      {!item.id && <button onClick={onAdd}>Agregar</button>}
    </form>
  );
};

/**
 * Componente para listar la información.
 */
const List = () => {
  const { dispatch, state } = useContext(Store);

  // Hace una petición GET a la API de forma asíncrona para obtener los todo
  useEffect(() => {
    fetch(HOST_API + "/todos") // Fetch es una promesa, es decir, que solo se ejecutará cuando se resuelva
      .then((response) => response.json()) // La respuesta se convierte en un objeto JSON
      .then((list) => {
        // list es la respuesta obtenida de la API
        dispatch({ type: "update-list", list });
      });
  }, [state.list.length, dispatch]); // Condiciones para que funcione el efecto

  /**
   * Hace una petición DELETE a la API de forma asíncrona para eliminar un todo mediante un id recibido como parámetro
   * @param {*} id
   */
  const onDelete = (id) => {
    fetch(HOST_API + "/todo" + "/" + id, {
      // Fetch es una promesa, es decir, que solo se ejecutará cuando se resuelva
      method: "DELETE", // Se establece que es una petición DELETE
    }).then((list) => {
      dispatch({ type: "delete-item", id });
    });
  };

  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Tarea</td>
            <td>¿Completado?</td>
          </tr>
        </thead>
        <tbody>
          {state.list.map((todo) => {
            return (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.name}</td>
                <td>{todo.isCompleted === true ? "SÍ" : "NO"}</td>
                <td>
                  <button onClick={() => onDelete(todo.id)}>Eliminar</button>
                </td>
                <td>
                  <button onClick={() => onEdit(todo)}>Editar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Realiza una acción con un estado recibido como parámetro.
 * @param {*} state
 * @param {*} action
 */
function reducer(state, action) {
  switch (action.type) {
    case "update-item":
      const listUpdateEdit = state.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      return { ...state, list: listUpdateEdit, item: {} };
    case "delete-item":
      const listUpdate = state.list.filter((item) => {
        return item.id !== action.id;
      });
      return { ...state, list: listUpdate };
    case "update-list":
      return { ...state, list: action.list };
    case "edit-item":
      return { ...state, item: action.item };
    case "add-item":
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList };
    default:
      return state;
  }
}

/**
 * El provider permite conectar varios componentes.
 */
const StoreProvider = ({ children }) => {
  // Implementa la lógica de los estados y el dispatch
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

function App() {
  return (
    // StoreProvider funciona como un contenedor de componentes
    <StoreProvider>
      <Form />
      <List />
    </StoreProvider>
  );
}

export default App;

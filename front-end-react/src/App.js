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
};

// Donde se guardan los estados
const Store = createContext(initialState);


/**
 * Componente para ver todos e ingresar uno nuevo.
 */
const Form = () => {
  const formRef = useRef(null);
  const { dispatch } = useContext(Store);
  const [state, setState] = useState();

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

  return (
    <form ref={formRef}>
      <input
        type="text"
        name="name"
        onChange={(event) => {
          setState({ ...state, name: event.target.value });
        }}
      ></input>
      <button onClick={onAdd}>Agregar</button>
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
    // Fetch es una promesa, es decir, que solo se ejecutará cuando se resuelva
    fetch(HOST_API + "/todos")
      .then((response) => response.json()) // La respuesta se convierte en un objeto JSON
      .then((list) => {
        // list es la respuesta obtenida de la API
        dispatch({ type: "update-list", list });
      });
  }, [state.list.length, dispatch]); // Condiciones para que funcione el efecto

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
                <td>{todo.isCompleted}</td>
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
    case "update-list":
      return { ...state, list: action.list };
    case "add-item":
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList };
    default:
      return state;
  }
}

/**
 * Permite conectar varios componentes.
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

import { createContext } from "preact";
import { useContext, useReducer, useEffect } from "preact/hooks";

const initialState = {
  things: [1, 23],
  dis: null
};
const context = createContext({ things: [], isDefault: true, dis: null });
const useStore = () => useContext(context);

const delayedValue = (value, time) =>
  new Promise(resolve => setTimeout(() => resolve(value), time));

const effects = (state, action, dispatch) => {
  if (action.type === "addThings") {
    delayedValue(action.newThings, 500).then(val =>
      dispatch({ type: "addThingsNow", newThings: val })
    );
  }
  if (action.type === "addRandomThings") {
    delayedValue((Math.random() * 100) | 0, 600).then(val => {
      dispatch({ type: "addThings", newThings: val });
    });
  }
  if (action.type === "failingEffect") {
    //undeclared, so error out
    a = +b;
  }
};

const effectMiddleware = (state, action, dispatch) => {
  Promise.resolve()
    .then(() => effects(state, action, dispatch))
    .catch(reason =>
      console.error("error running effect", action.type, reason)
    );
};

const reducer = (state, action) => {
  effectMiddleware(state, action, state.dis);

  switch (action.type) {
    case "addThingsNow":
      return { ...state, things: [...state.things, action.newThings] };
    case "dis":
      return { ...state, dis: action.fn };
    default:
      return state;
  }
};

const StoreContext = ({ children }) => (
  <context.Provider value={useReducer(reducer, initialState)}>
    {children}
  </context.Provider>
);
const EffectWrapper = ({ children }) => {
  const [{ dis }, dispatch] = useStore();
  const localDispatch = action => dispatch(action);
  useEffect(() => {
    dispatch({ type: "dis", fn: localDispatch });
  }, []);

  return dis && children;
};

const Testo = () => {
  const [{ things }, dispatch] = useStore();
  const kickThingsOff = () => dispatch({ type: "addThings", newThings: 5 });
  const kickThingsOffFast = () => dispatch({ type: "addThingsNow", newThings: 6 });
  const otherKickoff = () => dispatch({ type: "addRandomThings" });
  const explode = () => dispatch({ type: "failingEffect" });

  return (
    <div class="out">
      <button type="button" onClick={kickThingsOff}>
        +5 (effect)
      </button>
      <button type="button" onClick={kickThingsOffFast}>
        +6 (reducer)
      </button>
      <button type="button" onClick={otherKickoff}>
        +random (nested effect)
      </button>
      <button type="button" onClick={explode}>
        +error (error within effect)
      </button>
      <ul>
        {things.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
};

export const EffectTest = () => (
  <StoreContext>
    <EffectWrapper>
      <Testo />
    </EffectWrapper>
  </StoreContext>
);

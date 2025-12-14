import { DELETE_ORDER, EDIT_ORDER} from './Action';

const initialState = {
  // allProducts: products,
  // allUsers: users,
  // allOrders: orders,
  // allComments: comments,
  // allReviews: reviews,
  // allCollections: collections,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "TEST_ACTION":
      console.log(state.allProducts);
      return state;
      /// Order Reducer
      case DELETE_ORDER:
        return { ...state, allOrders: state.allOrders.filter(order => order.id !== action.payload) };
      case EDIT_ORDER:
        return {
          ...state,
          allOrders: state.allOrders.map(order => 
            order.id === action.payload.id ? action.payload : order
          ),
        };
    default:
      return state;
  }
};

export default reducer;

/****************************************************************************************
* Autor	:	Paulo Javier Arancibia Gutiérrez											*
* Fecha	:	14JUL2016																	*
* Asunto:	Prueba Técnica para optar al cargo de desarrollador en Koper C.A. Fullstack	*
*****************************************************************************************/
'use strict';

var _Immutable = Immutable;
var Map = _Immutable.Map;
var List = _Immutable.List;
var _Redux = Redux;
var createStore = _Redux.createStore;
var _reactRedux = reactRedux;
var Provider = _reactRedux.Provider;
var connect = _reactRedux.connect;

var components = {
  Todo: function Todo(_ref) {
    var todo = _ref.todo;

    if (todo.isDone) {
      return React.createElement(
        'strike',
        null,
        todo.text
      );
    } else {
      return React.createElement(
        'span',
        null,
        todo.text
      );
    }
  },
  TodoList: function TodoList(_ref2) {
    var todos = _ref2.todos;
    var toggleTodo = _ref2.toggleTodo;
    var addTodo = _ref2.addTodo;

    var onSubmit = function onSubmit(e) {
      var text = e.target.value;
      if (e.which === 13 && text.length > 0) {
        addTodo(text);
        e.target.value = '';
      }
    };

    var toggleClick = function toggleClick(id) {
      return function () {
        return toggleTodo(id);
      };
    };

    var Todo = components.Todo;

    return React.createElement(
      'div',
      { className: 'todo' },
      React.createElement('input', { type: 'text',
        className: 'todo__entry',
        placeholder: 'Añadir Tarea',
        onKeyDown: onSubmit }),
      React.createElement(
        'ul',
        { className: 'todo__list' },
        todos.map(function (t) {
          return React.createElement(
            'li',
            {
              key: t.get('id'),
              className: 'todo__item',
              onClick: toggleClick(t.get('id')) },
            React.createElement(Todo, { todo: t.toJS() })
          );
        })
      )
    );
  }
};

var actions = {
  addTodo: function addTodo(text) {
    return {
      type: 'ADD_TODO',
      payload: {
        id: Math.random().toString(34).slice(2),
        isDone: false,
        text: text
      }
    };
  },
  toggleTodo: function toggleTodo(id) {
    return {
      type: 'TOGGLE_TODO',
      payload: id
    };
  }
};

var init = List();

var reducer = function reducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? init : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_TODO':
      return state.push(Map(action.payload));
    case 'TOGGLE_TODO':
      return state.map(function (t) {
        if (t.get('id') == action.payload) {
          return t.update('isDone', function (isDone) {
            return !isDone;
          });
        } else {
          return t;
        }
      });
    default:
      return state;
  }
};

var containers = {
  TodoList: connect(function mapStateToProps(state) {
    return {
      todos: state
    };
  }, function mapDispatchToProps(dispatch) {
    return {
      toggleTodo: function toggleTodo(id) {
        return dispatch(actions.toggleTodo(id));
      },
      addTodo: function addTodo(text) {
        return dispatch(actions.addTodo(text));
      }
    };
  })(components.TodoList)
};

var TodoList = containers.TodoList;

var store = createStore(reducer);

ReactDOM.render(React.createElement(
  Provider,
  { store: store },
  React.createElement(TodoList, null)
), document.getElementById('app'));
import onChange from 'on-change';

const render = (elements, state) => (path, value, prevValue) => {
  console.log(state);
  switch (path) {
    case 'process': {
      switch (value) {
        case 'filling' : {
          break;
        }
        case 'processing': {
          elements.feedback.textContent = '';
          break;
        }
        case 'failed': {
          elements.feedback.textContent = state.error;
          break;
        }
        case 'success': {
          elements.feedback.textContent = '';
          break;
        }
        default: {
          break;
        }
      }
      break;
    }

    case 'errors': {
      break;
    };

    default:
      break;
  }
};

export default (elements, state) => {
  const watchedState = onChange(state, render(elements, state));
  return watchedState;
}
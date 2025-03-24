import onChange from 'on-change';
import { string } from 'yup';

const render = (state, formEl) => {
  console.log(state);
};

export default () => {
  const state = {
    formData: {
      url: '',
    },
    errors: [],
    process: "filling", // "processing", "failed", "success"
    feedList: ['https://lorem-rss.hexlet.app/feed']
  }

  const formEl = document.querySelector('.rss-form');
  const inputEl = document.getElementById('url-input');

  const watchedState = onChange(state, () => {
    render(state, formEl);
  });

  const validateForm = () => {
    const errors = [];

    const schema = string().url().notOneOf(state.feedList);

    return schema.validate(state.formData.url).then().catch((err) => {
      switch (err.type) {
        case 'notOneOf': {
          errors.push('RSS уже существует');
          break;
        }
        case 'url': {
          errors.push('Ссылка должна быть валидным URL');
          break;
        }
        default: {
          throw 'Unknown validation error type!';
        }
      }

      watchedState.errors = errors;
    });
  }

  inputEl.addEventListener('input', (e) => {
    watchedState.formData.url = e.target.value;
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    
    validateForm().then(() => {
      if (watchedState.errors.length > 0) {
        watchedState.process = 'failed';
        return;
      } else {
        
      }


    });
  })
};
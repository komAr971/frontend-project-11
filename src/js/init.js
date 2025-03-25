import { string } from 'yup';
import initView from './view.js';



const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
  notOneOf: {
    error: 'RSS уже существует',
  },
  url: {
    error: 'Ссылка должна быть валидным URL',
  },
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  const initialState = {
    formData: {
      url: '',
    },
    error: '',
    process: "filling", // "processing", "failed", "success"
    feedList: ['https://lorem-rss.hexlet.app/feed']
  }

  const state = initView(elements, initialState);

  const validateForm = () => {
    const schema = string().url().notOneOf(state.feedList);

    return schema.validate(state.formData.url).then().catch((err) => {
      state.error = errorMessages[err.type].error;
    });
  }

  elements.fields.url.addEventListener('input', (e) => {
    state.formData.url = e.target.value.trim();
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    state.process = 'processing'
    state.error = '';
    
    validateForm().then(() => {
      if (state.error !== '') {
        state.process = 'failed';
        return;
      }

      state.process = 'success'
    });
  })
};
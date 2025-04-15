/* eslint-disable no-param-reassign */

import { string } from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';

import resources from '../locales/index.js';
import initView from './view.js';
import rssParser from './rssParser.js';
import update from './update.js';

const validateForm = (formData, notOneOfArray) => {
  const schema = string()
    .url()
    .notOneOf(notOneOfArray.map((item) => item.url));

  return schema.validate(formData.url);
};

const handleLanguageChange = (lng, state, i18nInstance) => {
  i18nInstance.changeLanguage(lng).then(() => {
    state.lng = lng;
  });
};

const languages = ['ru', 'en'];

export default () => {
  const defaultLanguage = 'ru';

  const initialState = {
    lng: defaultLanguage,
    formData: {
      url: '',
    },
    errors: [],
    process: 'filling', // "processing", "failed", "success"
    feeds: [],
    posts: [],
    feedUrlList: [],
    unreadPosts: [],
    currentPreviewPost: {
      title: '',
      description: '',
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    title: document.querySelector('.title'),
    lead: document.querySelector('.lead'),
    label: document.querySelector('label[for="url-input"]'),
    example: document.querySelector('.example'),
    author: document.querySelector('.author'),
    createdBy: document.querySelector('.createdBy'),
    languageSelection: document.querySelector('.language-selection'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modal: {
      title: document.querySelector('.modal .modal-title'),
      body: document.querySelector('.modal .modal-body'),
      btnRead: document.querySelector('.modal .modal-footer .btn-primary'),
      btnClose: document.querySelector('.modal .modal-footer .btn-secondary'),
    },
  };

  languages.forEach((lng) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.classList.add('dropdown-item');
    button.setAttribute('type', 'button');
    button.setAttribute('data-lng', lng);
    li.appendChild(button);
    elements.languageSelection.appendChild(li);
  });

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    resources,
  }).then(() => {
    const state = initView(elements, initialState, i18nInstance);

    elements.fields.url.addEventListener('input', (e) => {
      state.formData.url = e.target.value.trim();
    });

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();

      state.process = 'processing';
      state.errors = [];

      validateForm(state.formData, state.feedUrlList)
        .then(() => {
          const url = new URL('https://allorigins.hexlet.app/get');
          url.searchParams.set('disableCache', 'true');
          url.searchParams.set('url', state.formData.url);

          return axios
            .get(url.toString())
            .catch(() => {
              throw new Error('Network Error');
            });
        })
        .then((result) => {
          const { feed, posts } = rssParser(result.data.contents);
          feed.id = _.uniqueId('feed_');

          const postsWithId = posts.map((post) => ({ ...post, feedId: feed.id, id: _.uniqueId('post_') }));

          state.feedUrlList.push({ feedId: feed.id, url: state.formData.url });
          state.formData.url = '';
          state.feeds.push(feed);
          state.posts.push(...postsWithId);
          state.unreadPosts.push(...postsWithId.map((post) => post.id));
          state.process = 'success';
        })
        .catch((err) => {
          state.errors.push(i18nInstance.t(`error.${err.name === 'ValidationError' ? err.type : err.message}`));
          state.process = 'failed';
        });
    });

    elements.languageSelection.querySelectorAll('.dropdown-item').forEach((el) => {
      el.addEventListener('click', (e) => {
        handleLanguageChange(e.target.dataset.lng, state, i18nInstance);
      });
    });

    setTimeout(() => update(state), 5000);
  });
};
